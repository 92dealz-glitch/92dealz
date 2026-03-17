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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
require('./models/PendingRegistration');
require('./models/Message');
require('./models/Order');
require('./models/Notification');

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
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketerRoutes = require('./routes/marketerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

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
registerRoutes('/orders', orderRoutes);
registerRoutes('/notifications', notificationRoutes);

// Error handling middleware (registered after routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const START_PORT = Number(process.env.PORT || 5001);

// Sync all environments for now to ensure new tables exist
sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Database sync failed:', err));

app.listen(START_PORT, () => {
  console.log(`Server listening on http://localhost:${START_PORT}`);
});

module.exports = app; // For Vercel
