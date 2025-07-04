#!/usr/bin/env python3
"""
Hybrid MCP Server Implementation
Supports both MCP protocol (stdio) and REST API for web interface
"""

import asyncio
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import uvicorn

# Import the MCP compliant server
from mcp_compliant_server import server as mcp_server, list_tools as mcp_list_tools, call_tool as mcp_call_tool

# FastAPI app for web interface
app = FastAPI(title="MCP Tools API (Hybrid)", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501", "http://127.0.0.1:8501"],  # Restrict to frontend only
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only allow necessary methods
    allow_headers=["*"],
)

class ToolRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]

class ToolResponse(BaseModel):
    success: bool
    result: str
    error: str = None

@app.get("/")
async def root():
    return {
        "message": "MCP Tools API (Hybrid Mode)", 
        "status": "running",
        "modes": ["REST API", "MCP Protocol"],
        "mcp_compliant": True
    }

@app.get("/tools")
async def list_tools():
    """List available MCP tools via REST API"""
    try:
        tools = await mcp_list_tools()
        return {
            "tools": [
                {
                    "name": tool.name,
                    "description": tool.description,
                    "input_schema": tool.inputSchema
                }
                for tool in tools
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/execute", response_model=ToolResponse)
async def execute_tool(request: ToolRequest):
    """Execute an MCP tool via REST API"""
    try:
        result = await mcp_call_tool(request.tool_name, request.arguments)
        # Extract text from TextContent objects
        result_text = "\n".join([content.text for content in result])
        return ToolResponse(success=True, result=result_text)
            
    except Exception as e:
        return ToolResponse(success=False, result="", error=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "mcp-tools-api-hybrid",
        "mcp_compliant": True
    }

@app.get("/mcp-info")
async def mcp_info():
    """Information about MCP compliance"""
    return {
        "mcp_compliant": True,
        "protocol_version": "2024-11-05",
        "transport": ["stdio", "REST API"],
        "capabilities": {
            "tools": True,
            "resources": False,
            "prompts": False,
            "logging": False
        },
        "usage": {
            "mcp_mode": "Run with --mcp flag or pipe to stdio",
            "web_mode": "Access via HTTP endpoints"
        }
    }

async def run_mcp_server():
    """Run the MCP server in stdio mode"""
    from mcp.server.stdio import stdio_server
    
    async with stdio_server() as (read_stream, write_stream):
        await mcp_server.run(
            read_stream,
            write_stream,
            mcp_server.create_initialization_options()
        )

def main():
    """Main entry point - determines mode based on arguments"""
    if len(sys.argv) > 1 and sys.argv[1] == "--mcp":
        # Run in MCP mode (stdio)
        print("Starting MCP server in stdio mode...", file=sys.stderr)
        asyncio.run(run_mcp_server())
    else:
        # Run in web mode (FastAPI)
        print("Starting hybrid server in web mode...", file=sys.stderr)
        print("Use --mcp flag for MCP stdio mode", file=sys.stderr)
        uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
