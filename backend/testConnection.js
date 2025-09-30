const mongoose = require('mongoose');

// MongoDB connection URI from your .env file
const MONGODB_URI = 'mongodb+srv://u23536765_db_user:HSM9OETiERFQxra6@220project.o8ivdqr.mongodb.net/Apex?retryWrites=true&w=majority&appName=220Project';

async function testConnection() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test basic operations
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📂 Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Count documents in each collection
    console.log('\n📊 Document counts:');
    for (const col of collections) {
      try {
        const count = await db.collection(col.name).countDocuments();
        console.log(`   ${col.name}: ${count} documents`);
      } catch (err) {
        console.log(`   ${col.name}: Error counting - ${err.message}`);
      }
    }
    
    // Show sample user if any exist
    const users = await db.collection('Users').find({}).limit(3).toArray();
    if (users.length > 0) {
      console.log(`\n👥 Sample users (${users.length} total):`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username || 'No username'} (${user.email || 'No email'})`);
      });
    }
    
    // Show sample projects if any exist
    const projects = await db.collection('Projects').find({}).limit(3).toArray();
    if (projects.length > 0) {
      console.log(`\n💻 Sample projects (${projects.length} total):`);
      projects.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.name || 'Unnamed'} - ${project.language || 'No language'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.reason) {
      console.error('   Reason:', error.reason);
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

testConnection();
