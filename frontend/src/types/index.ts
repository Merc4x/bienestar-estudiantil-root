export type RoleKey = 'student' | 'professional' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Estudiante' | 'Profesional' | 'Administrador' | 'Personal autorizado' | string;
  status: 'Activo' | 'Inactivo' | string;
  program?: string;
  specialty?: string;
}

export interface Service {
  id: number;
  name: string;
  cat: 'Psicología' | 'Salud' | 'Deportes' | 'Cultura' | string;
  icon: string;
  desc: string;
  active: boolean;
}

export interface Professional {
  id: number;
  name: string;
  specialty: string;
  email: string;
  active: boolean;
}

export interface Appointment {
  id: number;
  student: string;
  professional: string;
  service: string;
  date: string;
  time: string;
  status: 'Programada' | 'Confirmada' | 'Atendida' | 'Completada' | 'Cancelada' | string;
  reason?: string;
  note?: string;
}

export interface Activity {
  id: number;
  name: string;
  cat: string;
  date: string;
  time: string;
  capacity: number;
  enrolled: number;
  status: 'Activo' | 'Cancelada' | string;
  place: string;
}

export interface Enrollment {
  id: number;
  activityId: number;
  user: string;
  date: string;
}

export interface Attention {
  id: number;
  student: string;
  professional: string;
  date: string;
  type: string;
  notes: string;
}

export interface Followup {
  id: number;
  attentionId: number;
  date: string;
  note: string;
  professional: string;
}

export interface NotificationItem {
  id: number;
  text: string;
  date: string;
  read: boolean;
}

export interface AuditLog {
  date: string;
  actor: string;
  action: string;
  detail: string;
}

export interface Availability {
  professional: string;
  date: string;
  slots: string[];
}

export interface AppState {
  users: User[];
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  activities: Activity[];
  enrollments: Enrollment[];
  attentions: Attention[];
  followups: Followup[];
  notifications: NotificationItem[];
  audit: AuditLog[];
  availability: Availability[];
}

