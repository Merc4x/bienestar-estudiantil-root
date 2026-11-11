# 🎓 Bienestar Estudiantil — Root | Tecnológico de Antioquia (TdeA)

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_API-339933?logo=node.js&logoColor=white)

🔗 **Demo en vivo (GitHub Pages):** [https://merc4x.github.io/bienestar-estudiantil-root/](https://merc4x.github.io/bienestar-estudiantil-root/)

---

## 📌 ¿Para qué sirve este proyecto?

**Bienestar Estudiantil — Root** es una plataforma web integral diseñada para gestionar los servicios de bienestar universitario del **Tecnológico de Antioquia (TdeA)**.

Su propósito es centralizar en un solo sistema la reserva de citas médicas y psicológicas, la inscripción a eventos culturales y deportivos, el seguimiento clínico confidencial por parte de los especialistas y la supervisión administrativa y estadística de la institución.

---

## 👥 Módulos y Funcionalidades por Rol

### 1. 🎓 Estudiante
- **Dashboard Personal:** Resumen en tiempo real de citas activas, actividades inscritas, notificaciones y accesos rápidos.
- **Catálogo de Servicios:** Búsqueda y filtrado por categoría (*Psicología, Salud/Medicina, Deportes y Cultura*).
- **Directorio de Profesionales:** Consulta de especialistas activos y visualización de sus horarios disponibles.
- **Asistente de Solicitud de Citas (Wizard de 4 pasos):** Selección guiada de servicio y profesional → fecha en calendario → franja horaria disponible → confirmación con bloqueo automático de cupo.
- **Gestión de Mis Citas:** Historial cronológico, filtrado por estado y cancelación con registro obligatorio de motivo.
- **Actividades y Talleres:** Inscripción en línea con barra de progreso de aforo en tiempo real y gestión de inscripciones.
- **Perfil y Seguridad:** Actualización de datos personales/académicos y cambio de contraseña.

### 2. 🩺 Profesional
- **Agenda Profesional:** Indicadores de citas activas, completadas, atenciones registradas y seguimientos.
- **Gestión de Disponibilidad:** Creación, edición y bloqueo de fechas y franjas horarias de atención (validando que no existan citas activas antes de bloquear).
- **Gestión y Reasignación de Citas:** Actualización de estados (*Programada, Confirmada, Atendida, Completada, Cancelada*), notas de observación y reprogramación de fecha/hora/profesional.
- **Registro de Atenciones e Historial Confidencial:** Creación y edición de evoluciones clínicas/psicológicas confidenciales y trazabilidad de casos.
- **Seguimiento de Casos:** Bitácora de notas de evolución vinculadas a los pacientes atendidos.

### 3. 🛡️ Administrador
- **Dashboard Ejecutivo y Reportes:** KPIs globales, gráficas de demanda semanal y distribución porcentual por tipo de servicio.
- **Gestión de Usuarios y Roles (CRUD):** Creación, edición, activación/desactivación de cuentas institucionales (`@tdea.edu.co`) y asignación de privilegios.
- **Gestión de Profesionales, Servicios, Citas y Actividades:** Administración completa de la oferta de bienestar universitario.
- **Auditoría del Sistema:** Registro inmutable con fecha, hora, actor, acción y detalle de cada operación realizada en la plataforma.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (`/frontend`)
| Tecnología | Uso en el proyecto |
| :--- | :--- |
| **React 18** | Arquitectura basada en componentes funcionales y Hooks (`useState`, `useEffect`, `useCallback`). |
| **Tailwind CSS 3** | Diseño responsivo, tema oscuro personalizado (*Root Dark UI*), tarjetas, tablas, badges y gráficas. |
| **Vite 5** | Empaquetador ultrarrápido y servidor de desarrollo con recarga en caliente (HMR). |
| **Smart API Client** | Conector híbrido que consume la API REST de Node.js y provee respaldo automático en `localStorage` cuando se ejecuta en GitHub Pages. |

### Backend (`/backend`)
| Tecnología | Uso en el proyecto |
| :--- | :--- |
| **Node.js** | Entorno de ejecución en servidor para la lógica de negocio y persistencia de datos. |
| **Express.js** | Framework para la API RESTful (`/api/auth`, `/api/appointments`, `/api/activities`, `/api/users`, etc.). |
| **CORS** | Middleware para habilitar la comunicación segura entre el cliente React y el servidor Node. |
| **JSON File DB (`db.json`)** | Almacenamiento persistente en disco con semilla automática (`seed.js`) y punto de restauración (`/api/reset`). |

---

## 🔑 Credenciales de Demostración

En la pantalla de inicio de sesión puedes usar los **botones de acceso rápido** o ingresar manualmente con cualquiera de estos usuarios (contraseña para todos: **`123456`**):

| Rol | Correo Institucional | Contraseña |
| :--- | :--- | :--- |
| **Estudiante** | `estudiante@tdea.edu.co` | `123456` |
| **Profesional** | `profesional@tdea.edu.co` | `123456` |
| **Administrador** | `admin@tdea.edu.co` | `123456` |

> 💡 **Tip:** Dentro de la aplicación también puedes alternar instantáneamente entre las vistas de *Estudiante*, *Profesional* y *Administrador* desde el selector **"Vista de demostración"** ubicado en el menú lateral izquierdo.

---

## 📂 Estructura del Proyecto

```text
Bienestar Estudiantil — Root/
├── package.json              # Scripts globales (instalación, ejecución y despliegue)
├── README.md                 # Documentación del proyecto
├── backend/                  # API REST en Node.js + Express (Puerto 3001)
│   ├── package.json
│   ├── server.js             # Rutas y controladores de la API
│   └── data/
│       ├── seed.js           # Datos semilla iniciales del TdeA
│       └── db.json           # Base de datos JSON autogenerada
└── frontend/                 # Aplicación React + Vite + Tailwind CSS (Puerto 5173)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── services/
        │   └── api.js        # Cliente HTTP a Node.js + Fallback para GitHub Pages
        └── components/
            ├── Common.jsx
            ├── LoginScreen.jsx
            ├── Sidebar.jsx
            ├── Topbar.jsx
            ├── StudentViews.jsx
            ├── ProfessionalViews.jsx
            └── AdminViews.jsx
```

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Merc4x/bienestar-estudiantil-root.git
   cd bienestar-estudiantil-root
   ```

2. **Instalar dependencias (Backend y Frontend):**
   ```bash
   npm run install:all
   ```

3. **Iniciar el servidor Backend (Node.js en puerto `3001`):**
   ```bash
   npm run dev:backend
   ```

4. **En otra terminal, iniciar el Frontend (React + Vite en puerto `5173`):**
   ```bash
   npm run dev:frontend
   ```

5. Abrir en el navegador: **`http://localhost:5173`**
