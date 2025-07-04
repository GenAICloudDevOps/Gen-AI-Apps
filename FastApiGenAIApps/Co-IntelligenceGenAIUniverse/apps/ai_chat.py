"""
AI Chat Streamlit App
Environment-aware chat interface using AWS Bedrock
"""
import streamlit as st
import requests
import json
import os

# App configuration
st.set_page_config(
    page_title="AI Chat",
    page_icon="🤖",
    layout="centered"
)

# Environment-aware configuration
DEPLOYMENT_ENV = os.getenv("DEPLOYMENT_ENV", "local")
HOST_IP = os.getenv("HOST_IP", "localhost")
PUBLIC_IP = os.getenv("PUBLIC_IP", "localhost")

# Backend API URL - Use environment variable for Docker networking
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") + "/api/v1/bedrock"

def get_app_url():
    """Get the current app URL based on environment"""
    if DEPLOYMENT_ENV == "cloud":
        return f"http://{PUBLIC_IP}:8501"
    else:
        return "http://localhost:8501"

def call_chat_api(message, conversation_history=None):
    """Call the backend chat API"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/chat",
            json={
                "message": message,
                "conversation_history": conversation_history or []
            },
            timeout=30
        )
        if response.status_code == 200:
            return response.json()["response"]
        else:
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to backend: {str(e)}"

def main():
    st.title("🤖 AI Chat")
    st.write("Chat with AI powered by AWS Bedrock")
    
    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("What would you like to know?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get AI response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                # Prepare conversation history for API
                conversation_history = []
                for msg in st.session_state.messages[:-1]:  # Exclude the current message
                    conversation_history.append({
                        "role": msg["role"],
                        "content": [{"text": msg["content"]}]
                    })
                
                response = call_chat_api(prompt, conversation_history)
                st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
    
    # Sidebar with environment info
    with st.sidebar:
        st.header("App Info")
        st.write("**AI Chat Application**")
        st.write("Chat with AI using AWS Bedrock")
        
        st.header("Environment")
        st.write(f"**Environment:** {DEPLOYMENT_ENV}")
        st.write(f"**Host IP:** {HOST_IP}")
        if DEPLOYMENT_ENV == "cloud":
            st.write(f"**Public IP:** {PUBLIC_IP}")
        st.write(f"**App URL:** {get_app_url()}")
        
        # Backend connectivity test
        if st.button("Test Backend"):
            with st.spinner("Testing..."):
                try:
                    response = requests.get(API_BASE_URL.replace("/api/v1/bedrock", "/health"), timeout=5)
                    if response.status_code == 200:
                        st.success("✅ Backend connected")
                    else:
                        st.error("❌ Backend not responding")
                except:
                    st.error("❌ Backend connection failed")
        
        st.header("Chat Controls")
        # Clear chat button
        if st.button("Clear Chat"):
            st.session_state.messages = []
            st.rerun()
        
        # Chat statistics
        if st.session_state.messages:
            st.write(f"**Messages:** {len(st.session_state.messages)}")
            user_msgs = len([m for m in st.session_state.messages if m["role"] == "user"])
            st.write(f"**User messages:** {user_msgs}")
            st.write(f"**AI responses:** {len(st.session_state.messages) - user_msgs}")

if __name__ == "__main__":
    main()
