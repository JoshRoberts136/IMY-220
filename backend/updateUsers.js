const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
require('dotenv').config({ path: '../.env' });

async function updateExistingUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    console.log(`Found ${users.length} users`);

    for (let user of users) {
      if (!user.email || !user.password) {
        const email = `${user.username}@example.com`;
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await mongoose.connection.db.collection('Users').updateOne(
          { _id: user._id },
          { 
            $set: {
              email: email,
              password: hashedPassword 
            }
          }
        );
        console.log(`Updated user: ${user.username} -> ${email}`);
      }
    }

    console.log('\n🔑 Login with: username@example.com / password123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

updateExistingUsers();