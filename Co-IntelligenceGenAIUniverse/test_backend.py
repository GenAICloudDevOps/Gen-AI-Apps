#!/usr/bin/env python3
"""
Simple test script for the backend API
"""
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Backend API...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test apps endpoint
    try:
        response = requests.get(f"{base_url}/api/v1/apps")
        if response.status_code == 200:
            apps = response.json()
            print(f"✅ Apps endpoint works - found {len(apps['apps'])} apps")
        else:
            print(f"❌ Apps endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Apps endpoint error: {e}")
    
    # Test chat endpoint (this will fail without AWS credentials)
    try:
        response = requests.post(
            f"{base_url}/api/v1/bedrock/chat",
            json={"message": "Hello, this is a test"},
            timeout=10
        )
        if response.status_code == 200:
            print("✅ Chat endpoint works")
        else:
            print(f"⚠️  Chat endpoint returned {response.status_code} (expected without AWS credentials)")
    except Exception as e:
        print(f"⚠️  Chat endpoint error: {e} (expected without AWS credentials)")
    
    print("🧪 Backend test complete!")

if __name__ == "__main__":
    test_backend()
