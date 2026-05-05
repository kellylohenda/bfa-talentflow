// BFA TalentFlow — seed data (Angola context)
window.BFA = window.BFA || {};

window.BFA.programs = [
  { id: 'fbfa', name: 'Futuro BFA', kind: 'Trainee', color: '#FF7607' },
  { id: 'bif', name: 'Bolsa Internacional', kind: 'Bolsa', color: '#1D4ED8' },
  { id: 'bnac', name: 'Bolsa Nacional', kind: 'Bolsa', color: '#0E7C4A' },
  { id: 'lid', name: 'Programa Liderança+', kind: 'Trainee', color: '#7C3AED' },
  { id: 'mest', name: 'Mestrado Patrocinado', kind: 'Bolsa', color: '#B45309' }
];

window.BFA.universities = [
  { name: 'Universidade Agostinho Neto', city: 'Luanda', country: 'Angola' },
  { name: 'Universidade Católica de Angola', city: 'Luanda', country: 'Angola' },
  { name: 'Universidade Lusíada de Angola', city: 'Luanda', country: 'Angola' },
  { name: 'ISCTE-IUL', city: 'Lisboa', country: 'Portugal' },
  { name: 'Universidade de Coimbra', city: 'Coimbra', country: 'Portugal' },
  { name: 'Universidade do Porto', city: 'Porto', country: 'Portugal' },
  { name: 'Nova SBE', city: 'Lisboa', country: 'Portugal' },
  { name: 'HEC Paris', city: 'Paris', country: 'França' },
  { name: 'LSE', city: 'Londres', country: 'Reino Unido' },
  { name: 'Universidade de São Paulo', city: 'São Paulo', country: 'Brasil' }
];

window.BFA.departments = [
  'Banca de Empresas', 'Banca de Retalho', 'Tesouraria', 'Risco de Crédito',
  'Compliance', 'TI / Sistemas', 'Marketing', 'Recursos Humanos',
  'Auditoria Interna', 'Operações', 'Banca Privada'
];

window.BFA.statuses = {
  active: { label: 'Activo', tone: 'success' },
  delayed: { label: 'Atraso', tone: 'warn' },
  risk: { label: 'Em risco', tone: 'danger' },
  completed: { label: 'Concluído', tone: 'info' },
  hired: { label: 'Contratado', tone: 'primary' },
  pending: { label: 'Pendente', tone: 'neutral' },
  onboarding: { label: 'Onboarding', tone: 'info' }
};

// Helpers
window.BFA.fmtKz = (n) => 'Kz ' + Math.round(n).toLocaleString('pt-AO');
window.BFA.fmtKzShort = (n) => {
  if (n >= 1e9) return 'Kz ' + (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return 'Kz ' + (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return 'Kz ' + (n/1e3).toFixed(1) + 'K';
  return 'Kz ' + n;
};
window.BFA.initials = (name) => name.split(' ').filter(Boolean).map(p => p[0]).slice(0,2).join('').toUpperCase();

// Talent records
window.BFA.talents = [
  { id: 'T-1042', name: 'Lwini Capemba',         gender: 'F', program: 'fbfa', university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Economia',                   year: 'Trainee Y1', gpa: 17.2, status: 'active',     dept: 'Banca de Empresas', mentor: 'Edmilson Cardoso', stipend: 380000,  startDate: '2024-09-01', perf: 92, potential: 'alto',  riskScore: 0.12, lastReport: '2026-04-22' },
  { id: 'T-1043', name: 'Joaquim Tchindemba',    gender: 'M', program: 'bif',  university: 'Nova SBE',                    city: 'Lisboa',   country: 'Portugal',      course: 'Mestrado Finanças',          year: '2º ano',     gpa: 16.8, status: 'active',     dept: '—',                 mentor: 'Sofia Mendes',     stipend: 1850000, startDate: '2024-09-15', perf: 88, potential: 'alto',  riskScore: 0.15, lastReport: '2026-04-15' },
  { id: 'T-1044', name: 'Esperança Quimbamba',   gender: 'F', program: 'bnac', university: 'Universidade Católica de Angola', city: 'Luanda', country: 'Angola',     course: 'Gestão',                     year: '3º ano',     gpa: 14.5, status: 'delayed',    dept: '—',                 mentor: 'Domingos Vieira',  stipend: 220000,  startDate: '2023-10-02', perf: 71, potential: 'médio', riskScore: 0.42, lastReport: '2026-02-10' },
  { id: 'T-1045', name: 'Yuran Bumba',           gender: 'M', program: 'fbfa', university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Engenharia Informática',    year: 'Trainee Y2', gpa: 16.1, status: 'active',     dept: 'TI / Sistemas',     mentor: 'Patrícia Lopes',   stipend: 420000,  startDate: '2023-09-01', perf: 84, potential: 'alto',  riskScore: 0.20, lastReport: '2026-04-20' },
  { id: 'T-1046', name: 'Domingas Kassinda',     gender: 'F', program: 'mest', university: 'Universidade do Porto',       city: 'Porto',    country: 'Portugal',      course: 'Mestrado Contabilidade',     year: '1º ano',     gpa: 17.6, status: 'active',     dept: '—',                 mentor: 'José Almeida',     stipend: 1620000, startDate: '2025-09-12', perf: 94, potential: 'alto',  riskScore: 0.08, lastReport: '2026-04-28' },
  { id: 'T-1047', name: 'Adélio Sebastião',      gender: 'M', program: 'bnac', university: 'Universidade Lusíada de Angola', city: 'Luanda', country: 'Angola',      course: 'Matemática Aplicada',        year: '4º ano',     gpa: 13.2, status: 'risk',       dept: '—',                 mentor: 'Lina Cazimba',     stipend: 240000,  startDate: '2022-09-20', perf: 58, potential: 'baixo', riskScore: 0.78, lastReport: '2026-01-18' },
  { id: 'T-1048', name: 'Kiala Domingos',        gender: 'M', program: 'lid',  university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Pós-graduação Liderança',    year: 'Y1',         gpa: 18.0, status: 'active',     dept: 'Banca Privada',     mentor: 'Edmilson Cardoso', stipend: 540000,  startDate: '2025-02-03', perf: 96, potential: 'alto',  riskScore: 0.06, lastReport: '2026-04-30' },
  { id: 'T-1049', name: 'Nzinga Matondo',        gender: 'F', program: 'bif',  university: 'ISCTE-IUL',                   city: 'Lisboa',   country: 'Portugal',      course: 'Mestrado Banca & Seguros',   year: '2º ano',     gpa: 16.4, status: 'active',     dept: '—',                 mentor: 'Sofia Mendes',     stipend: 1780000, startDate: '2024-09-10', perf: 86, potential: 'alto',  riskScore: 0.18, lastReport: '2026-04-12' },
  { id: 'T-1050', name: 'Fernando Ngoma',        gender: 'M', program: 'fbfa', university: 'Universidade Católica de Angola', city: 'Luanda', country: 'Angola',     course: 'Gestão Financeira',          year: 'Trainee Y1', gpa: 15.4, status: 'onboarding', dept: 'Risco de Crédito',  mentor: 'Patrícia Lopes',   stipend: 380000,  startDate: '2026-03-01', perf: 78, potential: 'médio', riskScore: 0.22, lastReport: '2026-04-05' },
  { id: 'T-1051', name: 'Carla Bunga',           gender: 'F', program: 'bif',  university: 'HEC Paris',                   city: 'Paris',    country: 'França',        course: 'MBA',                        year: '1º ano',     gpa: 17.9, status: 'active',     dept: '—',                 mentor: 'José Almeida',     stipend: 2640000, startDate: '2025-09-20', perf: 95, potential: 'alto',  riskScore: 0.10, lastReport: '2026-04-25' },
  { id: 'T-1052', name: 'Walter Tchitangueleca', gender: 'M', program: 'bnac', university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Estatística',                year: '2º ano',     gpa: 12.8, status: 'delayed',    dept: '—',                 mentor: 'Domingos Vieira',  stipend: 200000,  startDate: '2024-10-05', perf: 64, potential: 'médio', riskScore: 0.55, lastReport: '2026-02-28' },
  { id: 'T-1053', name: 'Aida Bento',            gender: 'F', program: 'fbfa', university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Marketing & Comunicação',    year: 'Trainee Y2', gpa: 16.7, status: 'active',     dept: 'Marketing',         mentor: 'Lina Cazimba',     stipend: 420000,  startDate: '2023-09-01', perf: 89, potential: 'alto',  riskScore: 0.14, lastReport: '2026-04-18' },
  { id: 'T-1054', name: 'Heitor Quitumba',       gender: 'M', program: 'mest', university: 'LSE',                          city: 'Londres', country: 'Reino Unido',   course: 'MSc Risk & Finance',         year: '1º ano',     gpa: 17.4, status: 'active',     dept: '—',                 mentor: 'Sofia Mendes',     stipend: 3120000, startDate: '2025-09-25', perf: 91, potential: 'alto',  riskScore: 0.09, lastReport: '2026-04-22' },
  { id: 'T-1055', name: 'Beatriz Sapalo',        gender: 'F', program: 'bnac', university: 'Universidade Católica de Angola', city: 'Luanda', country: 'Angola',     course: 'Direito Económico',          year: '4º ano',     gpa: 15.8, status: 'completed',  dept: '—',                 mentor: 'Domingos Vieira',  stipend: 0,       startDate: '2021-09-01', perf: 82, potential: 'médio', riskScore: 0.20, lastReport: '2026-03-30' },
  { id: 'T-1056', name: 'Mateus Cabuenha',       gender: 'M', program: 'fbfa', university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Auditoria',                  year: 'Trainee Y1', gpa: 15.9, status: 'active',     dept: 'Auditoria Interna', mentor: 'Patrícia Lopes',   stipend: 380000,  startDate: '2025-09-05', perf: 81, potential: 'médio', riskScore: 0.19, lastReport: '2026-04-20' },
  { id: 'T-1057', name: 'Olívia Kambamba',       gender: 'F', program: 'bif',  university: 'Universidade de São Paulo',   city: 'São Paulo',country: 'Brasil',        course: 'Mestrado Economia',          year: '2º ano',     gpa: 17.0, status: 'active',     dept: '—',                 mentor: 'José Almeida',     stipend: 1450000, startDate: '2024-08-15', perf: 87, potential: 'alto',  riskScore: 0.16, lastReport: '2026-04-10' },
  { id: 'T-1058', name: 'Alberto Massano',       gender: 'M', program: 'lid',  university: 'Universidade Agostinho Neto', city: 'Luanda',   country: 'Angola',        course: 'Liderança Executiva',        year: 'Y2',         gpa: 17.8, status: 'hired',      dept: 'Banca de Empresas', mentor: 'Edmilson Cardoso', stipend: 0,       startDate: '2022-02-15', perf: 94, potential: 'alto',  riskScore: 0.07, lastReport: '2026-04-15' },
  { id: 'T-1059', name: 'Helga Pacavira',        gender: 'F', program: 'bnac', university: 'Universidade Lusíada de Angola', city: 'Luanda', country: 'Angola',      course: 'Contabilidade',              year: '3º ano',     gpa: 14.0, status: 'delayed',    dept: '—',                 mentor: 'Lina Cazimba',     stipend: 220000,  startDate: '2023-10-15', perf: 70, potential: 'médio', riskScore: 0.40, lastReport: '2026-03-02' }
];

// Applications (candidaturas) for funnel
window.BFA.applications = [
  { id: 'A-2451', name: 'Tomás Quissanga',    program: 'fbfa', stage: 'triagem',     score: 78, source: 'LinkedIn',  appliedAt: '2026-04-28', course: 'Economia',       uni: 'UAN' },
  { id: 'A-2452', name: 'Kissila Mbumba',     program: 'fbfa', stage: 'triagem',     score: 84, source: 'Site BFA',  appliedAt: '2026-04-28', course: 'Gestão',         uni: 'UCAN' },
  { id: 'A-2453', name: 'Nelson Cassule',     program: 'bif',  stage: 'entrevista1', score: 81, source: 'Site BFA',  appliedAt: '2026-04-25', course: 'Mestrado Fin.',  uni: 'Nova SBE' },
  { id: 'A-2454', name: 'Inês Caholo',        program: 'fbfa', stage: 'entrevista1', score: 88, source: 'Universidade', appliedAt: '2026-04-24', course: 'Matemática',  uni: 'UAN' },
  { id: 'A-2455', name: 'Pedro Bastos',       program: 'fbfa', stage: 'entrevista2', score: 91, source: 'LinkedIn',  appliedAt: '2026-04-20', course: 'Eng. Informática', uni: 'UCAN' },
  { id: 'A-2456', name: 'Eunice Bula',        program: 'bnac', stage: 'avaliacao',   score: 86, source: 'Site BFA',  appliedAt: '2026-04-18', course: 'Contabilidade',  uni: 'Lusíada' },
  { id: 'A-2457', name: 'Vitor Sambongo',     program: 'fbfa', stage: 'avaliacao',   score: 89, source: 'Indicação', appliedAt: '2026-04-15', course: 'Finanças',       uni: 'UCAN' },
  { id: 'A-2458', name: 'Cláudia Ngongo',     program: 'mest', stage: 'aprovacao',   score: 93, source: 'Universidade', appliedAt: '2026-04-12', course: 'Mestrado Cont.', uni: 'Porto' },
  { id: 'A-2459', name: 'Rui Manjate',        program: 'bif',  stage: 'aprovacao',   score: 90, source: 'LinkedIn',  appliedAt: '2026-04-10', course: 'MBA',            uni: 'HEC Paris' },
  { id: 'A-2460', name: 'Liliana Bange',      program: 'fbfa', stage: 'oferta',      score: 92, source: 'Site BFA',  appliedAt: '2026-04-08', course: 'Economia',       uni: 'UAN' },
  { id: 'A-2461', name: 'Fábio Quitumba',     program: 'fbfa', stage: 'oferta',      score: 87, source: 'Indicação', appliedAt: '2026-04-05', course: 'Gestão',         uni: 'UCAN' },
  { id: 'A-2462', name: 'Marta Ngonga',       program: 'bnac', stage: 'rejeitado',   score: 54, source: 'Site BFA',  appliedAt: '2026-04-02', course: 'Direito',        uni: 'Lusíada' }
];

window.BFA.stages = [
  { id: 'triagem',     label: 'Triagem CV' },
  { id: 'entrevista1', label: 'Entrevista 1' },
  { id: 'entrevista2', label: 'Entrevista 2' },
  { id: 'avaliacao',   label: 'Avaliação Técnica' },
  { id: 'aprovacao',   label: 'Aprovação' },
  { id: 'oferta',      label: 'Oferta' }
];

// Payments
window.BFA.payments = [
  { id: 'P-9821', talent: 'T-1042', talentName: 'Lwini Capemba',       type: 'Subsídio mensal', period: '2026-04', amount: 380000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9822', talent: 'T-1043', talentName: 'Joaquim Tchindemba',  type: 'Propina',         period: '2026-T2', amount: 1850000, status: 'paid',    paidAt: '2026-04-15', method: 'SWIFT' },
  { id: 'P-9823', talent: 'T-1044', talentName: 'Esperança Quimbamba', type: 'Subsídio mensal', period: '2026-04', amount: 220000,  status: 'pending', paidAt: null,         method: 'Transferência BFA' },
  { id: 'P-9824', talent: 'T-1045', talentName: 'Yuran Bumba',         type: 'Subsídio mensal', period: '2026-04', amount: 420000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9825', talent: 'T-1046', talentName: 'Domingas Kassinda',   type: 'Alojamento',      period: '2026-04', amount: 480000,  status: 'paid',    paidAt: '2026-04-20', method: 'SWIFT' },
  { id: 'P-9826', talent: 'T-1047', talentName: 'Adélio Sebastião',    type: 'Subsídio mensal', period: '2026-04', amount: 240000,  status: 'hold',    paidAt: null,         method: 'Transferência BFA' },
  { id: 'P-9827', talent: 'T-1048', talentName: 'Kiala Domingos',      type: 'Subsídio mensal', period: '2026-04', amount: 540000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9828', talent: 'T-1049', talentName: 'Nzinga Matondo',      type: 'Propina',         period: '2026-T2', amount: 1780000, status: 'failed',  paidAt: null,         method: 'SWIFT' },
  { id: 'P-9829', talent: 'T-1051', talentName: 'Carla Bunga',         type: 'Propina',         period: '2026-T2', amount: 2640000, status: 'paid',    paidAt: '2026-04-12', method: 'SWIFT' },
  { id: 'P-9830', talent: 'T-1052', talentName: 'Walter Tchitangueleca', type: 'Subsídio mensal', period: '2026-04', amount: 200000, status: 'pending', paidAt: null,       method: 'Transferência BFA' },
  { id: 'P-9831', talent: 'T-1053', talentName: 'Aida Bento',          type: 'Subsídio mensal', period: '2026-04', amount: 420000,  status: 'paid',    paidAt: '2026-04-28', method: 'Transferência BFA' },
  { id: 'P-9832', talent: 'T-1054', talentName: 'Heitor Quitumba',     type: 'Propina',         period: '2026-T2', amount: 3120000, status: 'paid',    paidAt: '2026-04-08', method: 'SWIFT' }
];

// Mentors
window.BFA.mentors = [
  { name: 'Edmilson Cardoso', dept: 'Banca de Empresas',  mentees: 6, rating: 4.8 },
  { name: 'Sofia Mendes',     dept: 'Banca Internacional', mentees: 5, rating: 4.9 },
  { name: 'Patrícia Lopes',   dept: 'TI / Sistemas',       mentees: 4, rating: 4.6 },
  { name: 'José Almeida',     dept: 'Banca Privada',       mentees: 4, rating: 4.7 },
  { name: 'Domingos Vieira',  dept: 'Risco de Crédito',    mentees: 3, rating: 4.4 },
  { name: 'Lina Cazimba',     dept: 'Marketing',           mentees: 3, rating: 4.5 }
];

// Geographic distribution
window.BFA.geo = [
  { country: 'Angola',         city: 'Luanda',    count: 142, cost: 482000000 },
  { country: 'Portugal',       city: 'Lisboa',    count: 38,  cost: 612000000 },
  { country: 'Portugal',       city: 'Porto',     count: 24,  cost: 384000000 },
  { country: 'Portugal',       city: 'Coimbra',   count: 12,  cost: 168000000 },
  { country: 'França',         city: 'Paris',     count: 6,   cost: 168000000 },
  { country: 'Reino Unido',    city: 'Londres',   count: 4,   cost: 124000000 },
  { country: 'Brasil',         city: 'São Paulo', count: 8,   cost: 92000000 }
];

// 9-Box positions: x = performance (1-3), y = potential (1-3)
window.BFA.nineBox = [
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
  { id: 'T-1055', name: 'Beatriz Sapalo',     x: 2, y: 1 },
  { id: 'T-1044', name: 'Esperança Quimbamba', x: 1, y: 2 },
  { id: 'T-1059', name: 'Helga Pacavira',     x: 1, y: 1 },
  { id: 'T-1052', name: 'Walter Tchitangueleca', x: 1, y: 1 },
  { id: 'T-1047', name: 'Adélio Sebastião',   x: 1, y: 1 }
];

// Activity feed
window.BFA.activity = [
  { id: 1, type: 'payment',   text: 'Pagamento aprovado — Lwini Capemba (Kz 380.000)', when: '12 min', actor: 'Sistema' },
  { id: 2, type: 'alert',     text: 'Adélio Sebastião — relatório semestral em atraso há 14 dias', when: '38 min', actor: 'Alerta' },
  { id: 3, type: 'evaluation', text: 'Avaliação 360° de Yuran Bumba submetida pelo mentor', when: '1 h',    actor: 'Patrícia Lopes' },
  { id: 4, type: 'application', text: 'Nova candidatura — Tomás Quissanga (Futuro BFA)',   when: '2 h',    actor: 'Portal' },
  { id: 5, type: 'payment',   text: 'Pagamento internacional SWIFT — Heitor Quitumba (Kz 3.12M)', when: '3 h', actor: 'Tesouraria' },
  { id: 6, type: 'doc',       text: 'Domingas Kassinda submeteu boletim semestral (média 17.6)', when: '5 h', actor: 'Portal Bolseiro' },
  { id: 7, type: 'alert',     text: 'Pagamento SWIFT falhou — Nzinga Matondo (revisar IBAN)', when: '6 h', actor: 'Alerta' },
  { id: 8, type: 'hire',      text: 'Beatriz Sapalo concluiu bolsa — proposta de contratação enviada', when: 'Ontem', actor: 'RH' },
  { id: 9, type: 'mentor',    text: 'Sessão de mentoria registada — Carla Bunga × Sofia Mendes', when: 'Ontem', actor: 'Sofia Mendes' }
];

// Notifications for Bolseiro portal
window.BFA.bolseiroNotifs = [
  { id: 1, type: 'payment', title: 'Subsídio de Abril processado', text: 'Kz 380.000 transferido para a sua conta BFA (····7821).', when: 'Há 2 dias', read: false },
  { id: 2, type: 'doc',     title: 'Boletim semestral pendente',   text: 'Submeta o boletim do 1º semestre até 15 de Maio.', when: 'Há 4 dias', read: false },
  { id: 3, type: 'mentor',  title: 'Próxima sessão de mentoria',   text: 'Edmilson Cardoso · 8 Maio às 15h00.', when: 'Há 5 dias', read: true },
  { id: 4, type: 'event',   title: 'Workshop "Banca em Angola"',  text: 'Inscrição aberta · 12 Maio · Sede BFA.', when: 'Há 1 semana', read: true }
];

window.BFA.bolseiroPayments = [
  { id: 'P-9821', period: 'Abril 2026',  type: 'Subsídio mensal',  amount: 380000, status: 'paid', date: '2026-04-28' },
  { id: 'P-9701', period: 'Março 2026', type: 'Subsídio mensal',  amount: 380000, status: 'paid', date: '2026-03-28' },
  { id: 'P-9602', period: '2026-T1',     type: 'Material didáctico', amount: 85000, status: 'paid', date: '2026-02-12' },
  { id: 'P-9588', period: 'Fevereiro 2026', type: 'Subsídio mensal', amount: 380000, status: 'paid', date: '2026-02-28' },
  { id: 'P-9412', period: 'Janeiro 2026', type: 'Subsídio mensal',  amount: 380000, status: 'paid', date: '2026-01-30' }
];
