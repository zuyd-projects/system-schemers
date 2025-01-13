const { Sequelize } = require('sequelize');

// Connect to SQLite (can replace with PostgreSQL or MySQL)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './metamodel.db', // SQLite database file
    logging: false, // Disable logging for cleaner console output
});

module.exports = sequelize;