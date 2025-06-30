#!/bin/bash

# Setup Validation Script
# Validates the entire GenAI Multi-App Platform setup for both local and cloud deployment

set -e

echo "🔍 Validating GenAI Multi-App Platform Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    ((WARNINGS++))
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to detect environment
detect_environment() {
    if curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id > /dev/null 2>&1; then
        echo "cloud"
    else
        echo "local"
    fi
}

# Detect current environment
CURRENT_ENV=$(detect_environment)
log_info "Detected environment: $CURRENT_ENV"

# Check prerequisites
echo "🔧 Checking Prerequisites..."

# Check Docker
if command -v docker &> /dev/null; then
    log_success "Docker is installed"
    if docker info &> /dev/null; then
        log_success "Docker daemon is running"
    else
        log_error "Docker daemon is not running"
    fi
else
    log_error "Docker is not installed"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    log_success "Docker Compose is installed"
else
    log_error "Docker Compose is not installed"
fi

# Check Python
if command -v python3 &> /dev/null; then
    log_success "Python 3 is installed"
else
    log_warning "Python 3 is not installed (needed for app creation scripts)"
fi

# Check Node.js (for React development)
if command -v node &> /dev/null; then
    log_success "Node.js is installed"
else
    log_warning "Node.js is not installed (needed for React development)"
fi

# Check curl for health checks
if command -v curl &> /dev/null; then
    log_success "curl is installed"
else
    log_error "curl is not installed (needed for health checks)"
fi

# Check file structure
echo ""
echo "📁 Checking File Structure..."

required_files=(
    "docker-compose.yml:Docker Compose configuration"
    "docker-compose.prod.yml:Production Docker Compose configuration"
    "backend/app/main.py:FastAPI main application"
    "backend/requirements.txt:Python dependencies"
    "backend/Dockerfile:Backend Docker configuration"
    "react-frontend/src/App.jsx:React main component"
    "react-frontend/package.json:React dependencies"
    "react-frontend/Dockerfile:Frontend Docker configuration"
    "apps/ai_chat.py:AI Chat Streamlit app"
    "apps/document_analysis.py:Document Analysis Streamlit app"
    "apps/web_search.py:Web Search Streamlit app"
    "Dockerfile.streamlit:Streamlit Docker configuration"
    "config/apps.json:Apps configuration"
    "scripts/deploy.sh:Deployment script"
    "scripts/create-streamlit-app.sh:App creation script"
    ".env.example:Environment template"
    ".env.local:Local environment template"
    ".env.cloud:Cloud environment template"
)

for item in "${required_files[@]}"; do
    file="${item%%:*}"
    description="${item##*:}"
    
    if [ -f "$file" ]; then
        log_success "$description ($file)"
    else
        log_error "$description is missing ($file)"
    fi
done

# Check directories
required_dirs=(
    "backend/app/api/v1:Backend API structure"
    "backend/app/services:Backend services"
    "react-frontend/src/components:React components"
    "react-frontend/src/services:React services"
    "apps:Streamlit applications"
    "config:Configuration files"
    "scripts:Utility scripts"
)

for item in "${required_dirs[@]}"; do
    dir="${item%%:*}"
    description="${item##*:}"
    
    if [ -d "$dir" ]; then
        log_success "$description ($dir)"
    else
        log_error "$description directory is missing ($dir)"
    fi
done

# Check environment configuration
echo ""
echo "🌍 Checking Environment Configuration..."

if [ -f ".env" ]; then
    log_success ".env file exists"
    
    # Check required environment variables
    required_vars=("AWS_DEFAULT_REGION" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "DEPLOYMENT_ENV" "HOST_IP" "PUBLIC_IP")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            value=$(grep "^${var}=" .env | cut -d'=' -f2)
            if [ -n "$value" ] && [ "$value" != "your_value_here" ] && [ "$value" != "YOUR_EC2_PUBLIC_IP_HERE" ]; then
                log_success "$var is configured"
            else
                log_warning "$var is not properly configured"
            fi
        else
            log_warning "$var is missing from .env file"
        fi
    done
else
    log_error ".env file is missing (copy from .env.example)"
fi

# Check environment-specific files
if [ -f ".env.local" ]; then
    log_success "Local environment configuration exists"
else
    log_warning "Local environment configuration (.env.local) is missing"
fi

if [ -f ".env.cloud" ]; then
    log_success "Cloud environment configuration exists"
else
    log_warning "Cloud environment configuration (.env.cloud) is missing"
fi

# Check Python syntax
echo ""
echo "🐍 Checking Python Syntax..."

python_files=(
    "backend/app/main.py"
    "backend/app/services/bedrock_service.py"
    "backend/app/services/app_manager.py"
    "backend/app/api/v1/bedrock.py"
    "apps/ai_chat.py"
    "apps/document_analysis.py"
    "apps/web_search.py"
)

for file in "${python_files[@]}"; do
    if [ -f "$file" ]; then
        if python3 -m py_compile "$file" 2>/dev/null; then
            log_success "Python syntax OK: $file"
        else
            log_error "Python syntax error in: $file"
        fi
    fi
done

# Check JSON configuration
echo ""
echo "📋 Checking JSON Configuration..."

json_files=(
    "config/apps.json"
    "react-frontend/package.json"
)

for file in "${json_files[@]}"; do
    if [ -f "$file" ]; then
        if python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
            log_success "JSON syntax OK: $file"
        else
            log_error "JSON syntax error in: $file"
        fi
    fi
done

# Check port configuration
echo ""
echo "🔌 Checking Port Configuration..."

ports=(3000 8000 8501 8502 8503)

for port in "${ports[@]}"; do
    if lsof -i :$port &> /dev/null; then
        log_warning "Port $port is already in use"
    else
        log_success "Port $port is available"
    fi
done

# Check Docker setup
echo ""
echo "🐳 Checking Docker Setup..."

if docker info &> /dev/null; then
    # Check if images exist
    if docker images | grep -q "python"; then
        log_success "Python Docker image is available"
    else
        log_info "Python Docker image will be downloaded on first build"
    fi
    
    if docker images | grep -q "node"; then
        log_success "Node.js Docker image is available"
    else
        log_info "Node.js Docker image will be downloaded on first build"
    fi
    
    if docker images | grep -q "nginx"; then
        log_success "Nginx Docker image is available"
    else
        log_info "Nginx Docker image will be downloaded on first build"
    fi
fi

# Environment-specific checks
echo ""
echo "🌐 Environment-Specific Checks..."

if [ "$CURRENT_ENV" = "cloud" ]; then
    log_info "Running on cloud/EC2 instance"
    
    # Check if we can get public IP
    if curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 > /dev/null; then
        PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
        log_success "Public IP detected: $PUBLIC_IP"
    else
        log_warning "Could not detect public IP"
    fi
    
    # Check security group (if possible)
    log_info "Make sure your EC2 Security Group allows inbound traffic on ports 3000, 8000, 8501-8503"
    
else
    log_info "Running on local machine"
    log_success "Local development environment detected"
fi

# Check React build configuration
echo ""
echo "⚛️  Checking React Configuration..."

if [ -f "react-frontend/Dockerfile" ]; then
    if grep -q "ARG REACT_APP_API_URL" react-frontend/Dockerfile; then
        log_success "React Dockerfile supports build arguments"
    else
        log_warning "React Dockerfile may not support environment-specific builds"
    fi
fi

if [ -f "react-frontend/src/services/api.js" ]; then
    if grep -q "getApiBaseUrl" react-frontend/src/services/api.js; then
        log_success "React API service supports environment detection"
    else
        log_warning "React API service may not support environment detection"
    fi
fi

# Summary
echo ""
echo "📊 Validation Summary:"
echo "===================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    log_success "All checks passed! Your setup is ready for both local and cloud deployment."
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run: ./scripts/deploy.sh"
    if [ "$CURRENT_ENV" = "cloud" ]; then
        echo "2. Access: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_PUBLIC_IP'):3000"
    else
        echo "2. Access: http://localhost:3000"
    fi
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}✅ Setup is functional with $WARNINGS warnings${NC}"
    echo ""
    echo "🚀 You can proceed with deployment:"
    echo "1. Run: ./scripts/deploy.sh"
    if [ "$CURRENT_ENV" = "cloud" ]; then
        echo "2. Access: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_PUBLIC_IP'):3000"
    else
        echo "2. Access: http://localhost:3000"
    fi
else
    echo -e "${RED}❌ Setup has $ERRORS errors and $WARNINGS warnings${NC}"
    echo ""
    echo "🔧 Please fix the errors before proceeding:"
    echo "1. Address the errors listed above"
    echo "2. Run this script again to validate"
    echo "3. Then run: ./scripts/deploy.sh"
fi

echo ""
echo "📚 Useful commands:"
echo "• Test system: ./scripts/test-system.sh"
echo "• Create new app: ./scripts/add-app.py 'App Name' 'Description'"
echo "• View logs: docker-compose logs -f"
echo "• Stop services: docker-compose down"
echo ""
echo "🌍 Environment Information:"
echo "• Current environment: $CURRENT_ENV"
if [ "$CURRENT_ENV" = "cloud" ]; then
    echo "• Public IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'Not detected')"
    echo "• Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id 2>/dev/null || echo 'Not detected')"
fi

exit $ERRORS
