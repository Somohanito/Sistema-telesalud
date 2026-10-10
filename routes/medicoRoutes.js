const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/database');
const { verificarSesion, permitirRoles } = require('../middleware/auth');
const upload = multer({ storage: multer.memoryStorage() });

router.use(verificarSesion, permitirRoles('MEDICO', 'ADMIN'));

/*
 * Registro de pacientes
 */
router.post('/pacientes', (req, res) => {
    const { nss, nombre, edad, sexo, direccion, telefono, estado_civil } = req.body;
    db.run(`INSERT INTO pacientes (nss, nombre, edad, sexo, direccion, telefono, estado_civil) VALUES (?,?,?,?,?,?,?)`,
        [nss, nombre, edad, sexo, direccion, telefono, estado_civil], function(err) {
            if (err) return res.status(400).json({ error: "NSS duplicado o datos inválidos" });
            res.json({ id: this.lastID });
        });
});

/*
 * Consulta general de pacientes
 */
router.get('/pacientes', (req, res) => {
    db.all(`SELECT * FROM pacientes`, [], (err, rows) => res.json(rows));
});

/*
 * Alta de expediente / consulta médica
 */
router.post('/expedientes', (req, res) => {
    const { paciente_id, motivo_consulta, diagnostico, tratamiento, notas } = req.body;
    const medico_id = req.session.usuario.id;
    db.run(`INSERT INTO expedientes (paciente_id, medico_id, motivo_consulta, diagnostico, tratamiento, notas) VALUES (?,?,?,?,?,?)`,
        [paciente_id, medico_id, motivo_consulta, diagnostico, tratamiento, notas], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ status: "Expediente guardado" });
        });
});

/*
 * Consultar Historial Médico de un Paciente
 */
router.get('/expedientes/:pacienteId', (req, res) => {
    db.all(`SELECT e.*, u.nombre as medico FROM expedientes e JOIN usuarios u ON e.medico_id = u.id WHERE e.paciente_id = ? ORDER BY e.id DESC`, 
        [req.params.pacienteId], (err, rows) => res.json(rows));
});

/*
 * Consultar Resultados de Laboratorio de un Paciente
 */
router.get('/resultados-lab/:pacienteId', (req, res) => {
    const query = `
        SELECT r.resultado, r.fecha_resultado, s.tipo_estudio, u.nombre as laboratorista
        FROM resultados_lab r
        JOIN solicitudes_lab s ON r.solicitud_id = s.id
        JOIN usuarios u ON r.laboratorista_id = u.id
        WHERE s.paciente_id = ?
        ORDER BY r.id DESC
    `;
    db.all(query, [req.params.pacienteId], (err, rows) => res.json(rows));
});

/*
 * Solicitud de estudio de laboratorio
 */
router.post('/solicitar-estudio', (req, res) => {
    const { paciente_id, tipo_estudio } = req.body;
    const medico_id = req.session.usuario.id;
    db.run(`INSERT INTO solicitudes_lab (paciente_id, medico_id, tipo_estudio) VALUES (?,?,?)`,
        [paciente_id, medico_id, tipo_estudio], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ status: "Solicitud generada" });
        });
});

/*
 * Exportación e Importación en Formato Estándar HL7 v2.x (.TXT)
 */
router.get('/exportar-txt/:pacienteId', (req, res) => {
    const pId = req.params.pacienteId;
    db.get(`SELECT * FROM pacientes WHERE id = ?`, [pId], (err, p) => {
        if (!p) return res.status(404).send("Paciente no encontrado");
        
        db.all(`SELECT * FROM expedientes WHERE paciente_id = ? ORDER BY id DESC`, [pId], (err, exps) => {
            const now = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
            
            // Encabezado MSH (Message Header)
            let hl7Msg = `MSH|^~\\&|TELESALUD_HIS|HOSPITAL_CENTRAL|MEDICO_APP|HOSPITAL_CENTRAL|${now}||ADT^A08|MSG${Date.now()}|P|2.3\n`;
            
            // Segmento PID (Patient Identification)
            hl7Msg += `PID|1||${p.nss}^^^NSS||${p.nombre.replace(/ /g, '^')}||${p.edad}|${p.sexo ? p.sexo.charAt(0) : 'U'}|||${p.direccion || ''}||${p.telefono || ''}||${p.estado_civil || ''}\n`;

            // Segmentos OBX (Observation/Result) para las consultas clínicas
            let obxIdx = 1;
            exps.forEach((e) => {
                hl7Msg += `OBX|${obxIdx++}|TX|MOTIVO^Motivo Consulta||${(e.motivo_consulta || '').replace(/\n/g, ' ')}||||||F\n`;
                hl7Msg += `OBX|${obxIdx++}|TX|DIAGNOSTICO^Diagnostico||${(e.diagnostico || '').replace(/\n/g, ' ')}||||||F\n`;
                hl7Msg += `OBX|${obxIdx++}|TX|TRATAMIENTO^Tratamiento||${(e.tratamiento || '').replace(/\n/g, ' ')}||||||F\n`;
                if (e.notas) {
                    hl7Msg += `OBX|${obxIdx++}|TX|NOTAS^Notas Clinicas||${e.notas.replace(/\n/g, ' ')}||||||F\n`;
                }
            });

            res.setHeader('Content-disposition', `attachment; filename=HL7_Expediente_${p.nss}.txt`);
            res.setHeader('Content-type', 'text/plain; charset=utf-8');
            res.write(hl7Msg);
            res.end();
        });
    });
});

/*
 * Decodificador de Mensajes HL7 v2.x desde archivo .TXT
 */
router.post('/importar-txt', upload.single('archivo'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Archivo no cargado" });
    
    const contenidoHL7 = req.file.buffer.toString('utf8');
    const lineas = contenidoHL7.split('\n');
    let lecturaEstructurada = "=== DECODIFICADOR DE MENSAJE HL7 v2.x ===\n\n";

    lineas.forEach(linea => {
        const campos = linea.trim().split('|');
        const tipoSegmento = campos[0];

        if (tipoSegmento === 'MSH') {
            lecturaEstructurada += `[ENCABEZADO MSH]\nEmisor: ${campos[2] || 'N/A'} | Tipo Mensaje: ${campos[8] || 'N/A'} | Fecha: ${campos[6] || 'N/A'}\n\n`;
        } else if (tipoSegmento === 'PID') {
            const nss = campos[3] ? campos[3].split('^')[0] : '';
            const nombre = campos[5] ? campos[5].replace(/\^/g, ' ') : '';
            lecturaEstructurada += `[DATOS PACIENTE - PID]\nNSS: ${nss}\nPaciente: ${nombre}\nEdad: ${campos[7] || ''}\nSexo: ${campos[8] || ''}\nDirección: ${campos[11] || ''}\nTeléfono: ${campos[13] || ''}\n\n`;
            lecturaEstructurada += `[DETALLES Y NOTAS CLÍNICAS]\n`;
        } else if (tipoSegmento === 'OBX') {
            const observacion = campos[3] ? campos[3].split('^')[1] || campos[3] : '';
            const valor = campos[5] || '';
            lecturaEstructurada += `  • ${observacion}: ${valor}\n`;
        }
    });

    res.json({ 
        rawHL7: contenidoHL7,
        contenidoParseado: lecturaEstructurada 
    });
});

module.exports = router;