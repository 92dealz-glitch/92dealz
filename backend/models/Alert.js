const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
}, {
  tableName: 'alerts',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'keyword', 'category_id'] },
  ],
});

const User = require('./userModel');
Alert.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = Alert;
