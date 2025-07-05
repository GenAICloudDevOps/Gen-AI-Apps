# Simple Chat App with FastAPI + Gradio + AWS Bedrock

A minimal chat application where Gradio frontend talks to FastAPI backend, which uses AWS Bedrock for AI responses.

## Project Structure

```
fastapisimple/
├── backend/
│   ├── app.py              # FastAPI server with API v1 endpoints
│   ├── requirements.txt    # Python packages
│   └── Dockerfile         # Container setup
├── frontend/
│   ├── gradio_app.py      # Chat interface (Gradio-based)
│   ├── requirements.txt   # Python packages  
│   └── Dockerfile        # Container setup
├── docker-compose.yml     # Runs both containers together
├── .env                  # AWS credentials
└── README.md            # This file
```

## API Endpoints

The backend uses versioned API endpoints:

- **GET** `/api/v1/` - API status check
- **GET** `/api/v1/health` - Health check (API + AWS Bedrock connection)
- **POST** `/api/v1/chat` - Main chat endpoint

## How Frontend Connects to Backend

### The Connection Flow:
1. **User types message** in Gradio chat interface
2. **Gradio sends HTTP POST** to FastAPI backend at `http://backend:8000/api/v1/chat`
3. **FastAPI receives message** and calls AWS Bedrock
4. **AWS Bedrock returns AI response** to FastAPI
5. **FastAPI sends response back** to Gradio
6. **Gradio displays response** in chat interface

### Code Connection:

**Frontend (gradio_app.py):**
```python
# When user sends message, this code runs:
response = requests.post(
    f"{BACKEND_URL}/api/v1/chat",        # Calls versioned API endpoint
    json={"message": message},           # Sends user message
    timeout=30
)
```

**Backend (app.py):**
```python
# API v1 router handles all v1 endpoints:
v1_router = APIRouter(prefix="/api/v1")

@v1_router.post("/chat")
async def chat(chat_message: ChatMessage):
    # Calls AWS Bedrock with user message
    # Returns AI response back to frontend
```

## Quick Start

### 1. Add Your AWS Credentials
Edit `.env` file:
```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
```

### 2. Run the Application
```bash
docker-compose up --build
```

### 3. Open in Browser
- **Chat App**: http://localhost:7860
- **API Backend**: http://localhost:8000
- **API Status**: http://localhost:8000/api/v1/
- **Health Check**: http://localhost:8000/api/v1/health

## Testing API Endpoints

FastAPI automatically generates interactive API documentation that you can use to test all endpoints directly in your browser.

### **Swagger UI Access**
- **URL**: http://localhost:8000/docs
- **Description**: Interactive API documentation with "Try it out" functionality

### **How to Test Each Endpoint:**

#### **1. GET `/api/v1/` (API Status Check)**
- Open http://localhost:8000/docs
- Find the `GET /api/v1/` endpoint
- Click "Try it out" → "Execute"
- **Expected Response**: 
  ```json
  {"message": "Chat API v1 is running"}
  ```

#### **2. GET `/api/v1/health` (Health Check)**
- Find the `GET /api/v1/health` endpoint
- Click "Try it out" → "Execute"
- **Healthy Response**:
  ```json
  {
    "status": "healthy",
    "api": "running", 
    "aws_bedrock": "connected",
    "region": "us-east-1",
    "model": "anthropic.claude-3-haiku-20240307-v1:0"
  }
  ```
- **Unhealthy Response**:
  ```json
  {
    "status": "unhealthy",
    "api": "running",
    "aws_bedrock": "disconnected", 
    "error": "specific error message",
    "region": "us-east-1"
  }
  ```

#### **3. POST `/api/v1/chat` (Main Chat)**
- Find the `POST /api/v1/chat` endpoint
- Click "Try it out"
- **Request Body Example**:
  ```json
  {"message": "Hello, how are you?"}
  ```
- Click "Execute"
- **Expected Response**:
  ```json
  {"response": "Hello! As an AI language model, I don't have personal feelings, but I'm functioning properly and ready to assist you..."}
  ```

### **Alternative: Command Line Testing**
You can also test endpoints using curl:
```bash
# Test API status
curl http://localhost:8000/api/v1/

# Test health check  
curl http://localhost:8000/api/v1/health

# Test chat endpoint
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## What Each Part Does

### Backend (FastAPI)
- **Port**: 8000
- **Job**: Receives chat messages, calls AWS Bedrock, returns AI responses
- **API Version**: v1 (all endpoints under `/api/v1/`)
- **Endpoints**: 
  - `GET /api/v1/` - API status check
  - `GET /api/v1/health` - Health check (tests AWS Bedrock connection)
  - `POST /api/v1/chat` - Main chat endpoint

### Frontend (Gradio) 
- **Port**: 7860
- **Job**: Provides modern chat interface with health monitoring
- **Features**: 
  - Clean chat interface with message history
  - Backend health status display
  - Example prompts for easy testing
  - Real-time error handling and connection status
- **API Calls**: Uses `/api/v1/chat` endpoint

### Docker Setup
- Both services run in separate containers
- `docker-compose.yml` connects them together
- Frontend can reach backend using `http://backend:8000/api/v1/chat`

## Gradio Features

The Gradio frontend provides:
- **Modern Chat Interface**: Clean, responsive design with message bubbles
- **Health Monitoring**: Real-time backend connection status
- **Example Prompts**: Pre-built examples to get started quickly
- **Error Handling**: Clear error messages for connection issues
- **Auto-refresh**: Easy backend status refresh functionality

## API Versioning

The app uses FastAPI router-based versioning:
- **Current Version**: v1
- **Future Versions**: Easy to add v2, v3, etc. without breaking existing clients
- **Benefits**: Clean code organization, easy maintenance, professional structure

## Requirements

- Docker and Docker Compose
- AWS account with Bedrock access
- AWS credentials with Bedrock permissions

## Troubleshooting

**Can't connect to backend?**
- Check if both containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Test API directly: http://localhost:8000/api/v1/
- Check health status: http://localhost:8000/api/v1/health

**AWS errors?**
- Verify credentials in `.env` file
- Check Bedrock model access in AWS Console

**Port already in use?**
- Stop other applications using ports 8000 or 7860
- Or change ports in `docker-compose.yml`

**Gradio not loading?**
- Check frontend logs: `docker-compose logs frontend`
- Verify port 7860 is accessible: `curl -I http://localhost:7860`
- Try refreshing the browser page
