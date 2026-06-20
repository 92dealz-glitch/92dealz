/**
 * Entry point for the Express server
 * - Reloaded with Gmail SMTP configurations
 * - Loads environment variables
 * - Configures middleware (CORS, body-parser, morgan)
 * - Connects to PostgreSQL via Sequelize
 * - Registers routes and centralized error handling
 */
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5173',
  'https://92dealz.vercel.app',
  'https://www.92dealz.vercel.app',
  'https://92dealz.com',
  'https://www.92dealz.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.options('*', cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware - Exclude webhook to allow raw buffer parsing
app.use((req, res, next) => {
  if (req.originalUrl.includes('/payments/webhook')) {
    next();
  } else {
    bodyParser.json({ limit: '50mb' })(req, res, next);
  }
});
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => res.send('92Dealz API Server Running'));

// Database
const sequelize = require('./config/database');

// Register models BEFORE syncing
require('./models/userModel');
require('./models/Deal');
require('./models/Category');
require('./models/Store');
require('./models/Favorite');
require('./models/PasswordReset');
require('./models/Alert');
require('./models/ClickEvent');
require('./models/Submission');
require('./models/PendingRegistration');
require('./models/Message');
require('./models/Order');
require('./models/Notification');
require('./models/Review');
require('./models/Report');
require('./models/Visitor');
require('./models/Payment'); // ADDED PAYMENT MODEL

// Routes
const forceSchemaFix = require('./force_schema_fix');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const dealRoutes = require('./routes/dealRoutes');
const adsRoutes = require('./routes/adsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const storeRoutes = require('./routes/storeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const searchRoutes = require('./routes/searchRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminRoutes = require('./routes/adminRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketerRoutes = require('./routes/marketerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const staffRoutes = require('./routes/staffRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // ADDED PAYMENT ROUTES

// Helper to register routes with and without /api prefix
function registerRoutes(prefix, router) {
  app.use(`/api${prefix}`, router);
  app.use(prefix, router);
}

registerRoutes('/users', userRoutes);
registerRoutes('/auth', authRoutes);
registerRoutes('/deals', dealRoutes);
registerRoutes('/ads', adsRoutes);
registerRoutes('/categories', categoryRoutes);
registerRoutes('/stores', storeRoutes);
registerRoutes('/favorites', favoriteRoutes);
registerRoutes('/search', searchRoutes);
registerRoutes('/alerts', alertRoutes);
registerRoutes('/admin', adminRoutes);
registerRoutes('/staff', staffRoutes);
registerRoutes('/submissions', submissionRoutes);
registerRoutes('/uploads', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
registerRoutes('/messages', messageRoutes);
registerRoutes('/vendor', vendorRoutes);
registerRoutes('/analytics', analyticsRoutes);
registerRoutes('/marketer', marketerRoutes);
registerRoutes('/orders', orderRoutes);
registerRoutes('/notifications', notificationRoutes);
registerRoutes('/reviews', reviewRoutes);
registerRoutes('/currency', currencyRoutes);
registerRoutes('/payments', paymentRoutes); // ADDED PAYMENT ROUTER

// Error handling middleware (registered after routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const START_PORT = Number(process.env.PORT || 5001);

// Sync all environments for now to ensure new tables exist
const listenWithFallback = async (port, maxAttempts = 5) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const srv = app.listen(port, () => resolve(srv));
        srv.on('error', reject);
      });
      console.log(`✅ Server listening on http://localhost:${port}`);
      return;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} in use – trying ${port + 1}…`);
        port++;
      } else {
        throw err;
      }
    }
  }
  throw new Error('❌ All attempted ports are busy');
};

const isSqlite = sequelize.options.dialect === 'sqlite';
sequelize.sync()
  .then(async () => {
    console.log('✅ Database synchronized');
    await forceSchemaFix();
    await listenWithFallback(START_PORT);
  })
  .catch(err => console.error('❌ Database sync failed:', err));

module.exports = app; // For Vercel
