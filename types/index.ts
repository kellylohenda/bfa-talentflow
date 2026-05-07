export type Role = 'rh' | 'direcao' | 'mentor' | 'bolseiro'
export type Theme = 'light' | 'dark'
export type Density = 'compact' | 'balanced' | 'comfortable'

export type TalentStatus = 'active' | 'delayed' | 'risk' | 'completed' | 'hired' | 'pending' | 'onboarding'
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'hold'
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'overdue'
export type AbsenceStatus = 'pending' | 'approved' | 'rejected'
export type WorkflowStatus = 'pending' | 'approved' | 'rejected'
export type ApplicationStage = 'triagem' | 'entrevista1' | 'entrevista2' | 'avaliacao' | 'aprovacao' | 'oferta' | 'rejeitado'

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
