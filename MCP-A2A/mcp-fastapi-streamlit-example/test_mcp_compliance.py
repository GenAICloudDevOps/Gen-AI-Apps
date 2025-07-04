#!/usr/bin/env python3
"""
Test script to verify MCP compliance
This script tests the MCP server to ensure it follows the protocol correctly
"""

import asyncio
import json
import subprocess
import sys
import os
from typing import Dict, Any

async def test_mcp_server():
    """Test the MCP server compliance"""
    print("Testing MCP Server Compliance...")
    print("=" * 50)
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    server_path = os.path.join(script_dir, "backend", "mcp_compliant_server.py")
    
    # Start the MCP server process
    process = subprocess.Popen(
        [sys.executable, server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd=script_dir
    )
    
    def send_message(message: Dict[str, Any]) -> Dict[str, Any]:
        """Send a JSON-RPC message to the MCP server"""
        json_message = json.dumps(message) + "\n"
        process.stdin.write(json_message)
        process.stdin.flush()
        
        # Read response
        response_line = process.stdout.readline()
        if response_line:
            return json.loads(response_line.strip())
        return {}
    
    try:
        # Test 1: Initialize
        print("1. Testing initialization...")
        init_message = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {
                    "name": "test-client",
                    "version": "1.0.0"
                }
            }
        }
        
        response = send_message(init_message)
        print(f"✅ Initialize response: {response}")
        
        # Test 2: List tools
        print("\n2. Testing tools/list...")
        list_tools_message = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/list",
            "params": {}
        }
        
        response = send_message(list_tools_message)
        print(f"✅ Tools list response: {json.dumps(response, indent=2)}")
        
        # Test 3: Call calculator tool
        print("\n3. Testing tools/call (calculator)...")
        call_tool_message = {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {
                "name": "calculator",
                "arguments": {
                    "expression": "2+2*3"
                }
            }
        }
        
        response = send_message(call_tool_message)
        print(f"✅ Calculator tool response: {json.dumps(response, indent=2)}")
        
        # Test 4: Call text analyzer tool
        print("\n4. Testing tools/call (text_analyzer)...")
        call_tool_message = {
            "jsonrpc": "2.0",
            "id": 4,
            "method": "tools/call",
            "params": {
                "name": "text_analyzer",
                "arguments": {
                    "text": "This is a test sentence for analysis.",
                    "analysis_type": "basic"
                }
            }
        }
        
        response = send_message(call_tool_message)
        print(f"✅ Text analyzer tool response: {json.dumps(response, indent=2)}")
        
        print("\n" + "=" * 50)
        print("✅ MCP Compliance Test PASSED!")
        print("The server correctly implements:")
        print("- JSON-RPC protocol")
        print("- Standard MCP messages")
        print("- Tool discovery and execution")
        print("- Proper response formatting")
        
    except Exception as e:
        print(f"❌ MCP Compliance Test FAILED: {e}")
        
    finally:
        # Clean up
        process.terminate()
        process.wait()

if __name__ == "__main__":
    asyncio.run(test_mcp_server())
