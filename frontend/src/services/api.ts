const STORAGE_KEY = 'rootBienestarReactDB_v3';

export const SEED_DATA = {
  users: [
    { id: 1, name: 'Juan Diego', email: 'estudiante@tdea.edu.co', role: 'Estudiante', status: 'Activo', program: 'Ingeniería de Software' },
    { id: 2, name: 'Laura Gómez', email: 'profesional@tdea.edu.co', role: 'Profesional', status: 'Activo', specialty: 'Psicología' },
    { id: 3, name: 'Administrador Root', email: 'admin@tdea.edu.co', role: 'Administrador', status: 'Activo' },
    { id: 4, name: 'Carlos Pérez', email: 'carlos@tdea.edu.co', role: 'Estudiante', status: 'Activo', program: 'Ingeniería de Software' },
    { id: 5, name: 'Ana Torres', email: 'ana@tdea.edu.co', role: 'Profesional', status: 'Activo', specialty: 'Medicina' }
  ],
  services: [
    { id: 1, name: 'Psicología', cat: 'Psicología', icon: 'Psi', desc: 'Orientación psicológica y acompañamiento individual.', active: true },
    { id: 2, name: 'Medicina', cat: 'Salud', icon: 'Med', desc: 'Atención y orientación en salud integral.', active: true },
    { id: 3, name: 'Deportes', cat: 'Deportes', icon: 'Dep', desc: 'Actividades físicas, recreativas y deportivas.', active: true },
    { id: 4, name: 'Cultura', cat: 'Cultura', icon: 'Cul', desc: 'Talleres, arte y actividades culturales.', active: true }
  ],
  professionals: [
    { id: 1, name: 'Laura Gómez', specialty: 'Psicología', email: 'profesional@tdea.edu.co', active: true },
    { id: 2, name: 'Ana Torres', specialty: 'Medicina', email: 'ana@tdea.edu.co', active: true },
    { id: 3, name: 'Andrés Ruiz', specialty: 'Deportes', email: 'andres@tdea.edu.co', active: true }
  ],
  appointments: [
    { id: 101, student: 'Juan Diego', professional: 'Laura Gómez', service: 'Psicología', date: '2026-10-08', time: '09:00', status: 'Programada' },
    { id: 102, student: 'Carlos Pérez', professional: 'Laura Gómez', service: 'Psicología', date: '2026-10-08', time: '10:00', status: 'Confirmada' },
    { id: 103, student: 'Juan Diego', professional: 'Ana Torres', service: 'Medicina', date: '2026-10-12', time: '14:00', status: 'Programada' }
  ],
  activities: [
    { id: 1, name: 'Taller de manejo del estrés', cat: 'Salud', date: '2026-10-15', time: '15:00', capacity: 30, enrolled: 18, status: 'Activo', place: 'Bloque B · Aula 204' },
    { id: 2, name: 'Torneo relámpago', cat: 'Deportes', date: '2026-10-20', time: '10:00', capacity: 40, enrolled: 32, status: 'Activo', place: 'Cancha principal' },
    { id: 3, name: 'Cine foro universitario', cat: 'Cultura', date: '2026-10-22', time: '17:00', capacity: 50, enrolled: 21, status: 'Activo', place: 'Auditorio' }
  ],
  enrollments: [
    { id: 1, activityId: 1, user: 'Juan Diego', date: '2026-09-30' }
  ],
  attentions: [
    { id: 1, student: 'Juan Diego', professional: 'Laura Gómez', date: '2026-09-25', type: 'Psicológica', notes: 'Orientación inicial y acuerdos de seguimiento.' }
  ],
  followups: [
    { id: 1, attentionId: 1, date: '2026-10-05', note: 'Seguimiento programado.', professional: 'Laura Gómez' }
  ],
  notifications: [
    { id: 1, text: 'Tu cita de Psicología está programada para el 8 de octubre a las 09:00.', date: '2026-10-05', read: false },
    { id: 2, text: 'Tienes una actividad inscrita: Taller de manejo del estrés.', date: '2026-10-05', read: false }
  ],
  audit: [
    { date: '2026-10-05 18:30', actor: 'Administrador Root', action: 'Inicio del sistema', detail: 'Sesión de demostración' }
  ],
  availability: [
    { professional: 'Laura Gómez', date: '2026-10-08', slots: ['08:00', '09:00', '10:00', '11:00', '14:00'] },
    { professional: 'Laura Gómez', date: '2026-10-09', slots: ['08:00', '09:00', '13:00', '14:00', '15:00'] },
    { professional: 'Ana Torres', date: '2026-10-12', slots: ['13:00', '14:00', '15:00', '16:00'] },
    { professional: 'Andrés Ruiz', date: '2026-10-20', slots: ['09:00', '10:00', '11:00', '12:00'] }
  ]
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getLocalDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  const fresh = JSON.parse(JSON.stringify(SEED_DATA));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveLocalDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
}

function localLog(db, actor, action, detail) {
  db.audit.unshift({
    date: new Date().toLocaleString('es-CO'),
    actor: actor || 'Sistema',
    action,
    detail
  });
}

function localNotify(db, text) {
  db.notifications.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    text,
    date: new Date().toISOString().slice(0, 10),
    read: false
  });
}

async function request(endpoint, options = {}, fallbackFn) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error en la solicitud al servidor');
    }
    if (data.state) {
      saveLocalDB(data.state);
    }
    return { ...data, mode: 'node' };
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch') && err.name !== 'AbortError' && !err.message.includes('NetworkError')) {
      throw err;
    }
    const result = fallbackFn(getLocalDB());
    saveLocalDB(result.state);
    return { ...result, mode: 'github-pages-local' };
  }
}

export const api = {
  async fetchState() {
    return request('/state', { method: 'GET' }, (db) => ({ ok: true, state: db }));
  },

  async resetDB() {
    return request('/reset', { method: 'POST' }, () => {
      const fresh = JSON.parse(JSON.stringify(SEED_DATA));
      return { ok: true, state: fresh };
    });
  },

  async login(email, password) {
    return request(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      (db) => {
        if (password !== '123456') {
          throw new Error('Credenciales inválidas. Usa la contraseña de demo 123456.');
        }
        const user = db.users.find(
          u => u.email.toLowerCase() === email.trim().toLowerCase() && u.status === 'Activo'
        );
        if (!user) {
          throw new Error('Usuario no encontrado o inactivo.');
        }
        localLog(db, user.name, 'Inicio de sesión', `Ingreso con correo ${user.email}`);
        return { ok: true, user, state: db };
      }
    );
  },

  async markAllNotificationsRead() {
    return request('/notifications/read-all', { method: 'POST' }, (db) => {
      db.notifications.forEach(n => { n.read = true; });
      return { ok: true, state: db };
    });
  },

  async createAppointment(payload) {
    return request(
      '/appointments',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { student, professional, service, date, time, actor } = payload;
        const appt = { id: Date.now(), student, professional, service, date, time, status: 'Programada' };
        db.appointments.push(appt);
        localNotify(db, `Confirmación: tu cita de ${appt.service} quedó para ${appt.date} a las ${appt.time}.`);
        localLog(db, actor || student, 'Solicitud de cita', `Cita ${appt.id} creada y cupo bloqueado.`);
        return { ok: true, appointment: appt, state: db };
      }
    );
  },

  async updateAppointment(id, payload) {
    return request(
      `/appointments/${id}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      (db) => {
        const appt = db.appointments.find(a => a.id === Number(id));
        if (!appt) throw new Error('Cita no encontrada.');
        const { status, reason, note, professional, date, time, actor } = payload;
        if (status && status !== appt.status) {
          const old = appt.status;
          appt.status = status;
          if (reason !== undefined) appt.reason = reason;
          if (note !== undefined) appt.note = note;
          if (status === 'Cancelada' && reason) {
            localNotify(db, `Tu cita de ${appt.service} fue cancelada. Motivo registrado.`);
            localLog(db, actor, 'Cancelación de cita', `Cita ${id}. Motivo: ${reason}`);
          } else {
            localNotify(db, `Actualización de cita: ${appt.service} ahora está en estado ${status}.`);
            localLog(db, actor, 'Cambio de estado', `Cita ${id}: ${old} → ${status}`);
          }
        } else if (professional || date || time) {
          if (professional) appt.professional = professional;
          if (date) appt.date = date;
          if (time) appt.time = time;
          localNotify(db, `Tu cita fue reasignada a ${appt.date} ${appt.time}.`);
          localLog(db, actor, 'Reasignación de cita', `Cita ${id} reasignada.`);
        }
        return { ok: true, appointment: appt, state: db };
      }
    );
  },

  async enrollActivity(id, payload) {
    return request(
      `/activities/${id}/enroll`,
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const act = db.activities.find(a => a.id === Number(id));
        if (!act || act.enrolled >= act.capacity) throw new Error('No hay cupos disponibles.');
        act.enrolled += 1;
        db.enrollments.push({ id: Date.now(), activityId: Number(id), user: payload.user, date: new Date().toISOString().slice(0, 10) });
        localNotify(db, `Inscripción confirmada: ${act.name}.`);
        localLog(db, payload.actor || payload.user, 'Inscripción en actividad', act.name);
        return { ok: true, state: db };
      }
    );
  },

  async unenrollActivity(enrollmentId) {
    return request(
      `/enrollments/${enrollmentId}`,
      { method: 'DELETE' },
      (db) => {
        const e = db.enrollments.find(x => x.id === Number(enrollmentId));
        if (e) {
          const a = db.activities.find(x => x.id === e.activityId);
          if (a && a.enrolled > 0) a.enrolled -= 1;
          db.enrollments = db.enrollments.filter(x => x.id !== Number(enrollmentId));
        }
        return { ok: true, state: db };
      }
    );
  },

  async saveAvailability(payload) {
    return request(
      '/availability',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { professional, oldDate, date, slots, actor } = payload;
        const active = db.appointments.some(a => a.professional === professional && a.date === date && a.status !== 'Cancelada');
        if (active && oldDate !== date) throw new Error('La fecha tiene citas activas y no puede modificarse.');
        if (oldDate) {
          const x = db.availability.find(a => a.professional === professional && a.date === oldDate);
          if (x) { x.date = date; x.slots = slots; }
        } else {
          db.availability.push({ professional, date, slots });
        }
        localLog(db, actor || professional, 'Actualización de disponibilidad', date);
        return { ok: true, state: db };
      }
    );
  },

  async deleteAvailability(payload) {
    return request(
      '/availability',
      { method: 'DELETE', body: JSON.stringify(payload) },
      (db) => {
        const { professional, date, actor } = payload;
        const active = db.appointments.some(a => a.professional === professional && a.date === date && a.status !== 'Cancelada');
        if (active) throw new Error('No se puede bloquear: existen citas activas.');
        db.availability = db.availability.filter(a => !(a.professional === professional && a.date === date));
        localLog(db, actor || professional, 'Bloqueo de disponibilidad', date);
        return { ok: true, state: db };
      }
    );
  },

  async saveAttention(payload) {
    return request(
      '/attentions',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { id, student, type, notes, professional, actor } = payload;
        if (id) {
          const x = db.attentions.find(a => a.id === Number(id));
          if (x) { x.student = student; x.type = type; x.notes = notes; }
          localLog(db, actor || professional, 'Edición de atención', `Registro ${id}`);
        } else {
          const created = { id: Date.now(), professional, date: new Date().toISOString().slice(0, 10), student, type, notes };
          db.attentions.push(created);
          localLog(db, actor || professional, 'Registro de atención', `Registro ${created.id}`);
        }
        return { ok: true, state: db };
      }
    );
  },

  async saveFollowup(payload) {
    return request(
      '/followups',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { note, professional, actor } = payload;
        db.followups.push({ id: Date.now(), attentionId: db.attentions[0]?.id || 1, date: new Date().toISOString().slice(0, 10), note, professional });
        localLog(db, actor || professional, 'Seguimiento de caso', 'Nueva nota');
        return { ok: true, state: db };
      }
    );
  },

  async saveUser(payload) {
    return request(
      '/users',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { id, name, email, role, status, actor } = payload;
        if (!name || !email || !email.endsWith('@tdea.edu.co')) {
          throw new Error('Nombre y correo institucional (@tdea.edu.co) son obligatorios.');
        }
        if (id) {
          const u = db.users.find(x => x.id === Number(id));
          if (u) { u.name = name; u.email = email; u.role = role; u.status = status; }
        } else {
          db.users.push({ id: Date.now(), name, email, role, status });
        }
        localLog(db, actor || 'Administrador Root', 'Gestión de usuarios', `${id ? 'Editado' : 'Creado'} ${email}`);
        return { ok: true, state: db };
      }
    );
  },

  async toggleUser(id, actor) {
    return request(
      `/users/${id}/toggle`,
      { method: 'PATCH', body: JSON.stringify({ actor }) },
      (db) => {
        const u = db.users.find(x => x.id === Number(id));
        if (u) {
          u.status = u.status === 'Activo' ? 'Inactivo' : 'Activo';
          localLog(db, actor || 'Administrador Root', 'Cambio de estado de usuario', `${u.email}: ${u.status}`);
        }
        return { ok: true, state: db };
      }
    );
  },

  async updateUserRole(id, role, actor) {
    return request(
      `/users/${id}/role`,
      { method: 'PATCH', body: JSON.stringify({ role, actor }) },
      (db) => {
        const u = db.users.find(x => x.id === Number(id));
        if (u) {
          u.role = role;
          localLog(db, actor || 'Administrador Root', 'Asignación de rol', u.email);
        }
        return { ok: true, state: db };
      }
    );
  },

  async saveProfessional(payload) {
    return request(
      '/professionals',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { id, name, email, specialty, actor } = payload;
        if (!name || !email) throw new Error('Completa los campos obligatorios.');
        if (id) {
          const p = db.professionals.find(x => x.id === Number(id));
          if (p) { p.name = name; p.email = email; p.specialty = specialty; }
        } else {
          db.professionals.push({ id: Date.now(), name, email, specialty, active: true });
        }
        localLog(db, actor || 'Administrador Root', 'Gestión de profesionales', name);
        return { ok: true, state: db };
      }
    );
  },

  async saveService(payload) {
    return request(
      '/services',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { id, name, cat, desc, actor } = payload;
        if (!name || !desc) throw new Error('Completa los campos obligatorios.');
        if (id) {
          const s = db.services.find(x => x.id === Number(id));
          if (s) { s.name = name; s.cat = cat; s.desc = desc; }
        } else {
          db.services.push({ id: Date.now(), name, cat, desc, active: true, icon: cat.slice(0, 3) });
        }
        localLog(db, actor || 'Administrador Root', 'Gestión de servicios', name);
        return { ok: true, state: db };
      }
    );
  },

  async toggleService(id, actor) {
    return request(
      `/services/${id}/toggle`,
      { method: 'PATCH', body: JSON.stringify({ actor }) },
      (db) => {
        const s = db.services.find(x => x.id === Number(id));
        if (s) {
          s.active = !s.active;
          localLog(db, actor || 'Administrador Root', 'Estado de servicio', `${s.name}: ${s.active ? 'Activo' : 'Inactivo'}`);
        }
        return { ok: true, state: db };
      }
    );
  },

  async saveActivity(payload) {
    return request(
      '/activities',
      { method: 'POST', body: JSON.stringify(payload) },
      (db) => {
        const { id, name, cat, date, time, capacity, place, actor } = payload;
        if (!name) throw new Error('El nombre es obligatorio.');
        if (id) {
          const a = db.activities.find(x => x.id === Number(id));
          if (a) { a.name = name; a.cat = cat; a.date = date; a.time = time; a.capacity = Number(capacity); a.place = place; }
        } else {
          db.activities.push({ id: Date.now(), name, cat, date, time, capacity: Number(capacity), enrolled: 0, status: 'Activo', place });
        }
        localLog(db, actor || 'Administrador Root', 'Gestión de actividades', name);
        return { ok: true, state: db };
      }
    );
  },

  async cancelActivity(id, actor) {
    return request(
      `/activities/${id}/cancel`,
      { method: 'PATCH', body: JSON.stringify({ actor }) },
      (db) => {
        const a = db.activities.find(x => x.id === Number(id));
        if (a) {
          a.status = 'Cancelada';
          db.enrollments.filter(e => e.activityId === Number(id)).forEach(() => localNotify(db, `La actividad ${a.name} fue cancelada.`));
          localLog(db, actor || 'Administrador Root', 'Cancelación de actividad', a.name);
        }
        return { ok: true, state: db };
      }
    );
  }
};
