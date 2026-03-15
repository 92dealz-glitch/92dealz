const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  from_user_id: { type: DataTypes.BIGINT, allowNull: false },
  to_user_id: { type: DataTypes.BIGINT, allowNull: false },
  deal_id: { type: DataTypes.BIGINT, allowNull: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  read_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: false,
});

module.exports = Message;

