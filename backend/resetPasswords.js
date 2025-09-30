const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Apex');
    console.log('Connected to MongoDB');

    // New password (change this to whatever you want)
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update all users to have this password
    const result = await mongoose.connection.db.collection('Users').updateMany(
      {},
      { $set: { password: hashedPassword } }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    console.log(`All users now have password: ${newPassword}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
