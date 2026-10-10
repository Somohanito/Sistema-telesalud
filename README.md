# Sistema Web de Gestión Hospitalaria para Telemedicina

Sistema web desarrollado para la administración de expedientes clínicos, control de solicitudes de laboratorio e intercambio de información médica mediante archivos de texto plano (.TXT).

## Capturas de Pantalla e Interfaz del Sistema

### Inicio de Sesión
![Login](public/screenshots/login.jpg)

### Módulo de Atención Médica
| Consulta Médica | Orden de Laboratorio |
| :---: | :---: |
| ![Consulta](public/screenshots/medico-consulta.jpg) | ![Orden Lab](public/screenshots/medico-lab.jpg) |

| Registro de Nuevo Paciente |
| :---: |
| ![Nuevo Paciente](public/screenshots/medico-paciente.jpg) |

### Panel de Administración Global
| Usuarios Registrados | Gestión de Expedientes |
| :---: | :---: |
| ![Usuarios](public/screenshots/admin-usuarios.jpg) | ![Expedientes](public/screenshots/admin-expedientes.jpg) |

| Gestión de Solicitudes |
| :---: |
| ![Solicitudes](public/screenshots/admin-solicitudes.jpg) |

### Dashboard de Dirección General
![Director General](public/screenshots/director.jpg)

### Módulo de Laboratorio Clínico
![Laboratorio](public/screenshots/laboratorio.jpg)

---

## Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Base de Datos:** SQLite3
* **Frontend:** HTML5, CSS3 (Glassmorphism / Layout Grid), JavaScript Vanilla
* **Autenticación:** Express Session, Bcryptjs
* **Manejo de Archivos:** Multer (Importación/Exportación .TXT)

---

## Perfiles de Usuario y Credenciales de Prueba

* **Contraseña predeterminada para todos los usuarios:** `123456`

| Rol | Correo de Acceso | Descripción de Permisos |
| :--- | :--- | :--- |
| **Administrador** | `admin@hospital.com` | Gestión de usuarios, expedientes y solicitudes de laboratorio. |
| **Director General** | `director@hospital.com` | Visualización de estadísticas hospitalarias y lectura de expedientes. |
| **Médico** | `medico@hospital.com` | Alta de pacientes, historial clínico, solicitudes e importación/exportación .TXT. |
| **Laboratorio** | `lab@hospital.com` | Procesamiento de órdenes de análisis y captura de resultados. |

---

## Instrucciones de Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/TU_USUARIO/Sistema-telesalud.git](https://github.com/TU_USUARIO/Sistema-telesalud.git)
   cd Sistema-telesalud