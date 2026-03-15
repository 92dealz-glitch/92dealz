const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

async function createUser({ name, email, password, phone }) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return User.create({ name, email, password: hashed, phone: phone || null });
}

module.exports = { findUserByEmail, createUser };
