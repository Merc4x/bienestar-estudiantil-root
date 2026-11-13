import React, { useState, useEffect } from 'react';
import { StatLogo, RootLogo } from './Icons';

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
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    const target = Number(number) || 0;
    if (target === 0) {
      setDisplayNum(0);
      return;
    }
    let start = 0;
    const duration = 1050;
    const stepTime = 30;
    const steps = Math.max(1, Math.floor(duration / stepTime));
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayNum(target);
        clearInterval(timer);
      } else {
        setDisplayNum(Math.ceil(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="root-card min-h-[120px] flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-rootMuted font-medium">{label}</div>
        <div className="w-9 h-9 rounded-xl bg-[#182649] text-blue-400 grid place-items-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-600/25">
          <StatLogo type={iconType} className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-extrabold mt-2 text-white tracking-tight">
        {displayNum}
      </div>
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
            style={{
              height: `${v}%`,
              animationDelay: `${i * 0.11}s`
            }}
            className="bar-animated flex-1 rounded-t-xl bg-gradient-to-t from-rootBlue to-[#60a5fa] transition-all duration-300 hover:brightness-110"
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
      className="modal-backdrop-anim fixed inset-0 bg-black/65 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="modal-box-anim w-full max-w-[560px] bg-rootPanel border border-rootBorder rounded-[18px] p-6 shadow-rootCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-rootMuted hover:text-white text-2xl leading-none px-1 transition-transform hover:rotate-90"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FullScreenLoader({ label = 'Cargando entorno Root · TdeA...' }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-6 modal-backdrop-anim"
      style={{
        background: 'radial-gradient(circle at center, rgba(24,41,82,0.94), rgba(11,13,19,0.98) 65%)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div className="flex flex-col items-center text-center gap-7">
        <div className="orbital-loader">
          <RootLogo className="w-12 h-12 rounded-2xl shadow-lg shadow-blue-600/40" />
        </div>
        <div className="space-y-2">
          <div className="text-base font-bold text-white tracking-wide">
            Bienestar Estudiantil — Root
          </div>
          <div className="text-xs text-blue-300/90 font-medium">{label}</div>
        </div>
        <div className="w-56 h-1.5 bg-[#1a2234] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 loader-progress-fill rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TabTransitionSkeleton({ label = 'Cargando módulo...' }) {
  return (
    <div className="space-y-5 py-2 modal-backdrop-anim">
      <div className="flex items-center gap-3 text-xs text-blue-400 font-medium mb-1">
        <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin inline-block" />
        <span>{label}</span>
      </div>
      <div className="flex justify-between items-center animate-pulse">
        <div className="space-y-2.5">
          <div className="h-7 w-56 bg-[#182032] rounded-lg" />
          <div className="h-4 w-80 bg-[#141a29] rounded-md" />
        </div>
        <div className="h-10 w-32 bg-[#182032] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-[120px] bg-rootPanel border border-rootBorder rounded-2xl p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <div className="h-3.5 w-24 bg-[#1c2438] rounded" />
              <div className="h-8 w-8 bg-[#182649] rounded-xl" />
            </div>
            <div className="h-8 w-14 bg-[#1c2438] rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
        <div className="h-48 bg-rootPanel border border-rootBorder rounded-2xl p-5" />
        <div className="h-48 bg-rootPanel border border-rootBorder rounded-2xl p-5" />
      </div>
    </div>
  );
}
