/**
 * User model definition
 * - id: auto-increment integer primary key
 * - name: non-empty string
 * - email: unique, valid email string
 * Sequelize automatically manages createdAt and updatedAt
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      len: { args: [1, 255], msg: 'Name must be between 1 and 255 characters' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      name: 'unique_email',
      msg: 'Email already exists',
    },
    validate: {
      isEmail: { msg: 'Email is not valid' },
      len: { args: [3, 255], msg: 'Email must be between 3 and 255 characters' },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      name: 'unique_phone',
      msg: 'Phone already exists',
    },
    validate: {
      len: { args: [0, 30], msg: 'Phone must be at most 30 characters' },
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'vendor', 'admin', 'csr'),
    allowNull: false,
    defaultValue: 'user',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'rejected', 'suspended'),
    allowNull: false,
    defaultValue: 'active',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
    },
  },
  profile_image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  businessCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  businessAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: { args: [0, 500], msg: 'About must be at most 500 characters' }
    },
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  total_ads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  responseTime: {
    type: DataTypes.STRING,
    defaultValue: 'Within 1 hour',
  },
  government_id_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verification_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  verification_rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  poll_category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poll_choice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_poll_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  suspension_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  total_time_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  country_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['role'] },
    { fields: ['is_verified'] },
    { fields: ['verification_status'] },
  ]
});

module.exports = User;
