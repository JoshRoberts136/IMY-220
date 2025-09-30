const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Apex');
    console.log('Connected to MongoDB\n');

    // Check Users
    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    console.log('=== USERS ===');
    console.log('Count:', users.length);
    if (users.length > 0) {
      console.log('Sample user:', {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email,
        ownedProjects: users[0].ownedProjects,
        memberProjects: users[0].memberProjects
      });
    }

    // Check Projects
    const projects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    console.log('\n=== PROJECTS ===');
    console.log('Count:', projects.length);
    if (projects.length > 0) {
      console.log('Sample project:', {
        id: projects[0].id,
        name: projects[0].name,
        ownedBy: projects[0].ownedBy,
        members: projects[0].members
      });
    }

    // Check Commits
    const commits = await mongoose.connection.db.collection('Commits').find({}).toArray();
    console.log('\n=== COMMITS ===');
    console.log('Count:', commits.length);
    if (commits.length > 0) {
      console.log('Sample commit:', {
        id: commits[0].id,
        userId: commits[0].userId,
        projectId: commits[0].projectId,
        message: commits[0].message
      });
    }

    // Check Messages
    const messages = await mongoose.connection.db.collection('Messages').find({}).toArray();
    console.log('\n=== MESSAGES ===');
    console.log('Count:', messages.length);
    if (messages.length > 0) {
      console.log('Sample message:', {
        id: messages[0].id,
        userId: messages[0].userId,
        projectId: messages[0].projectId,
        message: messages[0].message
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDatabase();
