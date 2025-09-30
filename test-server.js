const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server...');
    
    // Test health check
    const health = await axios.get('http://localhost:3000/api/health');
    console.log('✅ Health check:', health.status);
    
    // Test login with existing user
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('✅ Login:', login.status);
    
    const token = login.data.token;
    const userId = login.data.user.id;
    
    // Test profile view
    const profile = await axios.get(`http://localhost:3000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile view:', profile.status);
    console.log('Profile has username:', !!profile.data.username);
    
    // Test projects
    const projects = await axios.get('http://localhost:3000/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Projects:', projects.status);
    console.log('Projects array exists:', !!projects.data.projects);
    
    console.log('\n🎉 Basic tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
  }
}

testServer();