"""
AI Chat Streamlit App
Simple chat interface using AWS Bedrock
"""
import streamlit as st
import requests
import json

# App configuration
st.set_page_config(
    page_title="AI Chat",
    page_icon="🤖",
    layout="centered"
)

# Backend API URL - Use environment variable for Docker networking
import os
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") + "/api/v1/bedrock"

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
    
    # Clear chat button
    if st.button("Clear Chat"):
        st.session_state.messages = []
        st.rerun()

if __name__ == "__main__":
    main()
