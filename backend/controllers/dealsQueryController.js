const sequelize = require('../config/database');

let DEALS_COLUMNS = null;
let HAS_CLICK_EVENTS = null;

async function introspect() {
  if (!DEALS_COLUMNS) {
    const [cols] = await sequelize.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name='deals'`
    );
    DEALS_COLUMNS = new Set(cols.map(c => c.column_name));
  }
  if (HAS_CLICK_EVENTS === null) {
    const [tables] = await sequelize.query(
      `SELECT to_regclass('public.click_events') AS exists`
    );
    HAS_CLICK_EVENTS = !!tables[0].exists;
  }
}

function has(col) {
  return DEALS_COLUMNS && DEALS_COLUMNS.has(col);
}

function parsePaging(req) {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '100', 10), 1), 500);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildSort(sort, dir) {
  const direction = (dir || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const allow = {
    created_at: '"createdAt"',
    price: 'price',
    title: 'title',
  };
  if (has('expiry_date')) {
    allow.expiry_date = 'expiry_date';
  }
  const key = allow[sort || 'created_at'] || '"createdAt"';
  return `${key} ${direction}`;
}

exports.list = async (req, res, next) => {
  try {
    await introspect();
    const { page, limit, offset } = parsePaging(req);

    const where = [];
    const params = [];

    if (req.query.q) {
      params.push(`%${req.query.q}%`, `%${req.query.q}%`);
      where.push('(title ILIKE $' + (params.length - 1) + ' OR description ILIKE $' + params.length + ')');
    }
    if (req.query.min_price) {
      params.push(Number(req.query.min_price));
      where.push('price >= $' + params.length);
    }
    if (req.query.max_price) {
      params.push(Number(req.query.max_price));
      where.push('price <= $' + params.length);
    }
    if (req.query.category_id && has('category_id')) {
      params.push(Number(req.query.category_id));
      where.push('category_id = $' + params.length);
    }
    if (req.query.store_id && has('store_id')) {
      params.push(Number(req.query.store_id));
      where.push('store_id = $' + params.length);
    }
    if (req.query.status && has('status')) {
      params.push(String(req.query.status));
      where.push('status = $' + params.length);
    }
    if (req.query.userId && has('"userId"')) {
      params.push(Number(req.query.userId));
      where.push('"userId" = $' + params.length);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const orderSql = 'ORDER BY ' + buildSort(req.query.sort, req.query.dir);

    const baseSelectCols = ['id', 'title', 'description', 'price', '"createdAt"', '"userId"'];
    const fields = ['image_url', 'images_json', 'expiry_date', 'store_id', 'category_id', 'status',
                    'condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram',
                    'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location'];
    for (const f of fields) {
      if (has(f)) baseSelectCols.push(f);
      else if (has(`"${f}"`)) baseSelectCols.push(`"${f}"`);
    }

    const countSql = `SELECT COUNT(*)::INT AS count FROM deals ${whereSql}`;
    const dataSql = `SELECT ${baseSelectCols.join(', ')}
                     FROM deals
                     ${whereSql}
                     ${orderSql}
                     LIMIT ${limit} OFFSET ${offset}`;

    const [[countRow]] = await sequelize.query(countSql, { bind: params });
    const [rows] = await sequelize.query(dataSql, { bind: params });

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

exports.getById = async (req, res, next) => {
  try {
    await introspect();
    const id = Number(req.params.id);
    const baseSelectCols = ['id', 'title', 'description', 'price', '"createdAt"', '"userId"'];
    if (has('image_url')) baseSelectCols.push('image_url');
    if (has('images_json')) baseSelectCols.push('images_json');
    if (has('expiry_date')) baseSelectCols.push('expiry_date');
    if (has('store_id')) baseSelectCols.push('store_id');
    if (has('category_id')) baseSelectCols.push('category_id');
    if (has('status')) baseSelectCols.push('status');

    const sql = `SELECT ${baseSelectCols.join(', ')} FROM deals WHERE id = $1`;
    const [rows] = await sequelize.query(sql, { bind: [id] });
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    await introspect();
    const { 
      title, description, price, store_id, category_id, image_url, images_json, expiry_date, status,
      condition, brand, model, color, negotiable, screenSize, ram, mainCamera, selfieCamera, battery, internalStorage, state, city, location 
    } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const cols = ['title', 'description', 'price', '"userId"', '"createdAt"', '"updatedAt"'];
    const vals = ['$1', '$2', '$3', '$4', 'NOW()', 'NOW()'];
    const bind = [title, description || null, price, userId];
    let idx = 4;
    if (has('store_id') && typeof store_id !== 'undefined') { idx += 1; cols.push('store_id'); vals.push(`$${idx}`); bind.push(store_id); }
    if (has('category_id') && typeof category_id !== 'undefined') { idx += 1; cols.push('category_id'); vals.push(`$${idx}`); bind.push(category_id); }
    if (has('image_url') && typeof image_url !== 'undefined') { idx += 1; cols.push('image_url'); vals.push(`$${idx}`); bind.push(image_url); }
    if (has('images_json') && typeof images_json !== 'undefined') { idx += 1; cols.push('images_json'); vals.push(`$${idx}`); bind.push(images_json); }
    if (has('expiry_date') && typeof expiry_date !== 'undefined') { idx += 1; cols.push('expiry_date'); vals.push(`$${idx}`); bind.push(expiry_date); }
    if (has('status') && typeof status !== 'undefined') { idx += 1; cols.push('status'); vals.push(`$${idx}`); bind.push(status); }
    
    const extraFields = ['condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram', 'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location'];
    for (const f of extraFields) {
      if (has(f) && typeof req.body[f] !== 'undefined') {
        idx += 1;
        cols.push(f);
        vals.push(`$${idx}`);
        bind.push(req.body[f]);
      }
    }

    const sql = `INSERT INTO deals (${cols.join(', ')}) VALUES (${vals.join(', ')}) RETURNING id`;
    const [rows] = await sequelize.query(sql, { bind });
    const newId = rows[0].id;
    try {
      const [[dealRow]] = await sequelize.query(`SELECT id, title, price, category_id FROM deals WHERE id = $1`, { bind: [newId] });
      const { notifyAlertsForDeal } = require('../services/alertNotifier');
      const { sendGeneric } = require('../services/emailService');
      if (dealRow) {
        await notifyAlertsForDeal({ title: dealRow.title, price: dealRow.price, category_id: dealRow.category_id }, sendGeneric);
      }
    } catch (_) {}
    return res.status(201).json({ success: true, data: { id: newId } });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await introspect();
    const id = Number(req.params.id);
    const allowed = ['title', 'description', 'price'];
    if (has('store_id')) allowed.push('store_id');
    if (has('category_id')) allowed.push('category_id');
    if (has('image_url')) allowed.push('image_url');
    if (has('images_json')) allowed.push('images_json');
    if (has('expiry_date')) allowed.push('expiry_date');
    if (has('status')) allowed.push('status');
    const extraFields = ['condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram', 'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location'];
    for (const f of extraFields) {
      if (has(f)) allowed.push(f);
    }
    const sets = [];
    const bind = [];
    let idx = 0;
    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        idx += 1;
        sets.push(`${k} = $${idx}`);
        bind.push(req.body[k]);
      }
    }
    // Always update updatedAt
    sets.push('"updatedAt" = NOW()');
    if (sets.length === 1 && Object.keys(req.body).filter(k => allowed.includes(k)).length === 0) {
      return res.json({ success: true, message: 'No changes' });
    }
    // ownership check via WHERE clause on userId
    const userId = req.user && req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    bind.push(id);
    let sql;
    if (isAdmin) {
      sql = `UPDATE deals SET ${sets.join(', ')} WHERE id = $${bind.length} RETURNING id`;
    } else {
      bind.push(userId);
      sql = `UPDATE deals SET ${sets.join(', ')} WHERE id = $${bind.length - 1} AND "userId" = $${bind.length} RETURNING id`;
    }
    const [rows] = await sequelize.query(sql, { bind });
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Deal not found or not owned by user' });
    }
    return res.json({ success: true, data: { id: rows[0].id } });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user && req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    let sql, params;
    if (isAdmin) {
      sql = `DELETE FROM deals WHERE id = $1 RETURNING id`;
      params = [id];
    } else {
      sql = `DELETE FROM deals WHERE id = $1 AND "userId" = $2 RETURNING id`;
      params = [id, userId];
    }
    const [rows] = await sequelize.query(sql, { bind: params });
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Deal not found or not owned by user' });
    }
    return res.json({ success: true, message: 'Deal deleted' });
  } catch (err) {
    return next(err);
  }
};

exports.trending = async (req, res, next) => {
  try {
    await introspect();
    if (HAS_CLICK_EVENTS) {
      const [rows] = await sequelize.query(
        `SELECT d.id, d.title, d.description, d.price, d."createdAt", COUNT(c.id)::INT AS clicks
         FROM deals d
         JOIN click_events c ON c.deal_id = d.id
         WHERE c.clicked_at > NOW() - INTERVAL '7 days'
         GROUP BY d.id
         ORDER BY clicks DESC
         LIMIT 20`
      );
      return res.json({ success: true, data: rows });
    }
    const [rows] = await sequelize.query(
      `SELECT id, title, description, price, "createdAt"
       FROM deals
       ORDER BY "createdAt" DESC
       LIMIT 20`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.endingSoon = async (req, res, next) => {
  try {
    await introspect();
    if (has('expiry_date')) {
      const [rows] = await sequelize.query(
        `SELECT id, title, description, price, "createdAt", expiry_date
         FROM deals
         WHERE expiry_date IS NOT NULL AND expiry_date > NOW()
         ORDER BY expiry_date ASC
         LIMIT 20`
      );
      return res.json({ success: true, data: rows });
    }
    const [rows] = await sequelize.query(
      `SELECT id, title, description, price, "createdAt"
       FROM deals
       ORDER BY "createdAt" DESC
       LIMIT 20`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.newest = async (req, res, next) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT id, title, description, price, "createdAt"
       FROM deals
       ORDER BY "createdAt" DESC
       LIMIT 20`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};
