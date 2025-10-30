require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Apex';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('Users');

    const existingAdmin = await usersCollection.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('User ID:', existingAdmin.id);
      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = {
      id: `user_admin_${Date.now()}`,
      username: 'admin',
      email: 'admin@apexcoding.com',
      password: hashedPassword,
      profile: {
        bio: 'System Administrator',
        avatar: '👑',
        location: 'System',
        website: '',
        github: '',
        twitter: ''
      },
      isAdmin: true,
      isActive: true,
      friends: [],
      ownedProjects: [],
      memberProjects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Email: admin@apexcoding.com');
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
