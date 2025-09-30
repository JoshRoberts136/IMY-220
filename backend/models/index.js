// Export all models from a single file for easier imports
const User = require('./User');
const Project = require('./Project');
const CheckIn = require('./CheckIn');
const FriendRequest = require('./FriendRequest');

module.exports = {
  User,
  Project,
  CheckIn,
  FriendRequest
};
