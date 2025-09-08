const mongoose = require('mongoose');
require('dotenv').config();
const { User, Post } = require('../models');

// Sample data
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123', // Will be hashed by pre-save middleware
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Software developer and tech enthusiast'
    },
    isActive: true,
    lastLogin: new Date()
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'UI/UX designer with a passion for clean interfaces'
    },
    isActive: true,
    lastLogin: new Date()
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'password123',
    profile: {
      firstName: 'Mike',
      lastName: 'Wilson',
      bio: 'Full-stack developer and open source contributor'
    },
    isActive: true,
    lastLogin: new Date()
  },
  {
    username: 'sarah_connor',
    email: 'sarah@example.com',
    password: 'password123',
    profile: {
      firstName: 'Sarah',
      lastName: 'Connor',
      bio: 'Cybersecurity specialist and AI researcher'
    },
    isActive: true,
    lastLogin: new Date()
  }
];

const samplePosts = [
  {
    title: 'Getting Started with MongoDB',
    content: 'MongoDB is a powerful NoSQL database that offers flexibility and scalability. In this comprehensive guide, we will explore the basics of MongoDB and how to integrate it with Node.js applications. We\'ll cover everything from installation to advanced querying techniques, making this the perfect starting point for developers new to MongoDB.',
    tags: ['mongodb', 'database', 'nodejs', 'tutorial'],
    category: 'tutorial',
    status: 'published'
  },
  {
    title: 'React Best Practices 2024',
    content: 'As React continues to evolve, here are some essential best practices to keep in mind when building modern React applications. We will cover the latest hooks patterns, performance optimization techniques, component structure best practices, and how to write maintainable React code that scales with your application.',
    tags: ['react', 'javascript', 'frontend', 'best-practices'],
    category: 'guide',
    status: 'published'
  },
  {
    title: 'Building RESTful APIs with Express',
    content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Learn how to build production-ready RESTful APIs with proper error handling, middleware implementation, authentication, and comprehensive testing strategies.',
    tags: ['express', 'api', 'nodejs', 'backend'],
    category: 'tutorial',
    status: 'draft'
  },
  {
    title: 'The Future of Web Development',
    content: 'Web development is constantly evolving, and staying up-to-date with the latest trends and technologies is crucial for developers. In this article, we explore emerging technologies like WebAssembly, Progressive Web Apps, JAMstack architecture, and how they\'re shaping the future of web development.',
    tags: ['web-development', 'technology', 'future', 'trends'],
    category: 'opinion',
    status: 'published'
  },
  {
    title: 'Mastering CSS Grid and Flexbox',
    content: 'CSS Grid and Flexbox are powerful layout systems that have revolutionized how we approach web layouts. This comprehensive guide covers when to use each system, common layout patterns, and practical examples that you can implement in your own projects.',
    tags: ['css', 'grid', 'flexbox', 'layout', 'frontend'],
    category: 'tutorial',
    status: 'published'
  },
  {
    title: 'Cybersecurity in Modern Web Applications',
    content: 'Security should be a top priority for every web developer. This article covers essential security practices including input validation, authentication strategies, protecting against common vulnerabilities like XSS and SQL injection, and implementing secure coding practices.',
    tags: ['security', 'cybersecurity', 'web-development', 'best-practices'],
    category: 'security',
    status: 'published'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to MongoDB for seeding...');

    // Clear existing data (be careful with this in production!)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create users (passwords will be hashed by pre-save middleware)
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create posts with random authors
    console.log('📝 Creating sample posts...');
    const postsWithAuthors = samplePosts.map((post, index) => ({
      ...post,
      author: createdUsers[index % createdUsers.length]._id
    }));

    const createdPosts = [];
    for (const postData of postsWithAuthors) {
      const post = new Post(postData);
      await post.save();
      createdPosts.push(post);
    }
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Add some sample comments and likes
    console.log('💬 Adding sample comments and interactions...');
    const sampleComments = [
      'Great post! This is very helpful for understanding the topic.',
      'Thanks for sharing this comprehensive guide!',
      'This was exactly what I was looking for. Well explained!',
      'I learned a lot from this article. Keep up the great work!',
      'Excellent tutorial! Looking forward to more content like this.',
      'This helped me solve a problem I was struggling with. Much appreciated!'
    ];
    
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      
      // Add random comments
      const numComments = Math.floor(Math.random() * 3) + 1; // 1-3 comments per post
      for (let j = 0; j < numComments; j++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        
        post.comments.push({
          user: randomUser._id,
          content: randomComment,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
        });
      }
      
      // Add random likes
      const numLikes = Math.floor(Math.random() * createdUsers.length);
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      
      for (let k = 0; k < numLikes; k++) {
        post.likes.push({
          user: shuffledUsers[k]._id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
      
      // Add some random views
      post.viewCount = Math.floor(Math.random() * 100) + 10;
      
      await post.save();
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Database Statistics:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Posts: ${await Post.countDocuments()}`);
    console.log(`   Published Posts: ${await Post.countDocuments({ status: 'published' })}`);
    console.log('\n🚀 You can now start your server with: npm start');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  console.log('🌱 Starting database seeding...');
  seedDatabase();
}

module.exports = seedDatabase;