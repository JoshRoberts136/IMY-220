const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    console.log(`\nFound ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email || 'NOT SET'}`);
      console.log(`Password: ${user.password}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

listUsers();