const sequelize = require('../config/database');

let DEALS_COLUMNS = null;

async function introspect() {
  if (!DEALS_COLUMNS) {
    const [cols] = await sequelize.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name ILIKE 'deals'`
    );
    DEALS_COLUMNS = new Set(cols.map(c => c.column_name));
    console.log(`[SearchIntrospect] Found ${DEALS_COLUMNS.size} columns for deals table.`);
  }
}

function has(col) {
  return DEALS_COLUMNS && DEALS_COLUMNS.has(col);
}

function paging(req) {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function sortSql(sort) {
  const key = String(sort || '').toLowerCase();
  if (key === 'price_asc' || key === 'price_low_to_high' || key === 'low') return 'price ASC';
  if (key === 'price_desc' || key === 'price_high_to_low' || key === 'high') return 'price DESC';
  // newest
  return '"createdAt" DESC';
}

exports.search = async (req, res, next) => {
  try {
    await introspect();
    const { page, limit, offset } = paging(req);

    const where = [];
    const bind = [];

    if (req.query.q) {
      bind.push(`%${req.query.q}%`, `%${req.query.q}%`);
      where.push(`(title ILIKE $${bind.length - 1} OR description ILIKE $${bind.length})`);
    }
    if (req.query.min_price) {
      bind.push(Number(req.query.min_price));
      where.push(`price >= $${bind.length}`);
    }
    if (req.query.max_price) {
      bind.push(Number(req.query.max_price));
      where.push(`price <= $${bind.length}`);
    }
    const categoryParam = req.query.category_id ?? req.query.category;
    if (categoryParam && has('category_id')) {
      bind.push(Number(categoryParam));
      where.push(`category_id = $${bind.length}`);
    }
    const storeParam = req.query.store_id ?? req.query.store;
    if (storeParam && has('store_id')) {
      bind.push(Number(storeParam));
      where.push(`store_id = $${bind.length}`);
    }

    // Only show active deals in search result
    where.push("deals.status = 'active'");

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const orderSql = `ORDER BY ${sortSql(req.query.sort)}`;

    const selectCols = ['id', 'title', 'description', 'price', '"createdAt"'];
    const fields = ['image_url', 'images_json', 'expiry_date', 'store_id', 'category_id', 'status',
                    'condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram',
                    'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location', 'plan_type'];
    for (const f of fields) {
      if (has(f)) {
        const quoted = /[A-Z]/.test(f) ? `"${f}"` : f;
        selectCols.push(quoted);
      }
    }

    const countSql = `SELECT COUNT(*)::INT AS count FROM deals JOIN users u ON u.id = deals."userId" ${whereSql}${whereSql ? ' AND ' : 'WHERE '}u.status = 'active'`;
    const dataSql = `SELECT ${selectCols.map(c => c.includes('"') ? `deals.${c}` : `deals.${c}`).join(', ')},
                     u.rating AS rating,
                     u.is_verified AS is_verified,
                     (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = deals.id) AS clicks
                     FROM deals
                     JOIN users u ON u.id = deals."userId"
                     ${whereSql}${whereSql ? ' AND ' : 'WHERE '}u.status = 'active'
                     ORDER BY 
                       (CASE 
                         WHEN deals.plan_type = 'star' AND u.star_plan_expires_at > NOW() THEN 1 
                         WHEN deals.plan_type = 'basic' AND u.basic_plan_expires_at > NOW() THEN 2 
                         ELSE 3 
                       END) ASC,
                       u.is_verified DESC,
                       ${orderSql.replace('ORDER BY ', '')}
                     LIMIT ${limit} OFFSET ${offset}`;

    const [[countRow]] = await sequelize.query(countSql, { bind });
    const [rows] = await sequelize.query(dataSql, { bind });

    return res.json({
      success: true,
      data: rows,
      meta: {
        page,
        limit,
        total: countRow.count,
        pages: Math.ceil(countRow.count / limit),
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.suggestions = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      // Return popular categories as recommended searches
      const [cats] = await sequelize.query(
        'SELECT name FROM categories LIMIT 6'
      );
      return res.json({ success: true, data: cats.map(c => c.name), isRecommended: true });
    }
    
    // Simple ILIKE query for suggestions
    const [rows] = await sequelize.query(
      'SELECT DISTINCT title FROM deals WHERE title ILIKE :q AND status = \'active\' LIMIT 8',
      { replacements: { q: `%${q}%` } }
    );
    
    return res.json({ success: true, data: rows.map(r => r.title) });
  } catch (err) {
    return next(err);
  }
};
