import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Common';
import { RootLogo } from './Icons';
import { cn } from '../lib/utils';

export function LoginScreen({ onLogin, showToast, backendMode }) {
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: 'estudiante@tdea.edu.co',
      password: '123456'
    }
  });

  const {
    register: registerRecovery,
    handleSubmit: handleRecoverySubmit,
    reset: resetRecovery,
    formState: { errors: recoveryErrors }
  } = useForm({
    defaultValues: {
      recoveryEmail: ''
    }
  });

  const onSubmitLogin = async (data) => {
    await onLogin(data.email, data.password);
  };

  const quickFill = (demoEmail) => {
    setValue('email', demoEmail, { shouldValidate: true });
    setValue('password', '123456', { shouldValidate: true });
  };

  const onSubmitRecovery = (data) => {
    if (!data.recoveryEmail.trim() || !data.recoveryEmail.includes('@')) {
      showToast('Ingresa un correo válido.');
      return;
    }
    setRecoveryOpen(false);
    resetRecovery();
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
          <RootLogo className="w-12 h-12 shadow-lg shadow-blue-600/30 rounded-2xl" />
          <strong className="text-lg text-white">Bienestar Estudiantil</strong>
          <div className="text-xs text-rootMuted">Root · Tecnológico de Antioquia</div>
          <span
            className={cn(
              'mt-1 root-badge',
              backendMode === 'node' ? 'root-badge-green' : 'root-badge-blue'
            )}
          >
            {backendMode === 'node'
              ? 'API Node.js activa'
              : 'Modo local (GitHub Pages)'}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-3.5" noValidate>
          <div>
            <label className="root-label">Correo institucional</label>
            <input
              type="email"
              className="root-input"
              placeholder="usuario@tdea.edu.co"
              {...register('email', {
                required: 'El correo institucional es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un correo electrónico válido'
                }
              })}
            />
            {errors.email && (
              <span className="text-[11px] text-red-400 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="root-label">Contraseña</label>
            <input
              type="password"
              className="root-input"
              placeholder="••••••••"
              {...register('password', {
                required: 'Ingresa tu contraseña'
              })}
            />
            {errors.password && (
              <span className="text-[11px] text-red-400 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="root-btn root-btn-primary w-full mt-2 py-3 font-semibold"
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
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
        <form onSubmit={handleRecoverySubmit(onSubmitRecovery)} noValidate>
          <p className="text-sm text-rootMuted mb-4">
            Ingresa tu correo institucional. En producción se enviaría un enlace seguro con token de recuperación.
          </p>
          <div>
            <label className="root-label">Correo</label>
            <input
              className="root-input"
              placeholder="usuario@tdea.edu.co"
              {...registerRecovery('recoveryEmail', {
                required: 'Ingresa tu correo institucional'
              })}
            />
            {recoveryErrors.recoveryEmail && (
              <span className="text-[11px] text-red-400 mt-1 block">
                {recoveryErrors.recoveryEmail.message}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-2.5 mt-5">
            <button
              type="button"
              className="root-btn"
              onClick={() => setRecoveryOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="root-btn root-btn-primary">
              Enviar enlace
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
