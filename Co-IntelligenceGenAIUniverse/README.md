# 🚀 Co-Intelligence GenAI Universe

**Where Human Meets AI Intelligence**

A modular, production-ready platform built with React, FastAPI, Streamlit, and AWS Bedrock - enabling rapid co-intelligence development through scalable architecture.

⚡ **From concept to live AI app in under 3 minutes***

## 🎯 Platform Features

- **🚀 React Frontend** - Modern, responsive interface with dark/light themes
- **⚡ FastAPI Backend** - High-performance API with auto-docs
- **🧠 Rapid AI Development** - AWS Bedrock integration with rapid Streamlit development
- **🏗️ Modular Architecture** - Scalable, maintainable design with independent components
- **🤖 Co-Intelligence** - Collaborative intelligence combining human insight and AI

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

## 📱 Available Apps

### 🤖 AI Chat
- **AI-powered chat** using AWS Bedrock Claude 3 Haiku models
- **Real-time responses** with conversation history
- **Simple Streamlit interface** with chat UI
- **Status**: ✅ **Working** - Tested with AWS Bedrock
- **Access**: http://localhost:8501

### 📄 Document Analysis
- **Document upload** support (PDF, DOCX, TXT)
- **AI-powered text analysis** with multiple options:
  - Summary
  - Key Points
  - Important Questions
  - Detailed Analysis
- **Status**: ✅ **Working** - Ready for document processing
- **Access**: http://localhost:8502

### 🔍 Web Search
- **AI-powered web search** using DuckDuckGo and AWS Bedrock
- **Intelligent rate limiting** with automatic retry logic
- **AI analysis** of search results for comprehensive insights
- **Status**: ✅ **Working** - Enhanced with rate limit handling
- **Access**: http://localhost:8503

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- AWS credentials (for AI features)
- Python 3.8+ (for development scripts)

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your AWS credentials
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Validate Setup
```bash
# Check if everything is configured correctly
./scripts/validate-setup.sh
```

### One-Command Deployment
```bash
# Deploy everything with one command
./scripts/deploy.sh

# Access points:
# 🏠 Landing Page: http://localhost:3000
# 🤖 AI Chat: http://localhost:8501
# 📄 Document Analysis: http://localhost:8502
# 🔍 Web Search: http://localhost:8503
# 🔧 Backend API: http://localhost:8000
# 📚 API Docs: http://localhost:8000/docs
```

### Test Your Setup
```bash
# Run comprehensive system tests
./scripts/test-system.sh
```

### Manual Deployment
```bash
# Start all services
docker-compose up --build

# Or start in background
docker-compose up --build -d
```

## 🛠️ Development

### Project Structure
```
allapps/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── services/       # Business logic (Bedrock service)
│   │   └── main.py         # FastAPI app
├── react-frontend/         # React landing page with enhanced UI
├── apps/                   # Streamlit applications
│   ├── ai_chat.py         # AI Chat app
│   ├── document_analysis.py # Document analysis app
│   └── web_search.py      # Web Search app
├── config/                # Configuration management
│   └── apps.json          # Dynamic app registry
├── scripts/               # Automation scripts
│   ├── deploy.sh          # One-command deployment
│   ├── add-app.py         # Automated app creation
│   └── validate-setup.sh  # System validation
└── docker-compose.yml     # Container orchestration
```

## ➕ Adding New Apps

### Automated App Creation (Recommended)
```bash
# Use the Python creation script for full integration
./scripts/add-app.py "Weather App" "Weather forecasting with AI" --category utility

# Or use the bash script for basic creation
./scripts/create-streamlit-app.sh weather-app 8504 "Weather forecasting app"
```

### What Gets Created Automatically:
- ✅ Complete Streamlit app template with AI integration
- ✅ Docker service configuration
- ✅ Apps.json configuration update
- ✅ Health checks and networking
- ✅ Automatic port assignment
- ✅ React frontend integration

### Manual Steps After Creation:
1. Customize your app in `apps/your_app.py`
2. Restart services: `docker-compose up --build -d`
3. Your app will automatically appear in the React frontend

## 🎨 Enhanced Frontend Features

### 🌙 Dark/Light Mode
- **Theme Toggle** - Switch between dark and light themes
- **Persistent Preferences** - Theme choice saved automatically
- **Smooth Transitions** - All UI elements adapt seamlessly

### 📊 Real-time Dashboard
- **Auto-refresh** - Updates every 30 seconds
- **Live Status** - System health monitoring
- **Performance Metrics** - App usage and uptime tracking

### ⚙️ Management Panel
- **Analytics** - Usage patterns and performance insights
- **Backup** - Configuration management tools
- **Security** - Access monitoring and logs

## 🔧 API Endpoints

### Bedrock AI Services
- `POST /api/v1/bedrock/chat` - AI chat with conversation history
- `POST /api/v1/bedrock/analyze-text` - Analyze text content
- `POST /api/v1/bedrock/analyze-document` - Analyze uploaded documents

### System Management
- `GET /health` - Health check
- `GET /api/v1/apps` - Get available apps list
- `POST /api/v1/apps` - Add new app configuration
- `GET /api/v1/system/stats` - System statistics

### Documentation
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
# Production deployment
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables
```bash
# Required for AI features
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## 📊 Platform Benefits

- **🏗️ Modular Architecture** - Independent, scalable components
- **⚡ Rapid Development** - New AI apps in under 3 minutes
- **🤖 Co-Intelligence** - Human-AI collaborative experiences
- **🐳 Container-Based** - Docker orchestration with health checks
- **📈 Auto-Scaling** - Independent service Scaling
- **🎨 Modern UI** - Professional React interface with themes
- **🔧 Developer Friendly** - Hot reload, comprehensive tooling

## 🛠️ Troubleshooting

### Common Issues

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

#### Web Search Rate Limits
```bash
# If DuckDuckGo rate limits occur:
# - Wait 2-3 minutes between searches
# - Use more specific search terms
# - Try fewer results (3 instead of 8)
# - The app automatically retries with delays
```

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using React, FastAPI, Streamlit & AWS Bedrock**

## 🎉 Quick Commands Summary

```bash
# 🔍 Validate setup
./scripts/validate-setup.sh

# 🚀 Deploy everything
./scripts/deploy.sh

# 🧪 Test system
./scripts/test-system.sh

# ➕ Create new app (Python - Recommended)
./scripts/add-app.py "My App" "App description" --category utility

# ➕ Create new app (Bash - Basic)
./scripts/create-streamlit-app.sh my-app 8504 "My awesome app"

# 📊 View logs
docker-compose logs -f

# 🔄 Restart services
docker-compose restart

# 🛑 Stop everything
docker-compose down

# 🎨 Rebuild frontend (after changes)
docker-compose up --build -d frontend
```
