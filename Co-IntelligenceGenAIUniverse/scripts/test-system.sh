#!/bin/bash

# System Test Script
# Tests all components of the GenAI Multi-App Platform

set -e

echo "🧪 Testing GenAI Multi-App Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $service_name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

test_api_endpoint() {
    local endpoint_name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -n "Testing $endpoint_name... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url" 2>/dev/null)
    else
        response=$(curl -s "$url" 2>/dev/null)
    fi
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

# Check if services are running
echo "🔍 Checking if services are running..."

# Test Backend API
echo "📡 Testing Backend API..."
test_service "Health Check" "http://localhost:8000/health"
test_api_endpoint "Apps Endpoint" "http://localhost:8000/api/v1/apps"
test_api_endpoint "System Stats" "http://localhost:8000/api/v1/system/stats"

# Test Frontend
echo "🌐 Testing React Frontend..."
test_service "React Landing Page" "http://localhost:3000"

# Test Streamlit Apps
echo "📱 Testing Streamlit Apps..."
test_service "AI Chat App" "http://localhost:8501/_stcore/health"
test_service "Document Analysis App" "http://localhost:8502/_stcore/health"

# Test API functionality (if AWS credentials are available)
echo "🤖 Testing AI Functionality..."
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    test_api_endpoint "Chat API" "http://localhost:8000/api/v1/bedrock/chat" "POST" '{"message":"Hello, test message"}'
    echo -e "${GREEN}✅ AWS Bedrock integration available${NC}"
else
    echo -e "${YELLOW}⚠️  AWS credentials not found - AI features will not work${NC}"
fi

# Test Docker services
echo "🐳 Testing Docker Services..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker services are running${NC}"
else
    echo -e "${RED}❌ Docker services are not running${NC}"
fi

# Test file structure
echo "📁 Testing File Structure..."
required_files=(
    "docker-compose.yml"
    "backend/app/main.py"
    "react-frontend/src/App.jsx"
    "apps/ai_chat.py"
    "apps/document_analysis.py"
    "config/apps.json"
    ".env"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file ${GREEN}exists${NC}"
    else
        echo -e "❌ $file ${RED}missing${NC}"
    fi
done

echo ""
echo "🎯 Test Summary:"
echo "📱 Access your applications:"
echo "🏠 Landing Page: http://localhost:3000"
echo "🤖 AI Chat: http://localhost:8501"
echo "📄 Document Analysis: http://localhost:8502"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "🔧 Useful commands:"
echo "📊 View logs: docker-compose logs -f"
echo "🔄 Restart: docker-compose restart"
echo "🛑 Stop: docker-compose down"
echo "🚀 Deploy: ./scripts/deploy.sh"
