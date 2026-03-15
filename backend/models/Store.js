const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  logo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  website_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
  },
}, {
  tableName: 'stores',
  timestamps: false,
});

module.exports = Store;
