export type Role = 'rh' | 'direcao' | 'mentor' | 'bolseiro'
export type Theme = 'light' | 'dark'
export type Density = 'compact' | 'balanced' | 'comfortable'

// ── Participant kind ──────────────────────────────────────────────────────────
// bolseiro  = scholarship student (bif/bnac/lid/mest) — academic focus, stipends
// estagiario = trainee/intern (fbfa) — professional focus, rotations, competencies
// voluntario = community volunteer — CSR, hours-based, unpaid
export type ParticipantKind = 'bolseiro' | 'estagiario'

export type TalentStatus = 'active' | 'delayed' | 'risk' | 'completed' | 'hired' | 'pending' | 'onboarding'
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'hold'
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'overdue'
export type AbsenceStatus = 'pending' | 'approved' | 'rejected'
export type WorkflowStatus = 'pending' | 'approved' | 'rejected'
export type ApplicationStage = 'triagem' | 'entrevista1' | 'entrevista2' | 'avaliacao' | 'aprovacao' | 'oferta' | 'rejeitado'
export type ApplicationTipo = 'bolseiro' | 'estagiario' | 'voluntariado'
export type RotationStatus = 'concluida' | 'activa' | 'agendada'

// ── Agenda / Workshops ────────────────────────────────────────────────────────
export type EventoTipo = 'workshop' | 'formacao' | 'evento' | 'mentoria' | 'convocatoria' | 'avaliacao'
export type EventoAudience = 'todos' | 'bolseiro' | 'estagiario' | 'voluntario' | 'mentor' | 'rh'

export interface Evento {
  id: string
  titulo: string
  tipo: EventoTipo
  descricao: string
  data: string        // YYYY-MM-DD
  horaInicio: string  // HH:MM
  horaFim: string
  local: string
  facilitador: string
  vagasTotal: number | null
  inscritos: string[] // talentId[] or volunteerV-xxx
  audiencia: EventoAudience[]
  obrigatorio: boolean
  programas: string[] // e.g. ['fbfa','bif'] or [] for all
}

// ── Presença / Horas ──────────────────────────────────────────────────────────
export type PresencaStatus = 'presente' | 'ausente' | 'justificado' | 'pendente'
export type SessaoTipo     = 'mentoria' | 'workshop' | 'avaliacao' | 'formacao' | 'evento'

export interface Presenca {
  id: string
  talentId: string
  talentName: string
  date: string          // YYYY-MM-DD
  dept: string
  entrada: string | null   // HH:MM
  saida: string | null     // HH:MM
  horas: number | null
  status: PresencaStatus
  supervisorOk: boolean
  nota: string
}

export interface SessaoBolseiro {
  id: string
  talentId: string
  talentName: string
  date: string
  tipo: SessaoTipo
  titulo: string
  duracaoH: number
  presente: boolean
  nota: string
}

// ── Voluntariado ─────────────────────────────────────────────────────────────
export type VolunteerStatus = 'activo' | 'inactivo' | 'desistente'
export type ActivityStatus  = 'agendada' | 'em_curso' | 'concluida' | 'cancelada'
export type ActivityType    = 'saude' | 'educacao' | 'ambiente' | 'social' | 'cultura'

export interface Volunteer {
  id: string
  nome: string
  email: string
  tel: string
  profissao: string
  instituicao: string
  provincia: string
  local: string
  dataInscricao: string
  status: VolunteerStatus
  areaActuacao: ActivityType
  totalHoras: number
  mentor?: string
}

export interface VolunteerActivity {
  id: string
  nome: string
  descricao: string
  tipo: ActivityType
  data: string
  horaInicio: string
  horaFim: string
  local: string
  provincia: string
  coordenador: string
  vagasTotal: number
  inscritos: number
  status: ActivityStatus
  horasPrevistas: number
}

export interface HoursEntry {
  id: string
  voluntarioId: string
  voluntarioNome: string
  actividadeId: string
  actividadeNome: string
  data: string
  horas: number
  validado: boolean
  validadoPor: string | null
}

// ── Rotation (Estagiários) ────────────────────────────────────────────────────
export interface Rotation {
  id: string
  talentId: string
  talentName: string
  dept: string
  supervisor: string
  startDate: string
  endDate: string
  status: RotationStatus
  notes: string
}

// ─────────────────────────────────────────────────────────────────────────────

export interface Program {
  id: string
  name: string
  kind: string
  color: string
}

export interface Talent {
  id: string
  name: string
  gender: 'M' | 'F'
  program: string
  kind: ParticipantKind
  university: string
  city: string
  country: string
  course: string
  year: string
  gpa: number
  status: TalentStatus
  dept: string
  mentor: string
  stipend: number
  startDate: string
  perf: number
  potential: 'alto' | 'médio' | 'baixo'
  riskScore: number
  lastReport: string
}

export interface Application {
  id: string
  name: string
  program: string
  tipo: ApplicationTipo
  stage: ApplicationStage
  score: number
  source: string
  appliedAt: string
  course: string
  uni: string
}

export interface Payment {
  id: string
  talent: string
  talentName: string
  type: string
  period: string
  amount: number
  status: PaymentStatus
  paidAt: string | null
  method: string
}

export interface Mentor {
  name: string
  dept: string
  mentees: number
  rating: number
}

export interface GeoPoint {
  country: string
  city: string
  count: number
  cost: number
}

export interface NineBoxItem {
  id: string
  name: string
  x: number
  y: number
}

export interface ActivityItem {
  id: number
  type: string
  text: string
  when: string
  actor: string
}

export interface Notification {
  id: number
  type: string
  title: string
  text: string
  when: string
  read: boolean
}

export interface BolseiroPayment {
  id: string
  period: string
  type: string
  amount: number
  status: PaymentStatus
  date: string
}

export interface Task {
  id: string
  title: string
  description: string
  talentId: string
  talentName: string
  assignedBy: string
  assignedByRole: 'rh' | 'mentor'
  category: string
  priority: 'alta' | 'média' | 'baixa'
  status: TaskStatus
  dueDate: string
  completedAt: string | null
}

export interface Absence {
  id: string
  talentId: string
  talentName: string
  program: string
  type: 'justificada' | 'injustificada'
  reason: string
  date: string
  days: number
  status: AbsenceStatus
  requestedAt: string
  approvedBy: string | null
  mentorNote: string | null
  rhNote: string | null
}

export interface MentorSession {
  id: string
  date: string
  time: string
  mentee: string
  menteeId: string
  topic: string
  dur: number
  status: 'upcoming' | 'done'
  local: string
  notes: string
}

export interface Evaluation {
  talentId: string
  talentName: string
  program: string
  cycle: string
  due: string
  submitted: boolean
}

export interface Workflow {
  id: string
  talent: string
  talentId: string
  type: string
  amount: number
  urgency: 'high' | 'normal' | 'low'
  submitted: string
  step: number
  totalSteps: number
}

export interface Stage {
  id: string
  label: string
}

export interface Program {
  id: string
  name: string
  kind: string
  color: string
}

export interface Talent {
  id: string
  name: string
  gender: 'M' | 'F'
  program: string
  university: string
  city: string
  country: string
  course: string
  year: string
  gpa: number
  status: TalentStatus
  dept: string
  mentor: string
  stipend: number
  startDate: string
  perf: number
  potential: 'alto' | 'médio' | 'baixo'
  riskScore: number
  lastReport: string
}

export interface Application {
  id: string
  name: string
  program: string
  stage: ApplicationStage
  score: number
  source: string
  appliedAt: string
  course: string
  uni: string
}

export interface Payment {
  id: string
  talent: string
  talentName: string
  type: string
  period: string
  amount: number
  status: PaymentStatus
  paidAt: string | null
  method: string
}

export interface Mentor {
  name: string
  dept: string
  mentees: number
  rating: number
}

export interface GeoPoint {
  country: string
  city: string
  count: number
  cost: number
}

export interface NineBoxItem {
  id: string
  name: string
  x: number
  y: number
}

export interface ActivityItem {
  id: number
  type: string
  text: string
  when: string
  actor: string
}

export interface Notification {
  id: number
  type: string
  title: string
  text: string
  when: string
  read: boolean
}

export interface BolseiroPayment {
  id: string
  period: string
  type: string
  amount: number
  status: PaymentStatus
  date: string
}

export interface Task {
  id: string
  title: string
  description: string
  talentId: string
  talentName: string
  assignedBy: string
  assignedByRole: 'rh' | 'mentor'
  category: string
  priority: 'alta' | 'média' | 'baixa'
  status: TaskStatus
  dueDate: string
  completedAt: string | null
}

export interface Absence {
  id: string
  talentId: string
  talentName: string
  program: string
  type: 'justificada' | 'injustificada'
  reason: string
  date: string
  days: number
  status: AbsenceStatus
  requestedAt: string
  approvedBy: string | null
  mentorNote: string | null
  rhNote: string | null
}

export interface MentorSession {
  id: string
  date: string
  time: string
  mentee: string
  menteeId: string
  topic: string
  dur: number
  status: 'upcoming' | 'done'
  local: string
  notes: string
}

export interface Evaluation {
  talentId: string
  talentName: string
  program: string
  cycle: string
  due: string
  submitted: boolean
}

export interface Workflow {
  id: string
  talent: string
  talentId: string
  type: string
  amount: number
  urgency: 'high' | 'normal' | 'low'
  submitted: string
  step: number
  totalSteps: number
}

export interface Stage {
  id: string
  label: string
}
