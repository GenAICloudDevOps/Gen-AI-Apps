#!/bin/bash

# Frontend Fixes Validation Script
# Tests environment-aware configuration and URL handling

set -e

echo "🧪 Testing Frontend Environment-Aware Fixes"
echo "============================================"

# Function to test URL accessibility
test_url() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    echo -n "Testing $name ($url)... "
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    echo -n "Testing $name JSON ($url)... "
    if response=$(curl -s --max-time $timeout "$url" 2>/dev/null) && echo "$response" | jq . > /dev/null 2>&1; then
        echo "✅ OK"
        echo "  Response preview: $(echo "$response" | jq -c . | head -c 100)..."
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Detect environment
if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "localhost" ]; then
    ENVIRONMENT="cloud"
    BASE_URL="http://$PUBLIC_IP"
elif curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id > /dev/null 2>&1; then
    ENVIRONMENT="cloud"
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    BASE_URL="http://$PUBLIC_IP"
else
    ENVIRONMENT="local"
    BASE_URL="http://localhost"
fi

echo "🔍 Detected Environment: $ENVIRONMENT"
echo "🌐 Base URL: $BASE_URL"
echo ""

# Test backend endpoints
echo "🔧 Testing Backend Endpoints:"
test_json_endpoint "$BASE_URL:8000/health" "Health Check"
test_json_endpoint "$BASE_URL:8000/api/v1/config" "Environment Config"
test_json_endpoint "$BASE_URL:8000/api/v1/apps" "Apps List"
test_json_endpoint "$BASE_URL:8000/api/v1/system/stats" "System Stats"
echo ""

# Test frontend
echo "🎨 Testing Frontend:"
test_url "$BASE_URL:3000" "React Landing Page"
echo ""

# Test Streamlit apps
echo "🤖 Testing Streamlit Apps:"
test_url "$BASE_URL:8501" "AI Chat App"
test_url "$BASE_URL:8502" "Document Analysis App"
test_url "$BASE_URL:8503" "Web Search App"
echo ""

# Test API documentation
echo "📚 Testing API Documentation:"
test_url "$BASE_URL:8000/docs" "Swagger UI"
test_url "$BASE_URL:8000/redoc" "ReDoc"
echo ""

# Test environment configuration endpoint specifically
echo "🌍 Testing Environment Configuration:"
if config_response=$(curl -s --max-time 10 "$BASE_URL:8000/api/v1/config" 2>/dev/null); then
    echo "✅ Config endpoint accessible"
    echo "📋 Configuration Details:"
    echo "$config_response" | jq . 2>/dev/null || echo "$config_response"
    
    # Extract and validate URLs from config
    if echo "$config_response" | jq -e '.urls' > /dev/null 2>&1; then
        echo ""
        echo "🔗 Testing URLs from Configuration:"
        
        # Extract URLs using jq
        backend_url=$(echo "$config_response" | jq -r '.urls.backend // empty')
        ai_chat_url=$(echo "$config_response" | jq -r '.urls.ai_chat // empty')
        doc_analysis_url=$(echo "$config_response" | jq -r '.urls.document_analysis // empty')
        web_search_url=$(echo "$config_response" | jq -r '.urls.web_search // empty')
        
        [ -n "$backend_url" ] && test_url "$backend_url" "Backend (from config)"
        [ -n "$ai_chat_url" ] && test_url "$ai_chat_url" "AI Chat (from config)"
        [ -n "$doc_analysis_url" ] && test_url "$doc_analysis_url" "Document Analysis (from config)"
        [ -n "$web_search_url" ] && test_url "$web_search_url" "Web Search (from config)"
    fi
else
    echo "❌ Config endpoint not accessible"
fi

echo ""
echo "🎯 Frontend Fix Validation Summary:"
echo "=================================="

# Check if React app is using environment variables
echo "🔍 Checking React Environment Variables:"
if [ "$ENVIRONMENT" = "cloud" ]; then
    expected_api_url="http://$PUBLIC_IP:8000/api/v1"
else
    expected_api_url="http://localhost:8000/api/v1"
fi

echo "Expected API URL: $expected_api_url"

# Test if the React app can fetch from the correct API
echo ""
echo "🧪 Testing React App API Integration:"
if curl -s --max-time 10 "$BASE_URL:3000" | grep -q "Co-Intelligence GenAI Universe"; then
    echo "✅ React app is loading"
    
    # Check if the app is making requests to the correct API endpoint
    echo "📡 The React app should now be using environment-aware API calls"
    echo "   Check browser console for API request logs when accessing $BASE_URL:3000"
else
    echo "❌ React app is not loading properly"
fi

echo ""
echo "🎉 Test Complete!"
echo ""
echo "📱 Access your applications:"
echo "🏠 Landing Page: $BASE_URL:3000"
echo "🤖 AI Chat: $BASE_URL:8501"
echo "📄 Document Analysis: $BASE_URL:8502"
echo "🔍 Web Search: $BASE_URL:8503"
echo "🔧 Backend API: $BASE_URL:8000"
echo "📚 API Docs: $BASE_URL:8000/docs"

if [ "$ENVIRONMENT" = "cloud" ]; then
    echo ""
    echo "☁️ Cloud Environment Detected"
    echo "🌐 Public IP: $PUBLIC_IP"
    echo ""
    echo "🔒 Security Reminder:"
    echo "   Make sure your EC2 Security Group allows inbound traffic on:"
    echo "   - Port 3000 (Frontend)"
    echo "   - Port 8000 (Backend API)"
    echo "   - Ports 8501-8503 (Streamlit Apps)"
fi
