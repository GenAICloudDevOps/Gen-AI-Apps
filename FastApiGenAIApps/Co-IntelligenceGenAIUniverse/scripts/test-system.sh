#!/bin/bash

# System Test Script
# Tests all components of the GenAI Multi-App Platform for both local and cloud environments

set -e

echo "🧪 Testing GenAI Multi-App Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to detect environment and get base URL
get_base_url() {
    if curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id > /dev/null 2>&1; then
        # Cloud environment
        PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")
        echo "http://$PUBLIC_IP"
    else
        # Local environment
        echo "http://localhost"
    fi
}

BASE_URL=$(get_base_url)
echo -e "${BLUE}ℹ️  Testing on: $BASE_URL${NC}"

# Test functions
test_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $service_name... "
    
    if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" | grep -q "$expected_status"; then
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
        response=$(curl -s --max-time 10 -X POST -H "Content-Type: application/json" -d "$data" "$url" 2>/dev/null)
    else
        response=$(curl -s --max-time 10 "$url" 2>/dev/null)
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
test_service "Health Check" "$BASE_URL:8000/health"
test_api_endpoint "Config Endpoint" "$BASE_URL:8000/api/v1/config"
test_api_endpoint "Apps Endpoint" "$BASE_URL:8000/api/v1/apps"
test_api_endpoint "System Stats" "$BASE_URL:8000/api/v1/system/stats"

# Test Frontend
echo "🌐 Testing React Frontend..."
test_service "React Landing Page" "$BASE_URL:3000"

# Test Streamlit Apps
echo "📱 Testing Streamlit Apps..."
test_service "AI Chat App" "$BASE_URL:8501/_stcore/health"
test_service "Document Analysis App" "$BASE_URL:8502/_stcore/health"
test_service "Web Search App" "$BASE_URL:8503/_stcore/health"

# Test API functionality (if AWS credentials are available)
echo "🤖 Testing AI Functionality..."
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    test_api_endpoint "Chat API" "$BASE_URL:8000/api/v1/bedrock/chat" "POST" '{"message":"Hello, test message"}'
    echo -e "${GREEN}✅ AWS Bedrock integration available${NC}"
else
    echo -e "${YELLOW}⚠️  AWS credentials not found - AI features will not work${NC}"
fi

# Test Docker services
echo "🐳 Testing Docker Services..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker services are running${NC}"
    
    # Show service status
    echo ""
    echo "📊 Service Status:"
    docker-compose ps --format "table {{.Name}}\t{{.State}}\t{{.Ports}}"
else
    echo -e "${RED}❌ Docker services are not running${NC}"
fi

# Test environment configuration
echo "🌍 Testing Environment Configuration..."
config_response=$(curl -s --max-time 5 "$BASE_URL:8000/api/v1/config" 2>/dev/null)
if [ $? -eq 0 ] && [ -n "$config_response" ]; then
    echo -e "${GREEN}✅ Environment configuration accessible${NC}"
    
    # Extract environment info
    if command -v python3 &> /dev/null; then
        env_info=$(echo "$config_response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"Environment: {data.get('deployment_env', 'unknown')}, Host: {data.get('host_ip', 'unknown')}, Public IP: {data.get('public_ip', 'unknown')}\")" 2>/dev/null)
        if [ -n "$env_info" ]; then
            echo -e "${BLUE}ℹ️  $env_info${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Could not retrieve environment configuration${NC}"
fi

# Test file structure
echo "📁 Testing File Structure..."
required_files=(
    "docker-compose.yml"
    "docker-compose.prod.yml"
    "backend/app/main.py"
    "react-frontend/src/App.jsx"
    "apps/ai_chat.py"
    "apps/document_analysis.py"
    "apps/web_search.py"
    "config/apps.json"
    ".env"
    ".env.local"
    ".env.cloud"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file ${GREEN}exists${NC}"
    else
        echo -e "❌ $file ${RED}missing${NC}"
    fi
done

# Test network connectivity
echo "🌐 Testing Network Connectivity..."
if [ "$BASE_URL" != "http://localhost" ]; then
    echo "Testing external access..."
    
    # Test if ports are accessible from outside
    ports=(3000 8000 8501 8502 8503)
    for port in "${ports[@]}"; do
        if curl -s --max-time 5 "$BASE_URL:$port" > /dev/null; then
            echo -e "✅ Port $port ${GREEN}accessible${NC}"
        else
            echo -e "❌ Port $port ${RED}not accessible${NC}"
        fi
    done
    
    echo -e "${YELLOW}⚠️  If ports are not accessible, check your EC2 Security Group settings${NC}"
fi

echo ""
echo "🎯 Test Summary:"
echo "📱 Access your applications:"
echo "🏠 Landing Page: $BASE_URL:3000"
echo "🤖 AI Chat: $BASE_URL:8501"
echo "📄 Document Analysis: $BASE_URL:8502"
echo "🔍 Web Search: $BASE_URL:8503"
echo "🔧 Backend API: $BASE_URL:8000"
echo "📚 API Docs: $BASE_URL:8000/docs"
echo ""

# Environment-specific information
if [ "$BASE_URL" != "http://localhost" ]; then
    echo "☁️  Cloud Deployment Information:"
    echo "🌐 Public IP: $(echo $BASE_URL | sed 's/http:\/\///')"
    echo "🔒 Security: Ensure EC2 Security Group allows inbound traffic on ports 3000, 8000, 8501-8503"
    echo "🌍 Region: $(curl -s http://169.254.169.254/latest/meta-data/placement/region 2>/dev/null || echo 'Unknown')"
    echo ""
fi

echo "🔧 Useful commands:"
echo "📊 View logs: docker-compose logs -f"
echo "🔄 Restart: docker-compose restart"
echo "🛑 Stop: docker-compose down"
echo "🚀 Deploy: ./scripts/deploy.sh"
echo "🔍 Validate: ./scripts/validate-setup.sh"

# Performance test
echo ""
echo "⚡ Quick Performance Test..."
start_time=$(date +%s)
curl -s --max-time 5 "$BASE_URL:8000/health" > /dev/null
end_time=$(date +%s)
response_time=$((end_time - start_time))

if [ $response_time -lt 2 ]; then
    echo -e "${GREEN}✅ Backend response time: ${response_time}s (Good)${NC}"
elif [ $response_time -lt 5 ]; then
    echo -e "${YELLOW}⚠️  Backend response time: ${response_time}s (Acceptable)${NC}"
else
    echo -e "${RED}❌ Backend response time: ${response_time}s (Slow)${NC}"
fi
