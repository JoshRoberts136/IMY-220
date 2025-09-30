const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function getAllCurrentMembers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);
    
    // Get all users from the Users collection
    const users = await mongoose.connection.db.collection('Users').find({}).toArray();
    
    console.log(`📋 TOTAL USERS IN DATABASE: ${users.length}`);
    console.log('=' + '='.repeat(70) + '\n');
    
    // Display each user with details
    users.forEach((user, index) => {
      console.log(`👤 USER #${index + 1}`);
      console.log('-'.repeat(70));
      console.log(`ID:       ${user._id || user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email:    ${user.email || 'Not set'}`);
      console.log(`Name:     ${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`);
      console.log(`Title:    ${user.profile?.title || 'No title set'}`);
      console.log(`Bio:      ${user.profile?.bio ? user.profile.bio.substring(0, 60) + '...' : 'No bio'}`);
      console.log(`Active:   ${user.isActive !== false ? 'Yes' : 'No'}`);
      console.log(`Password: ${user.password ? 'Set (hashed)' : 'Not set'}`);
      console.log('');
    });
    
    console.log('=' + '='.repeat(70));
    console.log('\n📊 SUMMARY:');
    console.log(`Total Users: ${users.length}`);
    
    // Get usernames list for quick reference
    const usernames = users.map(u => u.username);
    console.log(`\nAll Usernames:\n${usernames.join(', ')}`);
    
    // Check projects to see member associations
    console.log('\n\n📁 CHECKING PROJECT MEMBERSHIPS:');
    console.log('=' + '='.repeat(70));
    
    const projects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    console.log(`Total Projects: ${projects.length}\n`);
    
    projects.forEach((project, index) => {
      console.log(`Project #${index + 1}: ${project.name}`);
      console.log(`  ID: ${project._id || project.id}`);
      console.log(`  Owner: ${project.ownedBy}`);
      console.log(`  Language: ${project.language}`);
      console.log(`  Status: ${project.status}`);
      console.log(`  Members: ${project.members ? `${project.members.length} members` : 'No members'}`);
      if (project.members && project.members.length > 0) {
        console.log(`  Member IDs: ${project.members.join(', ')}`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

getAllCurrentMembers();