require('dotenv').config();
const mongoose = require('mongoose');

const assignOwnerlessProjects = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const projectsCollection = db.collection('Projects');
    const usersCollection = db.collection('Users');

    // Find the user with email josh@gmail.com
    const joshUser = await usersCollection.findOne({ 
      email: { $regex: new RegExp('^josh@gmail.com$', 'i') }
    });

    if (!joshUser) {
      console.log('❌ User with email josh@gmail.com not found!');
      console.log('Please create this user first.');
      await mongoose.connection.close();
      process.exit();
      return;
    }

    console.log(`✅ Found user: ${joshUser.username} (${joshUser.email})`);
    console.log(`   User ID: ${joshUser.id}\n`);

    // Find all projects without an owner or with invalid owner
    const allProjects = await projectsCollection.find({}).toArray();
    console.log(`📊 Total projects in database: ${allProjects.length}\n`);

    // Get all valid user IDs
    const allUsers = await usersCollection.find({}).toArray();
    const validUserIds = allUsers.map(u => u.id);

    // Find ownerless projects
    const ownerlessProjects = allProjects.filter(project => {
      return !project.ownedBy || !validUserIds.includes(project.ownedBy);
    });

    console.log(`🔍 Found ${ownerlessProjects.length} ownerless projects\n`);

    if (ownerlessProjects.length === 0) {
      console.log('✨ All projects already have valid owners!');
      await mongoose.connection.close();
      process.exit();
      return;
    }

    console.log('🔧 Assigning projects to josh@gmail.com...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const project of ownerlessProjects) {
      try {
        // Update the project
        await projectsCollection.updateOne(
          { _id: project._id },
          { 
            $set: { 
              ownedBy: joshUser.id,
              updatedAt: new Date().toISOString()
            },
            // Add josh as a member if not already
            $addToSet: { members: joshUser.id }
          }
        );

        console.log(`✅ Assigned "${project.name}" to ${joshUser.username}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed to assign "${project.name}":`, err.message);
        errorCount++;
      }
    }

    // Update josh's ownedProjects array
    const projectIds = ownerlessProjects.map(p => p.id);
    await usersCollection.updateOne(
      { id: joshUser.id },
      { 
        $addToSet: { 
          ownedProjects: { $each: projectIds }
        }
      }
    );

    console.log('\n📈 Summary:');
    console.log(`   ✅ Successfully assigned: ${successCount} projects`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed to assign: ${errorCount} projects`);
    }
    console.log(`   👤 New owner: ${joshUser.username} (${joshUser.email})`);
    
    console.log('\n🎉 All ownerless projects have been assigned!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

assignOwnerlessProjects();
