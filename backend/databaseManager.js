const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

class DatabaseManager {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;
    
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      });
      console.log('✅ Connected to MongoDB');
      this.isConnected = true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  // USER OPERATIONS
  async getAllUsers() {
    await this.connect();
    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    console.log(`\nFound ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Last Login: ${user.lastLogin || 'Never'}`);
      console.log('   ---');
    });
    return users;
  }

  async createUser(userData) {
    await this.connect();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      id: `user_${Date.now()}`,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      profile: userData.profile || {
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        bio: userData.bio || 'A legendary developer',
        title: userData.title || 'Legend'
      },
      isActive: true,
      updatedAt: new Date(),
      lastLogin: new Date()
    };

    const result = await mongoose.connection.db.collection('Users').insertOne(newUser);
    console.log(`✅ Created user: ${userData.username} (ID: ${result.insertedId})`);
    return result;
  }

  async updateUser(userId, updateData) {
    await this.connect();
    const result = await mongoose.connection.db.collection('Users').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    console.log(`✅ Updated user: ${userId}`);
    return result;
  }

  async deleteUser(userId) {
    await this.connect();
    const result = await mongoose.connection.db.collection('Users').deleteOne(
      { _id: new mongoose.Types.ObjectId(userId) }
    );
    console.log(`✅ Deleted user: ${userId}`);
    return result;
  }

  // PROJECT OPERATIONS
  async getAllProjects() {
    await this.connect();
    const projects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    console.log(`\nFound ${projects.length} projects:`);
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name}`);
      console.log(`   ID: ${project._id}`);
      console.log(`   Owner: ${project.ownedBy}`);
      console.log(`   Language: ${project.language}`);
      console.log(`   Stars: ${project.stars || 0}`);
      console.log(`   Status: ${project.status}`);
      console.log('   ---');
    });
    return projects;
  }

  async createProject(projectData, ownerId) {
    await this.connect();
    const newProject = {
      id: `project_${Date.now()}`,
      name: projectData.name,
      description: projectData.description,
      status: projectData.status || 'active',
      language: projectData.language,
      ownedBy: ownerId,
      hashtags: projectData.hashtags || [],
      stars: 0,
      forks: 0,
      members: [ownerId],
      lastUpdated: new Date(),
      createdAt: new Date()
    };

    const result = await mongoose.connection.db.collection('Projects').insertOne(newProject);
    console.log(`✅ Created project: ${projectData.name} (ID: ${result.insertedId})`);
    return result;
  }

  async updateProject(projectId, updateData) {
    await this.connect();
    const result = await mongoose.connection.db.collection('Projects').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(projectId) },
      { $set: { ...updateData, lastUpdated: new Date() } },
      { returnDocument: 'after' }
    );
    console.log(`✅ Updated project: ${projectId}`);
    return result;
  }

  async deleteProject(projectId) {
    await this.connect();
    const result = await mongoose.connection.db.collection('Projects').deleteOne(
      { _id: new mongoose.Types.ObjectId(projectId) }
    );
    console.log(`✅ Deleted project: ${projectId}`);
    return result;
  }

  // FRIENDSHIP OPERATIONS
  async getAllFriendships() {
    await this.connect();
    const friendships = await mongoose.connection.db.collection('Friendships').find({}).toArray();
    console.log(`\nFound ${friendships.length} friendships:`);
    friendships.forEach((friendship, index) => {
      console.log(`${index + 1}. User ${friendship.userId1} ↔ User ${friendship.userId2}`);
    });
    return friendships;
  }

  async createFriendship(userId1, userId2) {
    await this.connect();
    const friendship = {
      id: `friendship_${Date.now()}`,
      userId1: userId1.toString(),
      userId2: userId2.toString(),
      createdAt: new Date()
    };

    const result = await mongoose.connection.db.collection('Friendships').insertOne(friendship);
    console.log(`✅ Created friendship between ${userId1} and ${userId2}`);
    return result;
  }

  // DATABASE UTILITIES
  async clearCollection(collectionName) {
    await this.connect();
    const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} documents from ${collectionName}`);
    return result;
  }

  async clearAllData() {
    await this.connect();
    const collections = ['Users', 'Projects', 'Friendships', 'FriendRequests', 'Activities', 'Commits'];
    
    for (const collection of collections) {
      try {
        const result = await mongoose.connection.db.collection(collection).deleteMany({});
        console.log(`🗑️ Cleared ${result.deletedCount} documents from ${collection}`);
      } catch (error) {
        console.log(`⚠️ Could not clear ${collection}: ${error.message}`);
      }
    }
  }

  async seedSampleData() {
    await this.connect();
    
    // Clear existing data
    await this.clearAllData();
    
    // Create sample users
    const users = [
      { username: 'octane_speed', email: 'octane@apex.com', password: 'test123', firstName: 'Octavio', lastName: 'Silva', title: 'Speed Demon' },
      { username: 'wraith_void', email: 'wraith@apex.com', password: 'test123', firstName: 'Renee', lastName: 'Blasey', title: 'Interdimensional Skirmisher' },
      { username: 'gibraltar_shield', email: 'gibraltar@apex.com', password: 'test123', firstName: 'Makoa', lastName: 'Gibraltar', title: 'Wild Frontier' },
      { username: 'lifeline_medic', email: 'lifeline@apex.com', password: 'test123', firstName: 'Ajay', lastName: 'Che', title: 'Combat Medic' },
      { username: 'pathfinder_scout', email: 'pathfinder@apex.com', password: 'test123', firstName: 'Path', lastName: 'Finder', title: 'Recon Specialist' }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const result = await this.createUser(userData);
      createdUsers.push(result.insertedId);
    }

    // Create sample projects
    const projects = [
      { name: 'Jump Pad Protocol', description: 'High-speed movement algorithms', language: 'JavaScript', hashtags: ['speed', 'movement'] },
      { name: 'Phase Technology', description: 'Dimensional portal system', language: 'Python', hashtags: ['quantum', 'portal'] },
      { name: 'Shield Generator', description: 'Defensive barrier algorithms', language: 'C++', hashtags: ['defense', 'shield'] },
      { name: 'Healing Drone AI', description: 'Autonomous medical assistance', language: 'Python', hashtags: ['ai', 'medical'] },
      { name: 'Zipline Pathfinding', description: 'Optimal route calculation', language: 'Java', hashtags: ['pathfinding', 'optimization'] }
    ];

    for (let i = 0; i < projects.length; i++) {
      await this.createProject(projects[i], createdUsers[i]);
    }

    // Create friendships
    await this.createFriendship(createdUsers[0], createdUsers[1]);
    await this.createFriendship(createdUsers[1], createdUsers[2]);
    await this.createFriendship(createdUsers[2], createdUsers[3]);
    await this.createFriendship(createdUsers[3], createdUsers[4]);

    console.log('\n🎉 Sample data seeded successfully!');
    console.log('- 5 users created');
    console.log('- 5 projects created');
    console.log('- 4 friendships created');
  }

  async getDatabaseStats() {
    await this.connect();
    const stats = {};
    
    const collections = ['Users', 'Projects', 'Friendships', 'FriendRequests', 'Activities', 'Commits'];
    
    for (const collection of collections) {
      try {
        const count = await mongoose.connection.db.collection(collection).countDocuments();
        stats[collection] = count;
      } catch (error) {
        stats[collection] = 0;
      }
    }

    console.log('\n📊 Database Statistics:');
    Object.entries(stats).forEach(([collection, count]) => {
      console.log(`   ${collection}: ${count} documents`);
    });

    return stats;
  }
}

// CLI Interface
async function runCLI() {
  const dbManager = new DatabaseManager();
  const args = process.argv.slice(2);
  
  try {
    switch (args[0]) {
      case 'users':
        await dbManager.getAllUsers();
        break;
      case 'projects':
        await dbManager.getAllProjects();
        break;
      case 'friendships':
        await dbManager.getAllFriendships();
        break;
      case 'stats':
        await dbManager.getDatabaseStats();
        break;
      case 'seed':
        await dbManager.seedSampleData();
        break;
      case 'clear':
        if (args[1]) {
          await dbManager.clearCollection(args[1]);
        } else {
          await dbManager.clearAllData();
        }
        break;
      default:
        console.log(`
🔧 ApexCoding Database Manager

Usage: node databaseManager.js [command]

Commands:
  users        - List all users
  projects     - List all projects  
  friendships  - List all friendships
  stats        - Show database statistics
  seed         - Seed sample data (clears existing data)
  clear [collection] - Clear collection or all data

Examples:
  node databaseManager.js users
  node databaseManager.js seed
  node databaseManager.js clear Users
        `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await dbManager.disconnect();
    process.exit(0);
  }
}

// Export for use in other scripts
module.exports = DatabaseManager;

// Run CLI if called directly
if (require.main === module) {
  runCLI();
}
