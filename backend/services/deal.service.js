const Deal = require('../models/Deal');

async function create({ title, description, price, userId }) {
  return Deal.create({ title, description: description || null, price, userId });
}

async function list() {
  return Deal.findAll({ order: [['id', 'ASC']] });
}

module.exports = { create, list };
