const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

/*
 * Autenticación y control de sesión
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Usuario no encontrado" });
        
        if (bcrypt.compareSync(password, user.password)) {
            req.session.usuario = { id: user.id, nombre: user.nombre, rol: user.rol, email: user.email };
            return res.json({ status: "OK", rol: user.rol, usuario: req.session.usuario });
        } else {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ status: "OK" });
});

router.get('/session', (req, res) => {
    if (req.session.usuario) {
        res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
        res.json({ autenticado: false });
    }
});

module.exports = router;