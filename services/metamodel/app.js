const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Add morgan
const sequelize = require('./database');
const metamodelRoutes = require('./routes/metamodel');

const app = express();
const PORT = 5005;

// Middleware
app.use(morgan('combined')); // Logs requests in Apache combined format
app.use(bodyParser.json());

// Routes
app.use('/api', metamodelRoutes);

// Sync database and start server
(async () => {
    try {
        await sequelize.sync(); // Creates tables if not already present
        console.log('Database connected successfully!');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    }
})();