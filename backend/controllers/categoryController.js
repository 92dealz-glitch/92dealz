const Category = require('../models/Category');

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json({ success: true, data: categories });
  } catch (err) {
    return next(err);
  }
};
