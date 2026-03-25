const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  visitor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  last_visited_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'visitors',
  timestamps: false,
});

module.exports = Visitor;
