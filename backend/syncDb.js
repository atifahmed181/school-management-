require('dotenv').config();
const { sequelize } = require('./src/models');

async function syncDatabase() {
  try {
    // This will create all tables based on our models
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
