const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

async function setupData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing users
    const allUsers = await mongoose.connection.db.collection('Users').find({}).toArray();
    console.log(`Found ${allUsers.length} existing users`);

    if (allUsers.length < 5) {
      console.log('❌ Need at least 5 users for proper setup');
      return;
    }

    // Use first 5 users for consistent setup
    const users = allUsers.slice(0, 5);
    
    // Create projects with proper structure
    const projects = [
      { 
        id: `project_${Date.now()}_1`, 
        name: 'Stealth Protocol', 
        description: 'Advanced stealth algorithms', 
        status: 'active',
        language: 'JavaScript',
        ownedBy: users[0]._id, 
        hashtags: ['stealth', 'security'],
        stars: 15,
        forks: 3,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
      { 
        id: `project_${Date.now()}_2`, 
        name: 'Route Optimizer', 
        description: 'AI pathfinding algorithms', 
        status: 'active',
        language: 'Python',
        ownedBy: users[1]._id, 
        hashtags: ['ai', 'pathfinding'],
        stars: 22,
        forks: 7,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
      { 
        id: `project_${Date.now()}_3`, 
        name: 'Legend Compiler', 
        description: 'Next-gen code compiler', 
        status: 'active',
        language: 'C++',
        ownedBy: users[2]._id, 
        hashtags: ['compiler', 'performance'],
        stars: 45,
        forks: 12,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
      { 
        id: `project_${Date.now()}_4`, 
        name: 'Encryption Engine', 
        description: 'Military-grade encryption', 
        status: 'active',
        language: 'Rust',
        ownedBy: users[3]._id, 
        hashtags: ['encryption', 'security'],
        stars: 33,
        forks: 8,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
      { 
        id: `project_${Date.now()}_5`, 
        name: 'ML Pipeline', 
        description: 'Automated machine learning', 
        status: 'active',
        language: 'Python',
        ownedBy: users[4]._id, 
        hashtags: ['ml', 'automation'],
        stars: 67,
        forks: 19,
        lastUpdated: new Date(),
        createdAt: new Date()
      }
    ];

    // Clear and add projects
    await mongoose.connection.db.collection('Projects').deleteMany({});
    await mongoose.connection.db.collection('Projects').insertMany(projects);
    console.log('✅ Added 5 projects');

    // Create friendship collections
    await mongoose.connection.db.collection('Friendships').deleteMany({});
    await mongoose.connection.db.collection('FriendRequests').deleteMany({});
    
    const friendships = [
      { id: `friendship_${Date.now()}_1`, userId1: users[0]._id.toString(), userId2: users[1]._id.toString(), createdAt: new Date() },
      { id: `friendship_${Date.now()}_2`, userId1: users[0]._id.toString(), userId2: users[2]._id.toString(), createdAt: new Date() },
      { id: `friendship_${Date.now()}_3`, userId1: users[1]._id.toString(), userId2: users[3]._id.toString(), createdAt: new Date() },
      { id: `friendship_${Date.now()}_4`, userId1: users[2]._id.toString(), userId2: users[4]._id.toString(), createdAt: new Date() }
    ];
    
    await mongoose.connection.db.collection('Friendships').insertMany(friendships);
    console.log('✅ Created friendships');

    // Create some activities
    await mongoose.connection.db.collection('Activities').deleteMany({});
    const activities = [
      {
        id: `activity_${Date.now()}_1`,
        userId: users[0]._id.toString(),
        type: 'project_created',
        description: 'Created Stealth Protocol project',
        data: { projectName: 'Stealth Protocol' },
        isPublic: true,
        createdAt: new Date()
      },
      {
        id: `activity_${Date.now()}_2`,
        userId: users[1]._id.toString(),
        type: 'project_updated',
        description: 'Updated Route Optimizer',
        data: { projectName: 'Route Optimizer' },
        isPublic: true,
        createdAt: new Date()
      }
    ];
    
    await mongoose.connection.db.collection('Activities').insertMany(activities);
    console.log('✅ Created activities');

    console.log('\n🎉 Setup complete!');
    console.log('- Projects, friendships, and activities created');
    console.log('- Ready for Postman testing');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

setupData();