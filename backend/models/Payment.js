const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  planId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Amount in lowest denomination (kobo/cents)'
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['NGN', 'USD']]
    }
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  }
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['reference'] },
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
});

// Relationships
User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Payment;
