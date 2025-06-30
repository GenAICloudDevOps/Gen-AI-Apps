#!/bin/bash

# GenAI Multi-App Platform Deployment Script
# Simple deployment with React + FastAPI + Streamlit

set -e

echo "🚀 Starting GenAI Multi-App Platform deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with your AWS credentials."
    echo "Copy .env.example to .env and fill in your AWS credentials."
    exit 1
fi

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend API is running on http://localhost:8000"
else
    echo "❌ Backend API is not responding"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ React Landing Page is running on http://localhost:3000"
else
    echo "❌ React Landing Page is not responding"
fi

# Check Streamlit apps
if curl -s http://localhost:8501 > /dev/null; then
    echo "✅ AI Chat App is running on http://localhost:8501"
else
    echo "❌ AI Chat App is not responding"
fi

if curl -s http://localhost:8502 > /dev/null; then
    echo "✅ Document Analysis App is running on http://localhost:8502"
else
    echo "❌ Document Analysis App is not responding"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📱 Access your applications:"
echo "🏠 Landing Page: http://localhost:3000"
echo "🤖 AI Chat: http://localhost:8501"
echo "📄 Document Analysis: http://localhost:8502"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
