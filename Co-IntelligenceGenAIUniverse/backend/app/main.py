"""
FastAPI Backend for Co-Intelligence GenAI Universe
Simple backend with AWS Bedrock integration and dynamic app management
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

# Create FastAPI app
app = FastAPI(
    title="Co-Intelligence GenAI Platform API",
    description="Backend API for AI-powered applications with dynamic app management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
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
    """Root endpoint"""
    return {"message": "Co-Intelligence GenAI Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "backend", "timestamp": str(os.popen('date').read().strip())}

@app.get("/api/v1/apps")
async def get_apps():
    """Get available apps from configuration"""
    try:
        apps = app_manager.get_apps()
        return {"apps": apps, "count": len(apps)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load apps: {str(e)}")

@app.post("/api/v1/apps")
async def add_app(app_data: dict):
    """Add a new app to the configuration"""
    try:
        result = app_manager.add_app(app_data)
        return {"message": "App added successfully", "app": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add app: {str(e)}")

@app.get("/api/v1/apps/{app_id}")
async def get_app(app_id: str):
    """Get specific app details"""
    try:
        app = app_manager.get_app(app_id)
        if not app:
            raise HTTPException(status_code=404, detail="App not found")
        return {"app": app}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get app: {str(e)}")

@app.put("/api/v1/apps/{app_id}")
async def update_app(app_id: str, app_data: dict):
    """Update an existing app"""
    try:
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
    """Get system statistics"""
    try:
        apps = app_manager.get_apps()
        stats = {
            "total_apps": len(apps),
            "active_apps": len([app for app in apps if app.get("status") == "active"]),
            "categories": list(set([app.get("category", "unknown") for app in apps])),
            "types": list(set([app.get("type", "unknown") for app in apps]))
        }
        return {"stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
