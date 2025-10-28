require('dotenv').config();
const mongoose = require('mongoose');

// Default emoji avatars
const DEFAULT_EMOJIS = [
  '👤', '🎮', '💻', '🚀', '⚡', '🔥', 
  '🎯', '💡', '🎨', '🎭', '🎪', '🎬',
  '🎸', '🎹', '🎺', '🎻', '🥁', '🎤',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
  '🌟', '✨', '💫', '🌙', '☀️', '🌈',
  '🦁', '🦊', '🐺', '🦅', '🦉', '🐉',
  '🍕', '🍔', '🍣', '🍩', '🍰', '🎂',
  '☕', '🍺', '🍷', '🍸', '🥤', '🧃'
];

// Get default emoji based on username
const getDefaultEmoji = (username) => {
  if (!username) return '👤';
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % DEFAULT_EMOJIS.length;
  return DEFAULT_EMOJIS[index];
};

const setDefaultAvatars = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('Users');

    // Find all users without an avatar
    const usersWithoutAvatar = await usersCollection.find({
      $or: [
        { 'profile.avatar': { $exists: false } },
        { 'profile.avatar': null },
        { 'profile.avatar': '' }
      ]
    }).toArray();

    console.log(`Found ${usersWithoutAvatar.length} users without avatars`);

    // Update each user with a default emoji avatar
    for (const user of usersWithoutAvatar) {
      const emoji = getDefaultEmoji(user.username);
      
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            'profile.avatar': emoji,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`✅ Set default avatar for ${user.username}: ${emoji}`);
    }

    console.log('\n🎉 All users now have default avatars!');
    
    // Show summary
    const allUsers = await usersCollection.find({}).project({ username: 1, 'profile.avatar': 1 }).toArray();
    console.log('\n📋 User Avatar Summary:');
    allUsers.forEach(user => {
      console.log(`   ${user.username}: ${user.profile?.avatar || '(none)'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

setDefaultAvatars();
