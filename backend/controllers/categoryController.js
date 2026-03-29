const Category = require('../models/Category');

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json({ success: true, data: categories });
  } catch (err) {
    return next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { Op } = require('sequelize');
    const category = await Category.findOne({ 
      where: { 
        slug: { [Op.iLike]: slug } 
      } 
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, data: category });
  } catch (err) {
    return next(err);
  }
};
