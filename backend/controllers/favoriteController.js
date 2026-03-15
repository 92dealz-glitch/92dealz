const Favorite = require('../models/Favorite');
const Deal = require('../models/Deal');

exports.create = async (req, res, next) => {
  try {
    const { deal_id } = req.body;
    if (!deal_id) {
      return res.status(400).json({ success: false, message: 'deal_id is required' });
    }
    const [fav, created] = await Favorite.findOrCreate({
      where: { user_id: req.user.id, deal_id },
      defaults: { user_id: req.user.id, deal_id },
    });
    return res.status(created ? 201 : 200).json({
      success: true,
      data: fav,
      message: created ? 'Favorite added' : 'Already in favorites',
    });
  } catch (err) {
    return next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Deal, attributes: ['id', 'title', 'description', 'price', 'createdAt'] }],
      order: [['id', 'DESC']],
    });
    return res.json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { dealId } = req.params;
    await Favorite.destroy({ where: { user_id: req.user.id, deal_id: Number(dealId) } });
    return res.json({ success: true, message: 'Favorite deleted' });
  } catch (err) {
    return next(err);
  }
};
