#!/usr/bin/env python3
"""
Standalone MCP Server Runner
Use this to run the server in pure MCP mode for MCP clients
"""

import asyncio
import sys
from mcp_compliant_server import main

if __name__ == "__main__":
    print("Starting MCP-compliant server...", file=sys.stderr)
    asyncio.run(main())
