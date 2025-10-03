#!/usr/bin/env python3
"""
Test script for the AI Website Generator API
"""
import requests
import sys

API_URL = "http://localhost:8080"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing /health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        print(f"✅ Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_generate():
    """Test generate endpoint"""
    print("\n🔍 Testing /generate endpoint...")
    
    data = {
        "company_name": "TestCorp",
        "description": "A test company for AI website generation",
        "theme_hint": "modern and professional",
        "pages": "home,about,contact",
        "require_dark_mode": False
    }
    
    try:
        print("📤 Sending request (this may take a while)...")
        response = requests.post(
            f"{API_URL}/generate",
            data=data,
            timeout=300
        )
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            # Save ZIP file
            filename = "test_website.zip"
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"✅ Website generated successfully!")
            print(f"   Saved to: {filename}")
            print(f"   Size: {len(response.content)} bytes")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except requests.Timeout:
        print("❌ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing AI Website Generator API\n")
    print("=" * 50)
    
    # Test health
    health_ok = test_health()
    
    if not health_ok:
        print("\n❌ Health check failed. Make sure services are running:")
        print("   docker-compose up -d")
        sys.exit(1)
    
    # Test generate
    generate_ok = test_generate()
    
    print("\n" + "=" * 50)
    if health_ok and generate_ok:
        print("✅ All tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
