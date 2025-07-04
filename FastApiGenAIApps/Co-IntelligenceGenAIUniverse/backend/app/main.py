"""
FastAPI Backend for Co-Intelligence GenAI Universe
Environment-aware backend with AWS Bedrock integration and dynamic app management
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import json
from pathlib import Path
from dotenv import load_dotenv

from app.api.v1.bedrock import router as bedrock_router
from app.services.app_manager import AppManager

# Load environment variables
load_dotenv()

# Get environment configuration
DEPLOYMENT_ENV = os.getenv("DEPLOYMENT_ENV", "local")
HOST_IP = os.getenv("HOST_IP", "localhost")
PUBLIC_IP = os.getenv("PUBLIC_IP", "localhost")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Create FastAPI app
app = FastAPI(
    title="Co-Intelligence GenAI Platform API",
    description="Environment-aware backend API for AI-powered applications with dynamic app management",
    version="1.0.0",
    debug=DEBUG
)

# Configure CORS based on environment
def get_cors_origins():
    """Get CORS origins based on deployment environment"""
    if DEPLOYMENT_ENV == "cloud":
        # Cloud/EC2 deployment
        origins = [
            f"http://{PUBLIC_IP}:3000",
            f"https://{PUBLIC_IP}:3000",
            f"http://{PUBLIC_IP}:8501",
            f"http://{PUBLIC_IP}:8502",
            f"http://{PUBLIC_IP}:8503",
            "http://localhost:3000",  # Keep localhost for development
            "http://127.0.0.1:3000",
        ]
    else:
        # Local development
        origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8501",
            "http://localhost:8502",
            "http://localhost:8503",
        ]
    
    # Add wildcard for development
    if DEBUG:
        origins.append("*")
    
    return origins

# CORS middleware with environment-aware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize app manager
app_manager = AppManager()

# Include routers
app.include_router(bedrock_router, prefix="/api/v1/bedrock", tags=["bedrock"])

@app.get("/")
async def root():
    """Root endpoint with environment info"""
    return {
        "message": "Co-Intelligence GenAI Platform API", 
        "version": "1.0.0",
        "environment": DEPLOYMENT_ENV,
        "host_ip": HOST_IP,
        "public_ip": PUBLIC_IP if DEPLOYMENT_ENV == "cloud" else "N/A",
        "debug": DEBUG
    }

@app.get("/health")
async def health_check():
    """Health check endpoint with environment details"""
    return {
        "status": "healthy", 
        "service": "backend", 
        "environment": DEPLOYMENT_ENV,
        "host_ip": HOST_IP,
        "public_ip": PUBLIC_IP if DEPLOYMENT_ENV == "cloud" else "N/A",
        "timestamp": str(os.popen('date').read().strip())
    }

@app.get("/api/v1/config")
async def get_config():
    """Get environment configuration for frontend"""
    return {
        "deployment_env": DEPLOYMENT_ENV,
        "host_ip": HOST_IP,
        "public_ip": PUBLIC_IP if DEPLOYMENT_ENV == "cloud" else HOST_IP,
        "urls": {
            "backend": f"http://{PUBLIC_IP if DEPLOYMENT_ENV == 'cloud' else HOST_IP}:8000",
            "frontend": f"http://{PUBLIC_IP if DEPLOYMENT_ENV == 'cloud' else HOST_IP}:3000",
            "ai_chat": f"http://{PUBLIC_IP if DEPLOYMENT_ENV == 'cloud' else HOST_IP}:8501",
            "document_analysis": f"http://{PUBLIC_IP if DEPLOYMENT_ENV == 'cloud' else HOST_IP}:8502",
            "web_search": f"http://{PUBLIC_IP if DEPLOYMENT_ENV == 'cloud' else HOST_IP}:8503"
        }
    }

@app.get("/api/v1/apps")
async def get_apps():
    """Get available apps from configuration with environment-aware URLs"""
    try:
        apps = app_manager.get_apps()
        
        # Update URLs based on environment
        for app in apps:
            if DEPLOYMENT_ENV == "cloud":
                app["url"] = app["url"].replace("localhost", PUBLIC_IP)
            
        return {"apps": apps, "count": len(apps), "environment": DEPLOYMENT_ENV}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load apps: {str(e)}")

@app.post("/api/v1/apps")
async def add_app(app_data: dict):
    """Add a new app to the configuration"""
    try:
        # Update URL based on environment
        if "url" in app_data and DEPLOYMENT_ENV == "cloud":
            app_data["url"] = app_data["url"].replace("localhost", PUBLIC_IP)
            
        result = app_manager.add_app(app_data)
        return {"message": "App added successfully", "app": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add app: {str(e)}")

@app.get("/api/v1/apps/{app_id}")
async def get_app(app_id: str):
    """Get specific app details with environment-aware URL"""
    try:
        app = app_manager.get_app(app_id)
        if not app:
            raise HTTPException(status_code=404, detail="App not found")
            
        # Update URL based on environment
        if DEPLOYMENT_ENV == "cloud":
            app["url"] = app["url"].replace("localhost", PUBLIC_IP)
            
        return {"app": app}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get app: {str(e)}")

@app.put("/api/v1/apps/{app_id}")
async def update_app(app_id: str, app_data: dict):
    """Update an existing app"""
    try:
        # Update URL based on environment
        if "url" in app_data and DEPLOYMENT_ENV == "cloud":
            app_data["url"] = app_data["url"].replace("localhost", PUBLIC_IP)
            
        result = app_manager.update_app(app_id, app_data)
        return {"message": "App updated successfully", "app": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update app: {str(e)}")

@app.delete("/api/v1/apps/{app_id}")
async def delete_app(app_id: str):
    """Delete an app"""
    try:
        app_manager.delete_app(app_id)
        return {"message": "App deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to delete app: {str(e)}")

@app.get("/api/v1/system/stats")
async def get_system_stats():
    """Get system statistics with environment info"""
    try:
        apps = app_manager.get_apps()
        stats = {
            "total_apps": len(apps),
            "active_apps": len([app for app in apps if app.get("status") == "active"]),
            "categories": list(set([app.get("category", "unknown") for app in apps])),
            "types": list(set([app.get("type", "unknown") for app in apps])),
            "environment": DEPLOYMENT_ENV,
            "host_ip": HOST_IP,
            "public_ip": PUBLIC_IP if DEPLOYMENT_ENV == "cloud" else "N/A"
        }
        return {"stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    uvicorn.run(
        app, 
        host=host, 
        port=port,
        workers=4 if DEPLOYMENT_ENV == "cloud" else 1,
        reload=DEBUG
    )
