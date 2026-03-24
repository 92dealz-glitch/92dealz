const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reviewer_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  vendor_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'reviews',
  timestamps: true,
});

Review.belongsTo(User, { as: 'Reviewer', foreignKey: 'reviewer_id' });
Review.belongsTo(User, { as: 'Vendor', foreignKey: 'vendor_id' });
User.hasMany(Review, { as: 'ReceivedReviews', foreignKey: 'vendor_id' });
User.hasMany(Review, { as: 'GivenReviews', foreignKey: 'reviewer_id' });

module.exports = Review;
