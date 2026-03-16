const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  store_id: {
    type: DataTypes.BIGINT,
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
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
}, {
  tableName: 'submissions',
  timestamps: false,
  indexes: [{ fields: ['status'] }, { fields: ['created_at'] }],
});

module.exports = Submission;
