const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../telesalud.db');
const db = new sqlite3.Database(dbPath);

/*
 * Inicialización de la base de datos y actualización de contraseñas
 */
db.serialize(() => {
    const schema = fs.readFileSync(path.resolve(__dirname, '../schema.sql'), 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error("Error BD:", err.message);
        } else {
            console.log("Base de datos SQLite inicializada correctamente.");
            
            // Re-encriptar la contraseña '123456' para asegurar compatibilidad
            const defaultPassHash = bcrypt.hashSync('123456', 10);
            const usuariosBase = [
                [1, 'Admin Sistema', 'admin@hospital.com', defaultPassHash, 'ADMIN'],
                [2, 'Dr. Carlos Director', 'director@hospital.com', defaultPassHash, 'DIRECTOR'],
                [3, 'Dra. Ana López', 'medico@hospital.com', defaultPassHash, 'MEDICO'],
                [4, 'Técnico QFB Juan', 'lab@hospital.com', defaultPassHash, 'LABORATORIO']
            ];

            usuariosBase.forEach(u => {
                db.run(
                    `INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)
                     ON CONFLICT(id) DO UPDATE SET password = ?`,
                    [u[0], u[1], u[2], u[3], u[4], u[3]]
                );
            });
        }
    });
});

module.exports = db;