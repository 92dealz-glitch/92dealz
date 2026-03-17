const sequelize = require('../config/database');

exports.createOrder = async (req, res, next) => {
  try {
    const buyerId = req.user && req.user.id;
    if (!buyerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { deal_id, vendor_id, price, notes } = req.body;
    if (!deal_id || !vendor_id || !price) {
      return res.status(400).json({ success: false, message: 'deal_id, vendor_id, and price are required' });
    }

    const [rows] = await sequelize.query(
      `INSERT INTO orders (buyer_id, vendor_id, deal_id, price, buyer_notes, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW()) RETURNING id`,
      { bind: [buyerId, Number(vendor_id), Number(deal_id), Number(price), notes || null] }
    );

    return res.status(201).json({ success: true, data: { id: rows[0].id } });
  } catch (err) {
    return next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const [rows] = await sequelize.query(
      `SELECT o.*, d.title as deal_title, d.image_url as deal_image, 
              u_buyer.name as buyer_name, u_vendor.name as vendor_name,
              u_vendor.phone as vendor_phone, u_vendor.email as vendor_email,
              u_buyer.phone as buyer_phone, u_buyer.email as buyer_email
       FROM orders o
       JOIN deals d ON d.id = o.deal_id
       JOIN users u_buyer ON u_buyer.id = o.buyer_id
       JOIN users u_vendor ON u_vendor.id = o.vendor_id
       WHERE o.buyer_id = $1 OR o.vendor_id = $1
       ORDER BY o."createdAt" DESC`,
      { bind: [userId] }
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.confirmOrder = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const orderId = Number(req.params.id);
    const [orders] = await sequelize.query(`SELECT * FROM orders WHERE id = $1`, { bind: [orderId] });
    
    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });
    const order = orders[0];

    let newStatus = order.status;
    if (order.buyer_id === userId) {
      if (order.status === 'vendor_confirmed') newStatus = 'completed';
      else if (order.status === 'pending') newStatus = 'buyer_confirmed';
    } else if (order.vendor_id === userId) {
      if (order.status === 'buyer_confirmed') newStatus = 'completed';
      else if (order.status === 'pending') newStatus = 'vendor_confirmed';
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await sequelize.query(
      `UPDATE orders SET status = $1, "updatedAt" = NOW() WHERE id = $2`,
      { bind: [newStatus, orderId] }
    );

    return res.json({ success: true, data: { id: orderId, status: newStatus } });
  } catch (err) {
    return next(err);
  }
};
