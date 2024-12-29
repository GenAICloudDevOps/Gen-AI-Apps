#This is a Conversational AI Chat Application
#It uses the Mistral AI API to generate responses based on user input and uploaded files
#It supports text messages and file uploads in .txt, .pdf, .doc, and .docx formats

# Import required libraries
import chainlit as cl
import os
import aiohttp
from typing import Dict, List
import PyPDF2
from docx import Document
import io

# API configuration for Mistral
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')  # Get API key from environment variables
MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"

async def process_file(file: cl.File) -> str:
    """
    Process uploaded files and extract text content based on file type
    Supports: .txt, .pdf, .doc, .docx
    """
    try:
        file_ext = os.path.splitext(file.name)[1].lower()  # Extract file extension
        
        # Handle text files - direct UTF-8 decode
        if file_ext == '.txt':
            return file.content.decode('utf-8')
        
        # Handle PDF files - extract text from all pages
        elif file_ext == '.pdf':
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.content))
            return "\n".join(page.extract_text() for page in pdf_reader.pages)
        
        # Handle Word documents - extract text from paragraphs
        elif file_ext in ['.docx', '.doc']:
            doc = Document(io.BytesIO(file.content))
            return "\n".join(paragraph.text for paragraph in doc.paragraphs)
        
        else:
            return f"Unsupported file format: {file.name}"
    except Exception as e:
        return f"Error processing file: {str(e)}"

@cl.on_chat_start
async def start():
    """Initialize chat with welcome message"""
    await cl.Message(
        content="👋 Welcome! You can upload .txt, .pdf, .doc and .docx files for analysis."
    ).send()

async def call_mistral_api(messages: List[Dict]) -> str:
    """
    Make API calls to Mistral AI
    messages: List of conversation history in format [{"role": "user/assistant", "content": "message"}]
    """
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "mistral-small-latest",
        "messages": messages,
        "max_tokens": 900  # Maximum response length
    }
    
    try:
        # Make async API request
        async with aiohttp.ClientSession() as session:
            async with session.post(MISTRAL_API_ENDPOINT, headers=headers, json=data) as response:
                if response.status == 200:
                    result = await response.json()
                    return result["choices"][0]["message"]["content"]
                return f"API Error: {response.status}"
    except Exception as e:
        return f"Error: {str(e)}"

@cl.on_message
async def main(message: cl.Message):
    """
    Main message handler - processes both text messages and file uploads
    Maintains conversation history in session
    """
    # Get or initialize conversation history
    history = cl.user_session.get("history", [])
    
    # Handle file uploads
    if message.elements:
        for element in message.elements:
            if isinstance(element, cl.File):
                content = await process_file(element)
                await cl.Message(f"Processed file: {element.name}").send()
                # Add first 1000 chars of file content to history
                history.append({"role": "user", "content": f"File content: {content[:1000]}"})

    # Add user message to history
    history.append({"role": "user", "content": message.content})
    
    # Get AI response
    response = await call_mistral_api(history)
    
    # Add AI response to history
    history.append({"role": "assistant", "content": response})
    
    # Update session history and send response
    cl.user_session.set("history", history)
    await cl.Message(content=response).send()