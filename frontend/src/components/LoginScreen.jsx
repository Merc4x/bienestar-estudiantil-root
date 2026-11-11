import React, { useState } from 'react';
import { Modal } from './Common';

export function LoginScreen({ onLogin, showToast, backendMode }) {
  const [email, setEmail] = useState('estudiante@tdea.edu.co');
  const [password, setPassword] = useState('123456');
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  const handleRecover = () => {
    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      showToast('Ingresa un correo válido.');
      return;
    }
    setRecoveryOpen(false);
    setRecoveryEmail('');
    showToast('Enlace de recuperación simulado enviado al correo.');
  };

  return (
    <div
      className="min-h-screen grid place-items-center p-5"
      style={{
        background: 'radial-gradient(circle at top, #182952, #0b0d13 55%)'
      }}
    >
      <div className="w-full max-w-[430px] bg-rootPanel border border-rootBorder rounded-[22px] p-7 shadow-rootCard">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-rootBlue grid place-items-center font-extrabold text-lg text-white shadow-lg shadow-blue-600/30">
            R
          </div>
          <strong className="text-lg text-white">Bienestar Estudiantil</strong>
          <div className="text-xs text-rootMuted">Root · Tecnológico de Antioquia</div>
          <span
            className={`mt-1 root-badge ${
              backendMode === 'node' ? 'root-badge-green' : 'root-badge-blue'
            }`}
          >
            {backendMode === 'node'
              ? 'API Node.js activa'
              : 'Modo local (GitHub Pages)'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="root-label">Correo institucional</label>
            <input
              type="email"
              className="root-input"
              placeholder="usuario@tdea.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Contraseña</label>
            <input
              type="password"
              className="root-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="root-btn root-btn-primary w-full mt-2 py-3 font-semibold"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setRecoveryOpen(true)}
          className="root-btn w-full mt-2.5"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <div className="mt-4 p-3 rounded-xl bg-[#0e1320] border border-rootBorder text-xs text-rootMuted">
          <div className="font-semibold text-slate-300 mb-2">
            Cuentas de demostración (contraseña: <code className="text-blue-400">123456</code>):
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => quickFill('estudiante@tdea.edu.co')}
              className="root-btn root-btn-sm"
            >
              Estudiante
            </button>
            <button
              type="button"
              onClick={() => quickFill('profesional@tdea.edu.co')}
              className="root-btn root-btn-sm"
            >
              Profesional
            </button>
            <button
              type="button"
              onClick={() => quickFill('admin@tdea.edu.co')}
              className="root-btn root-btn-sm"
            >
              Administrador
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={recoveryOpen}
        title="Recuperar contraseña"
        onClose={() => setRecoveryOpen(false)}
      >
        <p className="text-sm text-rootMuted mb-4">
          Ingresa tu correo institucional. En producción se enviaría un enlace seguro con token de recuperación.
        </p>
        <div>
          <label className="root-label">Correo</label>
          <input
            className="root-input"
            placeholder="usuario@tdea.edu.co"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2.5 mt-5">
          <button className="root-btn" onClick={() => setRecoveryOpen(false)}>
            Cancelar
          </button>
          <button className="root-btn root-btn-primary" onClick={handleRecover}>
            Enviar enlace
          </button>
        </div>
      </Modal>
    </div>
  );
}
