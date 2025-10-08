const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: 'postgres', // Connect to default database first
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  dialect: 'postgres'
});

async function createDatabase() {
  try {
    await sequelize.query('CREATE DATABASE school_mgmt');
    console.log('Database "school_mgmt" created successfully');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await sequelize.close();
  }
}

createDatabase();
