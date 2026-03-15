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
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'Email already exists',
    },
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Email is not valid' },
      len: { args: [3, 255], msg: 'Email must be between 3 and 255 characters' },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: { args: [0, 30], msg: 'Phone must be at most 30 characters' },
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'vendor', 'admin'),
    allowNull: false,
    defaultValue: 'user',
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
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
