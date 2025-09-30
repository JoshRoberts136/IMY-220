// Simple database reader using native MongoDB driver
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://u23536765_db_user:HSM9OETiERFQxra6@220project.o8ivdqr.mongodb.net/Apex?retryWrites=true&w=majority&appName=220Project';

async function printAllDatabaseData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('Apex');
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📂 Found ${collections.length} collections in database 'Apex':`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPLETE DATABASE CONTENTS');
    console.log('='.repeat(80));
    
    // Print all data from each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n🗂️  COLLECTION: ${collectionName}`);
      console.log('-'.repeat(50));
      
      try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        
        if (documents.length === 0) {
          console.log('   (Empty collection)');
        } else {
          console.log(`   Total documents: ${documents.length}\n`);
          
          documents.forEach((doc, index) => {
            console.log(`   Document ${index + 1}:`);
            console.log('   ' + JSON.stringify(doc, null, 4).replace(/\n/g, '\n   '));
            console.log('   ' + '-'.repeat(40));
          });
        }
      } catch (error) {
        console.log(`   ❌ Error reading collection: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Database dump complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    if (error.cause) {
      console.error('   Cause:', error.cause.message);
    }
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

printAllDatabaseData().catch(console.error);
