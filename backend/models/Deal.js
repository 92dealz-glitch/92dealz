const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [1, 70], msg: 'Title must be between 1 and 70 characters' }
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: { args: [0, 500], msg: 'Description must be at most 500 characters' }
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { isFloat: true },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  images_json: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'draft', 'closed', 'scheduled', 'pending', 'rejected'),
    allowNull: true,
    defaultValue: 'pending',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  negotiable: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'No',
  },
  screenSize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mainCamera: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  selfieCamera: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  battery: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  internalStorage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'deals',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['userId'] },
    { fields: ['category_id'] },
    { fields: ['subcategory'] },
  ]
});

Deal.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Deal;

