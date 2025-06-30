#!/usr/bin/env python3
"""
Enhanced App Creation Script
Creates new Streamlit apps with full integration
"""
import json
import os
import sys
import subprocess
import argparse
from pathlib import Path

def get_next_available_port(start_port=8503):
    """Get the next available port"""
    # Read current apps config
    try:
        with open('config/apps.json', 'r') as f:
            config = json.load(f)
        
        used_ports = {app.get('port') for app in config.get('apps', []) if app.get('port')}
        
        port = start_port
        while port in used_ports:
            port += 1
        
        return port
    except:
        return start_port

def create_streamlit_app(app_name, description, category="custom", icon="Calculator"):
    """Create a new Streamlit app with full integration"""
    
    # Validate inputs
    if not app_name or not description:
        raise ValueError("App name and description are required")
    
    # Generate file and service names
    file_name = app_name.replace('-', '_').replace(' ', '_').lower() + '.py'
    service_name = app_name.lower().replace(' ', '-')
    port = get_next_available_port()
    
    print(f"🚀 Creating new Streamlit app: {app_name}")
    print(f"📁 File: {file_name}")
    print(f"🔌 Port: {port}")
    print(f"🏷️  Category: {category}")
    
    # Check if app already exists
    if os.path.exists(f"apps/{file_name}"):
        raise FileExistsError(f"App file apps/{file_name} already exists")
    
    # Create the Streamlit app file
    app_template = f'''"""
{app_name} Streamlit App
{description}
"""
import streamlit as st
import requests
import os
import json

# App configuration
st.set_page_config(
    page_title="{app_name}",
    page_icon="🔧",
    layout="centered"
)

# Backend API URL - Use environment variable for Docker networking
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") + "/api/v1/bedrock"

def call_backend_api(endpoint, data=None, method="POST"):
    """Call backend API"""
    try:
        if method == "POST":
            response = requests.post(
                f"{{API_BASE_URL}}/{{endpoint}}",
                json=data,
                timeout=30
            )
        else:
            response = requests.get(
                f"{{API_BASE_URL}}/{{endpoint}}",
                timeout=30
            )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {{"error": f"API Error: {{response.status_code}} - {{response.text}}"}}
    except Exception as e:
        return {{"error": f"Connection error: {{str(e)}}"}}

def main():
    st.title("🔧 {app_name}")
    st.write("{description}")
    
    # Sidebar for app info
    with st.sidebar:
        st.header("App Info")
        st.write(f"**Category:** {category}")
        st.write(f"**Port:** {port}")
        st.write(f"**Version:** 1.0.0")
    
    # Main content area
    st.header("Features")
    
    # Example: Text processing with AI
    st.subheader("AI Text Processing")
    user_input = st.text_area("Enter text to process:", height=100)
    
    if user_input:
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("Chat with AI", type="primary"):
                with st.spinner("Processing..."):
                    result = call_backend_api("chat", {{"message": f"Help me with: {{user_input}}"}})
                    if "error" in result:
                        st.error(result["error"])
                    else:
                        st.success("✅ AI Response:")
                        st.write(result.get("response", "No response"))
        
        with col2:
            if st.button("Analyze Text"):
                with st.spinner("Analyzing..."):
                    result = call_backend_api("analyze-text", {{
                        "text": user_input,
                        "analysis_type": "summary"
                    }})
                    if "error" in result:
                        st.error(result["error"])
                    else:
                        st.success("✅ Analysis:")
                        st.write(result.get("analysis", "No analysis"))
    
    # Example: File upload
    st.subheader("File Processing")
    uploaded_file = st.file_uploader(
        "Choose a file", 
        type=['txt', 'pdf', 'docx'],
        help="Upload a document for AI analysis"
    )
    
    if uploaded_file is not None:
        st.write(f"**File:** {{uploaded_file.name}}")
        st.write(f"**Size:** {{uploaded_file.size:,}} bytes")
        
        if st.button("Analyze Document"):
            with st.spinner("Analyzing document..."):
                # This would need to be implemented with proper file handling
                st.info("Document analysis feature - implement based on your needs")
    
    # Custom functionality area
    st.subheader("Custom Features")
    st.info("Add your custom functionality here!")
    
    # Example: Simple calculator
    if category == "utility":
        st.write("**Simple Calculator:**")
        col1, col2, col3 = st.columns(3)
        with col1:
            num1 = st.number_input("Number 1", value=0.0)
        with col2:
            operation = st.selectbox("Operation", ["+", "-", "*", "/"])
        with col3:
            num2 = st.number_input("Number 2", value=0.0)
        
        if st.button("Calculate"):
            try:
                if operation == "+":
                    result = num1 + num2
                elif operation == "-":
                    result = num1 - num2
                elif operation == "*":
                    result = num1 * num2
                elif operation == "/":
                    result = num1 / num2 if num2 != 0 else "Error: Division by zero"
                
                st.success(f"Result: {{result}}")
            except Exception as e:
                st.error(f"Error: {{e}}")

if __name__ == "__main__":
    main()
'''
    
    # Write the app file
    with open(f"apps/{file_name}", 'w') as f:
        f.write(app_template)
    
    print(f"✅ Created apps/{file_name}")
    
    # Update apps.json
    try:
        with open('config/apps.json', 'r') as f:
            config = json.load(f)
    except FileNotFoundError:
        config = {"apps": []}
    
    new_app = {
        "id": service_name,
        "name": app_name,
        "description": description,
        "icon": icon,
        "url": f"http://localhost:{port}",
        "category": category,
        "version": "1.0.0",
        "status": "active",
        "type": "streamlit",
        "port": port,
        "file": file_name,
        "docker_service": service_name
    }
    
    config["apps"].append(new_app)
    
    # Backup and save config
    if os.path.exists('config/apps.json'):
        subprocess.run(['cp', 'config/apps.json', 'config/apps.json.backup'])
    
    with open('config/apps.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Updated config/apps.json")
    
    # Update docker-compose.yml
    docker_service = f'''
  # {app_name} Streamlit App
  {service_name}:
    build:
      context: .
      dockerfile: Dockerfile.streamlit
    ports:
      - "{port}:{port}"
    environment:
      - STREAMLIT_SERVER_PORT={port}
      - STREAMLIT_SERVER_ADDRESS=0.0.0.0
      - API_BASE_URL=http://backend:8000
    volumes:
      - ./apps:/app
    command: streamlit run {file_name} --server.port={port} --server.address=0.0.0.0 --server.headless=true
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:{port}/_stcore/health"]
      interval: 30s
      timeout: 10s
      retries: 3
'''
    
    # Backup docker-compose.yml
    subprocess.run(['cp', 'docker-compose.yml', 'docker-compose.yml.backup'])
    
    # Add service to docker-compose.yml
    with open('docker-compose.yml', 'r') as f:
        content = f.read()
    
    # Insert before networks section
    networks_pos = content.find('networks:')
    if networks_pos != -1:
        new_content = content[:networks_pos] + docker_service + '\n' + content[networks_pos:]
        with open('docker-compose.yml', 'w') as f:
            f.write(new_content)
        print("✅ Updated docker-compose.yml")
    else:
        print("⚠️  Could not automatically update docker-compose.yml")
    
    print(f"""
🎉 App created successfully!

📋 Next steps:
1. Customize your app in apps/{file_name}
2. Restart services: docker-compose up --build -d
3. Access your app at: http://localhost:{port}

🔧 The app will automatically appear in the React frontend after restart.
""")
    
    return {
        "name": app_name,
        "file": file_name,
        "port": port,
        "service": service_name
    }

def main():
    parser = argparse.ArgumentParser(description='Create a new Streamlit app')
    parser.add_argument('name', help='App name (e.g., "Weather App")')
    parser.add_argument('description', help='App description')
    parser.add_argument('--category', default='custom', help='App category (default: custom)')
    parser.add_argument('--icon', default='Calculator', help='App icon (default: Calculator)')
    
    args = parser.parse_args()
    
    try:
        result = create_streamlit_app(args.name, args.description, args.category, args.icon)
        print(f"✅ Successfully created {result['name']}")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
