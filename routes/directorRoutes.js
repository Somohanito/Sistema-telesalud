const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verificarSesion, permitirRoles } = require('../middleware/auth');

router.use(verificarSesion, permitirRoles('DIRECTOR', 'ADMIN'));

/*
 * Estadísticas e indicadores hospitalarios
 */
router.get('/estadisticas', (req, res) => {
    const stats = {};
    db.get(`SELECT COUNT(*) as totalPacientes FROM pacientes`, [], (err, row1) => {
        stats.totalPacientes = row1 ? row1.totalPacientes : 0;
        db.get(`SELECT COUNT(*) as totalEstudios FROM solicitudes_lab`, [], (err, row2) => {
            stats.totalEstudios = row2 ? row2.totalEstudios : 0;
            db.all(`SELECT tipo_estudio, COUNT(*) as cantidad FROM solicitudes_lab GROUP BY tipo_estudio`, [], (err, rows3) => {
                stats.estudiosPorTipo = rows3 || [];
                res.json(stats);
            });
        });
    });
});

module.exports = router;