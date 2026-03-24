const Report = require('../models/Report');
const User = require('../models/userModel');
const Deal = require('../models/Deal');

exports.submitReport = async (req, res, next) => {
  try {
    const { product_id, vendor_id, reason, details } = req.body;
    const reporter_id = req.user.id;

    if (!product_id && !vendor_id) {
      return res.status(400).json({ success: false, message: 'Either product or vendor must be reported' });
    }

    const report = await Report.create({
      reporter_id,
      product_id: product_id || null,
      vendor_id: vendor_id || null,
      reason,
      details: details || null
    });

    return res.status(201).json({ success: true, data: report });
  } catch (err) {
    return next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: User, as: 'Reporter', attributes: ['id', 'name', 'email'] },
        { model: Deal, as: 'Product', attributes: ['id', 'title', 'userId'] },
        { model: User, as: 'Vendor', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: reports });
  } catch (err) {
    return next(err);
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    report.status = status;
    await report.save();

    return res.json({ success: true, data: report });
  } catch (err) {
    return next(err);
  }
};
