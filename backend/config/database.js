/**
 * Sequelize database configuration
 * - Optimized for Vercel Postgres (Neon)
 * - Prioritizes official Vercel environment variables
 */
const path = require('path');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  DATABASE_URL,
  POSTGRES_URL,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT = 5432,
  POSTGRES_DATABASE,
  NODE_ENV = 'development',
} = process.env;

let sequelize;

const isProduction = NODE_ENV === 'production';

// Preference 1: Full Connection String (Recommended for Vercel/Neon)
const connectionString = DATABASE_URL || POSTGRES_URL;

if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: !isProduction ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Neon/Vercel Postgres
      },
    },
    define: {
      underscored: false,
      freezeTableName: true,
    },
  });
} 
// Preference 2: Individual Vercel-specific variables
else if (POSTGRES_HOST && POSTGRES_USER && POSTGRES_DATABASE) {
  sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, {
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: !isProduction ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      underscored: false,
      freezeTableName: true,
    },
  });
} 
// Fallback: Local SQLite (only for development if no PG vars present)
else {
  const storage = path.join(__dirname, '..', 'dev.sqlite');
  console.log('No PostgreSQL configuration found, falling back to SQLite:', storage);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: !isProduction ? console.log : false,
    define: {
      underscored: false,
      freezeTableName: true,
    },
  });
}

module.exports = sequelize;
