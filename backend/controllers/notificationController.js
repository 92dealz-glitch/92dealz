const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await Notification.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    return res.json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const notification = await Notification.findOne({ where: { id, user_id: userId } });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    
    notification.read_at = new Date();
    await notification.save();
    return res.json({ success: true, data: notification });
  } catch (err) {
    return next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.update(
      { read_at: new Date() },
      { where: { user_id: userId, read_at: null } }
    );
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const notification = await Notification.findOne({ where: { id, user_id: userId } });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    
    await notification.destroy();
    return res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    return next(err);
  }
};
