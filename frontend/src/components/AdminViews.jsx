import React, { useState } from 'react';
import { PageHead, StatCard, StatusBadge, BarChart, Modal } from './Common';
import { ProAppointmentTable } from './ProfessionalViews';

export function AdminDashboard({ state }) {
  const activeActivities = state.activities.filter((a) => a.status === 'Activo').length;

  return (
    <div>
      <PageHead
        title="Dashboard ejecutivo"
        subtitle="Resumen general de la operación de Bienestar Estudiantil."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard number={state.users.length} label="Usuarios registrados" icon="♙" />
        <StatCard number={state.professionals.length} label="Profesionales" icon="◎" />
        <StatCard number={state.appointments.length} label="Citas" icon="◷" />
        <StatCard number={activeActivities} label="Actividades activas" icon="✦" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">Citas por periodo</h3>
          <BarChart />
        </div>

        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">Distribución de servicios</h3>
          <div className="donut-chart" />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="root-badge root-badge-blue">Psicología 46%</span>
            <span className="root-badge root-badge-purple">Salud 26%</span>
            <span className="root-badge root-badge-green">Otros 28%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminUsers({
  state,
  onSaveUser,
  onToggleUser,
  onUpdateRole,
  showToast
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState('Estudiante');
  const [uStatus, setUStatus] = useState('Activo');

  const [roleTarget, setRoleTarget] = useState(null);
  const [roleEditValue, setRoleEditValue] = useState('Estudiante');

  const filtered = state.users.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === 'Todos' || u.role === roleFilter) &&
      (statusFilter === 'Todos' || u.status === statusFilter)
  );

  const openUserModal = (user = null) => {
    setEditId(user ? user.id : 0);
    setUName(user ? user.name : '');
    setUEmail(user ? user.email : '');
    setURole(user ? user.role : 'Estudiante');
    setUStatus(user ? user.status : 'Activo');
    setUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!uName.trim() || !uEmail.trim() || !uEmail.trim().endsWith('@tdea.edu.co')) {
      showToast('Nombre y correo institucional (@tdea.edu.co) son obligatorios.');
      return;
    }
    const ok = await onSaveUser({
      id: editId,
      name: uName.trim(),
      email: uEmail.trim(),
      role: uRole,
      status: uStatus
    });
    if (ok) setUserModalOpen(false);
  };

  const openRoleModal = (user) => {
    setRoleTarget(user);
    setRoleEditValue(user.role);
  };

  const handleSaveRole = async () => {
    await onUpdateRole(roleTarget.id, roleEditValue);
    setRoleTarget(null);
  };

  return (
    <div>
      <PageHead
        title="Usuarios y roles"
        subtitle="Administra cuentas, estados y privilegios."
        action={
          <button
            onClick={() => openUserModal(null)}
            className="root-btn root-btn-primary"
          >
            + Nuevo usuario
          </button>
        }
      />

      <div className="flex flex-wrap gap-2.5 mb-4">
        <input
          className="root-input max-w-[280px]"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="root-input max-w-[180px]"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option>Todos</option>
          <option>Estudiante</option>
          <option>Profesional</option>
          <option>Administrador</option>
        </select>
        <select
          className="root-input max-w-[180px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>Todos</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Usuario</th>
              <th className="py-3 px-2.5 text-left">Correo</th>
              <th className="py-3 px-2.5 text-left">Rol</th>
              <th className="py-3 px-2.5 text-left">Estado</th>
              <th className="py-3 px-2.5 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                <td className="py-3.5 px-2.5">{u.name}</td>
                <td className="py-3.5 px-2.5">{u.email}</td>
                <td className="py-3.5 px-2.5">
                  <span className="root-badge root-badge-purple">{u.role}</span>
                </td>
                <td className="py-3.5 px-2.5">
                  <StatusBadge status={u.status} />
                </td>
                <td className="py-3.5 px-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => openUserModal(u)}
                      className="root-btn root-btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openRoleModal(u)}
                      className="root-btn root-btn-sm"
                    >
                      Roles
                    </button>
                    <button
                      onClick={() => onToggleUser(u.id)}
                      className="root-btn root-btn-sm root-btn-danger"
                    >
                      {u.status === 'Activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={userModalOpen}
        title={editId ? 'Editar usuario' : 'Registrar usuario'}
        onClose={() => setUserModalOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="root-label">Nombre *</label>
            <input
              className="root-input"
              value={uName}
              onChange={(e) => setUName(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Correo institucional *</label>
            <input
              className="root-input"
              placeholder="usuario@tdea.edu.co"
              value={uEmail}
              onChange={(e) => setUEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Rol *</label>
            <select
              className="root-input"
              value={uRole}
              onChange={(e) => setURole(e.target.value)}
            >
              <option>Estudiante</option>
              <option>Profesional</option>
              <option>Administrador</option>
            </select>
          </div>
          <div>
            <label className="root-label">Estado</label>
            <select
              className="root-input"
              value={uStatus}
              onChange={(e) => setUStatus(e.target.value)}
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleSaveUser} className="root-btn root-btn-primary">
            Guardar
          </button>
        </div>
      </Modal>

      <Modal
        open={!!roleTarget}
        title="Roles y privilegios"
        onClose={() => setRoleTarget(null)}
      >
        {roleTarget && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-white">{roleTarget.name}</h4>
            <div>
              <label className="root-label">Rol</label>
              <select
                className="root-input"
                value={roleEditValue}
                onChange={(e) => setRoleEditValue(e.target.value)}
              >
                <option>Estudiante</option>
                <option>Profesional</option>
                <option>Personal autorizado</option>
                <option>Administrador</option>
              </select>
            </div>
            <p className="text-xs text-rootMuted">
              Los privilegios se aplican según el rol seleccionado.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveRole}
                className="root-btn root-btn-primary"
              >
                Asignar privilegio
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function AdminProfessionals({ state, onSaveProfessional, showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pSpec, setPSpec] = useState('Psicología');

  const openModal = (pro = null) => {
    setEditId(pro ? pro.id : 0);
    setPName(pro ? pro.name : '');
    setPEmail(pro ? pro.email : '');
    setPSpec(pro ? pro.specialty : 'Psicología');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!pName.trim() || !pEmail.trim()) {
      showToast('Completa los campos obligatorios.');
      return;
    }
    const ok = await onSaveProfessional({
      id: editId,
      name: pName.trim(),
      email: pEmail.trim(),
      specialty: pSpec
    });
    if (ok) setModalOpen(false);
  };

  return (
    <div>
      <PageHead
        title="Profesionales"
        subtitle="Registra profesionales y enlázalos con su agenda."
        action={
          <button
            onClick={() => openModal(null)}
            className="root-btn root-btn-primary"
          >
            + Registrar profesional
          </button>
        }
      />

      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Profesional</th>
              <th className="py-3 px-2.5 text-left">Especialidad</th>
              <th className="py-3 px-2.5 text-left">Correo</th>
              <th className="py-3 px-2.5 text-left">Agenda</th>
              <th className="py-3 px-2.5 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {state.professionals.map((p) => (
              <tr key={p.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                <td className="py-3.5 px-2.5">{p.name}</td>
                <td className="py-3.5 px-2.5">{p.specialty}</td>
                <td className="py-3.5 px-2.5">{p.email}</td>
                <td className="py-3.5 px-2.5">
                  <span className="root-badge root-badge-green">Vinculada</span>
                </td>
                <td className="py-3.5 px-2.5">
                  <button
                    onClick={() => openModal(p)}
                    className="root-btn root-btn-sm"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editId ? 'Editar profesional' : 'Registrar profesional'}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="root-label">Nombre *</label>
            <input
              className="root-input"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Correo *</label>
            <input
              className="root-input"
              value={pEmail}
              onChange={(e) => setPEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Especialidad *</label>
            <select
              className="root-input"
              value={pSpec}
              onChange={(e) => setPSpec(e.target.value)}
            >
              <option>Psicología</option>
              <option>Medicina</option>
              <option>Deportes</option>
              <option>Cultura</option>
            </select>
          </div>
          <div>
            <label className="root-label">Agenda</label>
            <select className="root-input">
              <option>Agenda estándar</option>
              <option>Agenda personalizada</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleSave} className="root-btn root-btn-primary">
            Guardar profesional
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function AdminServices({
  state,
  onSaveService,
  onToggleService,
  showToast
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [sName, setSName] = useState('');
  const [sCat, setSCat] = useState('Psicología');
  const [sDesc, setSDesc] = useState('');

  const openModal = (srv = null) => {
    setEditId(srv ? srv.id : 0);
    setSName(srv ? srv.name : '');
    setSCat(srv ? srv.cat : 'Psicología');
    setSDesc(srv ? srv.desc : '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!sName.trim() || !sDesc.trim()) {
      showToast('Completa los campos obligatorios.');
      return;
    }
    const ok = await onSaveService({
      id: editId,
      name: sName.trim(),
      cat: sCat,
      desc: sDesc.trim()
    });
    if (ok) setModalOpen(false);
  };

  return (
    <div>
      <PageHead
        title="Servicios"
        subtitle="Crea, edita o desactiva servicios de bienestar."
        action={
          <button
            onClick={() => openModal(null)}
            className="root-btn root-btn-primary"
          >
            + Crear servicio
          </button>
        }
      />

      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Servicio</th>
              <th className="py-3 px-2.5 text-left">Categoría</th>
              <th className="py-3 px-2.5 text-left">Descripción</th>
              <th className="py-3 px-2.5 text-left">Estado</th>
              <th className="py-3 px-2.5 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {state.services.map((s) => (
              <tr key={s.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                <td className="py-3.5 px-2.5 whitespace-nowrap">
                  {s.name}
                </td>
                <td className="py-3.5 px-2.5">{s.cat}</td>
                <td className="py-3.5 px-2.5">{s.desc}</td>
                <td className="py-3.5 px-2.5">
                  <StatusBadge status={s.active ? 'Activo' : 'Inactivo'} />
                </td>
                <td className="py-3.5 px-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => openModal(s)}
                      className="root-btn root-btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onToggleService(s.id)}
                      className="root-btn root-btn-sm root-btn-danger"
                    >
                      {s.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editId ? 'Editar servicio' : 'Crear servicio'}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="root-label">Nombre *</label>
            <input
              className="root-input"
              value={sName}
              onChange={(e) => setSName(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Categoría *</label>
            <select
              className="root-input"
              value={sCat}
              onChange={(e) => setSCat(e.target.value)}
            >
              <option>Psicología</option>
              <option>Salud</option>
              <option>Deportes</option>
              <option>Cultura</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="root-label">Descripción *</label>
            <textarea
              className="root-input min-h-[100px]"
              value={sDesc}
              onChange={(e) => setSDesc(e.target.value)}
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

export function AdminAppointments({ state, onUpdateAppointment }) {
  return (
    <div>
      <PageHead
        title="Citas"
        subtitle="Supervisa citas, estados, reasignaciones y cancelaciones."
      />
      <div className="root-card">
        <ProAppointmentTable
          appointments={state.appointments}
          professionals={state.professionals}
          onUpdateAppointment={onUpdateAppointment}
        />
      </div>
    </div>
  );
}

export function AdminActivities({
  state,
  onSaveActivity,
  onCancelActivity,
  showToast
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [acName, setAcName] = useState('');
  const [acCat, setAcCat] = useState('Salud');
  const [acDate, setAcDate] = useState('');
  const [acTime, setAcTime] = useState('15:00');
  const [acCap, setAcCap] = useState(30);
  const [acPlace, setAcPlace] = useState('');

  const openModal = (act = null) => {
    setEditId(act ? act.id : 0);
    setAcName(act ? act.name : '');
    setAcCat(act ? act.cat : 'Salud');
    setAcDate(act ? act.date : '2026-10-25');
    setAcTime(act ? act.time : '15:00');
    setAcCap(act ? act.capacity : 30);
    setAcPlace(act ? act.place : '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!acName.trim()) {
      showToast('El nombre es obligatorio.');
      return;
    }
    const ok = await onSaveActivity({
      id: editId,
      name: acName.trim(),
      cat: acCat,
      date: acDate,
      time: acTime,
      capacity: Number(acCap) || 30,
      place: acPlace.trim()
    });
    if (ok) setModalOpen(false);
  };

  return (
    <div>
      <PageHead
        title="Actividades"
        subtitle="Crea, modifica o cancela actividades y talleres."
        action={
          <button
            onClick={() => openModal(null)}
            className="root-btn root-btn-primary"
          >
            + Nueva actividad
          </button>
        }
      />

      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Actividad</th>
              <th className="py-3 px-2.5 text-left">Fecha</th>
              <th className="py-3 px-2.5 text-left">Cupos</th>
              <th className="py-3 px-2.5 text-left">Estado</th>
              <th className="py-3 px-2.5 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {state.activities.map((a) => (
              <tr key={a.id} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                <td className="py-3.5 px-2.5">{a.name}</td>
                <td className="py-3.5 px-2.5 whitespace-nowrap">
                  {a.date} {a.time}
                </td>
                <td className="py-3.5 px-2.5">
                  {a.enrolled}/{a.capacity}
                </td>
                <td className="py-3.5 px-2.5">
                  <StatusBadge status={a.status} />
                </td>
                <td className="py-3.5 px-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => openModal(a)}
                      className="root-btn root-btn-sm"
                    >
                      Editar
                    </button>
                    {a.status !== 'Cancelada' && (
                      <button
                        onClick={() => onCancelActivity(a.id)}
                        className="root-btn root-btn-sm root-btn-danger"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editId ? 'Editar actividad' : 'Crear actividad'}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="root-label">Nombre *</label>
            <input
              className="root-input"
              value={acName}
              onChange={(e) => setAcName(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Categoría</label>
            <select
              className="root-input"
              value={acCat}
              onChange={(e) => setAcCat(e.target.value)}
            >
              <option>Salud</option>
              <option>Deportes</option>
              <option>Cultura</option>
            </select>
          </div>
          <div>
            <label className="root-label">Fecha</label>
            <input
              type="date"
              className="root-input"
              value={acDate}
              onChange={(e) => setAcDate(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Hora</label>
            <input
              type="time"
              className="root-input"
              value={acTime}
              onChange={(e) => setAcTime(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Capacidad</label>
            <input
              type="number"
              className="root-input"
              value={acCap}
              onChange={(e) => setAcCap(e.target.value)}
            />
          </div>
          <div>
            <label className="root-label">Lugar</label>
            <input
              className="root-input"
              value={acPlace}
              onChange={(e) => setAcPlace(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleSave} className="root-btn root-btn-primary">
            Guardar actividad
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function AdminReports({ state }) {
  const effectiveAppts = state.appointments.filter(
    (a) => a.status !== 'Cancelada'
  ).length;
  const totalEnrolled = state.activities.reduce((n, a) => n + a.enrolled, 0);
  const serviceStats = [
    ['Psicología', 46],
    ['Salud', 26],
    ['Deportes', 16],
    ['Cultura', 12]
  ];

  return (
    <div>
      <PageHead
        title="Reportes y estadísticas"
        subtitle="Indicadores para la toma de decisiones administrativas."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard number={effectiveAppts} label="Citas efectivas" icon="◷" />
        <StatCard number={state.attentions.length} label="Atenciones" icon="▤" />
        <StatCard number={totalEnrolled} label="Inscripciones" icon="✓" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="root-card">
          <h3 className="text-base font-bold mb-3.5">Demanda semanal</h3>
          <BarChart />
        </div>

        <div className="root-card">
          <h3 className="text-base font-bold mb-4">Servicios más solicitados</h3>
          <div className="space-y-4 mt-2">
            {serviceStats.map(([label, pct]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{label}</span>
                  <span className="font-semibold text-slate-300">{pct}%</span>
                </div>
                <div className="h-2 bg-[#1e2433] rounded-full overflow-hidden">
                  <span
                    style={{ width: `${pct}%` }}
                    className="block h-full bg-gradient-to-r from-rootBlue to-[#60a5fa]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminAudit({ state }) {
  return (
    <div>
      <PageHead
        title="Auditoría"
        subtitle="Trazabilidad de acciones relevantes realizadas en el sistema."
      />
      <div className="root-card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rootBorder text-[11px] uppercase text-[#788195]">
              <th className="py-3 px-2.5 text-left">Fecha</th>
              <th className="py-3 px-2.5 text-left">Actor</th>
              <th className="py-3 px-2.5 text-left">Acción</th>
              <th className="py-3 px-2.5 text-left">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {state.audit.map((a, idx) => (
              <tr key={idx} className="border-b border-rootBorder text-[13px] text-[#dbe0ea]">
                <td className="py-3.5 px-2.5 whitespace-nowrap">{a.date}</td>
                <td className="py-3.5 px-2.5">{a.actor}</td>
                <td className="py-3.5 px-2.5">{a.action}</td>
                <td className="py-3.5 px-2.5">{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
