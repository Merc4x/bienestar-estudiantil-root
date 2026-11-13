import React from 'react';
import { NavIcon } from './Icons';

export const PAGE_TITLES = {
  dashboard: 'Dashboard',
  services: 'Servicios',
  professionals: 'Profesionales y disponibilidad',
  appointment: 'Solicitar cita',
  appointments: 'Mis citas',
  activities: 'Actividades y eventos',
  enrollments: 'Mis inscripciones',
  notifications: 'Notificaciones',
  profile: 'Perfil y seguridad',
  'pro-dashboard': 'Agenda profesional',
  availability: 'Disponibilidad',
  'pro-appointments': 'Gestión de citas',
  attention: 'Registro de atenciones',
  history: 'Historial confidencial',
  followup: 'Seguimiento de casos',
  'admin-dashboard': 'Dashboard ejecutivo',
  users: 'Usuarios y roles',
  'professionals-admin': 'Profesionales',
  'services-admin': 'Servicios',
  'appointments-admin': 'Citas',
  'activities-admin': 'Actividades',
  reports: 'Reportes y estadísticas',
  audit: 'Auditoría'
};

export function Topbar({
  page,
  user,
  unreadCount,
  backendMode,
  onToggleSidebar,
  onNavigate,
  onResetDB
}) {
  const initials = (user?.name || 'JD')
    .split(' ')
    .map((x) => x[0])
    .slice(0, 2)
    .join('');

  return (
    <header className="h-[72px] border-b border-rootBorder flex items-center justify-between px-5 md:px-7 bg-[#0b0d13]/85 sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="root-btn md:hidden px-3 py-2"
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <h1 className="text-lg font-bold text-white">
          {PAGE_TITLES[page] || 'Bienestar'}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          title={
            backendMode === 'node'
              ? 'Conectado a la API REST en Node.js + Express (puerto 3001)'
              : 'Ejecutando con base de datos en navegador'
          }
          className={`hidden sm:inline-flex root-badge ${
            backendMode === 'node' ? 'root-badge-green' : 'root-badge-blue'
          }`}
        >
          {backendMode === 'node' ? 'API Node.js' : 'Modo Local'}
        </span>

        <button
          onClick={onResetDB}
          className="root-btn root-btn-sm hidden sm:inline-flex"
          title="Restaurar datos de demostración"
        >
          Restaurar datos
        </button>

        <button
          onClick={() => onNavigate('notifications')}
          className="root-btn py-2 px-3 flex items-center gap-2"
        >
          <NavIcon name="notifications" className="w-4 h-4 text-blue-400" />
          <span>Notificaciones</span>
          {unreadCount > 0 && <span className="text-blue-400 font-bold">({unreadCount})</span>}
        </button>

        <div
          className="w-9 h-9 rounded-full bg-[#252b3a] grid place-items-center font-bold text-sm text-white"
          title={user?.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

