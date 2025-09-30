const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.status);

    // Test registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
      profile: {
        firstName: 'Test',
        lastName: 'User2',
        avatar: 'https://via.placeholder.com/150',
        title: 'Developer',
        bio: 'Test bio'
      }
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration:', registerResponse.status);
    const token = registerResponse.data.token;
    const userId = registerResponse.data.user.id;

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testuser2@example.com',
      password: 'password123'
    });
    console.log('✅ Login:', loginResponse.status);

    // Test profile view
    console.log('\n4. Testing profile view...');
    const profileResponse = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile view:', profileResponse.status);
    console.log('Profile data keys:', Object.keys(profileResponse.data));

    // Test projects list
    console.log('\n5. Testing projects list...');
    const projectsResponse = await axios.get(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Projects list:', projectsResponse.status);
    console.log('Projects count:', projectsResponse.data.projects?.length || 0);

    // Test activity feeds
    console.log('\n6. Testing activity feeds...');
    const localActivity = await axios.get(`${BASE_URL}/activity/local`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Local activity:', localActivity.status);
    console.log('Local activities count:', localActivity.data.activities?.length || 0);

    const globalActivity = await axios.get(`${BASE_URL}/activity/global`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Global activity:', globalActivity.status);
    console.log('Global activities count:', globalActivity.data.activities?.length || 0);

    // Test search
    console.log('\n7. Testing search...');
    const searchResponse = await axios.get(`${BASE_URL}/search?query=test&type=user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Search:', searchResponse.status);
    console.log('Search results count:', searchResponse.data.results?.length || 0);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data || error.message);
  }
}

testEndpoints();