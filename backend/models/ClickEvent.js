const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClickEvent = sequelize.define('ClickEvent', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  deal_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('view', 'contact'),
    allowNull: false,
    defaultValue: 'view',
  },
  clicked_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'click_events',
  timestamps: false,
  indexes: [
    { fields: ['deal_id'] },
    { fields: ['type'] },
    { fields: ['clicked_at'] },
  ],
});

module.exports = ClickEvent;
