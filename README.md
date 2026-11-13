<div align="center">
  <img src="./frontend/public/logo.svg" alt="Root Bienestar Estudiantil Logo" width="72" height="72" />
  <h1>Bienestar Estudiantil — Root</h1>
  <p><strong>Tecnológico de Antioquia (TdeA)</strong></p>
  <p>Plataforma web para la gestión integral de los servicios de bienestar universitario, agendamiento de citas, inscripción a actividades institucionales, seguimiento profesional y administración operativa.</p>
  <p><a href="https://merc4x.github.io/bienestar-estudiantil-root/"><strong>Ver Demo Desplegada</strong></a></p>
</div>

---

## Descripción General

**Bienestar Estudiantil — Root** centraliza los procesos de atención y acompañamiento estudiantil del Tecnológico de Antioquia en una sola aplicación dividida por perfiles de acceso. Permite a los estudiantes programar citas y participar en talleres, a los profesionales gestionar su agenda e historial clínico confidencial, y a los administradores supervisar métricas, usuarios y auditoría del sistema.

---

## Arquitectura y Tecnologías

El proyecto está estructurado bajo una arquitectura cliente-servidor separada en dos módulos principales (`frontend` y `backend`):

### Frontend (`/frontend`)
- **Lenguaje — TypeScript (`src/types/index.ts`, `tsconfig.json`):** Tipado estático de entidades, modelos de dominio y estados para detección temprana de errores.
- **Interfaz — React 18 + Vite 5:** Construcción de la interfaz de usuario mediante componentes modulares y empaquetado de alto rendimiento.
- **Estado y Datos — TanStack Query (`@tanstack/react-query`) & Zustand (`src/store/useAppStore.ts`):** Manejo eficiente de peticiones al servidor, caché reactiva, sincronización de mutaciones y estado global minimalista.
- **Formularios — React Hook Form (`react-hook-form`):** Validación y gestión declarativa de formularios de autenticación y recuperación de acceso.
- **Diseño — shadcn/ui + Tailwind CSS (`src/lib/utils.ts`, `components.json`):** Sistema de diseño consistente en modo oscuro, iconografía vectorial SVG a medida y animaciones fluidas de carga y transición entre vistas.

### Backend (`/backend`)
- **Node.js & Express:** Servidor API RESTful encargado de la lógica de negocio, validaciones de disponibilidad, control de cupos y registro de auditoría.
- **CORS:** Configuración de políticas de acceso entre el cliente y el servidor.
- **Persistencia JSON (`data/db.json`) + Adaptador Local (`api.js`):** Almacenamiento persistente en servidor con inicialización automática (`data/seed.js`) y respaldo transparente en `localStorage` para despliegues estáticos en GitHub Pages.

---

## Módulos del Sistema por Rol

| Rol | Módulos Principales |
| :--- | :--- |
| **Estudiante** | Dashboard personal, catálogo y filtro de servicios (Psicología, Salud, Deportes, Cultura), directorio de profesionales con consulta de horarios, asistente de reserva de citas en 4 pasos, historial y cancelación de citas, inscripción a actividades y talleres, notificaciones y configuración de perfil. |
| **Profesional** | Panel de agenda diaria, configuración y bloqueo de disponibilidad por fecha y franja horaria, actualización de estados y reasignación de citas, registro de evoluciones confidenciales, historial clínico y seguimiento de casos. |
| **Administrador** | Dashboard ejecutivo con indicadores y gráficas de demanda, gestión de usuarios y asignación de roles, directorio administrativo de profesionales, catálogo de servicios, supervisión global de citas y actividades, reportes estadísticos y bitácora de auditoría. |

---

## Credenciales de Prueba

Para probar los diferentes perfiles en el entorno de demostración, utiliza cualquiera de las siguientes cuentas institucionales:

| Perfil | Correo Institucional | Contraseña |
| :--- | :--- | :--- |
| Estudiante | `estudiante@tdea.edu.co` | `123456` |
| Profesional | `profesional@tdea.edu.co` | `123456` |
| Administrador | `admin@tdea.edu.co` | `123456` |

---

## Estructura de Directorios

```text
Bienestar Estudiantil — Root/
├── package.json
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   └── data/
│       ├── seed.js
│       └── db.json
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── components.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── types/
        │   └── index.ts
        ├── lib/
        │   └── utils.ts
        ├── store/
        │   └── useAppStore.ts
        ├── services/
        │   └── api.js
        └── components/
            ├── Icons.jsx
            ├── Common.jsx
            ├── LoginScreen.jsx
            ├── Sidebar.jsx
            ├── Topbar.jsx
            ├── StudentViews.jsx
            ├── ProfessionalViews.jsx
            └── AdminViews.jsx
```

---

## Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Merc4x/bienestar-estudiantil-root.git
   cd bienestar-estudiantil-root
   ```

2. **Instalar dependencias:**
   ```bash
   npm run install:all
   ```

3. **Iniciar el servidor Backend (puerto 3001):**
   ```bash
   npm run dev:backend
   ```

4. **Iniciar el cliente Frontend (puerto 5173):**
   ```bash
   npm run dev:frontend
   ```

5. **Abrir en el navegador:**
   `http://localhost:5173`
