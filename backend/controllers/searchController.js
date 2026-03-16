const sequelize = require('../config/database');

let DEALS_COLUMNS = null;

async function introspect() {
  if (!DEALS_COLUMNS) {
    const [cols] = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='deals'`
    );
    DEALS_COLUMNS = new Set(cols.map(c => c.column_name));
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
