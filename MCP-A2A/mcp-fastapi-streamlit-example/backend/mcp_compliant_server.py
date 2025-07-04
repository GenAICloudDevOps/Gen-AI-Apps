#!/usr/bin/env python3
"""
MCP-Compliant Server Implementation
This is a true MCP server that follows the Model Context Protocol specification.
"""

import sys

import asyncio
import json
import math
import re
import os
from typing import Any, Sequence
import boto3
from botocore.exceptions import ClientError, NoCredentialsError, PartialCredentialsError

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    Tool,
    TextContent,
    CallToolRequest,
    CallToolResult,
    ListToolsRequest,
    ListToolsResult,
)

# Initialize AWS Bedrock client with error handling
try:
    # Use environment variables for AWS credentials if available
    aws_config = {
        'region_name': os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
    }
    
    # Add credentials if provided via environment variables
    aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    
    # Check for placeholder values
    if aws_access_key and aws_secret_key:
        if aws_access_key == 'YOUR_AWS_ACCESS_KEY_ID' or aws_secret_key == 'YOUR_AWS_SECRET_ACCESS_KEY':
            print("Warning: Using placeholder AWS credentials. Please update .env file with actual credentials.", file=sys.stderr)
            AWS_AVAILABLE = False
            bedrock_client = None
        else:
            aws_config.update({
                'aws_access_key_id': aws_access_key,
                'aws_secret_access_key': aws_secret_key
            })
            bedrock_client = boto3.client('bedrock-runtime', **aws_config)
            AWS_AVAILABLE = True
    else:
        # Try to use default credentials (AWS CLI, IAM roles, etc.)
        bedrock_client = boto3.client('bedrock-runtime', **aws_config)
        AWS_AVAILABLE = True
        
except (NoCredentialsError, PartialCredentialsError) as e:
    print(f"Warning: AWS credentials not configured properly: {e}", file=sys.stderr)
    bedrock_client = None
    AWS_AVAILABLE = False
except Exception as e:
    print(f"Warning: AWS Bedrock client initialization failed: {e}", file=sys.stderr)
    bedrock_client = None
    AWS_AVAILABLE = False

# Create MCP server instance
server = Server("mcp-tools-server")

def safe_calculator(expression: str) -> str:
    """Safe calculator implementation with security checks"""
    try:
        # Replace common math functions
        safe_expr = expression.lower().strip()
        
        # Replace math functions with math module equivalents
        replacements = {
            'sqrt(': 'math.sqrt(',
            'sin(': 'math.sin(',
            'cos(': 'math.cos(',
            'tan(': 'math.tan(',
            'log(': 'math.log(',
            'pi': 'math.pi',
            'e': 'math.e'
        }
        
        for old, new in replacements.items():
            safe_expr = safe_expr.replace(old, new)
        
        # Basic security: only allow safe characters
        allowed_chars = set('0123456789+-*/().math sqrt sin cos tan log pi e ')
        if not all(c in allowed_chars for c in safe_expr):
            return "Error: Invalid characters in expression. Only numbers, basic operators (+, -, *, /), parentheses, and math functions are allowed."
        
        # Additional security checks
        dangerous_patterns = ['import', '__', 'exec', 'eval', 'open', 'file']
        if any(pattern in safe_expr for pattern in dangerous_patterns):
            return "Error: Expression contains potentially dangerous operations."
        
        # Evaluate safely with restricted globals
        safe_globals = {
            "__builtins__": {},
            "math": math
        }
        
        result = eval(safe_expr, safe_globals, {})
        
        # Check for reasonable result
        if isinstance(result, (int, float)):
            if abs(result) > 1e10:
                return f"Result: {result:.2e} (scientific notation due to large number)"
            return f"Result: {result}"
        else:
            return f"Result: {result}"
            
    except ZeroDivisionError:
        return "Error: Division by zero"
    except ValueError as e:
        return f"Error: Invalid mathematical operation - {str(e)}"
    except OverflowError:
        return "Error: Result too large to calculate"
    except Exception as e:
        return f"Error: {str(e)}"

def analyze_text_basic(text: str) -> str:
    """Basic text analysis"""
    words = text.split()
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    
    result = {
        "word_count": len(words),
        "character_count": len(text),
        "sentence_count": len(sentences),
        "avg_words_per_sentence": round(len(words) / max(len(sentences), 1), 2)
    }
    return json.dumps(result, indent=2)

def analyze_with_bedrock(text: str, analysis_type: str) -> str:
    """AWS Bedrock analysis with Claude models"""
    if not AWS_AVAILABLE:
        return "Error: AWS credentials not configured. Please set up AWS credentials to use AI-powered analysis."
    
    try:
        # Try Claude 3.5 Sonnet first, fallback to Claude 3 Haiku
        model_ids = [
            "anthropic.claude-3-5-sonnet-20241022-v2:0",
            "anthropic.claude-3-haiku-20240307-v1:0"
        ]
        
        prompts = {
            "sentiment": f"Analyze the sentiment of this text and provide a brief explanation:\n\n{text}",
            "summary": f"Provide a concise summary of this text:\n\n{text}"
        }
        
        for model_id in model_ids:
            try:
                response = bedrock_client.converse(
                    modelId=model_id,
                    messages=[{
                        "role": "user",
                        "content": [{"text": prompts[analysis_type]}]
                    }]
                )
                
                return response['output']['message']['content'][0]['text']
                
            except ClientError as e:
                error_code = e.response.get('Error', {}).get('Code', '')
                if error_code in ['ValidationException', 'ModelNotFoundError', 'ResourceNotFoundException']:
                    continue
                elif error_code in ['UnauthorizedOperation', 'AccessDeniedException']:
                    return "Error: AWS access denied. Please check your AWS permissions for Bedrock."
                raise e
        
        return "Error: No available Claude models found. Please check your AWS region and model access."
        
    except NoCredentialsError:
        return "Error: AWS credentials not found. Please configure AWS credentials."
    except PartialCredentialsError:
        return "Error: Incomplete AWS credentials. Please check your AWS configuration."
    except Exception as e:
        return f"AWS Bedrock Error: {str(e)}"

@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available MCP tools"""
    return [
        Tool(
            name="calculator",
            description="Perform basic mathematical calculations",
            inputSchema={
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate (e.g., '2+2', '10*5', 'sqrt(16)')"
                    }
                },
                "required": ["expression"]
            }
        ),
        Tool(
            name="text_analyzer",
            description="Analyze text for various metrics and insights",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "Text to analyze"
                    },
                    "analysis_type": {
                        "type": "string",
                        "enum": ["basic", "sentiment", "summary"],
                        "description": "Type of analysis to perform"
                    }
                },
                "required": ["text", "analysis_type"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Execute MCP tool and return result"""
    
    if name == "calculator":
        if "expression" not in arguments:
            raise ValueError("Missing required argument: expression")
        
        result = safe_calculator(arguments["expression"])
        return [TextContent(type="text", text=result)]
    
    elif name == "text_analyzer":
        if "text" not in arguments or "analysis_type" not in arguments:
            raise ValueError("Missing required arguments: text and/or analysis_type")
        
        text = arguments["text"]
        analysis_type = arguments["analysis_type"]
        
        if analysis_type == "basic":
            result = analyze_text_basic(text)
        elif analysis_type in ["sentiment", "summary"]:
            result = analyze_with_bedrock(text, analysis_type)
        else:
            result = "Error: Invalid analysis_type. Must be 'basic', 'sentiment', or 'summary'"
        
        return [TextContent(type="text", text=result)]
    
    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    """Main entry point for the MCP server"""
    # Run the server using stdio transport
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
