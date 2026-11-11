import React from 'react';
import { StatLogo } from './Icons';

export function PageHead({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-[26px] font-bold tracking-tight text-white mb-1">{title}</h2>
        <p className="text-sm text-rootMuted">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ number, label, iconType = 'appointments' }) {
  return (
    <div className="root-card min-h-[120px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-rootMuted font-medium">{label}</div>
        <div className="w-9 h-9 rounded-xl bg-[#182649] text-blue-400 grid place-items-center">
          <StatLogo type={iconType} className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-extrabold mt-2 text-white">{number}</div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const colorMap = {
    Completada: 'root-badge-green',
    Atendida: 'root-badge-green',
    Activo: 'root-badge-green',
    Inscrito: 'root-badge-green',
    Cancelada: 'root-badge-red',
    Inactivo: 'root-badge-red',
    Confirmada: 'root-badge-blue',
    Programada: 'root-badge-yellow'
  };
  return <span className={`root-badge ${colorMap[status] || ''}`}>{status}</span>;
}

export function BarChart() {
  const vals = [35, 52, 42, 68, 56, 74, 61];
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  return (
    <div>
      <div className="h-[190px] flex items-end gap-3 pt-5 px-2.5 pb-1">
        {vals.map((v, i) => (
          <div
            key={i}
            style={{ height: `${v}%` }}
            className="flex-1 rounded-t-xl bg-gradient-to-t from-rootBlue to-[#60a5fa] transition-all duration-300 hover:opacity-90"
            title={`${days[i]}: ${v}%`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-rootMuted px-2.5 pt-2">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-rootPanel border border-rootBorder rounded-[18px] p-6 shadow-rootCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-rootMuted hover:text-white text-2xl leading-none px-1"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
