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

const User = require('./userModel');
const Deal = require('./Deal');

Message.belongsTo(User, { as: 'Sender', foreignKey: 'from_user_id', onDelete: 'CASCADE' });
Message.belongsTo(User, { as: 'Recipient', foreignKey: 'to_user_id', onDelete: 'CASCADE' });
Message.belongsTo(Deal, { foreignKey: 'deal_id', onDelete: 'CASCADE' });

module.exports = Message;

