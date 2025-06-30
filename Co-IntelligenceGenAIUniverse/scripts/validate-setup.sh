#!/bin/bash

# Setup Validation Script
# Validates the entire GenAI Multi-App Platform setup

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

# Check file structure
echo ""
echo "📁 Checking File Structure..."

required_files=(
    "docker-compose.yml:Docker Compose configuration"
    "backend/app/main.py:FastAPI main application"
    "backend/requirements.txt:Python dependencies"
    "backend/Dockerfile:Backend Docker configuration"
    "react-frontend/src/App.jsx:React main component"
    "react-frontend/package.json:React dependencies"
    "react-frontend/Dockerfile:Frontend Docker configuration"
    "apps/ai_chat.py:AI Chat Streamlit app"
    "apps/document_analysis.py:Document Analysis Streamlit app"
    "Dockerfile.streamlit:Streamlit Docker configuration"
    "config/apps.json:Apps configuration"
    "scripts/deploy.sh:Deployment script"
    "scripts/create-streamlit-app.sh:App creation script"
    ".env.example:Environment template"
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
    required_vars=("AWS_DEFAULT_REGION" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            value=$(grep "^${var}=" .env | cut -d'=' -f2)
            if [ -n "$value" ] && [ "$value" != "your_value_here" ]; then
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

# Check port conflicts
echo ""
echo "🔌 Checking Port Configuration..."

ports=(3000 8000 8501 8502)

for port in "${ports[@]}"; do
    if lsof -i :$port &> /dev/null; then
        log_warning "Port $port is already in use"
    else
        log_success "Port $port is available"
    fi
done

# Check Docker images
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
fi

# Summary
echo ""
echo "📊 Validation Summary:"
echo "===================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    log_success "All checks passed! Your setup is ready to go."
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run: ./scripts/deploy.sh"
    echo "2. Access: http://localhost:3000"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}✅ Setup is functional with $WARNINGS warnings${NC}"
    echo ""
    echo "🚀 You can proceed with deployment:"
    echo "1. Run: ./scripts/deploy.sh"
    echo "2. Access: http://localhost:3000"
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

exit $ERRORS
