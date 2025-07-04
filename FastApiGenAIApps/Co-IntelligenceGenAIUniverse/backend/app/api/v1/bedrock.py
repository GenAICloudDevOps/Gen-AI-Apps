"""
Bedrock API endpoints
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
import PyPDF2
import docx
import io

from app.services.bedrock_service import bedrock_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = None

class ChatResponse(BaseModel):
    response: str

class DocumentAnalysisRequest(BaseModel):
    text: str
    analysis_type: str = "summary"

class DocumentAnalysisResponse(BaseModel):
    analysis: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Simple chat endpoint"""
    try:
        response = await bedrock_service.chat(
            message=request.message,
            conversation_history=request.conversation_history
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-text", response_model=DocumentAnalysisResponse)
async def analyze_text(request: DocumentAnalysisRequest):
    """Analyze text document"""
    try:
        analysis = await bedrock_service.analyze_document(
            text=request.text,
            analysis_type=request.analysis_type
        )
        return DocumentAnalysisResponse(analysis=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-document", response_model=DocumentAnalysisResponse)
async def analyze_document(
    file: UploadFile = File(...),
    analysis_type: str = "summary"
):
    """Analyze uploaded document"""
    try:
        # Read file content
        content = await file.read()
        text = ""
        
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        elif file.filename.endswith('.docx'):
            doc = docx.Document(io.BytesIO(content))
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        elif file.filename.endswith('.txt'):
            text = content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text found in document")
        
        # Analyze document
        analysis = await bedrock_service.analyze_document(
            text=text,
            analysis_type=analysis_type
        )
        
        return DocumentAnalysisResponse(analysis=analysis)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
