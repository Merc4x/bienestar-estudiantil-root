const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { initialData } = require('./data/seed');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error leyendo db.json, restaurando datos semilla:', err.message);
  }
  const fresh = JSON.parse(JSON.stringify(initialData));
  saveDB(fresh);
  return fresh;
}

function saveDB(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

let db = loadDB();

function addLog(actor, action, detail) {
  db.audit.unshift({
    date: new Date().toLocaleString('es-CO'),
    actor: actor || 'Sistema',
    action,
    detail
  });
}

function addNotification(text) {
  db.notifications.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    text,
    date: new Date().toISOString().slice(0, 10),
    read: false
  });
}

// Health check & state
app.get('/api/health', (req, res) => {
  res.json({ ok: true, engine: 'Node.js + Express JSON DB', timestamp: new Date().toISOString() });
});

app.get('/api/state', (req, res) => {
  res.json(db);
});

app.post('/api/reset', (req, res) => {
  db = JSON.parse(JSON.stringify(initialData));
  saveDB(db);
  res.json({ ok: true, state: db, message: 'Base de datos restaurada a valores iniciales.' });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email = '', password = '' } = req.body;
  if (password !== '123456') {
    return res.status(401).json({ ok: false, message: 'Credenciales inválidas. Usa la contraseña de demo 123456.' });
  }
  const user = db.users.find(
    u => u.email.toLowerCase() === email.trim().toLowerCase() && u.status === 'Activo'
  );
  if (!user) {
    return res.status(404).json({ ok: false, message: 'Usuario no encontrado o inactivo.' });
  }
  addLog(user.name, 'Inicio de sesión', `Ingreso con correo ${user.email}`);
  saveDB(db);
  res.json({ ok: true, user, state: db });
});

// Notifications
app.post('/api/notifications/read-all', (req, res) => {
  db.notifications.forEach(n => {
    n.read = true;
  });
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Appointments
app.post('/api/appointments', (req, res) => {
  const { student, professional, service, date, time, actor } = req.body;
  if (!student || !professional || !service || !date || !time) {
    return res.status(400).json({ ok: false, message: 'Todos los campos de la cita son obligatorios.' });
  }
  const busy = db.appointments.some(
    a => a.professional === professional && a.date === date && a.time === time && a.status !== 'Cancelada'
  );
  if (busy) {
    return res.status(409).json({ ok: false, message: 'La franja horaria seleccionada ya está ocupada.' });
  }
  const appt = {
    id: Date.now(),
    student,
    professional,
    service,
    date,
    time,
    status: 'Programada'
  };
  db.appointments.push(appt);
  addNotification(`Confirmación: tu cita de ${appt.service} quedó para ${appt.date} a las ${appt.time}.`);
  addLog(actor || student, 'Solicitud de cita', `Cita ${appt.id} creada y cupo bloqueado.`);
  saveDB(db);
  res.json({ ok: true, appointment: appt, state: db });
});

app.patch('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const appt = db.appointments.find(a => a.id === id);
  if (!appt) {
    return res.status(404).json({ ok: false, message: 'Cita no encontrada.' });
  }
  const { status, reason, note, professional, date, time, actor } = req.body;

  if (status && status !== appt.status) {
    const old = appt.status;
    appt.status = status;
    if (reason !== undefined) appt.reason = reason;
    if (note !== undefined) appt.note = note;
    if (status === 'Cancelada' && reason) {
      addNotification(`Tu cita de ${appt.service} fue cancelada. Motivo registrado.`);
      addLog(actor, 'Cancelación de cita', `Cita ${id}. Motivo: ${reason}`);
    } else {
      addNotification(`Actualización de cita: ${appt.service} ahora está en estado ${status}.`);
      addLog(actor, 'Cambio de estado', `Cita ${id}: ${old} → ${status}`);
    }
  } else if (professional || date || time) {
    if (professional) appt.professional = professional;
    if (date) appt.date = date;
    if (time) appt.time = time;
    addNotification(`Tu cita fue reasignada a ${appt.date} ${appt.time} con ${appt.professional}.`);
    addLog(actor, 'Reasignación de cita', `Cita ${id} reasignada.`);
  }

  saveDB(db);
  res.json({ ok: true, appointment: appt, state: db });
});

// Activities & Enrollments
app.post('/api/activities/:id/enroll', (req, res) => {
  const id = Number(req.params.id);
  const { user, actor } = req.body;
  const act = db.activities.find(a => a.id === id);
  if (!act) return res.status(404).json({ ok: false, message: 'Actividad no encontrada.' });
  if (act.enrolled >= act.capacity) {
    return res.status(400).json({ ok: false, message: 'No hay cupos disponibles.' });
  }
  const already = db.enrollments.some(e => e.activityId === id && e.user === user);
  if (already) {
    return res.status(400).json({ ok: false, message: 'Ya estás inscrito en esta actividad.' });
  }
  act.enrolled += 1;
  db.enrollments.push({
    id: Date.now(),
    activityId: id,
    user,
    date: new Date().toISOString().slice(0, 10)
  });
  addNotification(`Inscripción confirmada: ${act.name}.`);
  addLog(actor || user, 'Inscripción en actividad', act.name);
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.delete('/api/enrollments/:id', (req, res) => {
  const id = Number(req.params.id);
  const enrollment = db.enrollments.find(e => e.id === id);
  if (!enrollment) return res.status(404).json({ ok: false, message: 'Inscripción no encontrada.' });
  const act = db.activities.find(a => a.id === enrollment.activityId);
  if (act && act.enrolled > 0) act.enrolled -= 1;
  db.enrollments = db.enrollments.filter(e => e.id !== id);
  addLog(enrollment.user, 'Cancelación de inscripción', act ? act.name : `Actividad ${enrollment.activityId}`);
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Availability (Professional)
app.post('/api/availability', (req, res) => {
  const { professional, oldDate, date, slots, actor } = req.body;
  if (!professional || !date || !Array.isArray(slots) || !slots.length) {
    return res.status(400).json({ ok: false, message: 'Completa fecha y franjas.' });
  }
  const active = db.appointments.some(
    a => a.professional === professional && a.date === date && a.status !== 'Cancelada'
  );
  if (active && oldDate !== date) {
    return res.status(400).json({ ok: false, message: 'La fecha tiene citas activas y no puede modificarse.' });
  }
  if (oldDate) {
    const existing = db.availability.find(a => a.professional === professional && a.date === oldDate);
    if (existing) {
      existing.date = date;
      existing.slots = slots;
    } else {
      db.availability.push({ professional, date, slots });
    }
  } else {
    const existingSameDate = db.availability.find(a => a.professional === professional && a.date === date);
    if (existingSameDate) {
      existingSameDate.slots = slots;
    } else {
      db.availability.push({ professional, date, slots });
    }
  }
  addLog(actor || professional, 'Actualización de disponibilidad', date);
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.delete('/api/availability', (req, res) => {
  const { professional, date, actor } = req.body;
  const active = db.appointments.some(
    a => a.professional === professional && a.date === date && a.status !== 'Cancelada'
  );
  if (active) {
    return res.status(400).json({ ok: false, message: 'No se puede bloquear: existen citas activas.' });
  }
  db.availability = db.availability.filter(a => !(a.professional === professional && a.date === date));
  addLog(actor || professional, 'Bloqueo de disponibilidad', date);
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Attentions & Followups
app.post('/api/attentions', (req, res) => {
  const { id, student, type, notes, professional, actor } = req.body;
  if (!student || !notes) {
    return res.status(400).json({ ok: false, message: 'Estudiante y notas son obligatorios.' });
  }
  if (id) {
    const existing = db.attentions.find(a => a.id === Number(id));
    if (existing) {
      existing.student = student;
      existing.type = type || 'Psicológica';
      existing.notes = notes;
      addLog(actor || professional, 'Edición de atención', `Registro ${existing.id}`);
    }
  } else {
    const created = {
      id: Date.now(),
      student,
      professional,
      date: new Date().toISOString().slice(0, 10),
      type: type || 'Psicológica',
      notes
    };
    db.attentions.push(created);
    addLog(actor || professional, 'Registro de atención', `Registro ${created.id}`);
  }
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.post('/api/followups', (req, res) => {
  const { note, professional, actor } = req.body;
  if (!note) return res.status(400).json({ ok: false, message: 'Escribe una nota.' });
  db.followups.push({
    id: Date.now(),
    attentionId: db.attentions[0]?.id || 1,
    date: new Date().toISOString().slice(0, 10),
    note,
    professional
  });
  addLog(actor || professional, 'Seguimiento de caso', 'Nueva nota');
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Admin: Users
app.post('/api/users', (req, res) => {
  const { id, name, email, role, status, program, actor } = req.body;
  if (!name || !email || !email.endsWith('@tdea.edu.co')) {
    return res.status(400).json({ ok: false, message: 'Nombre y correo institucional (@tdea.edu.co) son obligatorios.' });
  }
  if (id) {
    const u = db.users.find(x => x.id === Number(id));
    if (u) {
      u.name = name;
      u.email = email;
      if (role) u.role = role;
      if (status) u.status = status;
      if (program) u.program = program;
      addLog(actor || 'Administrador Root', 'Gestión de usuarios', `Editado ${u.email}`);
    }
  } else {
    const u = {
      id: Date.now(),
      name,
      email,
      role: role || 'Estudiante',
      status: status || 'Activo',
      program: program || 'Ingeniería de Software'
    };
    db.users.push(u);
    addLog(actor || 'Administrador Root', 'Gestión de usuarios', `Creado ${u.email}`);
  }
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.patch('/api/users/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const u = db.users.find(x => x.id === id);
  if (!u) return res.status(404).json({ ok: false, message: 'Usuario no encontrado.' });
  u.status = u.status === 'Activo' ? 'Inactivo' : 'Activo';
  addLog(req.body.actor || 'Administrador Root', 'Cambio de estado de usuario', `${u.email}: ${u.status}`);
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.patch('/api/users/:id/role', (req, res) => {
  const id = Number(req.params.id);
  const u = db.users.find(x => x.id === id);
  if (!u) return res.status(404).json({ ok: false, message: 'Usuario no encontrado.' });
  u.role = req.body.role;
  addLog(req.body.actor || 'Administrador Root', 'Asignación de rol', `${u.email} -> ${u.role}`);
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Admin: Professionals
app.post('/api/professionals', (req, res) => {
  const { id, name, email, specialty, actor } = req.body;
  if (!name || !email) {
    return res.status(400).json({ ok: false, message: 'Completa los campos obligatorios.' });
  }
  if (id) {
    const p = db.professionals.find(x => x.id === Number(id));
    if (p) {
      p.name = name;
      p.email = email;
      p.specialty = specialty;
    }
  } else {
    db.professionals.push({
      id: Date.now(),
      name,
      email,
      specialty: specialty || 'Psicología',
      active: true
    });
  }
  addLog(actor || 'Administrador Root', 'Gestión de profesionales', name);
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Admin: Services
app.post('/api/services', (req, res) => {
  const { id, name, cat, desc, icon, actor } = req.body;
  if (!name || !desc) {
    return res.status(400).json({ ok: false, message: 'Completa los campos obligatorios.' });
  }
  if (id) {
    const s = db.services.find(x => x.id === Number(id));
    if (s) {
      s.name = name;
      s.cat = cat;
      s.desc = desc;
      if (icon) s.icon = icon;
    }
  } else {
    db.services.push({
      id: Date.now(),
      name,
      cat: cat || 'Psicología',
      desc,
      icon: icon || (cat || 'Srv').slice(0, 3),
      active: true
    });
  }
  addLog(actor || 'Administrador Root', 'Gestión de servicios', name);
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.patch('/api/services/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const s = db.services.find(x => x.id === id);
  if (!s) return res.status(404).json({ ok: false, message: 'Servicio no encontrado.' });
  s.active = !s.active;
  addLog(req.body.actor || 'Administrador Root', 'Estado de servicio', `${s.name}: ${s.active ? 'Activo' : 'Inactivo'}`);
  saveDB(db);
  res.json({ ok: true, state: db });
});

// Admin: Activities
app.post('/api/activities', (req, res) => {
  const { id, name, cat, date, time, capacity, place, actor } = req.body;
  if (!name) return res.status(400).json({ ok: false, message: 'El nombre es obligatorio.' });
  if (id) {
    const a = db.activities.find(x => x.id === Number(id));
    if (a) {
      a.name = name;
      a.cat = cat;
      a.date = date;
      a.time = time;
      a.capacity = Number(capacity) || 30;
      a.place = place;
    }
  } else {
    db.activities.push({
      id: Date.now(),
      name,
      cat: cat || 'Salud',
      date: date || '2026-10-25',
      time: time || '15:00',
      capacity: Number(capacity) || 30,
      enrolled: 0,
      status: 'Activo',
      place: place || 'Campus TdeA'
    });
  }
  addLog(actor || 'Administrador Root', 'Gestión de actividades', name);
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.patch('/api/activities/:id/cancel', (req, res) => {
  const id = Number(req.params.id);
  const a = db.activities.find(x => x.id === id);
  if (!a) return res.status(404).json({ ok: false, message: 'Actividad no encontrada.' });
  a.status = 'Cancelada';
  db.enrollments
    .filter(e => e.activityId === id)
    .forEach(() => addNotification(`La actividad ${a.name} fue cancelada.`));
  addLog(req.body.actor || 'Administrador Root', 'Cancelación de actividad', a.name);
  saveDB(db);
  res.json({ ok: true, state: db });
});

app.listen(PORT, () => {
  console.log(`Servidor Node.js + Express de Bienestar Estudiantil (Root) activo en http://localhost:${PORT}`);
});
