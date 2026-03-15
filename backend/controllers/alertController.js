const Alert = require('../models/Alert');

exports.create = async (req, res, next) => {
  try {
    const { keyword, category_id } = req.body;
    if (!keyword) {
      return res.status(400).json({ success: false, message: 'keyword is required' });
    }
    const [alert, created] = await Alert.findOrCreate({
      where: { user_id: req.user.id, keyword, category_id: category_id || null },
      defaults: { user_id: req.user.id, keyword, category_id: category_id || null },
    });
    return res.status(created ? 201 : 200).json({
      success: true,
      data: alert,
      message: created ? 'Alert created' : 'Alert already exists',
    });
  } catch (err) {
    return next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Alert.findAll({
      where: { user_id: req.user.id },
      order: [['id', 'DESC']],
    });
    return res.json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const count = await Alert.destroy({ where: { id, user_id: req.user.id } });
    if (!count) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    return res.json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    return next(err);
  }
};
