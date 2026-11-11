import React from 'react';

export const MENUS = {
  student: [
    ['dashboard', 'Dashboard'],
    ['services', 'Servicios'],
    ['professionals', 'Profesionales y disponibilidad'],
    ['appointment', 'Solicitar cita'],
    ['appointments', 'Mis citas'],
    ['activities', 'Actividades y eventos'],
    ['enrollments', 'Mis inscripciones'],
    ['notifications', 'Notificaciones'],
    ['profile', 'Perfil y seguridad']
  ],
  professional: [
    ['pro-dashboard', 'Dashboard / Agenda'],
    ['availability', 'Disponibilidad'],
    ['pro-appointments', 'Gestión de citas'],
    ['attention', 'Registro de atenciones'],
    ['history', 'Historial confidencial'],
    ['followup', 'Seguimiento de casos'],
    ['notifications', 'Notificaciones']
  ],
  admin: [
    ['admin-dashboard', 'Dashboard ejecutivo'],
    ['users', 'Usuarios y roles'],
    ['professionals-admin', 'Profesionales'],
    ['services-admin', 'Servicios'],
    ['appointments-admin', 'Citas'],
    ['activities-admin', 'Actividades'],
    ['notifications', 'Notificaciones'],
    ['reports', 'Reportes y estadísticas'],
    ['audit', 'Auditoría']
  ]
};

export function Sidebar({
  role,
  page,
  sidebarOpen,
  onNavigate,
  onSwitchRole,
  onLogout
}) {
  const items = MENUS[role] || MENUS.student;

  return (
    <aside
      className={`w-[260px] bg-rootSidebar border-r border-rootBorder px-4 py-5 fixed inset-y-0 left-0 z-30 overflow-y-auto transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex items-center gap-3 px-2.5 pt-1 pb-6 border-b border-rootBorder mb-4">
        <div className="w-[38px] h-[38px] rounded-xl bg-rootBlue grid place-items-center font-extrabold text-white">
          R
        </div>
        <div>
          <strong className="block text-sm text-white">Bienestar Estudiantil</strong>
          <span className="text-[11px] text-rootMuted">Root · TdeA</span>
        </div>
      </div>

      <div className="bg-rootPanel border border-rootBorder rounded-xl p-2.5 mb-4">
        <label className="text-[10px] uppercase text-rootMuted block mb-1 tracking-wider">
          Vista de demostración
        </label>
        <select
          value={role}
          onChange={(e) => onSwitchRole(e.target.value)}
          className="w-full bg-rootSidebar border-0 text-white text-sm outline-none cursor-pointer"
        >
          <option value="student">Estudiante</option>
          <option value="professional">Profesional</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <nav className="space-y-1">
        {items.map(([key, label]) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full px-3 py-2.5 rounded-[10px] text-left flex items-center text-sm transition-colors ${
                active
                  ? 'bg-[#191e2c] text-white font-medium shadow-[inset_3px_0_0_#2563eb]'
                  : 'text-[#9da6b8] hover:bg-[#191e2c] hover:text-white'
              }`}
            >
              <span>{label}</span>
            </button>
          );
        })}

        <div className="text-[10px] text-[#687184] uppercase tracking-widest px-2.5 pt-4 pb-1">
          Cuenta
        </div>
        <button
          onClick={onLogout}
          className="w-full px-3 py-2.5 rounded-[10px] text-left flex items-center text-sm text-[#9da6b8] hover:bg-[#191e2c] hover:text-white transition-colors"
        >
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  );
}
