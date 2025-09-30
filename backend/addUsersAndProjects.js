// addUsersAndProjects.js
// Run: node backend/addUsersAndProjects.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

async function addUsersAndProjects() {
  await connectDB();
  
  try {
    // Get existing users to work with
    const existingUsers = await mongoose.connection.db.collection('Users').find({}).toArray();
    console.log(`📋 Found ${existingUsers.length} existing users\n`);
    
    // Hash password - matching your existing "123" password
    const hashedPassword = await bcrypt.hash('123', 10);
    
    // Generate timestamp for unique IDs
    const timestamp = Date.now();
    
    // Create new users matching your exact structure
    const newUsers = [
      {
        id: `user_${timestamp}_1`,
        username: 'BangaloreSmoke',
        email: 'bangalore@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Anita',
          lastName: 'Williams',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bangalore',
          title: 'Professional Soldier',
          bio: 'Former IMC soldier. Smoke launcher and digital threat expert.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_2`,
        username: 'OctaneSpeed',
        email: 'octane@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Octavio',
          lastName: 'Silva',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=octane',
          title: 'High-Speed Daredevil',
          bio: 'They say death catches up to everyone. He can certainly try!'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_3`,
        username: 'CryptoHacker',
        email: 'crypto@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Tae',
          lastName: 'Joon Park',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto',
          title: 'Surveillance Expert',
          bio: 'Its hard to be scared when youre prepared. Drone specialist.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_4`,
        username: 'LifelineAjay',
        email: 'lifeline@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Ajay',
          lastName: 'Che',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifeline',
          title: 'Combat Medic',
          bio: 'Go on, tell me. Whats really got you down? D.O.C. Heal Drone operator.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_5`,
        username: 'GibraltarShield',
        email: 'gibraltar@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Makoa',
          lastName: 'Gibraltar',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gibraltar',
          title: 'Shielded Fortress',
          bio: 'Hey, we all make mistakes. The trick is to know how to get back up.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_6`,
        username: 'BloodhoundHunter',
        email: 'bloodhound@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Unknown',
          lastName: 'Hunter',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bloodhound',
          title: 'Technological Tracker',
          bio: 'I honor those who have risen, not those who have fallen. The Allfather graces me.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_7`,
        username: 'CausticToxic',
        email: 'caustic@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Alexander',
          lastName: 'Nox',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=caustic',
          title: 'Toxic Trapper',
          bio: 'Science demands a repeatable outcome. And I am the outcome. Nox gas deployed.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_8`,
        username: 'MirageDecoy',
        email: 'mirage@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Elliott',
          lastName: 'Witt',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mirage',
          title: 'Holographic Trickster',
          bio: 'Now you see me, now you dont, now you see me... Boom, youre dead!'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_9`,
        username: 'WatsonStatic',
        email: 'wattson@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Natalie',
          lastName: 'Paquette',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wattson',
          title: 'Static Defender',
          bio: 'Papa would be proud of me. Electricity is my specialty!'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: `user_${timestamp}_10`,
        username: 'RevenantKiller',
        email: 'revenant@apex.com',
        password: hashedPassword,
        profile: {
          firstName: 'Unknown',
          lastName: 'Simulacrum',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=revenant',
          title: 'Synthetic Nightmare',
          bio: 'Death is not merciful. Neither am I. Three centuries of revenge.'
        },
        friends: [],
        isActive: true,
        updatedAt: new Date(),
        lastLogin: new Date()
      }
    ];

    // Insert new users
    console.log('👥 Adding new users...\n');
    const insertedUsers = [];
    
    for (const user of newUsers) {
      try {
        const result = await mongoose.connection.db.collection('Users').insertOne(user);
        user._id = result.insertedId;
        insertedUsers.push(user);
        console.log(`✅ Added user: ${user.username}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ User ${user.username} already exists`);
        } else {
          console.error(`❌ Error adding ${user.username}:`, error.message);
        }
      }
    }

    // Combine existing and new users for projects
    const allUsers = [...existingUsers, ...insertedUsers];
    
    if (allUsers.length < 3) {
      console.log('❌ Not enough users to create projects with 3+ members');
      return;
    }

    console.log('\n📁 Creating projects with squad members...\n');

    // Create projects with at least 3 members each
    const projects = [
      {
        id: `proj_${timestamp}_1`,
        name: 'Apex Legends Tracker',
        description: 'Real-time stats tracking for Apex Legends players with leaderboards and analytics',
        status: 'active',
        language: 'JavaScript',
        stars: 145,
        forks: 32,
        members: [allUsers[0].id, allUsers[1].id, allUsers[2].id, allUsers[3].id],
        ownedBy: allUsers[0].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[1].id,
          username: allUsers[1].username,
          commitId: `commit_${Date.now()}_1`,
          message: 'Added ranked stats tracking',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_2`,
        name: 'Neural Network Framework',
        description: 'Lightweight deep learning framework for edge computing devices',
        status: 'active',
        language: 'Python',
        stars: 89,
        forks: 21,
        members: [allUsers[4].id, allUsers[5].id, allUsers[6].id],
        ownedBy: allUsers[4].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[5].id,
          username: allUsers[5].username,
          commitId: `commit_${Date.now()}_2`,
          message: 'Optimized CUDA kernels',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_3`,
        name: 'Secure Chat Protocol',
        description: 'End-to-end encrypted messaging protocol with quantum-resistant cryptography',
        status: 'active',
        language: 'Rust',
        stars: 234,
        forks: 56,
        members: [allUsers[7].id, allUsers[8].id, allUsers[9].id, allUsers[10].id, allUsers[11].id],
        ownedBy: allUsers[7].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[8].id,
          username: allUsers[8].username,
          commitId: `commit_${Date.now()}_3`,
          message: 'Implemented post-quantum key exchange',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_4`,
        name: 'Cloud Gaming Platform',
        description: 'Low-latency cloud gaming infrastructure with WebRTC streaming',
        status: 'active',
        language: 'Go',
        stars: 167,
        forks: 43,
        members: [allUsers[12].id, allUsers[13].id, allUsers[14].id, allUsers[0].id],
        ownedBy: allUsers[12].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[13].id,
          username: allUsers[13].username,
          commitId: `commit_${Date.now()}_4`,
          message: 'Reduced streaming latency by 40%',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_5`,
        name: 'AR Navigation System',
        description: 'Augmented reality indoor navigation using computer vision and SLAM',
        status: 'active',
        language: 'C++',
        stars: 98,
        forks: 19,
        members: [allUsers[15].id, allUsers[16].id, allUsers[17].id],
        ownedBy: allUsers[15].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[16].id,
          username: allUsers[16].username,
          commitId: `commit_${Date.now()}_5`,
          message: 'Improved marker detection accuracy',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_6`,
        name: 'Blockchain Voting System',
        description: 'Transparent and secure voting platform using smart contracts',
        status: 'active',
        language: 'Solidity',
        stars: 201,
        forks: 67,
        members: [allUsers[2].id, allUsers[4].id, allUsers[6].id, allUsers[8].id],
        ownedBy: allUsers[2].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[4].id,
          username: allUsers[4].username,
          commitId: `commit_${Date.now()}_6`,
          message: 'Added zero-knowledge proof verification',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_7`,
        name: 'AI Code Review Bot',
        description: 'Automated code review system using LLMs for pull request analysis',
        status: 'active',
        language: 'TypeScript',
        stars: 312,
        forks: 78,
        members: [allUsers[1].id, allUsers[3].id, allUsers[5].id, allUsers[7].id, allUsers[9].id],
        ownedBy: allUsers[1].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[3].id,
          username: allUsers[3].username,
          commitId: `commit_${Date.now()}_7`,
          message: 'Integrated GPT-4 for better suggestions',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_8`,
        name: 'Quantum Computing Sim',
        description: 'Web-based quantum circuit simulator with visual circuit builder',
        status: 'active',
        language: 'JavaScript',
        stars: 156,
        forks: 41,
        members: [allUsers[10].id, allUsers[11].id, allUsers[12].id],
        ownedBy: allUsers[10].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[11].id,
          username: allUsers[11].username,
          commitId: `commit_${Date.now()}_8`,
          message: 'Added Shors algorithm visualization',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_9`,
        name: 'IoT Smart Home Hub',
        description: 'Universal smart home controller with AI-powered automation',
        status: 'active',
        language: 'Python',
        stars: 223,
        forks: 59,
        members: [allUsers[13].id, allUsers[14].id, allUsers[15].id, allUsers[16].id],
        ownedBy: allUsers[13].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[14].id,
          username: allUsers[14].username,
          commitId: `commit_${Date.now()}_9`,
          message: 'Added Matter protocol support',
          timestamp: new Date()
        },
        createdAt: new Date()
      },
      {
        id: `proj_${timestamp}_10`,
        name: 'Game Engine X',
        description: 'Lightweight 2D game engine with built-in physics and particle systems',
        status: 'active',
        language: 'C++',
        stars: 445,
        forks: 123,
        members: [allUsers[17].id, allUsers[0].id, allUsers[2].id, allUsers[4].id, allUsers[6].id],
        ownedBy: allUsers[17].id,
        lastUpdated: new Date(),
        lastCommit: {
          userId: allUsers[0].id,
          username: allUsers[0].username,
          commitId: `commit_${Date.now()}_10`,
          message: 'Improved collision detection performance',
          timestamp: new Date()
        },
        createdAt: new Date()
      }
    ];

    // Insert projects
    for (const project of projects) {
      try {
        // Make sure we have valid member IDs
        const validMembers = project.members.filter(id => id !== undefined);
        if (validMembers.length < 3) {
          console.log(`⚠️ Skipping ${project.name} - not enough valid members`);
          continue;
        }
        project.members = validMembers;
        
        await mongoose.connection.db.collection('Projects').insertOne(project);
        console.log(`✅ Added project: ${project.name} (${project.members.length} members)`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ Project ${project.name} already exists`);
        } else {
          console.error(`❌ Error adding project ${project.name}:`, error.message);
        }
      }
    }

    // Update friend relationships
    console.log('\n👫 Updating friend relationships...\n');
    
    // Add some friend connections between users
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const friends = [];
      
      // Add 2-4 random friends
      const numFriends = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numFriends; j++) {
        const friendIndex = Math.floor(Math.random() * allUsers.length);
        if (friendIndex !== i && !friends.includes(allUsers[friendIndex].id)) {
          friends.push(allUsers[friendIndex].id);
        }
      }
      
      if (friends.length > 0) {
        await mongoose.connection.db.collection('Users').updateOne(
          { id: user.id },
          { $set: { friends: friends } }
        );
        console.log(`✅ ${user.username} now has ${friends.length} friends`);
      }
    }

    console.log('\n✨ Database population complete!');
    console.log(`   - Added ${insertedUsers.length} new users`);
    console.log(`   - Created ${projects.length} projects with squad members`);
    console.log('\n📝 All users can login with password: 123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

addUsersAndProjects();