const sequelize = require('../config/database');

let DEALS_COLUMNS = null;

async function introspect() {
  if (!DEALS_COLUMNS) {
    try {
      const dialect = sequelize.getDialect();
      let cols = [];
      if (dialect === 'postgres') {
        [cols] = await sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='deals'`
        );
      } else if (dialect === 'sqlite') {
        const [tableInfo] = await sequelize.query("PRAGMA table_info('deals')");
        cols = tableInfo.map(c => ({ column_name: c.name }));
      }
      DEALS_COLUMNS = new Set(cols.map(c => c.column_name));
    } catch (err) {
      console.warn("Introspection failed, using safe defaults", err);
      DEALS_COLUMNS = new Set(['id', 'title', 'description', 'price', 'category_id', 'store_id', 'image_url', 'status', 'userId', 'createdAt']);
    }
  }
}

// ... has function ...

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
    
    // Improved category filtering
    const categoryParam = req.query.category_id ?? req.query.category;
    if (categoryParam && categoryParam !== 'undefined' && categoryParam !== 'null') {
      const cid = Number(categoryParam);
      if (!isNaN(cid) && cid > 0) {
        bind.push(cid);
        where.push(`category_id = $${bind.length}`);
      }
    }

    const storeParam = req.query.store_id ?? req.query.store;
    if (storeParam && storeParam !== 'undefined' && storeParam !== 'null') {
      const sid = Number(storeParam);
      if (!isNaN(sid) && sid > 0) {
        bind.push(sid);
        where.push(`store_id = $${bind.length}`);
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const orderSql = `ORDER BY ${sortSql(req.query.sort)}`;

    const selectCols = ['id', 'title', 'description', 'price', '"createdAt"'];
    const fields = ['image_url', 'images_json', 'expiry_date', 'store_id', 'category_id', 'status',
                    'condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram',
                    'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location'];
    for (const f of fields) {
      if (has(f)) {
        const quoted = /[A-Z]/.test(f) ? `"${f}"` : f;
        selectCols.push(quoted);
      }
    }

    const countSql = `SELECT COUNT(*)::INT AS count FROM deals ${whereSql}`;
    const dataSql = `SELECT ${selectCols.join(', ')} FROM deals ${whereSql} ${orderSql} LIMIT ${limit} OFFSET ${offset}`;

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
    if (!q.trim()) return res.json({ success: true, data: [] });
    
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
