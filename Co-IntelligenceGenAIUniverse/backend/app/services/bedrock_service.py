"""
AWS Bedrock Converse API Service
Simple service for AI chat and document analysis
"""
import boto3
import json
import logging
from typing import Dict, Any, List, Optional
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class BedrockService:
    def __init__(self, region_name: str = "us-east-1"):
        """Initialize Bedrock client"""
        self.client = boto3.client('bedrock-runtime', region_name=region_name)
        self.model_id = "anthropic.claude-3-haiku-20240307-v1:0"
        
    async def chat(self, message: str, conversation_history: List[Dict] = None) -> str:
        """
        Simple chat using Bedrock Converse API
        """
        try:
            # Prepare messages
            messages = []
            
            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current message
            messages.append({
                "role": "user",
                "content": [{"text": message}]
            })
            
            # Call Bedrock Converse API
            response = self.client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={
                    "maxTokens": 4000,
                    "temperature": 0.7
                }
            )
            
            # Extract response text
            return response['output']['message']['content'][0]['text']
            
        except ClientError as e:
            logger.error(f"Bedrock API error: {e}")
            return f"Error: {str(e)}"
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return f"Error: {str(e)}"
    
    async def analyze_document(self, text: str, analysis_type: str = "summary") -> str:
        """
        Analyze document text using Bedrock
        """
        try:
            # Create analysis prompt based on type
            prompts = {
                "summary": f"Please provide a concise summary of the following document:\n\n{text}",
                "key_points": f"Extract the key points from the following document:\n\n{text}",
                "questions": f"Generate important questions that this document answers:\n\n{text}",
                "analysis": f"Provide a detailed analysis of the following document:\n\n{text}"
            }
            
            prompt = prompts.get(analysis_type, prompts["summary"])
            
            # Call Bedrock
            response = self.client.converse(
                modelId=self.model_id,
                messages=[{
                    "role": "user",
                    "content": [{"text": prompt}]
                }],
                inferenceConfig={
                    "maxTokens": 4000,
                    "temperature": 0.3
                }
            )
            
            return response['output']['message']['content'][0]['text']
            
        except Exception as e:
            logger.error(f"Document analysis error: {e}")
            return f"Error analyzing document: {str(e)}"

# Global instance
bedrock_service = BedrockService()
