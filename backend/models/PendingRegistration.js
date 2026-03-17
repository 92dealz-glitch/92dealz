const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PendingRegistration = sequelize.define('PendingRegistration', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.TEXT, // JSON string of signup data
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'pending_registrations',
  timestamps: true,
});

module.exports = PendingRegistration;
