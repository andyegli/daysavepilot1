// models/Tag.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'urls',
      key: 'id'
    }
  },
  tag: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'tags',
  timestamps: false
});

module.exports = Tag;