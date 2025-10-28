require('dotenv').config();
const mongoose = require('mongoose');

// Generate random date in October 2025
const getRandomOctoberDate = () => {
  const year = 2025;
  const month = 9; // October (0-indexed)
  const day = Math.floor(Math.random() * 31) + 1; // 1-31
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  
  return new Date(year, month, day, hour, minute, second);
};

const randomizeProjectDates = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const projectsCollection = db.collection('Projects');

    // Get all projects
    const projects = await projectsCollection.find({}).toArray();
    console.log(`📊 Found ${projects.length} projects\n`);

    if (projects.length === 0) {
      console.log('⚠️  No projects found in database');
      await mongoose.connection.close();
      process.exit();
      return;
    }

    console.log('🎲 Randomizing creation dates to October 2025...\n');

    // Update each project with a random October 2025 date
    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      try {
        const randomDate = getRandomOctoberDate();
        
        await projectsCollection.updateOne(
          { _id: project._id },
          { 
            $set: { 
              createdAt: randomDate.toISOString(),
              lastUpdated: randomDate.toISOString()
            }
          }
        );
        
        console.log(`✅ Updated "${project.name}" -> ${randomDate.toLocaleDateString()} ${randomDate.toLocaleTimeString()}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed to update "${project.name}":`, err.message);
        errorCount++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   ✅ Successfully updated: ${successCount} projects`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed to update: ${errorCount} projects`);
    }
    
    console.log('\n🎉 All project dates have been randomized to October 2025!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

randomizeProjectDates();
