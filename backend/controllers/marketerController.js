const sequelize = require('../config/database');

exports.overview = async (req, res, next) => {
  try {
    const [[mk]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS total_marketers FROM users WHERE role='user'`
    );
    const [[vd]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS total_vendors FROM users WHERE role='vendor'`
    );
    const [[vdMonth]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS vendors_this_month
       FROM users 
       WHERE role='vendor' AND date_trunc('month', "createdAt") = date_trunc('month', CURRENT_DATE)`
    );
    const COMM_PER_VENDOR = Number(process.env.COMMISSION_PER_VENDOR || 5000);
    const TARGET_MONTHLY = Number(process.env.VENDOR_TARGET_MONTHLY || 100);
    const monthly_commission = (vdMonth.vendors_this_month || 0) * COMM_PER_VENDOR;
    const total_balance = (vd.total_vendors || 0) * COMM_PER_VENDOR;
    const target_progress = TARGET_MONTHLY > 0
      ? Math.min(100, Math.round(((vdMonth.vendors_this_month || 0) / TARGET_MONTHLY) * 100))
      : 0;

    // Get all vendors for transactions list
    const [vendors] = await sequelize.query(
      `SELECT id, name, "createdAt" FROM users WHERE role='vendor' ORDER BY "createdAt" DESC`
    );

    const transactions = vendors.map(v => ({
      id: v.id,
      date: new Date(v.createdAt).toISOString().split('T')[0],
      source: `Vendor Signup - ${v.name}`,
      amount: `₦${COMM_PER_VENDOR.toLocaleString()}`,
      status: 'Paid'
    }));

    return res.json({
      success: true,
      data: {
        total_marketers: mk.total_marketers || 0,
        total_vendors: vd.total_vendors || 0,
        monthly_commission,
        total_balance,
        target_progress,
        transactions,
        payout_expected: Math.round(total_balance * 0.3), // Mock logic
        last_payout: Math.round(total_balance * 0.5) // Mock logic
      },
    });
  } catch (err) { return next(err); }
};

