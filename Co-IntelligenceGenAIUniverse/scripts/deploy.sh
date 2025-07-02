#!/bin/bash

# GenAI Multi-App Platform Deployment Script
# Environment-aware deployment with React + FastAPI + Streamlit

set -e

echo "🚀 Starting GenAI Multi-App Platform deployment..."

# Function to detect environment
detect_environment() {
    if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "localhost" ]; then
        echo "cloud"
    elif [ -n "$EC2_INSTANCE_ID" ] || [ -n "$AWS_EXECUTION_ENV" ]; then
        echo "cloud"
    elif curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id > /dev/null 2>&1; then
        echo "cloud"
    else
        echo "local"
    fi
}

# Function to get public IP for EC2
get_public_ip() {
    if curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 > /dev/null 2>&1; then
        curl -s http://169.254.169.254/latest/meta-data/public-ipv4
    else
        echo "localhost"
    fi
}

# Detect deployment environment
DEPLOYMENT_ENV=$(detect_environment)
echo "🔍 Detected environment: $DEPLOYMENT_ENV"

# Set environment-specific configuration
if [ "$DEPLOYMENT_ENV" = "cloud" ]; then
    echo "☁️  Configuring for cloud deployment..."
    
    # Get public IP if not set
    if [ -z "$PUBLIC_IP" ] || [ "$PUBLIC_IP" = "localhost" ]; then
        PUBLIC_IP=$(get_public_ip)
        echo "🌐 Detected public IP: $PUBLIC_IP"
    fi
    
    # Use cloud environment file if it exists
    if [ -f .env.cloud ]; then
        echo "📋 Using cloud environment configuration..."
        cp .env.cloud .env.deploy
        # Replace placeholder with actual public IP
        sed -i.bak "s/YOUR_EC2_PUBLIC_IP_HERE/$PUBLIC_IP/g" .env.deploy
        export $(cat .env.deploy | grep -v '^#' | xargs)
    else
        # Update current .env for cloud
        export DEPLOYMENT_ENV=cloud
        export HOST_IP=0.0.0.0
        export PUBLIC_IP=$PUBLIC_IP
        export ENVIRONMENT=production
        export DEBUG=false
        
        # Set React environment variables for cloud
        export REACT_APP_API_URL="http://$PUBLIC_IP:8000/api/v1"
        export REACT_APP_BACKEND_URL="http://$PUBLIC_IP:8000"
        export REACT_APP_AI_CHAT_URL="http://$PUBLIC_IP:8501"
        export REACT_APP_DOCUMENT_ANALYSIS_URL="http://$PUBLIC_IP:8502"
        export REACT_APP_WEB_SEARCH_URL="http://$PUBLIC_IP:8503"
    fi
    
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "📦 Using production docker-compose configuration"
else
    echo "🏠 Configuring for local deployment..."
    
    # Use local environment file if it exists
    if [ -f .env.local ]; then
        echo "📋 Using local environment configuration..."
        cp .env.local .env.deploy
        export $(cat .env.deploy | grep -v '^#' | xargs)
    else
        # Update current .env for local
        export DEPLOYMENT_ENV=local
        export HOST_IP=localhost
        export PUBLIC_IP=localhost
        export ENVIRONMENT=development
        export DEBUG=true
        
        # Set React environment variables for local
        export REACT_APP_API_URL="http://localhost:8000/api/v1"
        export REACT_APP_BACKEND_URL="http://localhost:8000"
        export REACT_APP_AI_CHAT_URL="http://localhost:8501"
        export REACT_APP_DOCUMENT_ANALYSIS_URL="http://localhost:8502"
        export REACT_APP_WEB_SEARCH_URL="http://localhost:8503"
    fi
    
    COMPOSE_FILE="docker-compose.yml"
    echo "📦 Using development docker-compose configuration"
fi

# Display environment configuration
echo ""
echo "🔧 Environment Configuration:"
echo "  - DEPLOYMENT_ENV: $DEPLOYMENT_ENV"
echo "  - HOST_IP: $HOST_IP"
echo "  - PUBLIC_IP: $PUBLIC_IP"
echo "  - REACT_APP_API_URL: $REACT_APP_API_URL"
echo "  - REACT_APP_BACKEND_URL: $REACT_APP_BACKEND_URL"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with your AWS credentials."
    echo "Copy .env.example to .env and fill in your AWS credentials."
    exit 1
fi

# Validate AWS credentials
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "⚠️  Warning: AWS credentials not found. AI features may not work."
    echo "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file."
fi

# Build and start all services
echo "🔨 Building and starting services with $COMPOSE_FILE..."

if [ "$DEPLOYMENT_ENV" = "cloud" ]; then
    # Production deployment with explicit environment variables
    PUBLIC_IP=$PUBLIC_IP docker-compose -f $COMPOSE_FILE up --build -d
else
    # Development deployment
    docker-compose -f $COMPOSE_FILE up --build -d
fi

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 20

# Determine base URL for health checks
if [ "$DEPLOYMENT_ENV" = "cloud" ]; then
    BASE_URL="http://$PUBLIC_IP"
else
    BASE_URL="http://localhost"
fi

echo "🔍 Checking service health on $BASE_URL..."

# Check backend
if curl -s $BASE_URL:8000/health > /dev/null; then
    echo "✅ Backend API is running on $BASE_URL:8000"
else
    echo "❌ Backend API is not responding"
fi

# Check frontend
if curl -s $BASE_URL:3000 > /dev/null; then
    echo "✅ React Landing Page is running on $BASE_URL:3000"
else
    echo "❌ React Landing Page is not responding"
fi

# Check Streamlit apps
if curl -s $BASE_URL:8501 > /dev/null; then
    echo "✅ AI Chat App is running on $BASE_URL:8501"
else
    echo "❌ AI Chat App is not responding"
fi

if curl -s $BASE_URL:8502 > /dev/null; then
    echo "✅ Document Analysis App is running on $BASE_URL:8502"
else
    echo "❌ Document Analysis App is not responding"
fi

if curl -s $BASE_URL:8503 > /dev/null; then
    echo "✅ Web Search App is running on $BASE_URL:8503"
else
    echo "❌ Web Search App is not responding"
fi

# Test environment configuration endpoint
echo ""
echo "🌍 Testing Environment Configuration:"
if config_response=$(curl -s --max-time 10 "$BASE_URL:8000/api/v1/config" 2>/dev/null); then
    echo "✅ Environment config endpoint is working"
    echo "📋 Backend reports environment as: $(echo "$config_response" | grep -o '"deployment_env":"[^"]*"' | cut -d'"' -f4)"
else
    echo "⚠️  Environment config endpoint not responding"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📱 Access your applications:"
echo "🏠 Landing Page: $BASE_URL:3000"
echo "🤖 AI Chat: $BASE_URL:8501"
echo "📄 Document Analysis: $BASE_URL:8502"
echo "🔍 Web Search: $BASE_URL:8503"
echo "🔧 Backend API: $BASE_URL:8000"
echo "📚 API Docs: $BASE_URL:8000/docs"
echo ""
echo "🌍 Environment: $DEPLOYMENT_ENV"
if [ "$DEPLOYMENT_ENV" = "cloud" ]; then
    echo "🌐 Public IP: $PUBLIC_IP"
    echo ""
    echo "🔒 Security Note: Make sure your EC2 Security Group allows inbound traffic on ports:"
    echo "   - 3000 (Frontend)"
    echo "   - 8000 (Backend API)"
    echo "   - 8501-8503 (Streamlit Apps)"
fi
echo ""
echo "📊 View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 Stop services: docker-compose -f $COMPOSE_FILE down"
echo ""
echo "🧪 Run comprehensive tests: ./scripts/test-frontend-fixes.sh"

# Clean up temporary files
if [ -f .env.deploy ]; then
    rm .env.deploy
fi
if [ -f .env.deploy.bak ]; then
    rm .env.deploy.bak
fi
