const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verificarSesion, permitirRoles } = require('../middleware/auth');

router.use(verificarSesion, permitirRoles('LABORATORIO', 'ADMIN'));

/*
 * Gestión de solicitudes y registros de laboratorio
 */
router.get('/solicitudes', (req, res) => {
    const query = `
        SELECT s.id, s.tipo_estudio, s.estado, s.fecha_solicitud, p.nombre as paciente, u.nombre as medico
        FROM solicitudes_lab s
        JOIN pacientes p ON s.paciente_id = p.id
        JOIN usuarios u ON s.medico_id = u.id
        ORDER BY s.id DESC
    `;
    db.all(query, [], (err, rows) => res.json(rows));
});

router.post('/resultados', (req, res) => {
    const { solicitud_id, resultado } = req.body;
    const lab_id = req.session.usuario.id;

    db.run(`INSERT INTO resultados_lab (solicitud_id, laboratorista_id, resultado) VALUES (?,?,?)`,
        [solicitud_id, lab_id, resultado], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            db.run(`UPDATE solicitudes_lab SET estado = 'COMPLETADO' WHERE id = ?`, [solicitud_id], () => {
                res.json({ status: "Resultado registrado" });
            });
        });
});

module.exports = router;