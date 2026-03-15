const Store = require('../models/Store');

exports.list = async (req, res, next) => {
  try {
    const stores = await Store.findAll({ order: [['name', 'ASC']] });
    return res.json({ success: true, data: stores });
  } catch (err) {
    return next(err);
  }
};
