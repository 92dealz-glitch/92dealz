const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'buyer_confirmed', 'vendor_confirmed', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  buyer_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'orders',
  timestamps: true,
});

const User = require('./userModel');
const Deal = require('./Deal');

Order.belongsTo(User, { as: 'Buyer', foreignKey: 'buyer_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { as: 'Vendor', foreignKey: 'vendor_id', onDelete: 'CASCADE' });
Order.belongsTo(Deal, { foreignKey: 'deal_id', onDelete: 'CASCADE' });

module.exports = Order;
