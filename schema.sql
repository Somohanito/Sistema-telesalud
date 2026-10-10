CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT CHECK(rol IN ('ADMIN', 'DIRECTOR', 'MEDICO', 'LABORATORIO')) NOT NULL
);

CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nss TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    edad INTEGER NOT NULL,
    sexo TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    estado_civil TEXT
);

CREATE TABLE IF NOT EXISTS expedientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    medico_id INTEGER NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT NOT NULL,
    diagnostico TEXT,
    tratamiento TEXT,
    notas TEXT,
    FOREIGN KEY(paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY(medico_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS solicitudes_lab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    medico_id INTEGER NOT NULL,
    tipo_estudio TEXT NOT NULL,
    estado TEXT DEFAULT 'PENDIENTE',
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY(medico_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS resultados_lab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solicitud_id INTEGER NOT NULL,
    laboratorista_id INTEGER NOT NULL,
    resultado TEXT NOT NULL,
    fecha_resultado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(solicitud_id) REFERENCES solicitudes_lab(id),
    FOREIGN KEY(laboratorista_id) REFERENCES usuarios(id)
);

INSERT OR IGNORE INTO usuarios (id, nombre, email, password, rol) VALUES 
(1, 'Admin Sistema', 'admin@hospital.com', '$2a$10$wT8K0pP9XvC4L5L/zE2e.eS4G5X1QW9mKzR5G0A5X2W3Y4Z5A6B7C', 'ADMIN'),
(2, 'Dr. Carlos Director', 'director@hospital.com', '$2a$10$wT8K0pP9XvC4L5L/zE2e.eS4G5X1QW9mKzR5G0A5X2W3Y4Z5A6B7C', 'DIRECTOR'),
(3, 'Dra. Ana López', 'medico@hospital.com', '$2a$10$wT8K0pP9XvC4L5L/zE2e.eS4G5X1QW9mKzR5G0A5X2W3Y4Z5A6B7C', 'MEDICO'),
(4, 'Técnico QFB Juan', 'lab@hospital.com', '$2a$10$wT8K0pP9XvC4L5L/zE2e.eS4G5X1QW9mKzR5G0A5X2W3Y4Z5A6B7C', 'LABORATORIO');