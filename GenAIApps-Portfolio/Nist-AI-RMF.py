import streamlit as st
import boto3
import psycopg2
import requests
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import io
import os
from dotenv import load_dotenv
import logging
import time
import re
from datetime import datetime

# Load environment variables and setup
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# AWS and API Configuration
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
S3_FOLDER_NAME = os.getenv('S3_FOLDER_APP3', 'App3_Nist-AI-RMF/')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
AWS_REGION = os.getenv('AWS_REGION')
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_EMBED_API_ENDPOINT = "https://api.mistral.ai/v1/embeddings"

# Initialize S3 Client
s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY,
                        aws_secret_access_key=AWS_SECRET_KEY,
                        region_name=AWS_REGION)

def get_s3_files():
    """Get list of files from S3 bucket's App3 folder"""
    try:
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET_NAME,
            Prefix=S3_FOLDER_NAME
        )
        return [obj['Key'] for obj in response.get('Contents', [])
                if obj['Key'].lower().endswith(('.pdf', '.txt', '.doc', '.docx'))]
    except Exception as e:
        st.error(f"Error accessing S3: {str(e)}")
        return []

def load_document_from_s3(bucket_name, document_key):
    """Load document from S3 with better encoding handling"""
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=document_key)
        content = response['Body'].read()
        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'cp1252']
        for encoding in encodings:
            try:
                return content.decode(encoding)
            except UnicodeDecodeError:
                continue
        raise ValueError("Could not decode document with any supported encoding")
    except Exception as e:
        st.error(f"Error loading document: {str(e)}")
        return None

def chunk_document(text):
    """Chunk document using sentence-based strategy"""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = []
    current_size = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        if current_size + len(sentence) > 8000:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [sentence]
                current_size = len(sentence)
        else:
            current_chunk.append(sentence)
            current_size += len(sentence)
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks

def get_embeddings(texts):
    """Call Mistral Embed API to get embeddings with improved error handling and request formatting"""
    try:
        # Clean and validate input texts
        texts = [text.strip() for text in texts]
        texts = [text[:8000] for text in texts if text]  # Limit each text to 8000 chars
        
        if not texts:
            raise ValueError("No valid texts provided for embedding.")
        
        # Process in smaller batches
        batch_size = 2  # Smaller batch size to avoid rate limits
        all_embeddings = []
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            headers = {
                "Authorization": f"Bearer {MISTRAL_API_KEY}",
                "Content-Type": "application/json"
            }
            
            # Ensure the input format matches the API requirements
            data = {
                "model": "mistral-embed",
                "input": batch,
                "encoding_format": "float"  # Explicitly specify the encoding format
            }
            
            logger.info(f"Processing batch {i//batch_size + 1} of {(len(texts) + batch_size - 1)//batch_size}")
            
            for retry in range(3):
                try:
                    response = requests.post(
                        MISTRAL_EMBED_API_ENDPOINT,
                        headers=headers,
                        json=data,
                        timeout=30  # Add timeout
                    )
                    
                    # Log the response for debugging
                    logger.info(f"Response status: {response.status_code}")
                    if response.status_code != 200:
                        logger.error(f"Response content: {response.text}")
                    
                    response.raise_for_status()
                    
                    result = response.json()
                    if "data" not in result:
                        raise ValueError(f"Unexpected API response format: {result}")
                    
                    embeddings = result["data"]
                    if len(embeddings) != len(batch):
                        raise ValueError(f"Received {len(embeddings)} embeddings for {len(batch)} texts")
                    
                    all_embeddings.extend([e["embedding"] for e in embeddings])
                    logger.info(f"Successfully processed {len(embeddings)} embeddings")
                    
                    # Add delay between batches to avoid rate limits
                    time.sleep(2)
                    break
                    
                except requests.exceptions.RequestException as e:
                    logger.error(f"Request error in batch {i//batch_size + 1}, attempt {retry + 1}: {str(e)}")
                    if retry == 2:
                        raise
                    time.sleep(5 * (retry + 1))
                    
                except Exception as e:
                    logger.error(f"Error in batch {i//batch_size + 1}, attempt {retry + 1}: {str(e)}")
                    if retry == 2:
                        raise
                    time.sleep(5 * (retry + 1))
        
        return all_embeddings
        
    except Exception as e:
        logger.error(f"Embedding error: {str(e)}")
        if hasattr(e, 'response'):
            logger.error(f"Response content: {e.response.text}")
        st.error(f"Error getting embeddings: {str(e)}")
        return None

def get_answer(question, context):
    """Get answer using Mistral API with improved error handling"""
    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Format system message and user message separately
        system_message = {
            "role": "system",
            "content": "You are an AI assistant specialized in the NIST AI Risk Management Framework. Provide detailed answers based on the given context."
        }
        
        user_message = {
            "role": "user",
            "content": f"""Context: {context}

Question: {question}

Please provide a detailed answer based on the provided context about the NIST AI Risk Management Framework. 
Include specific references to the framework where applicable."""
        }

        data = {
            "model": "mistral-small",  # Updated model name
            "messages": [system_message, user_message],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        logger.info("Sending request to Mistral chat API...")
        response = requests.post(
            MISTRAL_API_ENDPOINT,
            headers=headers,
            json=data,
            timeout=30
        )
        
        # Log response for debugging
        logger.info(f"Response status: {response.status_code}")
        if response.status_code != 200:
            logger.error(f"Response content: {response.text}")
            
        response.raise_for_status()
        
        result = response.json()
        if "choices" not in result or not result["choices"]:
            raise ValueError("No choices in API response")
            
        return result["choices"][0]["message"]["content"]
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        if hasattr(e, 'response'):
            logger.error(f"Response content: {e.response.text}")
        st.error(f"Error getting answer: {str(e)}")
        return None
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        st.error(f"Error getting answer: {str(e)}")
        return None

def main():
    st.set_page_config(page_title="NIST AI Risk Management Framework", layout="wide")
    
    # Center-aligned title and description
    st.markdown("""
        <div style='text-align: center; padding: 1rem 0;'>
            <h1 style='font-size: 2.5rem; margin-bottom: 1rem;'>
                NIST AI Risk Management Framework
            </h1>
            <p style='font-size: 1.2rem; color: #666; max-width: 800px; margin: 0 auto 2rem auto;'>
                Query and get responses related to the NIST AI Risk Management Framework. 
                Select a document, process it, and ask questions to get informed answers based on the framework.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    # Initialize session state
    if 'processed' not in st.session_state:
        st.session_state.processed = False
    if 'embeddings' not in st.session_state:
        st.session_state.embeddings = None
    if 'chunks' not in st.session_state:
        st.session_state.chunks = None

    # Two-column layout with different widths
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.markdown("### Document Selection")
        # Document selection in a compact form
        s3_files = get_s3_files()
        selected_file = st.selectbox(
            "Select Document",
            s3_files if s3_files else ["No documents found"],
            key="doc_select"
        )
        
        # Process button
        if st.button("Process Document", use_container_width=True):
            if selected_file == "No documents found":
                st.error("No documents available to process")
                return
            
            with st.spinner("Processing document..."):
                content = load_document_from_s3(S3_BUCKET_NAME, selected_file)
                if content:
                    st.info("Document loaded successfully")
                    chunks = chunk_document(content)
                    if chunks:
                        st.info(f"Created {len(chunks)} chunks")
                        with st.spinner("Generating embeddings..."):
                            embeddings = get_embeddings(chunks)
                            if embeddings and len(embeddings) == len(chunks):
                                st.session_state.chunks = chunks
                                st.session_state.embeddings = embeddings
                                st.session_state.processed = True
                                st.success("✅ Document processed successfully!")
                            else:
                                st.error(f"Failed to generate embeddings. Generated: {len(embeddings) if embeddings else 0}, Expected: {len(chunks)}")
                    else:
                        st.error("No valid chunks created from document")
    
    with col2:
        st.markdown("### Ask Questions")
        # Query interface
        query = st.text_area(
            "Enter your question about NIST AI Risk Management Framework:",
            height=100,
            placeholder="e.g., What are the key components of AI risk assessment?"
        )
        
        if st.button("Submit Question", use_container_width=True):
            if not st.session_state.processed:
                st.error("⚠️ Please process a document first!")
                return
                
            if not query:
                st.warning("Please enter a question.")
                return
                
            with st.spinner("Finding answer..."):
                query_embedding = get_embeddings([query])
                if not query_embedding:
                    st.error("Failed to process question")
                    return
                    
                similarities = cosine_similarity(
                    [query_embedding[0]],
                    st.session_state.embeddings
                )[0]
                
                top_indices = np.argsort(similarities)[-3:][::-1]
                relevant_chunks = [st.session_state.chunks[i] for i in top_indices]
                context = " ".join(relevant_chunks)
                
                answer = get_answer(query, context)
                
                if answer:
                    st.markdown("### Answer")
                    st.write(answer)
                    
                    with st.expander("View source context"):
                        for i, chunk in enumerate(relevant_chunks):
                            st.info(f"Relevance: {similarities[top_indices[i]]:.2f}")
                            st.write(chunk)
                            st.divider()

if __name__ == "__main__":
    main()