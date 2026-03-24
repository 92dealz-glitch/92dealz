const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Deal = require('./Deal');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  reporter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Deal,
      key: 'id'
    }
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'reports',
  timestamps: true,
});

Report.belongsTo(User, { as: 'Reporter', foreignKey: 'reporter_id' });
Report.belongsTo(Deal, { as: 'Product', foreignKey: 'product_id' });
Report.belongsTo(User, { as: 'Vendor', foreignKey: 'vendor_id' });

module.exports = Report;
