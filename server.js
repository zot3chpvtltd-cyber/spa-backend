require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const masterAdminRoutes = require('./routes/masterAdminRoutes');
const spaAdminRoutes = require('./routes/spaAdminRoutes');
const publicRoutes = require('./routes/publicRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/master-admin', masterAdminRoutes);
app.use('/api/admin', spaAdminRoutes);
app.use('/api', publicRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Thai Spa API (Node.js)' });
});

// Sync Database and Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // Sync only new models without altering existing tables
        await sequelize.sync({ alter: false });
        console.log('✅ Database synced.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

startServer();
