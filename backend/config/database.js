const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      bufferCommands: false 
    });

    mongoose.connection.on('error', (err) => {});

    mongoose.connection.on('disconnected', () => {});

    mongoose.connection.on('reconnected', () => {});

  } catch (error) {}
};

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});

module.exports = connectDB;
