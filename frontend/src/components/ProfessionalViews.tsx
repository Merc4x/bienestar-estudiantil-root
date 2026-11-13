import React, { useState } from 'react';
import { PageHead, StatCard, StatusBadge, Modal } from './Common';

export function ProAppointmentTable({
  appointments,
  professionals,
  onUpdateAppointment
}) {
  const [statusTarget, setStatusTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('Programada');
  const [statusNote, setStatusNote] = useState('');

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [raPro, setRaPro] = useState('');
  const [raDate, setRaDate] = useState('');
  const [raTime, setRaTime] = useState('');

  const openStatus = (appt) => {
    setStatusTarget(appt);
    setNewStatus(appt.status);
    setStatusNote(appt.note || '');
  };

  const openReschedule = (appt) => {
    setRescheduleTarget(appt);
    setRaPro(appt.professional);
    setRaDate(appt.date);
    setRaTime(appt.time);
  };

  const handleSaveStatus = async () => {
    await onUpdateAppointment(statusTarget.id, {
      status: newStatus,
      note: statusNote
    });
    setStatusTarget(null);
  };

  const handleSaveReschedule = async () => {
    await onUpdateAppointment(rescheduleTarget.id, {
      professional: raPro,
      date: raDate,
      time: raTime
    });
    setRescheduleTarget(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Fecha</th>
              <th className="py-3 px-2.5 text-left">Estudiante</th>
              <th className="py-3 px-2.5 text-left">Servicio</th>
              <th className="py-3 px-2.5 text-left">Estado</th>
              <th className="py-3 px-2.5 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                  <td className="py-3.5 px-2.5 whitespace-nowrap">
                    {a.date} {a.time}
                  </td>
                  <td className="py-3.5 px-2.5">{a.student}</td>
                  <td className="py-3.5 px-2.5">{a.service}</td>
                  <td className="py-3.5 px-2.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-3.5 px-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => openStatus(a)}
                        className="root-btn root-btn-sm"
                      >
                        Estado
                      </button>
                      <button
                        onClick={() => openReschedule(a)}
                        className="root-btn root-btn-sm"
                      >
                        Reasignar
                      </button>
                    </div>
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
        open={!!statusTarget}
        title="Actualizar estado"
        onClose={() => setStatusTarget(null)}
      >
        {statusTarget && (
          <div className="space-y-3.5">
            <p className="text-sm text-rootMuted">
              {statusTarget.service} · {statusTarget.student} · {statusTarget.date}{' '}
              {statusTarget.time}
            </p>
            <div>
              <label className="root-label">Nuevo estado</label>
              <select
                className="root-input"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option>Programada</option>
                <option>Confirmada</option>
                <option>Atendida</option>
                <option>Completada</option>
                <option>Cancelada</option>
              </select>
            </div>
            <div>
              <label className="root-label">Observación</label>
              <textarea
                className="root-input min-h-[90px]"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveStatus}
                className="root-btn root-btn-primary"
              >
                Guardar estado
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!rescheduleTarget}
        title="Reasignar cita"
        onClose={() => setRescheduleTarget(null)}
      >
        {rescheduleTarget && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="root-label">Profesional</label>
                <select
                  className="root-input"
                  value={raPro}
                  onChange={(e) => setRaPro(e.target.value)}
                >
                  {professionals
                    .filter((p) => p.active)
                    .map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="root-label">Fecha</label>
                <input
                  type="date"
                  className="root-input"
                  value={raDate}
                  onChange={(e) => setRaDate(e.target.value)}
                />
              </div>
              <div>
                <label className="root-label">Hora</label>
                <input
                  type="time"
                  className="root-input"
                  value={raTime}
                  onChange={(e) => setRaTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveReschedule}
                className="root-btn root-btn-primary"
              >
                Guardar reasignación
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export function ProDashboard({
  state,
  user,
  onNavigate,
  onUpdateAppointment
}) {
  const mine = state.appointments.filter((a) => a.professional === user.name);
  const activeCount = mine.filter((a) => a.status !== 'Cancelada').length;
  const completedCount = mine.filter((a) => a.status === 'Completada').length;
  const attentionsCount = state.attentions.filter(
    (a) => a.professional === user.name
  ).length;
  const followupsCount = state.followups.filter(
    (f) => f.professional === user.name
  ).length;

  return (
    <div>
      <PageHead
        title="Mi agenda"
        subtitle="Consulta y gestiona las citas asignadas a tu agenda."
        action={
          <button
            onClick={() => onNavigate('availability')}
            className="root-btn root-btn-primary"
          >
            Gestionar disponibilidad
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard number={activeCount} label="Citas activas" iconType="appointments" />
        <StatCard number={completedCount} label="Completadas" iconType="enrollments" />
        <StatCard number={attentionsCount} label="Atenciones registradas" iconType="attention" />
        <StatCard number={followupsCount} label="Seguimientos" iconType="followup" />
      </div>

      <div className="root-card mt-4">
        <h3 className="text-base font-bold mb-3.5">Agenda</h3>
        <ProAppointmentTable
          appointments={mine}
          professionals={state.professionals}
          onUpdateAppointment={onUpdateAppointment}
        />
      </div>
    </div>
  );
}

export function ProAvailability({
  state,
  user,
  onSaveAvailability,
  onDeleteAvailability,
  showToast
}) {
  const mine = state.availability.filter((a) => a.professional === user.name);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldDate, setOldDate] = useState('');
  const [avDate, setAvDate] = useState('');
  const [avSlots, setAvSlots] = useState('08:00,09:00,10:00,14:00');

  const openModal = (date = '') => {
    setOldDate(date);
    setAvDate(date);
    if (date) {
      const existing = state.availability.find(
        (a) => a.professional === user.name && a.date === date
      );
      setAvSlots(existing ? existing.slots.join(',') : '');
    } else {
      setAvSlots('08:00,09:00,10:00,14:00');
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    const slots = avSlots
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    if (!avDate || !slots.length) {
      showToast('Completa fecha y franjas.');
      return;
    }
    const ok = await onSaveAvailability({
      professional: user.name,
      oldDate,
      date: avDate,
      slots,
      actor: user.name
    });
    if (ok) setModalOpen(false);
  };

  return (
    <div>
      <PageHead
        title="Disponibilidad"
        subtitle="Crea, edita o bloquea franjas de tu agenda."
        action={
          <button
            onClick={() => openModal('')}
            className="root-btn root-btn-primary"
          >
            + Nueva disponibilidad
          </button>
        }
      />

      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Fecha</th>
              <th className="py-3 px-2.5 text-left">Franjas</th>
              <th className="py-3 px-2.5 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mine.length > 0 ? (
              mine.map((a) => (
                <tr key={a.date} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                  <td className="py-3.5 px-2.5 whitespace-nowrap">{a.date}</td>
                  <td className="py-3.5 px-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {a.slots.map((s) => (
                        <span key={s} className="root-badge">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => openModal(a.date)}
                        className="root-btn root-btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          onDeleteAvailability({
                            professional: user.name,
                            date: a.date,
                            actor: user.name
                          })
                        }
                        className="root-btn root-btn-sm root-btn-danger"
                      >
                        Bloquear día
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-rootMuted">
                  Sin horarios configurados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={oldDate ? 'Editar disponibilidad' : 'Nueva disponibilidad'}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="root-label">Fecha</label>
            <input
              type="date"
              className="root-input"
              value={avDate}
              onChange={(e) => setAvDate(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Franjas (separadas por coma)</label>
            <input
              className="root-input"
              value={avSlots}
              onChange={(e) => setAvSlots(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2.5 mt-5">
          <button onClick={() => setModalOpen(false)} className="root-btn">
            Cancelar
          </button>
          <button onClick={handleSave} className="root-btn root-btn-primary">
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function ProAppointments({ state, user, onUpdateAppointment }) {
  const mine = state.appointments.filter((a) => a.professional === user.name);
  return (
    <div>
      <PageHead
        title="Gestión de citas"
        subtitle="Actualiza estados, reprograma y registra cancelaciones."
      />
      <div className="root-card">
        <ProAppointmentTable
          appointments={mine}
          professionals={state.professionals}
          onUpdateAppointment={onUpdateAppointment}
        />
      </div>
    </div>
  );
}

export function ProAttentions({ state, user, onSaveAttention, showToast }) {
  const mine = state.attentions.filter((a) => a.professional === user.name);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [student, setStudent] = useState('');
  const [type, setType] = useState('Psicológica');
  const [notes, setNotes] = useState('');

  const openModal = (item = null) => {
    setEditId(item ? item.id : 0);
    setStudent(item ? item.student : '');
    setType(item ? item.type : 'Psicológica');
    setNotes(item ? item.notes : '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!student.trim() || !notes.trim()) {
      showToast('Completa estudiante y notas confidenciales.');
      return;
    }
    const ok = await onSaveAttention({
      id: editId,
      student: student.trim(),
      type: type.trim() || 'Psicológica',
      notes: notes.trim(),
      professional: user.name,
      actor: user.name
    });
    if (ok) setModalOpen(false);
  };

  return (
    <div>
      <PageHead
        title="Registro de atenciones"
        subtitle="Registra evoluciones confidenciales y seguras de las atenciones realizadas."
        action={
          <button
            onClick={() => openModal(null)}
            className="root-btn root-btn-primary"
          >
            + Nueva atención
          </button>
        }
      />

      <div className="root-card">
        <p className="text-xs text-rootMuted mb-3">
          Los registros de esta sección son de carácter confidencial.
        </p>
        {mine.length > 0 ? (
          mine.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 py-3.5 border-b border-rootBorder last:border-b-0"
            >
              <div className="flex gap-3 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-rootBlueLight mt-1.5 shrink-0" />
                <div>
                  <b className="text-sm text-white block">
                    {a.student} · {a.type}
                  </b>
                  <div className="text-xs text-slate-300">{a.date}</div>
                  <div className="text-sm text-rootMuted mt-1">{a.notes}</div>
                </div>
              </div>
              <button
                onClick={() => openModal(a)}
                className="root-btn root-btn-sm shrink-0"
              >
                Editar
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-rootMuted">No hay atenciones.</div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editId ? 'Editar atención' : 'Registrar atención'}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="root-label">Estudiante</label>
            <input
              className="root-input"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Tipo</label>
            <input
              className="root-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="root-label">Notas confidenciales</label>
            <textarea
              className="root-input min-h-[110px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleSave} className="root-btn root-btn-primary">
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function ProHistory({ state }) {
  return (
    <div>
      <PageHead
        title="Historial confidencial"
        subtitle="Consulta registros de atención autorizados y trazabilidad de cambios."
      />
      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Fecha</th>
              <th className="py-3 px-2.5 text-left">Estudiante</th>
              <th className="py-3 px-2.5 text-left">Tipo</th>
              <th className="py-3 px-2.5 text-left">Profesional</th>
              <th className="py-3 px-2.5 text-left">Registro</th>
            </tr>
          </thead>
          <tbody>
            {state.attentions.map((a) => (
              <tr key={a.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                <td className="py-3.5 px-2.5 whitespace-nowrap">{a.date}</td>
                <td className="py-3.5 px-2.5">{a.student}</td>
                <td className="py-3.5 px-2.5">{a.type}</td>
                <td className="py-3.5 px-2.5">{a.professional}</td>
                <td className="py-3.5 px-2.5">{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProFollowup({ state, user, onSaveFollowup, showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState('');

  const handleSave = async () => {
    if (!note.trim()) {
      showToast('Escribe una nota.');
      return;
    }
    const ok = await onSaveFollowup({
      note: note.trim(),
      professional: user.name,
      actor: user.name
    });
    if (ok) {
      setNote('');
      setModalOpen(false);
    }
  };

  return (
    <div>
      <PageHead
        title="Seguimiento de casos"
        subtitle="Gestiona notas de seguimiento vinculadas a atenciones."
      />
      <div className="root-card">
        <div className="mb-4">
          {state.followups.map((f) => (
            <div
              key={f.id}
              className="flex gap-3 items-start py-3.5 border-b border-rootBorder last:border-b-0"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rootBlueLight mt-1.5 shrink-0" />
              <div>
                <b className="text-sm text-white block">
                  {f.date} · {f.professional}
                </b>
                <div className="text-sm text-rootMuted mt-0.5">{f.note}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="root-btn root-btn-primary"
        >
          + Agregar seguimiento
        </button>
      </div>

      <Modal
        open={modalOpen}
        title="Nuevo seguimiento"
        onClose={() => setModalOpen(false)}
      >
        <div>
          <label className="root-label">Nota de seguimiento</label>
          <textarea
            className="root-input min-h-[110px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleSave} className="root-btn root-btn-primary">
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

