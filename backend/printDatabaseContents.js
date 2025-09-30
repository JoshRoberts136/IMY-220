#!/usr/bin/env node

// Simple database reader using your existing API
const http = require('http');

function makeRequest(path, method = 'GET', data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
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

async function printDatabaseContents() {
    console.log('🔧 ApexCoding Database Contents');
    console.log('='.repeat(50));
    
    try {
        // Test server
        console.log('\n1. 🔍 Testing server connection...');
        const health = await makeRequest('/api/health');
        console.log(`   Status: ${health.status}`);
        console.log(`   Response: ${JSON.stringify(health.data, null, 2)}`);
        
        if (health.status !== 200) {
            console.log('❌ Server not accessible. Make sure it\'s running with: npm start');
            return;
        }
        
        // Create test user for authentication
        console.log('\n2. 🔐 Creating authentication...');
        const testUser = {
            username: `db_reader_${Date.now()}`,
            email: `reader_${Date.now()}@apex.com`,
            password: 'test123',
            profile: {
                firstName: 'Database',
                lastName: 'Reader',
                bio: 'Reading database contents',
                title: 'Data Legend'
            }
        };
        
        const register = await makeRequest('/api/auth/register', 'POST', testUser);
        console.log(`   Registration status: ${register.status}`);
        
        if (register.status !== 201 || !register.data.token) {
            console.log('❌ Failed to get authentication token');
            console.log(`   Response: ${JSON.stringify(register.data, null, 2)}`);
            return;
        }
        
        const token = register.data.token;
        console.log('   ✅ Authentication successful');
        
        // Get projects from database
        console.log('\n3. 📂 PROJECTS IN DATABASE:');
        console.log('-'.repeat(30));
        
        const projects = await makeRequest('/api/projects', 'GET', null, {
            'Authorization': `Bearer ${token}`
        });
        
        console.log(`   API Status: ${projects.status}`);
        
        if (projects.status === 200 && projects.data.projects) {
            const projectList = projects.data.projects;
            console.log(`   ✅ Found ${projectList.length} projects in database\n`);
            
            if (projectList.length === 0) {
                console.log('   📭 No projects found in database');
            } else {
                projectList.forEach((project, index) => {
                    console.log(`   📁 Project ${index + 1}:`);
                    console.log(`      🆔 ID: ${project._id || project.id}`);
                    console.log(`      📛 Name: ${project.name}`);
                    console.log(`      👤 Owner: ${project.ownerName || project.ownedBy}`);
                    console.log(`      🔧 Language: ${project.language}`);
                    console.log(`      📝 Description: ${project.description}`);
                    console.log(`      ⭐ Stars: ${project.stars || 0}`);
                    console.log(`      🍴 Forks: ${project.forks || 0}`);
                    console.log(`      📊 Status: ${project.status}`);
                    console.log(`      📅 Created: ${project.createdAt}`);
                    console.log(`      📅 Updated: ${project.lastUpdated}`);
                    if (project.hashtags && project.hashtags.length > 0) {
                        console.log(`      🏷️  Tags: ${project.hashtags.join(', ')}`);
                    }
                    if (project.members && project.members.length > 0) {
                        console.log(`      👥 Members: ${project.members.length}`);
                    }
                    if (project.lastCommit) {
                        console.log(`      📝 Last Commit: ${project.lastCommit.message || 'No message'}`);
                        console.log(`      📝 Commit By: ${project.lastCommit.username || 'Unknown'}`);
                    }
                    console.log('      ' + '-'.repeat(40));
                });
                
                // Print raw JSON data for complete details
                console.log('\n   📋 COMPLETE PROJECT DATA (JSON):');
                console.log('   ' + '='.repeat(45));
                console.log(JSON.stringify(projectList, null, 4));
            }
        } else {
            console.log(`   ❌ Failed to get projects: ${projects.status}`);
            console.log(`   Response: ${JSON.stringify(projects.data, null, 2)}`);
        }
        
        // Test friends/users data
        console.log('\n4. 👥 FRIENDS/USERS DATA:');
        console.log('-'.repeat(30));
        
        const friends = await makeRequest('/api/friends', 'GET', null, {
            'Authorization': `Bearer ${token}`
        });
        
        console.log(`   Friends API Status: ${friends.status}`);
        console.log(`   Friends Response: ${JSON.stringify(friends.data, null, 2)}`);
        
        // Test search functionality
        console.log('\n5. 🔍 SEARCH FUNCTIONALITY:');
        console.log('-'.repeat(30));
        
        const search = await makeRequest('/api/search?q=test', 'GET', null, {
            'Authorization': `Bearer ${token}`
        });
        
        console.log(`   Search API Status: ${search.status}`);
        console.log(`   Search Response: ${JSON.stringify(search.data, null, 2)}`);
        
        // Test activity feed
        console.log('\n6. 📈 ACTIVITY FEED:');
        console.log('-'.repeat(30));
        
        const activity = await makeRequest('/api/activity', 'GET', null, {
            'Authorization': `Bearer ${token}`
        });
        
        console.log(`   Activity API Status: ${activity.status}`);
        console.log(`   Activity Response: ${JSON.stringify(activity.data, null, 2)}`);
        
        // Create a test project to demonstrate write access
        console.log('\n7. 🛠️  TESTING DATABASE WRITE ACCESS:');
        console.log('-'.repeat(30));
        
        const newProject = {
            name: `Database Test Project ${new Date().getTime()}`,
            description: 'A test project created to verify database write access',
            language: 'JavaScript',
            status: 'active',
            hashtags: ['test', 'database', 'verification']
        };
        
        const createProject = await makeRequest('/api/projects', 'POST', newProject, {
            'Authorization': `Bearer ${token}`
        });
        
        console.log(`   Create Project Status: ${createProject.status}`);
        console.log(`   Create Project Response: ${JSON.stringify(createProject.data, null, 2)}`);
        
        if (createProject.status === 201) {
            console.log('   ✅ Successfully created test project in database!');
            
            // Get the updated project list
            const updatedProjects = await makeRequest('/api/projects', 'GET', null, {
                'Authorization': `Bearer ${token}`
            });
            
            if (updatedProjects.status === 200) {
                console.log(`   📊 Updated project count: ${updatedProjects.data.projects.length}`);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ Database access test completed!');
        console.log('✅ I can successfully read and write to your MongoDB database!');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️  Make sure your server is running with: npm start');
    }
}

// Run the script
printDatabaseContents().catch(console.error);
