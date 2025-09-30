const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function listProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const projects = await mongoose.connection.db.collection('Projects').find({}).toArray();
    console.log(`\nFound ${projects.length} projects:`);
    
    projects.forEach((project, index) => {
      console.log(`\n${index + 1}. ${project.name || project.title || 'Unnamed Project'}`);
      console.log(`   ID: ${project._id}`);
      console.log(`   Owner: ${project.owner || project.ownerId || 'Unknown'}`);
      console.log(`   Description: ${project.description || 'No description'}`);
      console.log(`   Languages: ${project.languages ? project.languages.join(', ') : 'None'}`);
      console.log(`   Created: ${project.createdAt || project.dateCreated || 'Unknown'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

listProjects();