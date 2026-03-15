/**
 * Sequelize database configuration
 * - Prefers PostgreSQL when DB_* env vars are provided
 * - Falls back to local SQLite (dev.sqlite) when not configured
 */
const path = require('path');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT = 5432,
  DATABASE_URL,
  POSTGRES_URL, // Vercel Postgres
  NODE_ENV = 'development',
  DB_DIALECT,
} = process.env;

let sequelize;

const isProduction = NODE_ENV === 'production';
const connectionString = DATABASE_URL || POSTGRES_URL;

if (connectionString) {
  // Use connection string (common for Neon, Supabase, Vercel Postgres)
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: !isProduction ? console.log : false,
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
    define: {
      underscored: false,
      freezeTableName: true,
    },
  });
} else if (DB_HOST && DB_USER && DB_NAME) {
  // Use individual credentials
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || '', {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: !isProduction ? console.log : false,
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
    define: {
      underscored: false,
      freezeTableName: true,
    },
  });
} else {
  const storage = path.join(__dirname, '..', 'dev.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: NODE_ENV === 'development' ? console.log : false,
    define: {
      underscored: false,
      freezeTableName: true,
    },
  });
}

module.exports = sequelize;

