require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'telesalud_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

/*
 * Redirección de la raíz al login
 */
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

/*
 * Módulos de rutas del sistema
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/director', require('./routes/directorRoutes'));
app.use('/api/medico', require('./routes/medicoRoutes'));
app.use('/api/lab', require('./routes/labRoutes'));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});