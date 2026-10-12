# Sistema Web de Gestión Hospitalaria para Telemedicina / Hospital Telemedicine Management System

Sistema web desarrollado para la administración de expedientes clínicos, control de solicitudes de laboratorio e intercambio de información médica mediante mensajes estandarizados HL7 v2.x (ADT^A08) en archivos .txt.

Web system developed for the administration of clinical records, control of laboratory requests, and medical information exchange using standardized HL7 v2.x (ADT^A08) messages in .txt files.

---

## 📸 Capturas de Pantalla e Interfaz / Screenshots & Interface

### Inicio de Sesión / Login
<p align="center">
  <img src="public/screenshots/login.png" width="90%" alt="Login">
</p>

### Módulo de Atención Médica / Medical Care Module
| Consulta Médica / Medical Consultation | Orden de Laboratorio / Lab Order |
| :---: | :---: |
| <img src="public/screenshots/medico-consulta.png" width="100%" /> | <img src="public/screenshots/medico-lab.png" width="100%" /> |

<div align="center">

| Registro de Nuevo Paciente / New Patient Registration |
| :---: |
| <img src="public/screenshots/medico-paciente.png" width="100%" /> |

</div>

### Panel de Administración Global / Global Administration Panel
| Usuarios Registrados / Registered Users | Gestión de Expedientes / Record Management |
| :---: | :---: |
| <img src="public/screenshots/admin-usuarios.png" width="100%" /> | <img src="public/screenshots/admin-expedientes.png" width="100%" /> |

<div align="center">

| Gestión de Solicitudes / Request Management |
| :---: |
| <img src="public/screenshots/admin-solicitudes.png" width="100%" /> |

</div>

### Dashboard de Dirección General / General Directorate Dashboard
<p align="center">
  <img src="public/screenshots/director.png" width="90%" alt="Director">
</p>

### Módulo de Laboratorio Clínico / Clinical Laboratory Module
<p align="center">
  <img src="public/screenshots/laboratorio.png" width="90%" alt="Laboratorio">
</p>

---

## 🛠️ Tecnologías Utilizadas / Tech Stack

- **Backend:** Node.js, Express.js
- **Base de Datos / Database:** SQLite3
- **Frontend:** HTML5, CSS3 (Glassmorphism / Layout Grid), JavaScript Vanilla
- **Autenticación / Authentication:** Express Session, Bcryptjs
- **Estándar Interoperabilidad / Interoperability Standard:** HL7 v2.x (ADT^A08)
- **Manejo de Archivos / File Management:** Multer (Importación/Exportación de mensajes HL7 en .TXT / HL7 .TXT message import/export)

---

## 🔑 Perfiles de Usuario y Credenciales de Prueba / User Profiles & Test Credentials

- **Contraseña predeterminada para todos los usuarios / Default password for all users:** `123456`

| Rol / Role | Correo de Acceso / Access Email | Descripción de Permisos / Permissions Description |
| :--- | :--- | :--- |
| **Administrador / Admin** | `admin@hospital.com` | Gestión de usuarios, expedientes y solicitudes de laboratorio. / User, record, and lab request management. |
| **Director General / Director** | `director@hospital.com` | Visualización de estadísticas hospitalarias y lectura de expedientes. / View hospital statistics and read records. |
| **Médico / Doctor** | `medico@hospital.com` | Alta de pacientes, historial clínico, solicitudes e importación/exportación HL7 v2.x. / Patient registration, clinical history, requests, and HL7 v2.x import/export. |
| **Laboratorio / Lab** | `lab@hospital.com` | Procesamiento de órdenes de análisis y captura de resultados. / Analysis order processing and results capture. |

---

## ⚙️ Instrucciones de Instalación y Ejecución / Installation & Execution Instructions

```bash
# 1. Clonar el repositorio / Clone the repository
git clone [https://github.com/Somohanito/Sistema-telesalud.git](https://github.com/Somohanito/Sistema-telesalud.git)
cd Sistema-telesalud

# 2. Instalar dependencias / Install dependencies
npm install

# 3. Ejecutar la aplicación / Run the application
npm start

```
   ## Author & Developer / Autor y Desarrollador
* **Ing. Axel Daniel Somohano Maldonado**
