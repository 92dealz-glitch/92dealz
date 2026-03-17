const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
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
  slug: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  icon: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mega_menu: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  specifications_template: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'categories',
  timestamps: false,
});

module.exports = Category;
