#!/bin/bash

# IMY 220 Project API Test Script
# Run this to test the main API endpoints

echo "🚀 Starting IMY 220 Project API Tests..."
echo "============================================"

BASE_URL="http://localhost:3000/api"

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | grep -q "success" && echo "✅ Health check passed" || echo "❌ Health check failed"

# Test 2: Register User
echo "2. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com", 
    "password": "password123",
    "profile": {
      "firstName": "Test",
      "lastName": "User",
      "avatar": "https://via.placeholder.com/150",
      "title": "Developer",
      "bio": "Test bio"
    }
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ User registration passed - Token: ${TOKEN:0:20}..."
else
  echo "❌ User registration failed"
fi

# Test 3: Login User
echo "3. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')

LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$LOGIN_TOKEN" ]; then
  echo "✅ User login passed"
  TOKEN=$LOGIN_TOKEN
else
  echo "❌ User login failed"
fi

# Test 4: View Profile
echo "4. Testing View Profile..."
if [ -n "$USER_ID" ] && [ -n "$TOKEN" ]; then
  PROFILE_RESPONSE=$(curl -s "$BASE_URL/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  echo $PROFILE_RESPONSE | grep -q "testuser" && echo "✅ View profile passed" || echo "❌ View profile failed"
else
  echo "❌ Skipping profile test - missing user ID or token"
fi

# Test 5: List Projects
echo "5. Testing List Projects..."
if [ -n "$TOKEN" ]; then
  PROJECTS_RESPONSE=$(curl -s "$BASE_URL/projects" \
    -H "Authorization: Bearer $TOKEN")
  
  echo $PROJECTS_RESPONSE | grep -q "projects" && echo "✅ List projects passed" || echo "❌ List projects failed"
else
  echo "❌ Skipping projects test - missing token"
fi

# Test 6: Search Users
echo "6. Testing Search Users..."
if [ -n "$TOKEN" ]; then
  SEARCH_RESPONSE=$(curl -s "$BASE_URL/search?query=test&type=user" \
    -H "Authorization: Bearer $TOKEN")
  
  echo $SEARCH_RESPONSE | grep -q "results" && echo "✅ Search users passed" || echo "❌ Search users failed"
else
  echo "❌ Skipping search test - missing token"
fi

# Test 7: Activity Feed
echo "7. Testing Activity Feed..."
if [ -n "$TOKEN" ]; then
  ACTIVITY_RESPONSE=$(curl -s "$BASE_URL/activity/local" \
    -H "Authorization: Bearer $TOKEN")
  
  echo $ACTIVITY_RESPONSE | grep -q "activities" && echo "✅ Activity feed passed" || echo "❌ Activity feed failed"
else
  echo "❌ Skipping activity test - missing token"
fi

echo "============================================"
echo "🏁 API Tests Complete!"
echo "Now run your Postman collection to verify all endpoints work correctly."
