// Simple API test script to interact with your database through the existing API endpoints
const http = require('http');

const API_BASE = 'http://localhost:3000/api';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🔧 Testing ApexCoding API...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data, null, 2)}\n`);
    
    // Test user registration
    console.log('2. Testing user registration...');
    const newUser = {
      username: `test_user_${Date.now()}`,
      email: `test${Date.now()}@apex.com`,
      password: 'test123',
      profile: {
        firstName: 'Test',
        lastName: 'Legend',
        bio: 'A test legend',
        title: 'Test Champion'
      }
    };
    
    const register = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(newUser))
      }
    }, newUser);
    
    console.log(`   Status: ${register.status}`);
    console.log(`   Response: ${JSON.stringify(register.data, null, 2)}\n`);
    
    if (register.data.success && register.data.token) {
      const token = register.data.token;
      
      // Test creating a project
      console.log('3. Testing project creation...');
      const newProject = {
        name: `Test Project ${Date.now()}`,
        description: 'A test project for API validation',
        language: 'JavaScript',
        status: 'active',
        hashtags: ['test', 'api']
      };
      
      const createProject = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/projects',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(JSON.stringify(newProject))
        }
      }, newProject);
      
      console.log(`   Status: ${createProject.status}`);
      console.log(`   Response: ${JSON.stringify(createProject.data, null, 2)}\n`);
      
      // Test getting all projects
      console.log('4. Testing get all projects...');
      const getProjects = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/projects',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`   Status: ${getProjects.status}`);
      if (getProjects.data.projects) {
        console.log(`   Found ${getProjects.data.projects.length} projects`);
        getProjects.data.projects.slice(0, 3).forEach((project, index) => {
          console.log(`     ${index + 1}. ${project.name} (${project.language})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n⚠️  Make sure your server is running with: npm start');
  }
}

testAPI();
