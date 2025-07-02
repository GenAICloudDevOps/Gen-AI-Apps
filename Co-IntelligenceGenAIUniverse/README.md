# 🚀 Co-Intelligence GenAI Universe


**Where Human Meets AI Intelligence - Now with Cloud Deployment Support**

A modular, production-ready platform built with React, FastAPI, Streamlit, and AWS Bedrock - enabling rapid co-intelligence development through scalable architecture that works seamlessly in both local and cloud environments.

⚡ **From concept to live AI app in under 3 minutes - anywhere***

## 🎯 Platform Features

- **🚀 React Frontend** - Modern, responsive interface with dark/light themes
- **⚡ FastAPI Backend** - High-performance API with auto-docs
- **🧠 Rapid AI Development** - AWS Bedrock integration with rapid Streamlit development
- **🏗️ Modular Architecture** - Scalable, maintainable design with independent components
- **🤖 Co-Intelligence** - Collaborative intelligence combining human insight and AI
- **🌍 Environment-Aware** - Seamless deployment on local machines and cloud (EC2)
- **🔄 Auto-Configuration** - Smart environment detection and URL management

## 📸 Platform Screenshots

### Main Dashboard
![Main Dashboard](screenshots/1.png)
*Modern React frontend with real-time system metrics, app status monitoring, and dark theme interface*

### Application Overview
![Application Overview](screenshots/2.png)
*Complete view of available AI applications with launch capabilities and platform features showcase*

### API Documentation
![API Documentation](screenshots/3.png)
*Interactive Swagger UI showing all available API endpoints for Bedrock AI services and system management*

### Document Analysis App
![Document Analysis](screenshots/4.png)
*Streamlit-based document analysis interface with drag-and-drop file upload and multiple analysis options*

## 🏗️ Architecture

```
┌─────────────────┐    Launch App    ┌──────────────────┐
│   React         │ ──────────────► │   Streamlit      │
│   Landing Page  │                 │   AI Apps        │
│   (Port 3000)   │                 │   (Port 8501+)   │
└─────────────────┘                 └──────────────────┘
         │                                    │
         │ HTTP/REST                          │
         ▼                                    │
┌──────────────────┐                         │
│   FastAPI        │ ◄───────────────────────┘
│   Backend        │
│   (Port 8000)    │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│   AWS Bedrock    │
│   Converse API   │
└──────────────────┘
```

## 🌍 Deployment Environments

### 🏠 Local Development
- **Perfect for:** Development, testing, and local demos
- **Access:** http://localhost:3000
- **Configuration:** Automatic localhost detection
- **Features:** Hot reload, debug mode, development tools

### ☁️ Cloud Deployment (EC2)
- **Perfect for:** Production, sharing, and scalable deployment
- **Access:** http://YOUR_EC2_PUBLIC_IP:3000
- **Configuration:** Automatic cloud detection and IP configuration
- **Features:** Production optimization, auto-restart, security headers

## 📱 Available Apps

### 🤖 AI Chat
- **AI-powered chat** using AWS Bedrock Claude 3 Haiku models
- **Real-time responses** with conversation history
- **Environment-aware interface** with connectivity testing
- **Status**: ✅ **Working** - Tested with AWS Bedrock
- **Access**: 
  - Local: http://localhost:8501
  - Cloud: http://YOUR_EC2_IP:8501

### 📄 Document Analysis
- **Document upload** support (PDF, DOCX, TXT)
- **AI-powered text analysis** with multiple options:
  - Summary
  - Key Points
  - Important Questions
  - Detailed Analysis
- **Environment-aware processing** with backend connectivity tests
- **Status**: ✅ **Working** - Ready for document processing
- **Access**: 
  - Local: http://localhost:8502
  - Cloud: http://YOUR_EC2_IP:8502

### 🔍 Web Search
- **AI-powered web search** using DuckDuckGo and AWS Bedrock
- **Intelligent rate limiting** with automatic retry logic
- **AI analysis** of search results for comprehensive insights
- **Environment-aware configuration** with smart URL handling
- **Status**: ✅ **Working** - Enhanced with rate limit handling
- **Access**: 
  - Local: http://localhost:8503
  - Cloud: http://YOUR_EC2_IP:8503

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- AWS credentials (for AI features)
- Python 3.8+ (for development scripts)
- For EC2: Security Group with ports 3000, 8000, 8501-8503 open

### Environment Setup

#### For Local Development:
```bash
# Copy local environment template
cp .env.local .env

# Edit with your AWS credentials
nano .env
```

#### For Cloud/EC2 Deployment:
```bash
# Copy cloud environment template
cp .env.cloud .env

# Edit with your AWS credentials and public IP
nano .env
# Replace YOUR_EC2_PUBLIC_IP_HERE with your actual EC2 public IP
```

### Validate Setup
```bash
# Check if everything is configured correctly
./scripts/validate-setup.sh
```

### One-Command Deployment (Works Everywhere!)
```bash
# Deploy with automatic environment detection
./scripts/deploy.sh

# The script automatically detects:
# - Local machine vs EC2 instance
# - Public IP address (for EC2)
# - Appropriate configuration files
# - Environment-specific settings

# Access points will be shown after deployment:
# 🏠 Landing Page: http://localhost:3000 OR http://YOUR_EC2_IP:3000
# 🤖 AI Chat: http://localhost:8501 OR http://YOUR_EC2_IP:8501
# 📄 Document Analysis: http://localhost:8502 OR http://YOUR_EC2_IP:8502
# 🔍 Web Search: http://localhost:8503 OR http://YOUR_EC2_IP:8503
# 🔧 Backend API: http://localhost:8000 OR http://YOUR_EC2_IP:8000
# 📚 API Docs: http://localhost:8000/docs OR http://YOUR_EC2_IP:8000/docs
```

### Test Your Setup
```bash
# Run comprehensive system tests (environment-aware)
./scripts/test-system.sh
```

### Manual Deployment
```bash
# Local deployment
docker-compose up --build -d

# Cloud deployment (uses production configuration)
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🛠️ Development

### Project Structure
```
allapps/
├── backend/                 # FastAPI backend with environment awareness
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── services/       # Business logic (Bedrock service)
│   │   └── main.py         # Environment-aware FastAPI app
├── react-frontend/         # React landing page with dynamic configuration
├── apps/                   # Environment-aware Streamlit applications
│   ├── ai_chat.py         # AI Chat app with environment detection
│   ├── document_analysis.py # Document analysis with cloud support
│   └── web_search.py      # Web Search with environment awareness
├── config/                # Configuration management
│   └── apps.json          # Dynamic app registry with environment support
├── scripts/               # Enhanced automation scripts
│   ├── deploy.sh          # Smart environment-aware deployment
│   ├── add-app.py         # Environment-aware app creation
│   ├── validate-setup.sh  # Comprehensive validation for both environments
│   └── test-system.sh     # Environment-aware system testing
├── docker-compose.yml     # Development container orchestration
├── docker-compose.prod.yml # Production container orchestration
├── .env.local            # Local development configuration
├── .env.cloud            # Cloud deployment configuration
└── .env.example          # Environment template
```

## ➕ Adding New Apps

### Automated App Creation (Recommended)
```bash
# Create environment-aware apps with full integration
./scripts/add-app.py "Weather App" "Weather forecasting with AI" --category utility

# The new app will automatically include:
# - Environment detection (local/cloud)
# - Dynamic URL configuration
# - Backend connectivity testing
# - Environment-specific features
```

### What Gets Created Automatically:
- ✅ Complete Streamlit app template with environment awareness
- ✅ Docker service configuration for both local and cloud
- ✅ Apps.json configuration update with environment support
- ✅ Health checks and networking for both environments
- ✅ Automatic port assignment
- ✅ React frontend integration with dynamic URLs

## 🎨 Enhanced Frontend Features

### 🌙 Dark/Light Mode
- **Theme Toggle** - Switch between dark and light themes
- **Persistent Preferences** - Theme choice saved automatically
- **Smooth Transitions** - All UI elements adapt seamlessly

### 📊 Real-time Dashboard
- **Auto-refresh** - Updates every 30 seconds
- **Live Status** - System health monitoring with environment info
- **Performance Metrics** - App usage and uptime tracking
- **Environment Display** - Shows current deployment environment

### ⚙️ Management Panel
- **Analytics** - Usage patterns and performance insights
- **Environment Info** - Current deployment status and configuration
- **Backup** - Configuration management tools
- **Security** - Access monitoring and logs

## 🔧 API Endpoints

### Environment Configuration
- `GET /api/v1/config` - Get environment configuration and URLs
- `GET /health` - Health check with environment details

### Bedrock AI Services
- `POST /api/v1/bedrock/chat` - AI chat with conversation history
- `POST /api/v1/bedrock/analyze-text` - Analyze text content
- `POST /api/v1/bedrock/analyze-document` - Analyze uploaded documents

### System Management
- `GET /api/v1/apps` - Get available apps list (environment-aware URLs)
- `POST /api/v1/apps` - Add new app configuration
- `GET /api/v1/system/stats` - System statistics with environment info

### Documentation
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

## 🌍 Cloud Deployment Guide

### EC2 Setup
1. **Launch EC2 Instance** (Ubuntu 20.04+ recommended)
2. **Configure Security Group:**
   ```
   Port 22   (SSH)          - Your IP
   Port 3000 (Frontend)     - 0.0.0.0/0
   Port 8000 (Backend API)  - 0.0.0.0/0
   Port 8501 (AI Chat)      - 0.0.0.0/0
   Port 8502 (Doc Analysis) - 0.0.0.0/0
   Port 8503 (Web Search)   - 0.0.0.0/0
   ```

3. **Install Dependencies:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Logout and login again for Docker group changes
   ```

4. **Deploy Application:**
   ```bash
   # Clone your repository
   git clone <your-repo-url>
   cd allapps
   
   # Setup environment
   cp .env.cloud .env
   # Edit .env with your AWS credentials and EC2 public IP
   
   # Deploy (automatic environment detection)
   ./scripts/deploy.sh
   ```

### Environment Variables for Cloud
```bash
# Cloud-specific configuration
DEPLOYMENT_ENV=cloud
HOST_IP=0.0.0.0
PUBLIC_IP=your-ec2-public-ip
ENVIRONMENT=production
DEBUG=false

# AWS Configuration
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Dynamic URLs (automatically configured)
REACT_APP_API_URL=http://your-ec2-public-ip:8000/api/v1
REACT_APP_AI_CHAT_URL=http://your-ec2-public-ip:8501
# ... etc
```

## 📊 Platform Benefits

- **🏗️ Modular Architecture** - Independent, scalable components
- **⚡ Rapid Development** - New AI apps in under 3 minutes
- **🤖 Co-Intelligence** - Human-AI collaborative experiences
- **🐳 Container-Based** - Docker orchestration with health checks
- **📈 Auto-Scaling** - Independent service scaling
- **🎨 Modern UI** - Professional React interface with themes
- **🔧 Developer Friendly** - Hot reload, comprehensive tooling
- **🌍 Environment Agnostic** - Works seamlessly local and cloud
- **🔄 Auto-Configuration** - Smart environment detection
- **🛡️ Production Ready** - Security headers, error handling, monitoring

## 🛠️ Troubleshooting

### Common Issues

#### Environment Detection
```bash
# Check current environment
./scripts/validate-setup.sh

# Force local environment
export DEPLOYMENT_ENV=local
./scripts/deploy.sh

# Force cloud environment
export DEPLOYMENT_ENV=cloud
export PUBLIC_IP=your-ec2-ip
./scripts/deploy.sh
```

#### Browser Cache (Most Common)
If changes don't appear after updates:
```bash
# Hard refresh in browser
# Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
# Safari: Cmd+Option+R (Mac)

# Or use incognito/private mode
```

#### Docker Issues
```bash
# Reset Docker environment
docker-compose down --volumes --remove-orphans
docker system prune -f
./scripts/deploy.sh
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3000 -i :8000 -i :8501 -i :8502 -i :8503

# Kill processes if needed
sudo kill -9 $(lsof -t -i:3000)
```

#### AWS Credentials
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Or check .env file
cat .env | grep AWS

# Test AI functionality directly
curl -X POST http://localhost:8000/api/v1/bedrock/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test message"}'
```

#### Cloud Access Issues
```bash
# Check EC2 Security Group settings
# Ensure ports 3000, 8000, 8501-8503 are open to 0.0.0.0/0

# Check if services are running
curl http://YOUR_EC2_IP:8000/health

# Check environment configuration
curl http://YOUR_EC2_IP:8000/api/v1/config
```

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using React, FastAPI, Streamlit & AWS Bedrock**

## 🎉 Quick Commands Summary

```bash
# 🔍 Validate setup (environment-aware)
./scripts/validate-setup.sh

# 🚀 Deploy everywhere (auto-detects environment)
./scripts/deploy.sh

# 🧪 Test system (environment-aware)
./scripts/test-system.sh

# ➕ Create new environment-aware app
./scripts/add-app.py "My App" "App description" --category utility

# 📊 View logs
docker-compose logs -f

# 🔄 Restart services
docker-compose restart

# 🛑 Stop everything
docker-compose down

# 🌍 Check environment
curl http://localhost:8000/api/v1/config  # Local
curl http://YOUR_EC2_IP:8000/api/v1/config  # Cloud
```

## 🌟 New in Version 2.0

- ✅ **Environment-Aware Deployment** - Automatic local/cloud detection
- ✅ **Smart URL Configuration** - Dynamic endpoint management
- ✅ **Enhanced Validation** - Comprehensive environment checking
- ✅ **Cloud-Ready Apps** - All Streamlit apps support cloud deployment
- ✅ **Production Optimization** - Separate configurations for dev/prod
- ✅ **Auto-Configuration** - Zero-manual configuration for environment switching
- ✅ **Enhanced Monitoring** - Environment-specific health checks and metrics
- ✅ **Improved Documentation** - Complete deployment guides for both environments
