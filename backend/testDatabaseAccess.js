const http = require('http');
const fs = require('fs');

// Simple HTTP client to test API endpoints
async function makeAPIRequest(endpoint, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testServerAndDatabase() {
  console.log('🔧 Testing ApexCoding Server and Database Access...\n');
  
  try {
    // Test if server is running
    console.log('1. Testing server health...');
    const health = await makeAPIRequest('/api/health');
    console.log(`   Server Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data, null, 2)}\n`);
    
    if (health.status !== 200) {
      console.log('❌ Server is not running. Please start with: npm start');
      return;
    }
    
    // Test user registration to get a token
    console.log('2. Creating test user for authentication...');
    const testUser = {
      username: `api_test_${Date.now()}`,
      email: `test_${Date.now()}@apex.com`,
      password: 'test123',
      profile: {
        firstName: 'API',
        lastName: 'Test',
        bio: 'Test user for database access',
        title: 'Database Tester'
      }
    };
    
    const registerResponse = await makeAPIRequest('/api/auth/register', 'POST', testUser);
    console.log(`   Registration Status: ${registerResponse.status}`);
    
    if (registerResponse.status === 201 && registerResponse.data.token) {
      const token = registerResponse.data.token;
      console.log('   ✅ User created and authenticated\n');
      
      // Now test database access through API
      console.log('3. Accessing database through API...\n');
      
      // Get all projects
      console.log('📂 PROJECTS:');
      const projectsResponse = await makeAPIRequest('/api/projects', 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      if (projectsResponse.status === 200 && projectsResponse.data.projects) {
        console.log(`   Found ${projectsResponse.data.projects.length} projects:`);
        projectsResponse.data.projects.forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.name}`);
          console.log(`      ID: ${project._id}`);
          console.log(`      Owner: ${project.ownerName || project.ownedBy}`);
          console.log(`      Language: ${project.language}`);
          console.log(`      Description: ${project.description}`);
          console.log(`      Stars: ${project.stars || 0}`);
          console.log(`      Status: ${project.status}`);
          console.log(`      Created: ${project.createdAt || 'Unknown'}`);
          console.log('      ---');
        });
      } else {
        console.log('   No projects found or error accessing projects');
        console.log(`   Status: ${projectsResponse.status}`);
        console.log(`   Response: ${JSON.stringify(projectsResponse.data, null, 2)}`);
      }
      
      console.log('\n👥 USERS (via friends endpoint):');
      const friendsResponse = await makeAPIRequest('/api/friends', 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      console.log(`   Friends endpoint status: ${friendsResponse.status}`);
      console.log(`   Response: ${JSON.stringify(friendsResponse.data, null, 2)}`);
      
      console.log('\n🔍 SEARCH TEST:');
      const searchResponse = await makeAPIRequest('/api/search?q=test', 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      console.log(`   Search endpoint status: ${searchResponse.status}`);
      console.log(`   Response: ${JSON.stringify(searchResponse.data, null, 2)}`);
      
      console.log('\n📈 ACTIVITY:');
      const activityResponse = await makeAPIRequest('/api/activity', 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      console.log(`   Activity endpoint status: ${activityResponse.status}`);
      console.log(`   Response: ${JSON.stringify(activityResponse.data, null, 2)}`);
      
    } else {
      console.log('   ❌ Failed to create user or get token');
      console.log(`   Status: ${registerResponse.status}`);
      console.log(`   Response: ${JSON.stringify(registerResponse.data, null, 2)}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure your server is running with: npm start');
    console.log('   You can start it in another terminal or command prompt');
  }
}

// Run the test
testServerAndDatabase();
