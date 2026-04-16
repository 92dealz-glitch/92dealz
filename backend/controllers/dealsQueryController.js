const sequelize = require('../config/database');
const currencyService = require('../services/currencyService');

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
    if (req.query.userId && (has('userId') || has('userid'))) {
      const col = has('userId') ? '"userId"' : 'userid';
      params.push(Number(req.query.userId));
      where.push(`${col} = $` + params.length);
    }
    if (req.query.state && has('state')) {
      params.push(String(req.query.state));
      where.push('state = $' + params.length);
    }
    if (req.query.city && has('city')) {
      params.push(String(req.query.city));
      where.push('city = $' + params.length);
    }
    if (req.query.location && has('location')) {
      params.push(String(req.query.location));
      where.push('location = $' + params.length);
    }
    if (req.query.today_only === 'true') {
      where.push('deals."createdAt" >= CURRENT_DATE');
    }
    // Filter out expired ads for public listing
    where.push("(deals.active_until IS NULL OR deals.active_until > NOW())");

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
                    'subcategory', 'specifications', 'plan_type'];
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
                     ORDER BY 
                       (CASE 
                          WHEN deals.plan_type = 'star' AND u.star_plan_expires_at > NOW() THEN 1 
                          WHEN deals.plan_type = 'basic' AND u.basic_plan_expires_at > NOW() THEN 2 
                          ELSE 3 
                        END) ASC,
                       u.is_verified DESC, 
                       ${orderSql.replace('ORDER BY ', '')}
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

    // --- Subscription Plan Logic & Limits ---
    const [[user]] = await sequelize.query(
      `SELECT subscription_plan, basic_plan_expires_at, star_plan_expires_at, premium_plan_expires_at, extra_slots_purchased, country_code FROM users WHERE id = $1`, 
      { bind: [userId] }
    );
    
    const targetPlanType = req.body.plan_type || 'free';
    const now = new Date();
    
    // Validate authorization for paid tiers based on specific expiries
    if (targetPlanType === 'basic') {
      const isExpired = !user.basic_plan_expires_at || new Date(user.basic_plan_expires_at) < now;
      if (isExpired) {
        return res.status(403).json({ success: false, message: 'Your Featured (Basic) subscription has expired. Please renew to post Featured ads.' });
      }
    } else if (targetPlanType === 'star') {
      const isExpired = !user.star_plan_expires_at || new Date(user.star_plan_expires_at) < now;
      if (isExpired) {
        return res.status(403).json({ success: false, message: 'Your Premium (Star) subscription has expired. Please renew to post Premium ads.' });
      }
    } else if (targetPlanType === 'premium') {
      const isExpired = !user.premium_plan_expires_at || new Date(user.premium_plan_expires_at) < now;
      if (isExpired) {
        return res.status(403).json({ success: false, message: 'Your Ultimate (Premium) subscription has expired. Please renew to post Ultimate ads.' });
      }
    }

    // Chinese Vendor Restriction: No Free Tier
    const isChina = user.country_code === 'CN';
    if (isChina && targetPlanType === 'free') {
      return res.status(403).json({ success: false, message: 'Chinese vendors must purchase a plan to list products. Free tier is not available in your region.' });
    }

    // Check monthly limit specifically for the chosen plan tier
    const [countRes] = await sequelize.query(
      `SELECT COUNT(*)::INT as count FROM deals WHERE "userId" = $1 AND plan_type = $2 AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [userId, targetPlanType] }
    );
    const existingCount = countRes[0].count;
    
    // Dynamic limits: Free tier can have extra slots purchased via Starter add-on
    const limits = { 
      free: 1 + (Number(user.extra_slots_purchased) || 0), 
      basic: 10, 
      star: 20,
      premium: 1000000 
    };

    if (existingCount >= limits[targetPlanType]) {
      return res.status(403).json({ 
        success: false, 
        message: `Limit exceeded for ${targetPlanType} slot. Your current monthly capacity for this tier is ${limits[targetPlanType]} ad(s).` 
      });
    }

    // Currency Handling
    const originalCurrency = req.body.originalCurrency || 'NGN';
    const finalPrice = await currencyService.convertToBase(Number(price), originalCurrency);

    const cols = ['title', 'description', 'price', '"userId"', '"createdAt"', '"updatedAt"', 'status', 'plan_type', 'active_until'];
    const vals = ['$1', '$2', '$3', '$4', 'NOW()', 'NOW()', '$5', '$6', "NOW() + INTERVAL '30 days'"];
    
    // Always default to pending for non-admins during initial creation
    const isAdmin = req.user && req.user.role === 'admin';
    const initialStatus = isAdmin && req.body.status ? req.body.status : 'pending';
    
    const bind = [title, description || null, finalPrice, userId, initialStatus, targetPlanType];
    let idx = 6;
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

    // Preserve original price/currency
    if (has('originalPrice')) { idx += 1; cols.push('"originalPrice"'); vals.push(`$${idx}`); bind.push(Number(price)); }
    if (has('originalCurrency')) { idx += 1; cols.push('"originalCurrency"'); vals.push(`$${idx}`); bind.push(originalCurrency); }
    
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
    const extraFields = ['condition', 'brand', 'model', 'color', 'negotiable', 'screenSize', 'ram', 'mainCamera', 'selfieCamera', 'battery', 'internalStorage', 'state', 'city', 'location', 'subcategory', 'specifications', 'active_until'];
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
        if (k === 'active_until' && value === 'reset') {
          sets.push(`active_until = NOW() + INTERVAL '30 days'`);
          sets.push(`"createdAt" = NOW()`); // Bump to top
          continue; 
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

        // Handle Price update with currency conversion
        if (k === 'price') {
           const originalPrice = Number(value);
           const originalCurrency = req.body.originalCurrency || 'NGN';
           value = await currencyService.convertToBase(originalPrice, originalCurrency);
           
           // Also update original fields if they exist
           if (has('originalPrice')) {
              // We'll add them to the sets manually here to be safe
              idx += 1;
              sets.push(`"originalPrice" = $${idx}`);
              bind.push(originalPrice);
           }
           if (has('originalCurrency')) {
              idx += 1;
              sets.push(`"originalCurrency" = $${idx}`);
              bind.push(originalCurrency);
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

    // Check strict deletion rule
    let fetchSql;
    if (isAdmin) {
      fetchSql = `SELECT id, is_contacted, status, is_locked FROM deals WHERE id = $1`;
    } else {
      fetchSql = `SELECT id, is_contacted, status, is_locked FROM deals WHERE id = $1 AND "userId" = $2`;
    }
    const [existing] = await sequelize.query(fetchSql, { bind: isAdmin ? [id] : [id, userId] });
    
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Deal not found or not owned by user' });
    }
    
    const deal = existing[0];
    
    if (deal.is_contacted || deal.status === 'sold' || deal.is_locked) {
      // Lock it instead of deleting
      await sequelize.query(
        `UPDATE deals SET status = 'closed', is_locked = true, "updatedAt" = NOW() WHERE id = $1`,
        { bind: [id] }
      );
      return res.json({ success: true, message: 'Product has been locked as it was previously contacted or sold.' });
    } else {
      // Hard delete
      await sequelize.query(`DELETE FROM deals WHERE id = $1`, { bind: [id] });
      return res.json({ success: true, message: 'Deal deleted completely.' });
    }
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

    const where = ['d.status = \'active\'', 'u.status = \'active\''];
    // Trending Ads visibility: Compulsory to have at least Basic or Star plan
    where.push("d.plan_type IN ('basic', 'star')");

    const params = [];
    if (req.query.location && has('location')) {
      params.push(String(req.query.location));
      where.push(`d.location = $${params.length}`);
    }
    if (req.query.state && has('state')) {
      params.push(String(req.query.state));
      where.push(`d.state = $${params.length}`);
    }
    if (req.query.city && has('city')) {
      params.push(String(req.query.city));
      where.push(`d.city = $${params.length}`);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

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
         ${whereSql}
         ORDER BY clicks DESC, d."createdAt" DESC
         LIMIT 20`,
         { bind: params }
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

exports.featured = async (req, res, next) => {
  try {
    await introspect();
    const selectCols = ['d.id', 'd.title', 'd.description', 'd.price', 'd."createdAt"', 'd."userId"', 'd.image_url', 'd.plan_type'];
    const [rows] = await sequelize.query(
      `SELECT ${selectCols.join(', ')}, u.rating, u.is_verified, 
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id) AS clicks
       FROM deals d
       JOIN users u ON u.id = d."userId"
       WHERE d.status = 'active' AND u.status = 'active' AND d.plan_type = 'star'
       ORDER BY RANDOM()
       LIMIT 4`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.hotDeals = async (req, res, next) => {
  try {
    await introspect();
    const [rows] = await sequelize.query(
      `SELECT d.id, d.title, d.price, d.image_url, d.location, d.state, d.city, d.condition,
              u.rating, u.is_verified,
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id) AS clicks
       FROM deals d
       JOIN users u ON u.id = d."userId"
       WHERE d.status = 'active' AND u.status = 'active' AND d.plan_type = 'star'
       ORDER BY d."createdAt" DESC
       LIMIT 10`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};
