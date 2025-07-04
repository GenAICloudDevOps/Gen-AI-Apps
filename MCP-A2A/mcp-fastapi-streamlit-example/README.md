# MCP Tools Dashboard

An **MCP-compliant** application with hybrid architecture supporting both Model Context Protocol (MCP) and REST API interfaces.

## Features

- **✅ MCP-Compliant**: Full implementation of MCP protocol specification
- **Hybrid Architecture**: Supports both MCP protocol (stdio) and REST API
- **Calculator Tool**: Perform mathematical calculations
- **Text Analyzer Tool**: Basic metrics, sentiment analysis, and AI-powered summarization
- **AWS Bedrock Integration**: Uses Claude 3.5 Sonnet (fallback to Claude 3 Haiku)
- **Containerized Deployment**: Docker containers for all services
- **Production Ready**: Health checks, error handling, and proper logging

## MCP Compliance Status

**✅ FULLY MCP-COMPLIANT**

This application implements a **gold standard** for MCP compliance while maintaining practical web application functionality.

## Core MCP Protocol Implementation

**✅ JSON-RPC Protocol**
- Complete MCP JSON-RPC specification implementation
- Standard request/response patterns with proper message formatting
- Async/await for non-blocking operations

**✅ Required MCP Messages**
- `initialize` - Establishes connection and capabilities
- `tools/list` - Returns available tools with proper schema
- `tools/call` - Executes tools with validated parameters

**✅ Transport Layer**
- Stdio transport implementation (standard input/output)
- Proper message framing and protocol handling
- Compatible with MCP client expectations

## Tool Schema Compliance

**✅ Proper Tool Definitions**
- Calculator tool: Mathematical expression evaluation
- Text Analyzer tool: Sentiment analysis, summarization, basic metrics
- Each tool has complete schema with input/output specifications

**✅ Parameter Structure**
- Uses MCP-standard `arguments` field (not `parameters`)
- Schema-based validation for all inputs
- Type safety with proper MCP types

## Technical Verification Points

**✅ Protocol Version**
- Supports MCP protocol version 2024-11-05
- Maintains backward compatibility standards

**✅ Error Handling**
- MCP-compliant error responses
- Proper error codes and messages
- Graceful failure handling for AWS credentials

**✅ Discovery Mechanism**
- Dynamic tool listing via `tools/list`
- Runtime capability detection
- Metadata exposure for client integration

## Production Readiness

**✅ Hybrid Architecture**
- Simultaneous MCP protocol + REST API support
- No compromise on MCP compliance for web compatibility
- Single codebase serving multiple interface types

**✅ Integration Ready**
- Can be consumed by any MCP-compliant AI assistant
- Standard stdio interface for easy integration
- Docker containerization for deployment flexibility

## Architecture

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   Streamlit     │ ──────────────► │   FastAPI        │
│   Frontend      │                 │   Backend        │
│   (Port 8501)   │                 │   (Port 8000)    │
└─────────────────┘                 └──────────────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │   MCP Server     │
                                    │   Tools Engine   │
                                    └──────────────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │   AWS Bedrock    │
                                    │   Claude Models  │
                                    └──────────────────┘
```

## Usage Modes

### 1. MCP Protocol Mode (MCP-Compliant)
For MCP clients and AI assistants:

```bash
# Run standalone MCP server
python backend/mcp_compliant_server.py

# Or using the hybrid server
python backend/hybrid_main.py --mcp

# Or via Docker
docker-compose run mcp-server
```

### 2. Web Interface Mode
For web applications and testing:

```bash
# Start web server
docker-compose up --build

# Access at:
# - Frontend: http://localhost:8501
# - Backend API: http://localhost:8000
# - MCP Info: http://localhost:8000/mcp-info
```

### 3. Hybrid Mode
Both MCP and REST API simultaneously:

```bash
docker-compose up --build
# Web interface + MCP server both running
```

## Tools Available

### 1. Calculator
- **Purpose**: Perform mathematical calculations
- **Input**: Mathematical expression (e.g., "2+2", "sqrt(16)")
- **Output**: Calculated result

### 2. Text Analyzer
- **Basic Analysis**: Word count, character count, sentence count
- **Sentiment Analysis**: AI-powered sentiment detection using Claude
- **Summarization**: AI-powered text summarization using Claude

## API Endpoints

### REST API (Web Mode)
- `GET /` - Root endpoint with mode information
- `GET /tools` - List available MCP tools
- `POST /execute` - Execute a tool with parameters
- `GET /health` - Health check endpoint
- `GET /mcp-info` - MCP compliance information

### MCP Protocol (Stdio Mode)
- Standard MCP messages: `initialize`, `tools/list`, `tools/call`
- JSON-RPC protocol over stdio transport
- Full MCP specification compliance

## Development

### Local Development

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn hybrid_main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   pip install -r requirements.txt
   streamlit run app.py
   ```

### Environment Variables

- `AWS_DEFAULT_REGION`: AWS region for Bedrock (default: us-east-1)
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `BACKEND_URL`: Backend URL for frontend (default: http://localhost:8000)

### Configuration

1. **Copy and configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual AWS credentials
   ```

2. **Update .env file**:
   ```bash
   AWS_DEFAULT_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_actual_access_key
   AWS_SECRET_ACCESS_KEY=your_actual_secret_key
   BACKEND_URL=http://localhost:8000
   ```

## AWS Setup

### Required AWS Credentials
The application requires AWS credentials for AI-powered text analysis features:

```bash
# Option 1: AWS CLI
aws configure

# Option 2: Environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_DEFAULT_REGION=us-east-1
```

### Required AWS Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["bedrock:InvokeModel"],
            "Resource": [
                "arn:aws:bedrock:*:*:model/anthropic.claude-3-5-sonnet-20241022-v2:0",
                "arn:aws:bedrock:*:*:model/anthropic.claude-3-haiku-20240307-v1:0"
            ]
        }
    ]
}
```

### Graceful Degradation
- **Calculator Tool**: Works without AWS credentials
- **Text Analyzer**: 
  - Basic metrics work without AWS
  - AI features require AWS credentials
  - Clear error messages when credentials missing

## AWS Bedrock Models

The application attempts to use models in this order:
1. `anthropic.claude-3-5-sonnet-20241022-v2:0` (Claude 3.5 Sonnet)
2. `anthropic.claude-3-haiku-20240307-v1:0` (Claude 3 Haiku - fallback)

## Security Features

- Input sanitization for calculator expressions
- CORS configuration for cross-origin requests
- AWS IAM-based authentication for Bedrock
- Container isolation
- Comprehensive error handling for AWS credentials

## Monitoring

- Health check endpoints
- Error logging and handling
- Request/response validation
- AWS credential validation

## Testing

Run the MCP compliance test:
```bash
python test_mcp_compliance.py
```

## License

MIT License - See LICENSE file for details
