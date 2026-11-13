import React, { useState, useEffect } from 'react';
import { PageHead, StatCard, StatusBadge, Modal } from './Common';
import { ServiceLogo } from './Icons';

export function StudentDashboard({ state, user, onNavigate }) {
  const myA = state.appointments.filter((a) => a.student === user.name);
  const upcoming = myA.filter((a) => a.status !== 'Cancelada').length;
  const myEnrollments = state.enrollments.filter((e) => e.user === user.name).length;
  const unreadNotifs = state.notifications.filter((n) => !n.read).length;
  const activeServices = state.services.filter((s) => s.active).length;

  return (
    <div>
      <PageHead
        title={`Hola, ${user.name.split(' ')[0]}`}
        subtitle="Gestiona tus servicios de bienestar desde un solo lugar."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard number={upcoming} label="Citas activas" iconType="appointments" />
        <StatCard number={myEnrollments} label="Inscripciones" iconType="enrollments" />
        <StatCard number={unreadNotifs} label="Notificaciones" iconType="notifications" />
        <StatCard number={activeServices} label="Servicios disponibles" iconType="services" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">Próxima cita</h3>
          {myA[0] ? (
            <div className="space-y-2">
              <StatusBadge status={myA[0].status} />
              <h4 className="text-lg font-bold text-white">{myA[0].service}</h4>
              <p className="text-sm text-rootMuted">
                {myA[0].professional} · {myA[0].date} · {myA[0].time}
              </p>
              <button
                onClick={() => onNavigate('appointments')}
                className="root-btn root-btn-sm mt-2"
              >
                Ver mis citas
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-rootMuted border border-dashed border-rootBorder rounded-xl">
              No tienes citas programadas.
            </div>
          )}
        </div>

        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">Accesos rápidos</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('appointment')}
              className="root-btn root-btn-primary"
            >
              Solicitar cita
            </button>
            <button onClick={() => onNavigate('services')} className="root-btn">
              Ver servicios
            </button>
            <button onClick={() => onNavigate('activities')} className="root-btn">
              Explorar actividades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentServices({ state, onStartAppointment }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todos');

  const filtered = state.services.filter(
    (s) =>
      s.active &&
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (cat === 'Todos' || s.cat === cat)
  );

  return (
    <div>
      <PageHead
        title="Servicios"
        subtitle="Consulta los servicios disponibles y encuentra el acompañamiento que necesitas."
      />
      <div className="flex flex-wrap gap-2.5 mb-4">
        <input
          className="root-input max-w-[300px]"
          placeholder="Buscar servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="root-input max-w-[200px]"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option>Todos</option>
          <option>Psicología</option>
          <option>Salud</option>
          <option>Deportes</option>
          <option>Cultura</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="root-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-[13px] bg-[#192b57] text-[#7fb0ff] grid place-items-center">
                    <ServiceLogo category={s.cat} className="w-5 h-5" />
                  </div>
                  <span className="root-badge">{s.cat}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{s.name}</h3>
                <p className="text-sm text-rootMuted mb-4">{s.desc}</p>
              </div>
              <button
                onClick={() => onStartAppointment(s, null)}
                className="root-btn root-btn-primary w-full"
              >
                Solicitar cita
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="root-card text-center text-rootMuted py-8">
          No hay servicios con esos filtros.
        </div>
      )}
    </div>
  );
}

export function StudentProfessionals({ state, onStartAppointment }) {
  const [specialty, setSpecialty] = useState('Todos');
  const [schedulePro, setSchedulePro] = useState(null);

  const specialties = [...new Set(state.professionals.map((p) => p.specialty))];
  const filtered = state.professionals.filter(
    (p) => p.active && (specialty === 'Todos' || p.specialty === specialty)
  );

  const proAvailability = schedulePro
    ? state.availability.filter((x) => x.professional === schedulePro.name)
    : [];

  return (
    <div>
      <PageHead
        title="Profesionales y disponibilidad"
        subtitle="Consulta especialistas por servicio y revisa sus horarios disponibles."
      />
      <div className="flex flex-wrap gap-2.5 mb-4">
        <select
          className="root-input max-w-[220px]"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option>Todos</option>
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="root-card">
            <span className="root-badge root-badge-blue">{p.specialty}</span>
            <h3 className="text-lg font-bold text-white mt-2">{p.name}</h3>
            <p className="text-sm text-rootMuted">{p.email}</p>
            <div className="h-px bg-rootBorder my-3.5" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSchedulePro(p)}
                className="root-btn"
              >
                Ver horarios
              </button>
              <button
                onClick={() => {
                  const srv =
                    state.services.find((s) => s.cat === p.specialty) ||
                    state.services[0];
                  onStartAppointment(srv, p);
                }}
                className="root-btn root-btn-primary"
              >
                Solicitar cita
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!schedulePro}
        title={`Disponibilidad · ${schedulePro?.name || ''}`}
        onClose={() => setSchedulePro(null)}
      >
        {proAvailability.length > 0 ? (
          <div className="space-y-2.5">
            {proAvailability.map((x) => (
              <div key={x.date} className="root-card p-4">
                <b className="text-sm text-white">{x.date}</b>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {x.slots.map((s) => (
                    <span key={s} className="root-badge">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-rootMuted border border-dashed border-rootBorder rounded-xl">
            Sin horarios publicados.
          </div>
        )}
      </Modal>
    </div>
  );
}

export function AppointmentWizard({
  state,
  user,
  wizardDefaults,
  onCreateAppointment,
  onNavigate,
  showToast
}) {
  const activeServices = state.services.filter((s) => s.active);
  const [step, setStep] = useState(1);
  const [service, setService] = useState(
    wizardDefaults?.service || activeServices[0] || state.services[0]
  );
  const [professional, setProfessional] = useState(wizardDefaults?.professional || null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (wizardDefaults?.service) setService(wizardDefaults.service);
    if (wizardDefaults?.professional) setProfessional(wizardDefaults.professional);
  }, [wizardDefaults]);

  const matchingPros = state.professionals.filter(
    (p) => p.active && (!service || p.specialty === service.cat || p.specialty === service.name)
  );
  const availablePros = matchingPros.length > 0 ? matchingPros : state.professionals.filter((p) => p.active);

  const days = [
    '2026-10-06',
    '2026-10-07',
    '2026-10-08',
    '2026-10-09',
    '2026-10-10',
    '2026-10-12',
    '2026-10-13'
  ];

  const selectedPro = professional || availablePros[0];
  const av = state.availability.find(
    (x) => x.professional === selectedPro?.name && x.date === date
  );
  const slots = av?.slots || ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'];
  const usedSlots = state.appointments
    .filter((a) => a.date === date && a.professional === selectedPro?.name && a.status !== 'Cancelada')
    .map((a) => a.time);

  const handleNext = async (targetStep) => {
    if (targetStep === 2 && !professional) {
      showToast('Selecciona un profesional.');
      return;
    }
    if (targetStep === 3 && !date) {
      showToast('Selecciona una fecha.');
      return;
    }
    if (targetStep === 4) {
      if (!time) {
        showToast('Selecciona una franja disponible.');
        return;
      }
      await onCreateAppointment({
        student: user.name,
        professional: professional.name,
        service: service.name,
        date,
        time,
        actor: user.name
      });
      setStep(4);
      return;
    }
    setStep(targetStep);
  };

  const resetWizard = () => {
    setStep(1);
    setDate(null);
    setTime(null);
  };

  const stepLabels = ['Servicio y profesional', 'Fecha', 'Franja', 'Confirmación'];

  return (
    <div>
      <PageHead
        title="Solicitar cita"
        subtitle="Reserva una atención seleccionando servicio, profesional, fecha y franja."
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-5">
        {stepLabels.map((label, i) => (
          <div
            key={label}
            className={`p-3 rounded-xl border text-xs font-medium ${
              i + 1 <= step
                ? 'border-rootBlue bg-[#14203d] text-white'
                : 'border-rootBorder bg-rootPanel2 text-rootMuted'
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="root-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="root-label">Servicio</label>
              <select
                className="root-input"
                value={service?.id || ''}
                onChange={(e) => {
                  const found = state.services.find((x) => x.id === Number(e.target.value));
                  setService(found);
                  setProfessional(null);
                }}
              >
                {activeServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="root-label">Profesional</label>
              <select
                className="root-input"
                value={professional?.id || ''}
                onChange={(e) => {
                  const found = state.professionals.find((x) => x.id === Number(e.target.value));
                  setProfessional(found || null);
                }}
              >
                <option value="">Selecciona...</option>
                {availablePros.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button onClick={() => handleNext(2)} className="root-btn root-btn-primary">
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">Selecciona una fecha</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {days.map((d) => {
              const weekday = new Date(d + 'T12:00').toLocaleDateString('es-CO', {
                weekday: 'short'
              });
              const isSelected = date === d;
              return (
                <div
                  key={d}
                  className="bg-rootPanel2 border border-rootBorder rounded-xl p-3 text-center flex flex-col items-center gap-1"
                >
                  <small className="text-xs text-rootMuted capitalize">{weekday}</small>
                  <b className="text-lg text-white">{d.slice(-2)}</b>
                  <button
                    onClick={() => setDate(d)}
                    className={`w-full mt-1.5 py-1.5 rounded-lg text-xs font-medium border ${
                      isSelected
                        ? 'bg-rootBlue border-rootBlue text-white'
                        : 'bg-[#171c28] border-rootBorder text-white hover:border-blue-500'
                    }`}
                  >
                    Elegir
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2.5 mt-5">
            <button onClick={() => setStep(1)} className="root-btn">
              Atrás
            </button>
            <button onClick={() => handleNext(3)} className="root-btn root-btn-primary">
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">
            Franja disponible · {selectedPro?.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {slots.map((s) => {
              const busy = usedSlots.includes(s);
              const selected = time === s;
              return (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => setTime(s)}
                  className={`p-3 rounded-xl border text-sm font-medium transition ${
                    busy
                      ? 'opacity-40 cursor-not-allowed border-rootBorder bg-rootPanel2 text-rootMuted'
                      : selected
                      ? 'bg-rootBlue border-rootBlue text-white'
                      : 'bg-rootPanel2 border-rootBorder text-white hover:border-blue-500'
                  }`}
                >
                  {s}
                  {busy ? ' · Ocupada' : ''}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-2.5 mt-5">
            <button onClick={() => setStep(2)} className="root-btn">
              Atrás
            </button>
            <button onClick={() => handleNext(4)} className="root-btn root-btn-primary">
              Confirmar cita
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="root-card text-center py-8 space-y-3">
            <h3 className="text-xl font-bold text-white">Cita solicitada</h3>
            <p className="text-sm text-rootMuted">
              La franja fue bloqueada y la confirmación quedó registrada.
            </p>
            <p className="text-sm text-white">
              <b>{service?.name}</b>
              <br />
              {professional?.name}
              <br />
              {date} · {time}
            </p>
            <div>
              <span className="root-badge root-badge-green">US-01 · Confirmación enviada</span>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mt-4">
            <button onClick={resetWizard} className="root-btn root-btn-primary">
              Agendar otra cita
            </button>
            <button onClick={() => onNavigate('appointments')} className="root-btn">
              Ir a mis citas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentAppointments({
  state,
  user,
  onCancelAppointment,
  onNewAppointment,
  showToast
}) {
  const [filter, setFilter] = useState('Todos');
  const [cancelingId, setCancelingId] = useState(null);
  const [reason, setReason] = useState('');

  const states = ['Todos', 'Programada', 'Confirmada', 'Atendida', 'Completada', 'Cancelada'];
  const mine = state.appointments
    .filter((a) => a.student === user.name && (filter === 'Todos' || a.status === filter))
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const confirmCancel = async () => {
    if (!reason.trim()) {
      showToast('El motivo es obligatorio.');
      return;
    }
    await onCancelAppointment(cancelingId, reason.trim());
    setCancelingId(null);
    setReason('');
  };

  return (
    <div>
      <PageHead
        title="Mis citas"
        subtitle="Consulta tus citas en orden cronológico y su estado."
        action={
          <button onClick={onNewAppointment} className="root-btn root-btn-primary">
            Nueva cita
          </button>
        }
      />

      <div className="mb-4">
        <select
          className="root-input max-w-[220px]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Fecha</th>
              <th className="py-3 px-2.5 text-left">Servicio</th>
              <th className="py-3 px-2.5 text-left">Profesional</th>
              <th className="py-3 px-2.5 text-left">Estado</th>
              <th className="py-3 px-2.5 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {mine.length > 0 ? (
              mine.map((a) => (
                <tr key={a.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    {a.date} {a.time}
                  </td>
                  <td className="py-3.5 px-2.5">{a.service}</td>
                  <td className="py-3.5 px-2.5">{a.professional}</td>
                  <td className="py-3.5 px-2.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-3.5 px-2.5 text-right">
                    {a.status !== 'Cancelada' && (
                      <button
                        onClick={() => setCancelingId(a.id)}
                        className="root-btn root-btn-sm root-btn-danger"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-rootMuted">
                  Sin citas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!cancelingId}
        title="Cancelar cita"
        onClose={() => setCancelingId(null)}
      >
        <p className="text-sm text-rootMuted mb-3">Indica el motivo de cancelación.</p>
        <div>
          <label className="root-label">Motivo</label>
          <textarea
            className="root-input min-h-[100px]"
            placeholder="Motivo..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2.5 mt-4">
          <button onClick={() => setCancelingId(null)} className="root-btn">
            Cerrar
          </button>
          <button onClick={confirmCancel} className="root-btn root-btn-primary">
            Registrar cancelación
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function StudentActivities({ state, user, onEnroll }) {
  const activeActivities = state.activities.filter((a) => a.status === 'Activo');
  const isEnrolled = (actId) =>
    state.enrollments.some((e) => e.activityId === actId && e.user === user.name);

  return (
    <div>
      <PageHead
        title="Actividades y eventos"
        subtitle="Explora talleres y actividades de bienestar e inscríbete en línea."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeActivities.map((a) => {
          const pct = Math.min(100, Math.round((a.enrolled / a.capacity) * 100));
          const enrolled = isEnrolled(a.id);
          return (
            <div key={a.id} className="root-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center gap-2 mb-3">
                  <span className="root-badge root-badge-blue">{a.cat}</span>
                  <span className="root-badge">
                    {a.enrolled}/{a.capacity}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{a.name}</h3>
                <p className="text-sm text-rootMuted">
                  {a.date} · {a.time}
                  <br />
                  {a.place}
                </p>
                <div className="h-2 bg-[#1e2433] rounded-full overflow-hidden mt-3">
                  <span
                    style={{ width: `${pct}%` }}
                    className="block h-full bg-gradient-to-r from-rootBlue to-[#60a5fa]"
                  />
                </div>
              </div>

              <div className="mt-4">
                {enrolled ? (
                  <span className="root-badge root-badge-green">Inscrito</span>
                ) : a.enrolled < a.capacity ? (
                  <button
                    onClick={() => onEnroll(a.id)}
                    className="root-btn root-btn-primary"
                  >
                    Inscribirme
                  </button>
                ) : (
                  <span className="root-badge root-badge-red">Cupos agotados</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StudentEnrollments({ state, user, onUnenroll }) {
  const mine = state.enrollments.filter((x) => x.user === user.name);

  return (
    <div>
      <PageHead
        title="Mis inscripciones"
        subtitle="Consulta las actividades a las que estás inscrito."
      />
      {mine.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mine.map((x) => {
            const act = state.activities.find((y) => y.id === x.activityId);
            return (
              <div key={x.id} className="root-card space-y-2">
                <span className="root-badge root-badge-green">Inscrito</span>
                <h3 className="text-lg font-bold text-white">
                  {act?.name || 'Actividad'}
                </h3>
                <p className="text-sm text-rootMuted">
                  {act?.date} · {act?.time}
                </p>
                <button
                  onClick={() => onUnenroll(x.id)}
                  className="root-btn root-btn-sm root-btn-danger mt-2"
                >
                  Cancelar inscripción
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="root-card text-center text-rootMuted py-8">
          No tienes inscripciones.
        </div>
      )}
    </div>
  );
}

export function NotificationsView({ state, onMarkRead }) {
  useEffect(() => {
    if (state.notifications.some((n) => !n.read)) {
      onMarkRead();
    }
  }, []);

  return (
    <div>
      <PageHead
        title="Notificaciones"
        subtitle="Avisos de citas, cambios de estado, inscripciones y recordatorios."
      />
      <div className="root-card">
        {state.notifications.length > 0 ? (
          state.notifications.map((n) => (
            <div
              key={n.id}
              className="flex gap-3 items-start py-3.5 border-b border-rootBorder last:border-b-0"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rootBlueLight mt-1.5 shrink-0" />
              <div>
                <b className="text-sm text-white block">{n.text}</b>
                <div className="text-xs text-rootMuted mt-0.5">{n.date}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-rootMuted">No tienes notificaciones.</div>
        )}
      </div>
    </div>
  );
}

export function ProfileView({ user, showToast }) {
  const [name, setName] = useState(user.name);
  const [program, setProgram] = useState(user.program || 'Ingeniería de Software');

  return (
    <div>
      <PageHead
        title="Perfil y seguridad"
        subtitle="Administra tus datos personales, académicos y seguridad de acceso."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="root-card">
          <h3 className="text-base font-bold mb-4">Datos personales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="root-label">Nombre</label>
              <input
                className="root-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="root-label">Correo institucional</label>
              <input className="root-input" value={user.email} disabled />
            </div>
            <div>
              <label className="root-label">Rol</label>
              <input className="root-input" value={user.role} disabled />
            </div>
            <div>
              <label className="root-label">Programa académico</label>
              <input
                className="root-input"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={() => showToast('Perfil actualizado.')}
              className="root-btn root-btn-primary"
            >
              Guardar cambios
            </button>
          </div>
        </div>

        <div className="root-card">
          <h3 className="text-base font-bold mb-4">Cambiar contraseña</h3>
          <div className="space-y-3">
            <div>
              <label className="root-label">Contraseña actual</label>
              <input type="password" className="root-input" />
            </div>
            <div>
              <label className="root-label">Nueva contraseña</label>
              <input type="password" className="root-input" />
            </div>
            <div>
              <label className="root-label">Confirmar nueva contraseña</label>
              <input type="password" className="root-input" />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={() => showToast('Contraseña actualizada correctamente.')}
              className="root-btn root-btn-primary"
            >
              Actualizar contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

