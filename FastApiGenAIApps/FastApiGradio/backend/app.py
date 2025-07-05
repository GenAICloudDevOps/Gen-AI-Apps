from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Create API v1 router
v1_router = APIRouter(prefix="/api/v1")

@v1_router.get("/")
async def root():
    return {"message": "Chat API v1 is running"}

@v1_router.get("/health")
async def health_check():
    try:
        # Test AWS Bedrock connection
        bedrock_client = boto3.client(
            'bedrock-runtime',
            region_name=os.getenv('AWS_REGION', 'us-east-1'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )
        
        # Simple check - try to create a minimal request (this validates credentials and connection)
        model_id = os.getenv('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0')
        
        # Test with a minimal conversation to validate the connection
        test_conversation = [
            {
                "role": "user",
                "content": [{"text": "test"}]
            }
        ]
        
        # This will fail if AWS credentials or Bedrock access is invalid
        bedrock_client.converse(
            modelId=model_id,
            messages=test_conversation,
            inferenceConfig={
                "maxTokens": 1,
                "temperature": 0.1
            }
        )
        
        return {
            "status": "healthy",
            "api": "running",
            "aws_bedrock": "connected",
            "region": os.getenv('AWS_REGION', 'us-east-1'),
            "model": model_id
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "api": "running",
            "aws_bedrock": "disconnected",
            "error": str(e),
            "region": os.getenv('AWS_REGION', 'us-east-1')
        }

@v1_router.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    try:
        bedrock_client = boto3.client(
            'bedrock-runtime',
            region_name=os.getenv('AWS_REGION', 'us-east-1'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )
        
        model_id = os.getenv('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0')
        
        conversation = [
            {
                "role": "user",
                "content": [{"text": chat_message.message}]
            }
        ]
        
        response = bedrock_client.converse(
            modelId=model_id,
            messages=conversation,
            inferenceConfig={
                "maxTokens": 1000,
                "temperature": 0.7
            }
        )
        
        response_text = response['output']['message']['content'][0]['text']
        
        return ChatResponse(response=response_text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the v1 router in the main app
app.include_router(v1_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
