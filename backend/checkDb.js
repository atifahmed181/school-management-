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

async function checkDatabase() {
  try {
    // Try connecting to PostgreSQL
    await sequelize.authenticate();
    console.log('Successfully connected to PostgreSQL');

    // Check if our database exists
    const [results] = await sequelize.query(
      "SELECT datname FROM pg_database WHERE datname = 'school_mgmt'"
    );
    
    if (results.length > 0) {
      console.log('Database "school_mgmt" exists');
    } else {
      console.log('Database "school_mgmt" does not exist');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();
