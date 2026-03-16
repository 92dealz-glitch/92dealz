/**
 * Entry point for the Express server
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

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// CORS configuration (support comma-separated list, sanitized for matching)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3005')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, "")); // Remove trailing slashes for exact match

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or local curl)
      if (!origin) return callback(null, true);

      // Regex to allow any 234deals related domain or localhost
      const isAllowed = /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?|https:\/\/([a-z0-9-]+\.)?vercel\.app|https:\/\/234deals\.online)$/i.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
  })
);

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('234Deals API Server Running'));

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
require('./models/Message');

// Routes
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
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketerRoutes = require('./routes/marketerRoutes');

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
registerRoutes('/submissions', submissionRoutes);
registerRoutes('/uploads', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
registerRoutes('/messages', messageRoutes);
registerRoutes('/vendor', vendorRoutes);
registerRoutes('/analytics', analyticsRoutes);
registerRoutes('/marketer', marketerRoutes);

// Error handling middleware (registered after routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const START_PORT = Number(process.env.PORT || 5001);

async function startServer(port) {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    }).on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer(START_PORT);
