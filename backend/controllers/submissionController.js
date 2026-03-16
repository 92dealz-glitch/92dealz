const Submission = require('../models/Submission');

exports.create = async (req, res, next) => {
  try {
    const { 
      title, description, price, category_id, store_id, image_url, images_json,
      condition, brand, model, color, negotiable, screenSize, ram, mainCamera, selfieCamera, battery, internalStorage, state, city, location
    } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'title and price are required' });
    }
    const sub = await Submission.create({
      user_id: req.user.id,
      title,
      description: description || null,
      price,
      category_id: category_id || null,
      store_id: store_id || null,
      image_url: image_url || null,
      images_json: images_json || null,
      status: 'PENDING',
      condition: condition || null,
      brand: brand || null,
      model: model || null,
      color: color || null,
      negotiable: negotiable || 'No',
      screenSize: screenSize || null,
      ram: ram || null,
      mainCamera: mainCamera || null,
      selfieCamera: selfieCamera || null,
      battery: battery || null,
      internalStorage: internalStorage || null,
      state: state || null,
      city: city || null,
      location: location || null,
    });
    return res.status(201).json({ success: true, data: sub });
  } catch (err) {
    return next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const items = await Submission.findAll({
      where: { user_id: req.user.id },
      order: [['id', 'DESC']],
    });
    return res.json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
};
