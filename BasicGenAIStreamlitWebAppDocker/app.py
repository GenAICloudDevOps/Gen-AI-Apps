#basic Gen AI Streamlit Web App uses mistral API
import streamlit as st
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configuration from environment variables
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_ENDPOINT = os.getenv('MISTRAL_API_ENDPOINT')

# # Replace with your actual Mistral API endpoint and key
# MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
# MISTRAL_API_KEY = "your_mistrail_api_key"

def call_mistral_api(prompt, model):
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 900  # Adjust as needed
    }
    response = requests.post(MISTRAL_API_ENDPOINT, headers=headers, json=data)
    if response.status_code == 200:
        return response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    else:
        return f"Error: {response.status_code} - {response.text}"

st.title("Mistral API Interaction")

# Add a dropdown for model selection
model = st.selectbox("Select a model:", ["mistral-small-latest", "open-mistral-7b"])

prompt = st.text_area("Enter your prompt here:")

if st.button("Submit"):
    if prompt:
        response = call_mistral_api(prompt, model)
        st.write("Response from Mistral API:")
        st.write(response)
    else:
        st.write("Please enter a prompt.")
