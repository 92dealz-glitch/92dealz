const sequelize = require('../config/database');

let DEALS_COLUMNS = null;
let HAS_CLICK_EVENTS = null;

async function introspect() {
  if (!DEALS_COLUMNS) {
    const [cols] = await sequelize.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name ILIKE 'deals'`
    );
    DEALS_COLUMNS = new Set(cols.map(c => c.column_name));
    console.log(`[DealsIntrospect] Found ${DEALS_COLUMNS.size} columns for deals table.`);
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
    if (req.query.category_id) {
      const cid = Number(req.query.category_id);
      if (!isNaN(cid)) {
        params.push(cid);
        const pIdx = params.length;
        // Apply filter more certainly
        console.log(`[DealsListSQL] Targeting category_id: $${pIdx} = ${cid}`);
        where.push(`category_id = $${pIdx}`);
      }
    }
    if (req.query.store_id && has('store_id')) {
      params.push(Number(req.query.store_id));
      where.push('store_id = $' + params.length);
    }
    if (req.query.category_name && has('category_id')) {
      // Join with categories table to filter by name
      where.push(`category_id IN (SELECT id FROM categories WHERE name ILIKE $${params.length + 1})`);
      params.push(String(req.query.category_name));
    }
    if (req.query.subcategory && has('subcategory')) {
      params.push(String(req.query.subcategory));
      where.push('subcategory = $' + params.length);
    }
    if (req.query.userId && has('"userId"')) {
      params.push(Number(req.query.userId));
      where.push('"userId" = $' + params.length);
    }

    // Default to active status if not specified
    if (req.query.status && has('status')) {
      params.push(String(req.query.status));
      where.push('deals.status = $' + params.length);
    } else if (has('status')) {
      // If no status is requested, we strongly default to active for public safety
      params.push('active');
      where.push('deals.status = $' + params.length);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    let orderSql = 'ORDER BY ' + buildSort(req.query.sort, req.query.dir);
    if (req.query.random === 'true') {
      orderSql = 'ORDER BY RANDOM()';
    }

    const baseSelectCols = ['id', 'title', 'description', 'price', '"createdAt"', '"userId"'];
    const fields = ['image_url', 'images_json', 'expiry_date', 'store_id', 'category_id', 'status',
                    'condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram',
                    'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location',
                    'subcategory', 'specifications'];
    for (const f of fields) {
      if (has(f)) {
        // Quote if it's camelCase (contains uppercase letters)
        const quoted = /[A-Z]/.test(f) ? `"${f}"` : f;
        baseSelectCols.push(quoted);
      }
    }

    const countSql = `SELECT COUNT(*)::INT AS count FROM deals JOIN users u ON u.id = deals."userId" ${whereSql}${whereSql ? ' AND ' : 'WHERE '}u.status = 'active'`;
    const dataSql = `SELECT ${baseSelectCols.map(c => c.includes('"') ? `deals.${c}` : `deals.${c}`).join(', ')}, 
                     u.rating AS rating,
                     u.is_verified AS is_verified,
                     (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = deals.id) AS clicks
                     FROM deals
                     JOIN users u ON u.id = deals."userId"
                     ${whereSql}${whereSql ? ' AND ' : 'WHERE '}u.status = 'active'
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
    const selectCols = ['id', 'title', 'description', 'price', '"createdAt"', '"userId"'];
    const fields = ['image_url', 'images_json', 'expiry_date', 'store_id', 'category_id', 'status',
                    'condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram',
                    'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location',
                    'subcategory', 'specifications'];
    for (const f of fields) {
      if (has(f)) {
        const quoted = /[A-Z]/.test(f) ? `"${f}"` : f;
        selectCols.push(quoted);
      }
    }
    const sql = `SELECT ${selectCols.join(', ')}, 
                 (SELECT rating FROM users u WHERE u.id = deals."userId") AS rating,
                 (SELECT is_verified FROM users u WHERE u.id = deals."userId") AS is_verified,
                 (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = deals.id) AS clicks
                 FROM deals WHERE id = $1`;
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
    const cols = ['title', 'description', 'price', '"userId"', '"createdAt"', '"updatedAt"', 'status'];
    const vals = ['$1', '$2', '$3', '$4', 'NOW()', 'NOW()', '$5'];
    
    // Always default to pending for non-admins during initial creation
    const isAdmin = req.user && req.user.role === 'admin';
    const initialStatus = isAdmin && req.body.status ? req.body.status : 'pending';
    
    const bind = [title, description || null, price, userId, initialStatus];
    let idx = 5;
    if (has('store_id') && typeof store_id !== 'undefined') { idx += 1; cols.push('store_id'); vals.push(`$${idx}`); bind.push(store_id); }
    if (has('category_id') && typeof category_id !== 'undefined') { idx += 1; cols.push('category_id'); vals.push(`$${idx}`); bind.push(category_id); }
    if (has('image_url') && typeof image_url !== 'undefined') { idx += 1; cols.push('image_url'); vals.push(`$${idx}`); bind.push(image_url); }
    if (has('images_json') && typeof images_json !== 'undefined') { 
      idx += 1; 
      cols.push('images_json'); 
      vals.push(`$${idx}`); 
      bind.push(typeof images_json === 'string' ? images_json : JSON.stringify(images_json)); 
    }
    if (has('expiry_date') && typeof expiry_date !== 'undefined') { idx += 1; cols.push('expiry_date'); vals.push(`$${idx}`); bind.push(expiry_date); }
    
    const extraFields = ['condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram', 'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location', 'subcategory', 'specifications'];
    for (const f of extraFields) {
      if (has(f) && typeof req.body[f] !== 'undefined') {
        idx += 1;
        const colName = /[A-Z]/.test(f) ? `"${f}"` : f;
        cols.push(colName);
        vals.push(`$${idx}`);
        
        let value = req.body[f];
        if (f === 'specifications' && typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        if (f === 'status') {
          // If we already handled status efficiently above for create, we can skip it here
          // but we ensure 'value' is safe just in case it were to be added to cols
          const allowedStatus = ['active', 'sold', 'draft', 'closed', 'pending', 'rejected'];
          if (!allowedStatus.includes(value)) value = 'pending';
          continue; // Already handled status in base cols
        }
        bind.push(value);
      }
    }
    
    // images_json special handling if not in extraFields loop correctly
    if (has('images_json') && typeof images_json !== 'undefined') {
       // already handled in bind construction if it was in the loop, but bind index is tricky.
       // The original code handled it at line 170. Let's fix it there.
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
    const extraFields = ['condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram', 'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location', 'subcategory', 'specifications'];
    for (const f of extraFields) {
      if (has(f)) allowed.push(f);
    }
    const sets = [];
    const bind = [];
    let idx = 0;
    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        idx += 1;
        const colName = /[A-Z]/.test(k) ? `"${k}"` : k;
        sets.push(`${colName} = $${idx}`);
        
        let value = req.body[k];
        if ((k === 'specifications' || k === 'images_json') && typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        if (k === 'status') {
          const allowedStatus = ['active', 'sold', 'draft', 'closed', 'pending', 'rejected'];
          if (!allowedStatus.includes(value)) value = 'pending';
          
          // Role-based enforcement
          const isAdmin = req.user && req.user.role === 'admin';
          if (!isAdmin && (value === 'active' || value === 'rejected')) {
             value = 'pending'; // Force re-approval if non-admin tries to set active/rejected
          }
        }
        bind.push(value);
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
    const selectCols = ['d.id', 'd.title', 'd.description', 'd.price', 'd."createdAt"', 'd."userId"'];
    const fields = ['image_url', 'images_json', 'expiry_date', 'store_id', 'category_id', 'status',
                    'condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram',
                    'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location',
                    'subcategory', 'specifications'];
    for (const f of fields) {
      if (has(f)) {
        const quoted = /[A-Z]/.test(f) ? `d."${f}"` : `d.${f}`;
        selectCols.push(quoted);
      }
    }
    if (HAS_CLICK_EVENTS) {
      const [rows] = await sequelize.query(
        `SELECT ${selectCols.join(', ')}, COALESCE(counts.clicks, 0) AS clicks,
                u.rating AS rating,
                u.is_verified AS is_verified
         FROM deals d
         JOIN users u ON u.id = d."userId"
         LEFT JOIN (
           SELECT deal_id, COUNT(id) AS clicks
           FROM click_events
           WHERE clicked_at > NOW() - INTERVAL '24 hours'
           GROUP BY deal_id
         ) counts ON counts.deal_id = d.id
         WHERE d.status = 'active' AND u.status = 'active'
         ORDER BY clicks DESC, d."createdAt" DESC
         LIMIT 20`
      );
      return res.json({ success: true, data: rows });
    }
  } catch (err) {
    return next(err);
  }
};

exports.endingSoon = async (req, res, next) => {
  try {
    await introspect();
    if (has('expiry_date')) {
      const [rows] = await sequelize.query(
        `SELECT id, title, description, price, "createdAt", expiry_date, (SELECT rating FROM users u WHERE u.id = deals."userId") AS rating
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
