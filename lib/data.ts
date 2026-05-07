import type { Program, Talent, Application, Payment, Mentor, GeoPoint, NineBoxItem, ActivityItem, Notification, BolseiroPayment, Task, Absence, Workflow, Stage, Volunteer, VolunteerActivity, HoursEntry } from '@/types'

export const programs: Program[] = [
  { id: 'fbfa', name: 'Futuro BFA', kind: 'Trainee', color: '#FF7607' },
  { id: 'bif', name: 'Bolsa Internacional', kind: 'Bolsa', color: '#1D4ED8' },
  { id: 'bnac', name: 'Bolsa Nacional', kind: 'Bolsa', color: '#0E7C4A' },
  { id: 'lid', name: 'Programa Liderança+', kind: 'Trainee', color: '#7C3AED' },
  { id: 'mest', name: 'Mestrado Patrocinado', kind: 'Bolsa', color: '#B45309' },
]

export const universities = [
  { name: 'Universidade Agostinho Neto', city: 'Luanda', country: 'Angola' },
  { name: 'Universidade Católica de Angola', city: 'Luanda', country: 'Angola' },
  { name: 'Universidade Lusíada de Angola', city: 'Luanda', country: 'Angola' },
  { name: 'ISCTE-IUL', city: 'Lisboa', country: 'Portugal' },
  { name: 'Universidade de Coimbra', city: 'Coimbra', country: 'Portugal' },
  { name: 'Universidade do Porto', city: 'Porto', country: 'Portugal' },
  { name: 'Nova SBE', city: 'Lisboa', country: 'Portugal' },
  { name: 'HEC Paris', city: 'Paris', country: 'França' },
  { name: 'LSE', city: 'Londres', country: 'Reino Unido' },
  { name: 'Universidade de São Paulo', city: 'São Paulo', country: 'Brasil' },
]

export const departments = [
  'Banca de Empresas', 'Banca de Retalho', 'Tesouraria', 'Risco de Crédito',
  'Compliance', 'TI / Sistemas', 'Marketing', 'Recursos Humanos',
  'Auditoria Interna', 'Operações', 'Banca Privada',
]

export const statuses: Record<string, { label: string; tone: string }> = {
  active:     { label: 'Activo',      tone: 'success' },
  delayed:    { label: 'Atraso',      tone: 'warn' },
  risk:       { label: 'Em risco',    tone: 'danger' },
  completed:  { label: 'Concluído',   tone: 'info' },
  hired:      { label: 'Contratado',  tone: 'primary' },
  pending:    { label: 'Pendente',    tone: 'neutral' },
  onboarding: { label: 'Onboarding', tone: 'info' },
}

export const talents: Talent[] = [
  { id: 'T-1042', name: 'Lwini Capemba',         gender: 'F', program: 'fbfa', university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Economia',                year: 'Trainee Y1', gpa: 17.2, status: 'active',     dept: 'Banca de Empresas', mentor: 'Edmilson Cardoso', stipend: 380000,  startDate: '2024-09-01', perf: 92, potential: 'alto',  riskScore: 0.12, lastReport: '2026-04-22' },
  { id: 'T-1043', name: 'Joaquim Tchindemba',    gender: 'M', program: 'bif',  university: 'Nova SBE',                       city: 'Lisboa',    country: 'Portugal',      course: 'Mestrado Finanças',        year: '2º ano',     gpa: 16.8, status: 'active',     dept: '—',                 mentor: 'Sofia Mendes',     stipend: 1850000, startDate: '2024-09-15', perf: 88, potential: 'alto',  riskScore: 0.15, lastReport: '2026-04-15' },
  { id: 'T-1044', name: 'Esperança Quimbamba',   gender: 'F', program: 'bnac', university: 'Universidade Católica de Angola', city: 'Luanda',   country: 'Angola',        course: 'Gestão',                  year: '3º ano',     gpa: 14.5, status: 'delayed',    dept: '—',                 mentor: 'Domingos Vieira',  stipend: 220000,  startDate: '2023-10-02', perf: 71, potential: 'médio', riskScore: 0.42, lastReport: '2026-02-10' },
  { id: 'T-1045', name: 'Yuran Bumba',           gender: 'M', program: 'fbfa', university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Engenharia Informática',  year: 'Trainee Y2', gpa: 16.1, status: 'active',     dept: 'TI / Sistemas',     mentor: 'Patrícia Lopes',   stipend: 420000,  startDate: '2023-09-01', perf: 84, potential: 'alto',  riskScore: 0.20, lastReport: '2026-04-20' },
  { id: 'T-1046', name: 'Domingas Kassinda',     gender: 'F', program: 'mest', university: 'Universidade do Porto',          city: 'Porto',     country: 'Portugal',      course: 'Mestrado Contabilidade',  year: '1º ano',     gpa: 17.6, status: 'active',     dept: '—',                 mentor: 'José Almeida',     stipend: 1620000, startDate: '2025-09-12', perf: 94, potential: 'alto',  riskScore: 0.08, lastReport: '2026-04-28' },
  { id: 'T-1047', name: 'Adélio Sebastião',      gender: 'M', program: 'bnac', university: 'Universidade Lusíada de Angola', city: 'Luanda',   country: 'Angola',        course: 'Matemática Aplicada',     year: '4º ano',     gpa: 13.2, status: 'risk',       dept: '—',                 mentor: 'Lina Cazimba',     stipend: 240000,  startDate: '2022-09-20', perf: 58, potential: 'baixo', riskScore: 0.78, lastReport: '2026-01-18' },
  { id: 'T-1048', name: 'Kiala Domingos',        gender: 'M', program: 'lid',  university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Pós-graduação Liderança', year: 'Y1',         gpa: 18.0, status: 'active',     dept: 'Banca Privada',     mentor: 'Edmilson Cardoso', stipend: 540000,  startDate: '2025-02-03', perf: 96, potential: 'alto',  riskScore: 0.06, lastReport: '2026-04-30' },
  { id: 'T-1049', name: 'Nzinga Matondo',        gender: 'F', program: 'bif',  university: 'ISCTE-IUL',                      city: 'Lisboa',    country: 'Portugal',      course: 'Mestrado Banca & Seguros',year: '2º ano',     gpa: 16.4, status: 'active',     dept: '—',                 mentor: 'Sofia Mendes',     stipend: 1780000, startDate: '2024-09-10', perf: 86, potential: 'alto',  riskScore: 0.18, lastReport: '2026-04-12' },
  { id: 'T-1050', name: 'Fernando Ngoma',        gender: 'M', program: 'fbfa', university: 'Universidade Católica de Angola', city: 'Luanda',   country: 'Angola',        course: 'Gestão Financeira',       year: 'Trainee Y1', gpa: 15.4, status: 'onboarding', dept: 'Risco de Crédito',  mentor: 'Patrícia Lopes',   stipend: 380000,  startDate: '2026-03-01', perf: 78, potential: 'médio', riskScore: 0.22, lastReport: '2026-04-05' },
  { id: 'T-1051', name: 'Carla Bunga',           gender: 'F', program: 'bif',  university: 'HEC Paris',                      city: 'Paris',     country: 'França',        course: 'MBA',                     year: '1º ano',     gpa: 17.9, status: 'active',     dept: '—',                 mentor: 'José Almeida',     stipend: 2640000, startDate: '2025-09-20', perf: 95, potential: 'alto',  riskScore: 0.10, lastReport: '2026-04-25' },
  { id: 'T-1052', name: 'Walter Tchitangueleca', gender: 'M', program: 'bnac', university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Estatística',             year: '2º ano',     gpa: 12.8, status: 'delayed',    dept: '—',                 mentor: 'Domingos Vieira',  stipend: 200000,  startDate: '2024-10-05', perf: 64, potential: 'médio', riskScore: 0.55, lastReport: '2026-02-28' },
  { id: 'T-1053', name: 'Aida Bento',            gender: 'F', program: 'fbfa', university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Marketing & Comunicação', year: 'Trainee Y2', gpa: 16.7, status: 'active',     dept: 'Marketing',         mentor: 'Lina Cazimba',     stipend: 420000,  startDate: '2023-09-01', perf: 89, potential: 'alto',  riskScore: 0.14, lastReport: '2026-04-18' },
  { id: 'T-1054', name: 'Heitor Quitumba',       gender: 'M', program: 'mest', university: 'LSE',                            city: 'Londres',   country: 'Reino Unido',   course: 'MSc Risk & Finance',      year: '1º ano',     gpa: 17.4, status: 'active',     dept: '—',                 mentor: 'Sofia Mendes',     stipend: 3120000, startDate: '2025-09-25', perf: 91, potential: 'alto',  riskScore: 0.09, lastReport: '2026-04-22' },
  { id: 'T-1055', name: 'Beatriz Sapalo',        gender: 'F', program: 'bnac', university: 'Universidade Católica de Angola', city: 'Luanda',   country: 'Angola',        course: 'Direito Económico',       year: '4º ano',     gpa: 15.8, status: 'completed',  dept: '—',                 mentor: 'Domingos Vieira',  stipend: 0,       startDate: '2021-09-01', perf: 82, potential: 'médio', riskScore: 0.20, lastReport: '2026-03-30' },
  { id: 'T-1056', name: 'Mateus Cabuenha',       gender: 'M', program: 'fbfa', university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Auditoria',               year: 'Trainee Y1', gpa: 15.9, status: 'active',     dept: 'Auditoria Interna', mentor: 'Patrícia Lopes',   stipend: 380000,  startDate: '2025-09-05', perf: 81, potential: 'médio', riskScore: 0.19, lastReport: '2026-04-20' },
  { id: 'T-1057', name: 'Olívia Kambamba',       gender: 'F', program: 'bif',  university: 'Universidade de São Paulo',      city: 'São Paulo', country: 'Brasil',        course: 'Mestrado Economia',       year: '2º ano',     gpa: 17.0, status: 'active',     dept: '—',                 mentor: 'José Almeida',     stipend: 1450000, startDate: '2024-08-15', perf: 87, potential: 'alto',  riskScore: 0.16, lastReport: '2026-04-10' },
  { id: 'T-1058', name: 'Alberto Massano',       gender: 'M', program: 'lid',  university: 'Universidade Agostinho Neto',    city: 'Luanda',    country: 'Angola',        course: 'Liderança Executiva',     year: 'Y2',         gpa: 17.8, status: 'hired',      dept: 'Banca de Empresas', mentor: 'Edmilson Cardoso', stipend: 0,       startDate: '2022-02-15', perf: 94, potential: 'alto',  riskScore: 0.07, lastReport: '2026-04-15' },
  { id: 'T-1059', name: 'Helga Pacavira',        gender: 'F', program: 'bnac', university: 'Universidade Lusíada de Angola', city: 'Luanda',   country: 'Angola',        course: 'Contabilidade',           year: '3º ano',     gpa: 14.0, status: 'delayed',    dept: '—',                 mentor: 'Lina Cazimba',     stipend: 220000,  startDate: '2023-10-15', perf: 70, potential: 'médio', riskScore: 0.40, lastReport: '2026-03-02' },
]

export const applications: Application[] = [
  { id: 'A-2451', name: 'Tomás Quissanga',    program: 'fbfa', stage: 'triagem',     score: 78, source: 'LinkedIn',     appliedAt: '2026-04-28', course: 'Economia',         uni: 'UAN' },
  { id: 'A-2452', name: 'Kissila Mbumba',     program: 'fbfa', stage: 'triagem',     score: 84, source: 'Site BFA',     appliedAt: '2026-04-28', course: 'Gestão',           uni: 'UCAN' },
  { id: 'A-2453', name: 'Nelson Cassule',     program: 'bif',  stage: 'entrevista1', score: 81, source: 'Site BFA',     appliedAt: '2026-04-25', course: 'Mestrado Fin.',    uni: 'Nova SBE' },
  { id: 'A-2454', name: 'Inês Caholo',        program: 'fbfa', stage: 'entrevista1', score: 88, source: 'Universidade', appliedAt: '2026-04-24', course: 'Matemática',       uni: 'UAN' },
  { id: 'A-2455', name: 'Pedro Bastos',       program: 'fbfa', stage: 'entrevista2', score: 91, source: 'LinkedIn',     appliedAt: '2026-04-20', course: 'Eng. Informática', uni: 'UCAN' },
  { id: 'A-2456', name: 'Eunice Bula',        program: 'bnac', stage: 'avaliacao',   score: 86, source: 'Site BFA',     appliedAt: '2026-04-18', course: 'Contabilidade',    uni: 'Lusíada' },
  { id: 'A-2457', name: 'Vitor Sambongo',     program: 'fbfa', stage: 'avaliacao',   score: 89, source: 'Indicação',    appliedAt: '2026-04-15', course: 'Finanças',         uni: 'UCAN' },
  { id: 'A-2458', name: 'Cláudia Ngongo',     program: 'mest', stage: 'aprovacao',   score: 93, source: 'Universidade', appliedAt: '2026-04-12', course: 'Mestrado Cont.',   uni: 'Porto' },
  { id: 'A-2459', name: 'Rui Manjate',        program: 'bif',  stage: 'aprovacao',   score: 90, source: 'LinkedIn',     appliedAt: '2026-04-10', course: 'MBA',              uni: 'HEC Paris' },
  { id: 'A-2460', name: 'Liliana Bange',      program: 'fbfa', stage: 'oferta',      score: 92, source: 'Site BFA',     appliedAt: '2026-04-08', course: 'Economia',         uni: 'UAN' },
  { id: 'A-2461', name: 'Fábio Quitumba',     program: 'fbfa', stage: 'oferta',      score: 87, source: 'Indicação',    appliedAt: '2026-04-05', course: 'Gestão',           uni: 'UCAN' },
  { id: 'A-2462', name: 'Marta Ngonga',       program: 'bnac', stage: 'rejeitado',   score: 54, source: 'Site BFA',     appliedAt: '2026-04-02', course: 'Direito',          uni: 'Lusíada' },
]

export const stages: Stage[] = [
  { id: 'triagem',     label: 'Triagem CV' },
  { id: 'entrevista1', label: 'Entrevista 1' },
  { id: 'entrevista2', label: 'Entrevista 2' },
  { id: 'avaliacao',   label: 'Avaliação Técnica' },
  { id: 'aprovacao',   label: 'Aprovação' },
  { id: 'oferta',      label: 'Oferta' },
]

export const payments: Payment[] = [
  { id: 'P-9821', talent: 'T-1042', talentName: 'Lwini Capemba',         type: 'Subsídio mensal',   period: '2026-04', amount: 380000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9822', talent: 'T-1043', talentName: 'Joaquim Tchindemba',    type: 'Propina',           period: '2026-T2', amount: 1850000, status: 'paid',    paidAt: '2026-04-15', method: 'SWIFT' },
  { id: 'P-9823', talent: 'T-1044', talentName: 'Esperança Quimbamba',   type: 'Subsídio mensal',   period: '2026-04', amount: 220000,  status: 'pending', paidAt: null,         method: 'Transferência BFA' },
  { id: 'P-9824', talent: 'T-1045', talentName: 'Yuran Bumba',           type: 'Subsídio mensal',   period: '2026-04', amount: 420000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9825', talent: 'T-1046', talentName: 'Domingas Kassinda',     type: 'Alojamento',        period: '2026-04', amount: 480000,  status: 'paid',    paidAt: '2026-04-20', method: 'SWIFT' },
  { id: 'P-9826', talent: 'T-1047', talentName: 'Adélio Sebastião',      type: 'Subsídio mensal',   period: '2026-04', amount: 240000,  status: 'hold',    paidAt: null,         method: 'Transferência BFA' },
  { id: 'P-9827', talent: 'T-1048', talentName: 'Kiala Domingos',        type: 'Subsídio mensal',   period: '2026-04', amount: 540000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9828', talent: 'T-1049', talentName: 'Nzinga Matondo',        type: 'Propina',           period: '2026-T2', amount: 1780000, status: 'failed',  paidAt: null,         method: 'SWIFT' },
  { id: 'P-9829', talent: 'T-1051', talentName: 'Carla Bunga',           type: 'Propina',           period: '2026-T2', amount: 2640000, status: 'paid',    paidAt: '2026-04-12', method: 'SWIFT' },
  { id: 'P-9830', talent: 'T-1052', talentName: 'Walter Tchitangueleca', type: 'Subsídio mensal',   period: '2026-04', amount: 200000,  status: 'pending', paidAt: null,         method: 'Transferência BFA' },
  { id: 'P-9831', talent: 'T-1053', talentName: 'Aida Bento',            type: 'Subsídio mensal',   period: '2026-04', amount: 420000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9832', talent: 'T-1054', talentName: 'Heitor Quitumba',       type: 'Propina',           period: '2026-T2', amount: 3120000, status: 'paid',    paidAt: '2026-04-08', method: 'SWIFT' },
]

export const mentors: Mentor[] = [
  { name: 'Edmilson Cardoso', dept: 'Banca de Empresas',   mentees: 6, rating: 4.8 },
  { name: 'Sofia Mendes',     dept: 'Banca Internacional', mentees: 5, rating: 4.9 },
  { name: 'Patrícia Lopes',   dept: 'TI / Sistemas',       mentees: 4, rating: 4.6 },
  { name: 'José Almeida',     dept: 'Banca Privada',       mentees: 4, rating: 4.7 },
  { name: 'Domingos Vieira',  dept: 'Risco de Crédito',   mentees: 3, rating: 4.4 },
  { name: 'Lina Cazimba',     dept: 'Marketing',           mentees: 3, rating: 4.5 },
]

export const geo: GeoPoint[] = [
  { country: 'Angola',      city: 'Luanda',    count: 142, cost: 482000000 },
  { country: 'Portugal',    city: 'Lisboa',    count: 38,  cost: 612000000 },
  { country: 'Portugal',    city: 'Porto',     count: 24,  cost: 384000000 },
  { country: 'Portugal',    city: 'Coimbra',   count: 12,  cost: 168000000 },
  { country: 'França',      city: 'Paris',     count: 6,   cost: 168000000 },
  { country: 'Reino Unido', city: 'Londres',   count: 4,   cost: 124000000 },
  { country: 'Brasil',      city: 'São Paulo', count: 8,   cost: 92000000 },
]

export const nineBox: NineBoxItem[] = [
  { id: 'T-1048', name: 'Kiala Domingos',     x: 3, y: 3 },
  { id: 'T-1051', name: 'Carla Bunga',        x: 3, y: 3 },
  { id: 'T-1058', name: 'Alberto Massano',    x: 3, y: 3 },
  { id: 'T-1042', name: 'Lwini Capemba',      x: 3, y: 3 },
  { id: 'T-1046', name: 'Domingas Kassinda',  x: 3, y: 3 },
  { id: 'T-1054', name: 'Heitor Quitumba',    x: 2, y: 3 },
  { id: 'T-1043', name: 'Joaquim Tchindemba', x: 2, y: 3 },
  { id: 'T-1045', name: 'Yuran Bumba',        x: 2, y: 3 },
  { id: 'T-1053', name: 'Aida Bento',         x: 2, y: 2 },
  { id: 'T-1049', name: 'Nzinga Matondo',     x: 2, y: 2 },
  { id: 'T-1057', name: 'Olívia Kambamba',    x: 2, y: 2 },
  { id: 'T-1056', name: 'Mateus Cabuenha',    x: 2, y: 2 },
  { id: 'T-1050', name: 'Fernando Ngoma',     x: 1, y: 2 },
  { id: 'T-1059', name: 'Helga Pacavira',     x: 1, y: 1 },
  { id: 'T-1055', name: 'Beatriz Sapalo',     x: 2, y: 1 },
  { id: 'T-1044', name: 'Esperança Quimbamba',x: 1, y: 2 },
  { id: 'T-1052', name: 'Walter Tchitangueleca',x: 1, y: 1 },
  { id: 'T-1047', name: 'Adélio Sebastião',   x: 1, y: 1 },
]

export const activity: ActivityItem[] = [
  { id: 1, type: 'payment',    text: 'Pagamento aprovado — Lwini Capemba (Kz 380.000)',           when: '12 min',    actor: 'Sistema' },
  { id: 2, type: 'alert',      text: 'Adélio Sebastião — relatório semestral em atraso há 14 dias', when: '38 min', actor: 'Alerta' },
  { id: 3, type: 'evaluation', text: 'Avaliação 360° de Yuran Bumba submetida pelo mentor',        when: '1 h',       actor: 'Patrícia Lopes' },
  { id: 4, type: 'application',text: 'Nova candidatura — Tomás Quissanga (Futuro BFA)',            when: '2 h',       actor: 'Portal' },
  { id: 5, type: 'payment',    text: 'Pagamento SWIFT — Heitor Quitumba (Kz 3.12M)',              when: '3 h',       actor: 'Tesouraria' },
  { id: 6, type: 'doc',        text: 'Domingas Kassinda submeteu boletim semestral (média 17.6)', when: '5 h',       actor: 'Portal Bolseiro' },
  { id: 7, type: 'alert',      text: 'Pagamento SWIFT falhou — Nzinga Matondo (revisar IBAN)',    when: '6 h',       actor: 'Alerta' },
  { id: 8, type: 'hire',       text: 'Beatriz Sapalo concluiu bolsa — proposta de contratação enviada', when: 'Ontem', actor: 'RH' },
  { id: 9, type: 'mentor',     text: 'Sessão de mentoria registada — Carla Bunga × Sofia Mendes', when: 'Ontem',    actor: 'Sofia Mendes' },
]

export const bolseiroNotifs: Notification[] = [
  { id: 1, type: 'payment', title: 'Subsídio de Abril processado', text: 'Kz 380.000 transferido para a sua conta BFA (····7821).', when: 'Há 2 dias', read: false },
  { id: 2, type: 'doc',     title: 'Boletim semestral pendente',   text: 'Submeta o boletim do 1º semestre até 15 de Maio.',          when: 'Há 4 dias', read: false },
  { id: 3, type: 'mentor',  title: 'Próxima sessão de mentoria',   text: 'Edmilson Cardoso · 8 Maio às 15h00.',                       when: 'Há 5 dias', read: true },
  { id: 4, type: 'event',   title: 'Workshop "Banca em Angola"',   text: 'Inscrição aberta · 12 Maio · Sede BFA.',                    when: 'Há 1 semana', read: true },
]

export const bolseiroPayments: BolseiroPayment[] = [
  { id: 'P-9821', period: 'Abril 2026',     type: 'Subsídio mensal',    amount: 380000, status: 'paid', date: '2026-04-28' },
  { id: 'P-9701', period: 'Março 2026',     type: 'Subsídio mensal',    amount: 380000, status: 'paid', date: '2026-03-28' },
  { id: 'P-9602', period: '2026-T1',        type: 'Material didáctico', amount: 85000,  status: 'paid', date: '2026-02-12' },
  { id: 'P-9588', period: 'Fevereiro 2026', type: 'Subsídio mensal',    amount: 380000, status: 'paid', date: '2026-02-28' },
  { id: 'P-9412', period: 'Janeiro 2026',   type: 'Subsídio mensal',    amount: 380000, status: 'paid', date: '2026-01-30' },
]

export const tasks: Task[] = [
  { id: 'TK-0001', title: 'Relatório semestral Q1 2026',          talentId: 'T-1042', talentName: 'Lwini Capemba',        assignedBy: 'Edmilson Cardoso',  assignedByRole: 'mentor', category: 'Relatório',    priority: 'alta',  status: 'done',        dueDate: '2026-04-30', completedAt: '2026-04-28', description: 'Submeter relatório de progresso do 1º semestre.' },
  { id: 'TK-0002', title: 'Análise de crédito — caso prático',    talentId: 'T-1042', talentName: 'Lwini Capemba',        assignedBy: 'Edmilson Cardoso',  assignedByRole: 'mentor', category: 'Formação',     priority: 'alta',  status: 'in_progress', dueDate: '2026-05-15', completedAt: null,         description: 'Elaborar análise de crédito com demonstrações financeiras fornecidas.' },
  { id: 'TK-0003', title: 'Apresentação à direcção — projecto Q2',talentId: 'T-1048', talentName: 'Kiala Domingos',       assignedBy: 'Mariana Quissama',  assignedByRole: 'rh',     category: 'Apresentação', priority: 'alta',  status: 'pending',     dueDate: '2026-05-20', completedAt: null,         description: 'Preparar apresentação de 10 minutos sobre gestão de carteira premium.' },
  { id: 'TK-0004', title: 'Boletim académico 2º semestre',        talentId: 'T-1043', talentName: 'Joaquim Tchindemba',   assignedBy: 'Mariana Quissama',  assignedByRole: 'rh',     category: 'Documento',   priority: 'média', status: 'pending',     dueDate: '2026-05-31', completedAt: null,         description: 'Submeter boletim de notas do 2º semestre via portal.' },
  { id: 'TK-0005', title: 'Plano de desenvolvimento individual Q3',talentId: 'T-1045', talentName: 'Yuran Bumba',          assignedBy: 'Patrícia Lopes',   assignedByRole: 'mentor', category: 'PDI',          priority: 'média', status: 'in_progress', dueDate: '2026-05-10', completedAt: null,         description: 'Definir 3 objectivos SMART para o Q3.' },
  { id: 'TK-0006', title: 'Relatório de estágio — Banca Privada', talentId: 'T-1048', talentName: 'Kiala Domingos',       assignedBy: 'Edmilson Cardoso',  assignedByRole: 'mentor', category: 'Relatório',    priority: 'alta',  status: 'done',        dueDate: '2026-04-15', completedAt: '2026-04-14', description: 'Relatório de 5 páginas sobre aprendizagens na rotação.' },
  { id: 'TK-0007', title: 'Leitura — "The Intelligent Investor"', talentId: 'T-1042', talentName: 'Lwini Capemba',        assignedBy: 'Edmilson Cardoso',  assignedByRole: 'mentor', category: 'Formação',     priority: 'baixa', status: 'in_progress', dueDate: '2026-06-01', completedAt: null,         description: 'Ler os primeiros 8 capítulos e submeter resumo de 2 páginas.' },
  { id: 'TK-0008', title: 'Certificação Bloomberg Essentials',    talentId: 'T-1045', talentName: 'Yuran Bumba',          assignedBy: 'Patrícia Lopes',   assignedByRole: 'mentor', category: 'Certificação', priority: 'alta',  status: 'overdue',     dueDate: '2026-04-30', completedAt: null,         description: 'Completar módulos 1-4 da certificação Bloomberg Essentials.' },
  { id: 'TK-0009', title: 'Relatório semestral Q1 2026',          talentId: 'T-1044', talentName: 'Esperança Quimbamba',  assignedBy: 'Domingos Vieira',  assignedByRole: 'mentor', category: 'Relatório',    priority: 'alta',  status: 'overdue',     dueDate: '2026-04-15', completedAt: null,         description: 'Submeter relatório de progresso. URGENTE — em atraso.' },
  { id: 'TK-0010', title: 'Workshop "Gestão de Risco Bancário"',  talentId: 'T-1046', talentName: 'Domingas Kassinda',    assignedBy: 'Mariana Quissama',  assignedByRole: 'rh',     category: 'Formação',     priority: 'média', status: 'done',        dueDate: '2026-04-20', completedAt: '2026-04-19', description: 'Participar no workshop e submeter certificado.' },
  { id: 'TK-0011', title: 'Plano de carreira — 3 anos',           talentId: 'T-1058', talentName: 'Alberto Massano',      assignedBy: 'Edmilson Cardoso',  assignedByRole: 'mentor', category: 'PDI',          priority: 'alta',  status: 'pending',     dueDate: '2026-05-25', completedAt: null,         description: 'Definir trajectória de carreira no BFA para os próximos 3 anos.' },
  { id: 'TK-0012', title: 'Reflexão mensal — Abril 2026',         talentId: 'T-1053', talentName: 'Aida Bento',           assignedBy: 'Lina Cazimba',     assignedByRole: 'mentor', category: 'Relatório',    priority: 'baixa', status: 'done',        dueDate: '2026-05-05', completedAt: '2026-05-04', description: 'Submeter reflexão sobre actividades e aprendizagens de Abril.' },
  { id: 'TK-0013', title: 'Auto-avaliação 360° Q2',               talentId: 'T-1042', talentName: 'Lwini Capemba',        assignedBy: 'Mariana Quissama',  assignedByRole: 'rh',     category: 'Avaliação',    priority: 'alta',  status: 'pending',     dueDate: '2026-05-30', completedAt: null,         description: 'Preencher formulário de auto-avaliação 360° no portal.' },
  { id: 'TK-0014', title: 'Estudo de caso — Mercado de Capitais', talentId: 'T-1045', talentName: 'Yuran Bumba',          assignedBy: 'Patrícia Lopes',   assignedByRole: 'mentor', category: 'Formação',     priority: 'média', status: 'pending',     dueDate: '2026-06-10', completedAt: null,         description: 'Analisar o impacto da digitalização nos mercados de capitais angolanos.' },
]

export const absences: Absence[] = [
  { id: 'FA-001', talentId: 'T-1042', talentName: 'Lwini Capemba',         program: 'fbfa', type: 'justificada',   reason: 'Consulta médica',               date: '2026-05-07', days: 1, status: 'pending',  requestedAt: '2026-05-04', approvedBy: null,               mentorNote: null,                                        rhNote: null },
  { id: 'FA-002', talentId: 'T-1044', talentName: 'Esperança Quimbamba',   program: 'bnac', type: 'justificada',   reason: 'Exame académico',               date: '2026-04-28', days: 1, status: 'approved', requestedAt: '2026-04-25', approvedBy: 'Domingos Vieira',  mentorNote: 'Aprovado — exame de gestão financeira.',    rhNote: null },
  { id: 'FA-003', talentId: 'T-1047', talentName: 'Adélio Sebastião',      program: 'bnac', type: 'injustificada', reason: '',                              date: '2026-04-22', days: 1, status: 'approved', requestedAt: '2026-04-23', approvedBy: 'Lina Cazimba',     mentorNote: 'Contactei o bolseiro. Situação familiar.',  rhNote: null },
  { id: 'FA-004', talentId: 'T-1050', talentName: 'Fernando Ngoma',        program: 'fbfa', type: 'justificada',   reason: 'Problema familiar urgente',     date: '2026-05-06', days: 2, status: 'pending',  requestedAt: '2026-05-05', approvedBy: null,               mentorNote: null,                                        rhNote: null },
  { id: 'FA-005', talentId: 'T-1052', talentName: 'Walter Tchitangueleca', program: 'bnac', type: 'injustificada', reason: '',                              date: '2026-04-15', days: 1, status: 'rejected', requestedAt: '2026-04-16', approvedBy: 'Domingos Vieira',  mentorNote: 'Sem justificação. Terceira falta.',         rhNote: 'Advertência formal emitida.' },
  { id: 'FA-006', talentId: 'T-1045', talentName: 'Yuran Bumba',           program: 'fbfa', type: 'justificada',   reason: 'Defesa de projecto académico',  date: '2026-05-12', days: 1, status: 'pending',  requestedAt: '2026-05-04', approvedBy: null,               mentorNote: null,                                        rhNote: null },
  { id: 'FA-007', talentId: 'T-1048', talentName: 'Kiala Domingos',        program: 'lid',  type: 'justificada',   reason: 'Visita médica preventiva',      date: '2026-04-10', days: 1, status: 'approved', requestedAt: '2026-04-08', approvedBy: 'Edmilson Cardoso', mentorNote: 'Aprovado sem reservas.',                    rhNote: null },
  { id: 'FA-008', talentId: 'T-1053', talentName: 'Aida Bento',            program: 'fbfa', type: 'justificada',   reason: 'Cerimónia académica',           date: '2026-05-15', days: 1, status: 'pending',  requestedAt: '2026-05-05', approvedBy: null,               mentorNote: null,                                        rhNote: null },
  { id: 'FA-009', talentId: 'T-1056', talentName: 'Mateus Cabuenha',       program: 'fbfa', type: 'justificada',   reason: 'Conferência universitária',     date: '2026-05-18', days: 1, status: 'pending',  requestedAt: '2026-05-06', approvedBy: null,               mentorNote: null,                                        rhNote: null },
  { id: 'FA-010', talentId: 'T-1059', talentName: 'Helga Pacavira',        program: 'bnac', type: 'injustificada', reason: '',                              date: '2026-04-08', days: 1, status: 'approved', requestedAt: '2026-04-09', approvedBy: 'Lina Cazimba',     mentorNote: 'Situação pessoal confirmada por telefone.', rhNote: null },
]

export const workflows: Workflow[] = [
  { id: 'WF-2451', talent: 'Heitor Quitumba',       talentId: 'T-1054', type: 'Propina LSE',           amount: 3120000,  urgency: 'high',   submitted: '2026-04-28 09:14', step: 3, totalSteps: 4 },
  { id: 'WF-2452', talent: 'Carla Bunga',            talentId: 'T-1051', type: 'Propina HEC Paris',     amount: 2640000,  urgency: 'normal', submitted: '2026-04-27 16:02', step: 2, totalSteps: 4 },
  { id: 'WF-2453', talent: 'Domingas Kassinda',      talentId: 'T-1046', type: 'Alojamento Porto',      amount: 480000,   urgency: 'normal', submitted: '2026-04-27 11:48', step: 4, totalSteps: 4 },
  { id: 'WF-2454', talent: 'Lote · 38 trainees',    talentId: '—',      type: 'Subsídio mensal Abr',   amount: 14440000, urgency: 'high',   submitted: '2026-04-26 08:00', step: 2, totalSteps: 4 },
  { id: 'WF-2455', talent: 'Walter Tchitangueleca',  talentId: 'T-1052', type: 'Subsídio · revisão',    amount: 200000,   urgency: 'low',    submitted: '2026-04-25 14:33', step: 1, totalSteps: 4 },
  { id: 'WF-2456', talent: 'Nzinga Matondo',         talentId: 'T-1049', type: 'Reprocessamento SWIFT', amount: 1780000,  urgency: 'high',   submitted: '2026-04-25 10:15', step: 1, totalSteps: 4 },
]

// ── Voluntariado ─────────────────────────────────────────────────────────────

export const volunteers: Volunteer[] = [
  { id: 'V-001', nome: 'Ana Paula Kiala',        email: 'apkiala@bfa.ao',      tel: '+244 912 100 001', profissao: 'Gestora de Conta',      instituicao: 'BFA',                           provincia: 'Luanda',    local: 'Ingombota',       dataInscricao: '2024-02-10', status: 'activo',     areaActuacao: 'educacao', totalHoras: 48, mentor: 'Edmilson Cardoso' },
  { id: 'V-002', nome: 'Carlos Ndombe',          email: 'cndombe@bfa.ao',      tel: '+244 912 100 002', profissao: 'Analista de Risco',      instituicao: 'BFA',                           provincia: 'Luanda',    local: 'Maianga',         dataInscricao: '2024-03-05', status: 'activo',     areaActuacao: 'saude',    totalHoras: 36, mentor: 'Patrícia Lopes' },
  { id: 'V-003', nome: 'Felícia Bumba',          email: 'fbumba@gmail.com',    tel: '+244 912 100 003', profissao: 'Médica',                 instituicao: 'Hospital Josina Machel',        provincia: 'Luanda',    local: 'Rangel',          dataInscricao: '2024-01-20', status: 'activo',     areaActuacao: 'saude',    totalHoras: 64, mentor: 'Sofia Mendes' },
  { id: 'V-004', nome: 'Isac Tchilemba',         email: 'itchilemba@gmail.com',tel: '+244 912 100 004', profissao: 'Professor',              instituicao: 'Escola Sec. Patrice Lumumba',  provincia: 'Luanda',    local: 'Sambizanga',      dataInscricao: '2024-04-12', status: 'activo',     areaActuacao: 'educacao', totalHoras: 52, mentor: 'Edmilson Cardoso' },
  { id: 'V-005', nome: 'Lurdes Cassinda',        email: 'lcassinda@bfa.ao',    tel: '+244 912 100 005', profissao: 'Directora de Marketing', instituicao: 'BFA',                           provincia: 'Luanda',    local: 'Alvalade',        dataInscricao: '2023-11-08', status: 'activo',     areaActuacao: 'cultura',  totalHoras: 88, mentor: 'José Almeida' },
  { id: 'V-006', nome: 'Manuel Songo',           email: 'msongo@ucan.edu.ao',  tel: '+244 912 100 006', profissao: 'Engenheiro Ambiental',   instituicao: 'Universidade Católica Angola',  provincia: 'Luanda',    local: 'Talatona',        dataInscricao: '2024-02-28', status: 'activo',     areaActuacao: 'ambiente', totalHoras: 40, mentor: 'Domingos Vieira' },
  { id: 'V-007', nome: 'Palmira Dala',           email: 'pdala@gmail.com',     tel: '+244 912 100 007', profissao: 'Assistente Social',      instituicao: 'Ministério da Acção Social',    provincia: 'Luanda',    local: 'Cazenga',         dataInscricao: '2024-05-15', status: 'activo',     areaActuacao: 'social',   totalHoras: 24, mentor: 'Edmilson Cardoso' },
  { id: 'V-008', nome: 'Ricardo Catata',         email: 'rcatata@bfa.ao',      tel: '+244 912 100 008', profissao: 'Técnico de TI',          instituicao: 'BFA',                           provincia: 'Benguela',  local: 'Centro',          dataInscricao: '2024-06-01', status: 'activo',     areaActuacao: 'educacao', totalHoras: 20, mentor: 'Patrícia Lopes' },
  { id: 'V-009', nome: 'Sofia Mavungo',          email: 'smavungo@gmail.com',  tel: '+244 912 100 009', profissao: 'Nutricionista',          instituicao: 'Clínica Girassol',              provincia: 'Luanda',    local: 'Viana',           dataInscricao: '2024-03-18', status: 'inactivo',   areaActuacao: 'saude',    totalHoras: 16, mentor: 'Lina Cazimba' },
  { id: 'V-010', nome: 'Tomé Quissama',          email: 'tquissama@uan.ao',    tel: '+244 912 100 010', profissao: 'Estudante de Direito',   instituicao: 'Universidade Agostinho Neto',   provincia: 'Luanda',    local: 'Samba',           dataInscricao: '2024-07-20', status: 'activo',     areaActuacao: 'social',   totalHoras: 32, mentor: 'Sofia Mendes' },
  { id: 'V-011', nome: 'Verônica Lopes',         email: 'vlopes@bfa.ao',       tel: '+244 912 100 011', profissao: 'Contabilista',           instituicao: 'BFA',                           provincia: 'Luanda',    local: 'Miramar',         dataInscricao: '2023-09-14', status: 'desistente',  areaActuacao: 'educacao', totalHoras: 12, mentor: 'Domingos Vieira' },
  { id: 'V-012', nome: 'Xavier Ngola',           email: 'xngola@gmail.com',    tel: '+244 912 100 012', profissao: 'Arquitecto',             instituicao: 'Studio Ngola Arquitectos',      provincia: 'Huambo',    local: 'Centro',          dataInscricao: '2024-08-05', status: 'activo',     areaActuacao: 'cultura',  totalHoras: 28, mentor: 'José Almeida' },
  { id: 'V-013', nome: 'Yara Domingos',          email: 'ydomingos@bfa.ao',    tel: '+244 912 100 013', profissao: 'Advogada',               instituicao: 'BFA',                           provincia: 'Luanda',    local: 'Kilamba',         dataInscricao: '2024-01-30', status: 'activo',     areaActuacao: 'social',   totalHoras: 44, mentor: 'Lina Cazimba' },
  { id: 'V-014', nome: 'Zacarias Bula',          email: 'zbula@gmail.com',     tel: '+244 912 100 014', profissao: 'Biólogo',                instituicao: 'Instituto Nacional de Recursos', provincia: 'Cabinda',   local: 'Centro',          dataInscricao: '2024-04-25', status: 'activo',     areaActuacao: 'ambiente', totalHoras: 56, mentor: 'Patrícia Lopes' },
  { id: 'V-015', nome: 'Adelina Weba',           email: 'aweba@gmail.com',     tel: '+244 912 100 015', profissao: 'Jornalista',             instituicao: 'Jornal de Angola',              provincia: 'Luanda',    local: 'Rocha Pinto',     dataInscricao: '2024-09-10', status: 'desistente',  areaActuacao: 'cultura',  totalHoras: 8,  mentor: 'Sofia Mendes' },
]

export const volunteerActivities: VolunteerActivity[] = [
  { id: 'AC-001', nome: 'Campanha de Rastreio Visual',          descricao: 'Rastreio gratuito de doenças oculares em comunidades carenciadas.',              tipo: 'saude',    data: '2026-01-18', horaInicio: '08:00', horaFim: '14:00', local: 'Escola Primária do Sambizanga', provincia: 'Luanda',   coordenador: 'Felícia Bumba',   vagasTotal: 20, inscritos: 18, status: 'concluida', horasPrevistas: 6  },
  { id: 'AC-002', nome: 'Plantação de Árvores — Luanda Verde', descricao: 'Plantação de 500 árvores nativas ao longo da via expressa.',                    tipo: 'ambiente', data: '2026-02-08', horaInicio: '07:00', horaFim: '13:00', local: 'Via Expressa, km 4',            provincia: 'Luanda',   coordenador: 'Manuel Songo',    vagasTotal: 30, inscritos: 27, status: 'concluida', horasPrevistas: 6  },
  { id: 'AC-003', nome: 'Tutoria Escolar — Operação Lápis',     descricao: 'Apoio escolar a 80 alunos do ensino primário em bairros periféricos.',           tipo: 'educacao', data: '2026-02-20', horaInicio: '14:00', horaFim: '18:00', local: 'Escola Sec. Patrice Lumumba',   provincia: 'Luanda',   coordenador: 'Isac Tchilemba',  vagasTotal: 15, inscritos: 14, status: 'concluida', horasPrevistas: 4  },
  { id: 'AC-004', nome: 'Doação de Sangue — 1ª Edição 2026',    descricao: 'Campanha interna de doação de sangue em parceria com o Hospital Josina.',        tipo: 'saude',    data: '2026-03-05', horaInicio: '09:00', horaFim: '13:00', local: 'Sede BFA, Rua Major Kanhangulo', provincia: 'Luanda',  coordenador: 'Felícia Bumba',   vagasTotal: 40, inscritos: 38, status: 'concluida', horasPrevistas: 4  },
  { id: 'AC-005', nome: 'Fórum da Juventude Angolana',           descricao: 'Painel de debate sobre empreendedorismo e cidadania activa com jovens.',        tipo: 'social',   data: '2026-03-22', horaInicio: '10:00', horaFim: '17:00', local: 'Centro Cultural Elinga Teatro',  provincia: 'Luanda',  coordenador: 'Yara Domingos',   vagasTotal: 12, inscritos: 10, status: 'concluida', horasPrevistas: 7  },
  { id: 'AC-006', nome: 'Limpeza Costeira — Baía de Luanda',    descricao: 'Recolha de resíduos e sensibilização ambiental na orla marítima.',              tipo: 'ambiente', data: '2026-04-19', horaInicio: '07:30', horaFim: '12:00', local: 'Marginal de Luanda',             provincia: 'Luanda',  coordenador: 'Manuel Songo',    vagasTotal: 50, inscritos: 44, status: 'concluida', horasPrevistas: 5  },
  { id: 'AC-007', nome: 'Banco Alimentar — Ramadão 2026',       descricao: 'Recolha e distribuição de géneros alimentares a famílias vulneráveis.',         tipo: 'social',   data: '2026-04-05', horaInicio: '09:00', horaFim: '16:00', local: 'Bairro Cazenga',                 provincia: 'Luanda',  coordenador: 'Palmira Dala',    vagasTotal: 25, inscritos: 22, status: 'concluida', horasPrevistas: 7  },
  { id: 'AC-008', nome: 'Exposição Arte Contemporânea Angolana', descricao: 'Curadoria e apoio logístico a exposição de artistas emergentes.',               tipo: 'cultura',  data: '2026-05-17', horaInicio: '10:00', horaFim: '20:00', local: 'Museu Nacional da Escravatura',   provincia: 'Luanda',  coordenador: 'Lurdes Cassinda', vagasTotal: 10, inscritos: 8,  status: 'agendada',  horasPrevistas: 10 },
  { id: 'AC-009', nome: 'Tutoria Escolar — Maio (Benguela)',     descricao: 'Extensão do programa de tutoria à cidade de Benguela.',                        tipo: 'educacao', data: '2026-05-24', horaInicio: '14:00', horaFim: '18:00', local: 'Escola Primária 15 de Agosto',    provincia: 'Benguela', coordenador: 'Ricardo Catata',  vagasTotal: 10, inscritos: 6,  status: 'agendada',  horasPrevistas: 4  },
  { id: 'AC-010', nome: 'Doação de Sangue — 2ª Edição 2026',    descricao: 'Segunda campanha semestral de doação de sangue.',                               tipo: 'saude',    data: '2026-06-12', horaInicio: '09:00', horaFim: '13:00', local: 'Sede BFA, Rua Major Kanhangulo', provincia: 'Luanda',  coordenador: 'Felícia Bumba',   vagasTotal: 40, inscritos: 12, status: 'agendada',  horasPrevistas: 4  },
]

export const hoursEntries: HoursEntry[] = [
  // AC-001 Rastreio Visual
  { id: 'H-001', voluntarioId: 'V-003', voluntarioNome: 'Felícia Bumba',     actividadeId: 'AC-001', actividadeNome: 'Campanha de Rastreio Visual',       data: '2026-01-18', horas: 6, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-002', voluntarioId: 'V-002', voluntarioNome: 'Carlos Ndombe',     actividadeId: 'AC-001', actividadeNome: 'Campanha de Rastreio Visual',       data: '2026-01-18', horas: 6, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-003', voluntarioId: 'V-007', voluntarioNome: 'Palmira Dala',      actividadeId: 'AC-001', actividadeNome: 'Campanha de Rastreio Visual',       data: '2026-01-18', horas: 6, validado: true,  validadoPor: 'Lurdes Cassinda' },
  // AC-002 Plantação de Árvores
  { id: 'H-004', voluntarioId: 'V-006', voluntarioNome: 'Manuel Songo',      actividadeId: 'AC-002', actividadeNome: 'Plantação de Árvores — Luanda Verde', data: '2026-02-08', horas: 6, validado: true, validadoPor: 'Lurdes Cassinda' },
  { id: 'H-005', voluntarioId: 'V-014', voluntarioNome: 'Zacarias Bula',     actividadeId: 'AC-002', actividadeNome: 'Plantação de Árvores — Luanda Verde', data: '2026-02-08', horas: 6, validado: true, validadoPor: 'Lurdes Cassinda' },
  { id: 'H-006', voluntarioId: 'V-001', voluntarioNome: 'Ana Paula Kiala',   actividadeId: 'AC-002', actividadeNome: 'Plantação de Árvores — Luanda Verde', data: '2026-02-08', horas: 6, validado: true, validadoPor: 'Lurdes Cassinda' },
  // AC-003 Tutoria Escolar
  { id: 'H-007', voluntarioId: 'V-004', voluntarioNome: 'Isac Tchilemba',    actividadeId: 'AC-003', actividadeNome: 'Tutoria Escolar — Operação Lápis',  data: '2026-02-20', horas: 4, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-008', voluntarioId: 'V-001', voluntarioNome: 'Ana Paula Kiala',   actividadeId: 'AC-003', actividadeNome: 'Tutoria Escolar — Operação Lápis',  data: '2026-02-20', horas: 4, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-009', voluntarioId: 'V-008', voluntarioNome: 'Ricardo Catata',    actividadeId: 'AC-003', actividadeNome: 'Tutoria Escolar — Operação Lápis',  data: '2026-02-20', horas: 4, validado: true,  validadoPor: 'Lurdes Cassinda' },
  // AC-004 Doação de Sangue
  { id: 'H-010', voluntarioId: 'V-003', voluntarioNome: 'Felícia Bumba',     actividadeId: 'AC-004', actividadeNome: 'Doação de Sangue — 1ª Edição 2026', data: '2026-03-05', horas: 4, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-011', voluntarioId: 'V-002', voluntarioNome: 'Carlos Ndombe',     actividadeId: 'AC-004', actividadeNome: 'Doação de Sangue — 1ª Edição 2026', data: '2026-03-05', horas: 4, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-012', voluntarioId: 'V-005', voluntarioNome: 'Lurdes Cassinda',   actividadeId: 'AC-004', actividadeNome: 'Doação de Sangue — 1ª Edição 2026', data: '2026-03-05', horas: 4, validado: true,  validadoPor: 'Ana Paula Kiala' },
  { id: 'H-013', voluntarioId: 'V-013', voluntarioNome: 'Yara Domingos',     actividadeId: 'AC-004', actividadeNome: 'Doação de Sangue — 1ª Edição 2026', data: '2026-03-05', horas: 4, validado: true,  validadoPor: 'Lurdes Cassinda' },
  // AC-005 Fórum Juventude
  { id: 'H-014', voluntarioId: 'V-013', voluntarioNome: 'Yara Domingos',     actividadeId: 'AC-005', actividadeNome: 'Fórum da Juventude Angolana',        data: '2026-03-22', horas: 7, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-015', voluntarioId: 'V-010', voluntarioNome: 'Tomé Quissama',     actividadeId: 'AC-005', actividadeNome: 'Fórum da Juventude Angolana',        data: '2026-03-22', horas: 7, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-016', voluntarioId: 'V-005', voluntarioNome: 'Lurdes Cassinda',   actividadeId: 'AC-005', actividadeNome: 'Fórum da Juventude Angolana',        data: '2026-03-22', horas: 7, validado: true,  validadoPor: 'Ana Paula Kiala' },
  // AC-006 Limpeza Costeira
  { id: 'H-017', voluntarioId: 'V-006', voluntarioNome: 'Manuel Songo',      actividadeId: 'AC-006', actividadeNome: 'Limpeza Costeira — Baía de Luanda', data: '2026-04-19', horas: 5, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-018', voluntarioId: 'V-014', voluntarioNome: 'Zacarias Bula',     actividadeId: 'AC-006', actividadeNome: 'Limpeza Costeira — Baía de Luanda', data: '2026-04-19', horas: 5, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-019', voluntarioId: 'V-001', voluntarioNome: 'Ana Paula Kiala',   actividadeId: 'AC-006', actividadeNome: 'Limpeza Costeira — Baía de Luanda', data: '2026-04-19', horas: 5, validado: true,  validadoPor: 'Carlos Ndombe' },
  { id: 'H-020', voluntarioId: 'V-010', voluntarioNome: 'Tomé Quissama',     actividadeId: 'AC-006', actividadeNome: 'Limpeza Costeira — Baía de Luanda', data: '2026-04-19', horas: 5, validado: true,  validadoPor: 'Carlos Ndombe' },
  // AC-007 Banco Alimentar
  { id: 'H-021', voluntarioId: 'V-007', voluntarioNome: 'Palmira Dala',      actividadeId: 'AC-007', actividadeNome: 'Banco Alimentar — Ramadão 2026',    data: '2026-04-05', horas: 7, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-022', voluntarioId: 'V-013', voluntarioNome: 'Yara Domingos',     actividadeId: 'AC-007', actividadeNome: 'Banco Alimentar — Ramadão 2026',    data: '2026-04-05', horas: 7, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-023', voluntarioId: 'V-010', voluntarioNome: 'Tomé Quissama',     actividadeId: 'AC-007', actividadeNome: 'Banco Alimentar — Ramadão 2026',    data: '2026-04-05', horas: 7, validado: true,  validadoPor: 'Lurdes Cassinda' },
  { id: 'H-024', voluntarioId: 'V-002', voluntarioNome: 'Carlos Ndombe',     actividadeId: 'AC-007', actividadeNome: 'Banco Alimentar — Ramadão 2026',    data: '2026-04-05', horas: 7, validado: false, validadoPor: null              },
  // Horas pendentes de validação (AC-008 em preparação)
  { id: 'H-025', voluntarioId: 'V-005', voluntarioNome: 'Lurdes Cassinda',   actividadeId: 'AC-008', actividadeNome: 'Exposição Arte Contemporânea',      data: '2026-05-17', horas: 10, validado: false, validadoPor: null             },
  { id: 'H-026', voluntarioId: 'V-012', voluntarioNome: 'Xavier Ngola',      actividadeId: 'AC-008', actividadeNome: 'Exposição Arte Contemporânea',      data: '2026-05-17', horas: 10, validado: false, validadoPor: null             },
  { id: 'H-027', voluntarioId: 'V-004', voluntarioNome: 'Isac Tchilemba',    actividadeId: 'AC-009', actividadeNome: 'Tutoria Escolar — Maio (Benguela)', data: '2026-05-24', horas: 4,  validado: false, validadoPor: null             },
  { id: 'H-028', voluntarioId: 'V-008', voluntarioNome: 'Ricardo Catata',    actividadeId: 'AC-009', actividadeNome: 'Tutoria Escolar — Maio (Benguela)', data: '2026-05-24', horas: 4,  validado: false, validadoPor: null             },
]
// ─────────────────────────────────────────────────────────────────────────────
