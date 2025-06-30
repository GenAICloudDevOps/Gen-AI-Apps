"""
Document Analysis Streamlit App
Analyze documents using AWS Bedrock
"""
import streamlit as st
import requests
import io

# App configuration
st.set_page_config(
    page_title="Document Analysis",
    page_icon="📄",
    layout="centered"
)

# Backend API URL - Use environment variable for Docker networking
import os
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") + "/api/v1/bedrock"

def analyze_text(text, analysis_type):
    """Analyze text using backend API"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/analyze-text",
            json={
                "text": text,
                "analysis_type": analysis_type
            },
            timeout=30
        )
        if response.status_code == 200:
            return response.json()["analysis"]
        else:
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to backend: {str(e)}"

def analyze_document(file, analysis_type):
    """Analyze uploaded document using backend API"""
    try:
        files = {"file": (file.name, file.getvalue(), file.type)}
        data = {"analysis_type": analysis_type}
        
        response = requests.post(
            f"{API_BASE_URL}/analyze-document",
            files=files,
            data=data,
            timeout=60
        )
        
        if response.status_code == 200:
            return response.json()["analysis"]
        else:
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to backend: {str(e)}"

def main():
    st.title("📄 Document Analysis")
    st.write("Analyze documents and text using AI powered by AWS Bedrock")
    
    # Analysis type selection
    analysis_type = st.selectbox(
        "Choose analysis type:",
        ["summary", "key_points", "questions", "analysis"],
        format_func=lambda x: {
            "summary": "Summary",
            "key_points": "Key Points",
            "questions": "Important Questions",
            "analysis": "Detailed Analysis"
        }[x]
    )
    
    # Input method selection
    input_method = st.radio(
        "Choose input method:",
        ["Upload Document", "Paste Text"]
    )
    
    if input_method == "Upload Document":
        st.subheader("Upload Document")
        uploaded_file = st.file_uploader(
            "Choose a file",
            type=['pdf', 'docx', 'txt'],
            help="Supported formats: PDF, DOCX, TXT"
        )
        
        if uploaded_file is not None:
            st.write(f"**File:** {uploaded_file.name}")
            st.write(f"**Size:** {uploaded_file.size} bytes")
            
            if st.button("Analyze Document", type="primary"):
                with st.spinner("Analyzing document..."):
                    result = analyze_document(uploaded_file, analysis_type)
                    
                    st.subheader("Analysis Result")
                    st.write(result)
    
    else:  # Paste Text
        st.subheader("Paste Text")
        text_input = st.text_area(
            "Enter text to analyze:",
            height=200,
            placeholder="Paste your text here..."
        )
        
        if text_input.strip():
            if st.button("Analyze Text", type="primary"):
                with st.spinner("Analyzing text..."):
                    result = analyze_text(text_input, analysis_type)
                    
                    st.subheader("Analysis Result")
                    st.write(result)
        else:
            st.info("Please enter some text to analyze.")

if __name__ == "__main__":
    main()
