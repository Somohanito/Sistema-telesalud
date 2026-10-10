const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { verificarSesion, permitirRoles } = require('../middleware/auth');

router.use(verificarSesion, permitirRoles('ADMIN'));

/*
 * Gestión de Usuarios
 */
router.get('/usuarios', (req, res) => {
    db.all(`SELECT id, nombre, email, rol FROM usuarios`, [], (err, rows) => res.json(rows));
});

router.post('/usuarios', (req, res) => {
    const { nombre, email, password, rol } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    db.run(`INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)`, 
        [nombre, email, hash, rol], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, message: "Usuario creado" });
        });
});

router.delete('/usuarios/:id', (req, res) => {
    db.run(`DELETE FROM usuarios WHERE id = ?`, [req.params.id], (err) => res.json({ status: "Eliminado" }));
});

/*
 * Administración de Expedientes por parte del Administrador
 */
router.get('/expedientes-todos', (req, res) => {
    const query = `
        SELECT e.id, p.nombre as paciente, u.nombre as medico, e.fecha_ingreso, e.diagnostico 
        FROM expedientes e
        JOIN pacientes p ON e.paciente_id = p.id
        JOIN usuarios u ON e.medico_id = u.id
    `;
    db.all(query, [], (err, rows) => res.json(rows));
});

router.delete('/expedientes/:id', (req, res) => {
    db.run(`DELETE FROM expedientes WHERE id = ?`, [req.params.id], (err) => res.json({ status: "Expediente eliminado" }));
});

/*
 * Administración de Solicitudes de Laboratorio por parte del Administrador
 */
router.get('/solicitudes-todas', (req, res) => {
    const query = `
        SELECT s.id, p.nombre as paciente, s.tipo_estudio, s.estado, s.fecha_solicitud 
        FROM solicitudes_lab s
        JOIN pacientes p ON s.paciente_id = p.id
    `;
    db.all(query, [], (err, rows) => res.json(rows));
});

router.delete('/solicitudes/:id', (req, res) => {
    db.run(`DELETE FROM solicitudes_lab WHERE id = ?`, [req.params.id], (err) => res.json({ status: "Solicitud eliminada" }));
});

module.exports = router;