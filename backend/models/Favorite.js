const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Deal = require('./Deal');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  deal_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { unique: true, fields: ['user_id', 'deal_id'] },
  ],
});

Favorite.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Favorite.belongsTo(Deal, { foreignKey: 'deal_id', onDelete: 'CASCADE' });

module.exports = Favorite;
