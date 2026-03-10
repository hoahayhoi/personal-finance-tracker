"""
Script để test Django API endpoints
Run: python test_api.py
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_register():
    print("\n=== Testing Register ===")
    data = {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/auth/register/", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

def test_login():
    print("\n=== Testing Login ===")
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    response = requests.post(f"{BASE_URL}/auth/login/", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {result}")
    return result.get('access')

def test_categories(token):
    print("\n=== Testing Categories ===")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/categories/", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Categories: {len(response.json())} items")
    return response.json()

def test_create_transaction(token, category_id):
    print("\n=== Testing Create Transaction ===")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "amount": 50000,
        "type": "EXPENSE",
        "category_id": category_id,
        "date": "2026-03-09T10:00:00Z",
        "note": "Test transaction"
    }
    response = requests.post(f"{BASE_URL}/transactions/", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_dashboard(token):
    print("\n=== Testing Dashboard Summary ===")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/summary/", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    print("Starting API Tests...")
    print("Make sure Django server is running on http://localhost:8000")
    
    try:
        # Register user
        test_register()
        
        # Login
        token = test_login()
        
        if token:
            # Get categories
            categories = test_categories(token)
            
            if categories:
                # Create transaction
                category_id = categories[0]['id']
                test_create_transaction(token, category_id)
                
                # Get dashboard
                test_dashboard(token)
        
        print("\n✅ All tests completed!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
