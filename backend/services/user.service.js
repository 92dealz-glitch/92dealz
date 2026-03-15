const User = require('../models/User');

async function getById(id) {
  return User.findByPk(id);
}

async function updateById(id, { name, phone }) {
  const user = await User.findByPk(id);
  if (!user) return null;
  if (typeof name === 'string') user.name = name;
  if (typeof phone === 'string' || phone === null) user.phone = phone || null;
  await user.save();
  return user;
}

module.exports = { getById, updateById };
