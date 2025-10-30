const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
let client = null;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('Apex');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) throw new Error('Database not connected');
  return db;
};

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    process.exit(0);
  }
});

module.exports = { connectDB, getDB };
