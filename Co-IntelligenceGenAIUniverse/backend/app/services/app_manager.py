"""
App Manager Service
Handles dynamic app configuration and management
"""
import json
import os
from pathlib import Path
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class AppManager:
    def __init__(self, config_path: str = None):
        """Initialize the app manager with configuration path"""
        if config_path is None:
            # Try different possible paths
            possible_paths = [
                "/app/config/apps.json",  # Docker container path
                "./config/apps.json",     # Local development
                "../config/apps.json"     # Alternative path
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    config_path = path
                    break
            
            if config_path is None:
                # Create default config if none exists
                config_path = "./config/apps.json"
                self._create_default_config(config_path)
        
        self.config_path = config_path
        logger.info(f"AppManager initialized with config: {self.config_path}")
    
    def _create_default_config(self, path: str):
        """Create default configuration file"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        default_config = {
            "apps": [
                {
                    "id": "ai-chat",
                    "name": "AI Chat",
                    "description": "Chat with AI using AWS Bedrock Claude models",
                    "icon": "Calculator",
                    "url": "http://localhost:8501",
                    "category": "ai",
                    "version": "1.0.0",
                    "status": "active",
                    "type": "streamlit",
                    "port": 8501,
                    "file": "ai_chat.py",
                    "docker_service": "ai-chat"
                },
                {
                    "id": "document-analysis",
                    "name": "Document Analysis",
                    "description": "Analyze documents with AI - summaries, key points, and insights",
                    "icon": "FileText",
                    "url": "http://localhost:8502",
                    "category": "analysis",
                    "version": "1.0.0",
                    "status": "active",
                    "type": "streamlit",
                    "port": 8502,
                    "file": "document_analysis.py",
                    "docker_service": "document-analysis"
                }
            ]
        }
        
        with open(path, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        logger.info(f"Created default config at {path}")
    
    def _load_config(self) -> Dict:
        """Load configuration from file"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Config file not found: {self.config_path}")
            self._create_default_config(self.config_path)
            return self._load_config()
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in config file: {e}")
            raise ValueError(f"Invalid configuration file: {e}")
    
    def _save_config(self, config: Dict):
        """Save configuration to file"""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
            logger.info("Configuration saved successfully")
        except Exception as e:
            logger.error(f"Failed to save configuration: {e}")
            raise
    
    def get_apps(self) -> List[Dict]:
        """Get all apps"""
        config = self._load_config()
        return config.get("apps", [])
    
    def get_app(self, app_id: str) -> Optional[Dict]:
        """Get specific app by ID"""
        apps = self.get_apps()
        for app in apps:
            if app.get("id") == app_id:
                return app
        return None
    
    def add_app(self, app_data: Dict) -> Dict:
        """Add a new app"""
        # Validate required fields
        required_fields = ["id", "name", "description", "port", "file"]
        for field in required_fields:
            if field not in app_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Check if app ID already exists
        if self.get_app(app_data["id"]):
            raise ValueError(f"App with ID '{app_data['id']}' already exists")
        
        # Set defaults
        app_data.setdefault("icon", "Calculator")
        app_data.setdefault("category", "custom")
        app_data.setdefault("version", "1.0.0")
        app_data.setdefault("status", "active")
        app_data.setdefault("type", "streamlit")
        app_data.setdefault("url", f"http://localhost:{app_data['port']}")
        app_data.setdefault("docker_service", app_data["id"])
        
        # Load config, add app, and save
        config = self._load_config()
        config["apps"].append(app_data)
        self._save_config(config)
        
        logger.info(f"Added new app: {app_data['id']}")
        return app_data
    
    def update_app(self, app_id: str, app_data: Dict) -> Dict:
        """Update an existing app"""
        config = self._load_config()
        apps = config["apps"]
        
        for i, app in enumerate(apps):
            if app.get("id") == app_id:
                # Update app data
                apps[i].update(app_data)
                self._save_config(config)
                logger.info(f"Updated app: {app_id}")
                return apps[i]
        
        raise ValueError(f"App with ID '{app_id}' not found")
    
    def delete_app(self, app_id: str):
        """Delete an app"""
        config = self._load_config()
        apps = config["apps"]
        
        for i, app in enumerate(apps):
            if app.get("id") == app_id:
                deleted_app = apps.pop(i)
                self._save_config(config)
                logger.info(f"Deleted app: {app_id}")
                return deleted_app
        
        raise ValueError(f"App with ID '{app_id}' not found")
    
    def get_next_available_port(self, start_port: int = 8503) -> int:
        """Get the next available port for a new app"""
        apps = self.get_apps()
        used_ports = {app.get("port") for app in apps if app.get("port")}
        
        port = start_port
        while port in used_ports:
            port += 1
        
        return port
