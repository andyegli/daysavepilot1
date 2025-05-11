// models/index.js
const User = require('./User');
const Url = require('./Url');
const Tag = require('./Tag');
const Comment = require('./Comment');

// Define relationships
User.hasMany(Url, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Url.belongsTo(User, { foreignKey: 'user_id' });

Url.hasMany(Tag, { foreignKey: 'url_id', onDelete: 'CASCADE' });
Tag.belongsTo(Url, { foreignKey: 'url_id' });

Url.hasMany(Comment, { foreignKey: 'url_id', onDelete: 'CASCADE' });
Comment.belongsTo(Url, { foreignKey: 'url_id' });

User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Url,
  Tag,
  Comment
};