#!/bin/bash

# Create new Streamlit app script
# Usage: ./create-streamlit-app.sh app-name port "Description"

set -e

if [ $# -ne 3 ]; then
    echo "Usage: $0 <app-name> <port> <description>"
    echo "Example: $0 weather-app 8503 'Weather forecasting app'"
    exit 1
fi

APP_NAME=$1
PORT=$2
DESCRIPTION=$3
FILE_NAME="${APP_NAME//-/_}.py"
SERVICE_NAME="${APP_NAME}"

echo "🚀 Creating new Streamlit app: $APP_NAME"

# Check if port is already in use
if grep -q "\"$PORT:" docker-compose.yml; then
    echo "❌ Port $PORT is already in use in docker-compose.yml"
    exit 1
fi

# Check if app file already exists
if [ -f "apps/$FILE_NAME" ]; then
    echo "❌ App file apps/$FILE_NAME already exists"
    exit 1
fi

# Create the Streamlit app file
cat > "apps/$FILE_NAME" << EOF
"""
$APP_NAME Streamlit App
$DESCRIPTION
"""
import streamlit as st
import requests
import os

# App configuration
st.set_page_config(
    page_title="$APP_NAME",
    page_icon="🔧",
    layout="centered"
)

# Backend API URL - Use environment variable for Docker networking
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") + "/api/v1/bedrock"

def call_backend_api(endpoint, data):
    """Call backend API"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/{endpoint}",
            json=data,
            timeout=30
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"API Error: {response.status_code} - {response.text}"}
    except Exception as e:
        return {"error": f"Connection error: {str(e)}"}

def main():
    st.title("🔧 $APP_NAME")
    st.write("$DESCRIPTION")
    
    # Add your app logic here
    st.info("This is a template app. Add your functionality here!")
    
    # Example: Simple text input and processing
    user_input = st.text_input("Enter some text:")
    
    if user_input:
        st.write(f"You entered: {user_input}")
        
        # Example API call to chat endpoint
        if st.button("Process with AI"):
            with st.spinner("Processing..."):
                result = call_backend_api("chat", {"message": f"Process this text: {user_input}"})
                if "error" in result:
                    st.error(result["error"])
                else:
                    st.success("Processing complete!")
                    st.write(result.get("response", "No response"))
    
    # Example: File upload
    st.subheader("File Upload Example")
    uploaded_file = st.file_uploader("Choose a file", type=['txt', 'pdf', 'docx'])
    
    if uploaded_file is not None:
        st.write(f"File: {uploaded_file.name}")
        st.write(f"Size: {uploaded_file.size} bytes")

if __name__ == "__main__":
    main()
EOF

echo "✅ Created $FILE_NAME"

# Add service to docker-compose.yml
echo "📝 Adding service to docker-compose.yml..."

# Create backup
cp docker-compose.yml docker-compose.yml.backup

# Add new service before networks section
sed -i.tmp "/^networks:/i\\
\\
  # $APP_NAME Streamlit App\\
  $SERVICE_NAME:\\
    build:\\
      context: .\\
      dockerfile: Dockerfile.streamlit\\
    ports:\\
      - \"$PORT:$PORT\"\\
    environment:\\
      - STREAMLIT_SERVER_PORT=$PORT\\
      - STREAMLIT_SERVER_ADDRESS=0.0.0.0\\
      - API_BASE_URL=http://backend:8000\\
    volumes:\\
      - ./apps:/app\\
    command: streamlit run $FILE_NAME --server.port=$PORT --server.address=0.0.0.0 --server.headless=true\\
    depends_on:\\
      backend:\\
        condition: service_healthy\\
    networks:\\
      - app-network\\
    healthcheck:\\
      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:$PORT/_stcore/health\"]\\
      interval: 30s\\
      timeout: 10s\\
      retries: 3\\
" docker-compose.yml

rm docker-compose.yml.tmp

echo "✅ Added service to docker-compose.yml"

# Update apps.json configuration
echo "📝 Updating apps.json configuration..."

# Create backup
cp config/apps.json config/apps.json.backup

# Add new app to config using Python
python3 -c "
import json
import sys

# Read current config
with open('config/apps.json', 'r') as f:
    config = json.load(f)

# Add new app
new_app = {
    'id': '$APP_NAME',
    'name': '$APP_NAME'.replace('-', ' ').title(),
    'description': '$DESCRIPTION',
    'icon': 'Calculator',
    'url': 'http://localhost:$PORT',
    'category': 'custom',
    'version': '1.0.0',
    'status': 'active',
    'type': 'streamlit',
    'port': $PORT,
    'file': '$FILE_NAME',
    'docker_service': '$SERVICE_NAME'
}

config['apps'].append(new_app)

# Write updated config
with open('config/apps.json', 'w') as f:
    json.dump(config, f, indent=2)

print('✅ Updated apps.json')
"

echo "📋 Next steps:"
echo "1. Customize your app in apps/$FILE_NAME"
echo "2. Restart services: docker-compose up --build -d"
echo "3. Access your app at: http://localhost:$PORT"
echo ""
echo "🎉 New app created successfully!"
echo "📱 The app will automatically appear in the React frontend after restart."
