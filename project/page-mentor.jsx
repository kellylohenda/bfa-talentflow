// BFA TalentFlow — Dashboard do Mentor
window.PageMentorDashboard = function PageMentorDashboard() {
  const [tab, setTab] = React.useState('visao');
  const [showNewSession, setShowNewSession] = React.useState(false);
  const [showEvalModal, setShowEvalModal] = React.useState(null);
  const [evalScores, setEvalScores] = React.useState({});

  const me = { name: 'Edmilson Cardoso', dept: 'Banca de Empresas', seniority: 'Director', rating: 4.8, years: 12, mentees: 6, totalSessions: 142 };

  const myMentees = window.BFA.talents.filter(t => t.mentor === 'Edmilson Cardoso');

  const [showNewTask, setShowNewTask] = React.useState(false);
  const [taskForm, setTaskForm] = React.useState({ title: '', description: '', talentId: '', category: 'Formação', priority: 'média', dueDate: '' });
  const [myTasks, setMyTasks] = React.useState(
    window.BFA.tasks.filter(t => myMentees.some(m => m.id === t.talentId))
  );

  const myAbsences = window.BFA.absences.filter(a => myMentees.some(m => m.id === a.talentId));
  const [absences, setAbsences] = React.useState(myAbsences);
  const [showAbsenceDetail, setShowAbsenceDetail] = React.useState(null);
  const [absenceNote, setAbsenceNote] = React.useState('');

  const [sessions, setSessions] = React.useState([
    { id: 'S-0084', date: '2026-05-20', time: '14:30', mentee: 'Alberto Massano',   menteeId: 'T-1058', topic: 'Integração pós-contratação',    dur: 45, status: 'upcoming', local: 'Sede BFA · Sala 4.2',     notes: '' },
    { id: 'S-0083', date: '2026-05-14', time: '11:00', mentee: 'Domingas Kassinda', menteeId: 'T-1046', topic: 'Revisão tese · capítulo 3',      dur: 75, status: 'upcoming', local: 'Videochamada · Teams',    notes: '' },
    { id: 'S-0082', date: '2026-05-09', time: '09:30', mentee: 'Kiala Domingos',    menteeId: 'T-1048', topic: 'Wealth management · portfólio',  dur: 60, status: 'upcoming', local: 'Sede BFA · Sala 4.2',     notes: '' },
    { id: 'S-0081', date: '2026-05-08', time: '15:00', mentee: 'Lwini Capemba',     menteeId: 'T-1042', topic: 'Modelação · spread analysis',    dur: 60, status: 'upcoming', local: 'Sede BFA · Sala 4.2',     notes: '' },
    { id: 'S-0079', date: '2026-04-30', time: '15:00', mentee: 'Lwini Capemba',     menteeId: 'T-1042', topic: 'Revisão PDI Q2',                 dur: 60, status: 'done',     local: 'Sede BFA · Sala 4.2',     notes: 'Progresso sólido. Foco em DCF para próxima sessão.' },
    { id: 'S-0078', date: '2026-04-22', time: '10:00', mentee: 'Kiala Domingos',    menteeId: 'T-1048', topic: 'Liderança · case study BFA',     dur: 60, status: 'done',     local: 'Sede BFA · Sala 4.2',     notes: 'Excelente análise. Recomendei leitura Heifetz.' },
    { id: 'S-0077', date: '2026-04-15', time: '14:00', mentee: 'Domingas Kassinda', menteeId: 'T-1046', topic: 'Apresentação de dissertação',     dur: 90, status: 'done',     local: 'Videochamada · Teams',    notes: 'Estrutura sólida. Rever secção metodológica.' },
    { id: 'S-0076', date: '2026-04-08', time: '11:30', mentee: 'Alberto Massano',   menteeId: 'T-1058', topic: 'Career path · plano de 5 anos',  dur: 60, status: 'done',     local: 'Sede BFA · Sala 4.2',     notes: 'Decidimos Banca Empresas como trajectória principal.' },
    { id: 'S-0075', date: '2026-03-28', time: '15:30', mentee: 'Lwini Capemba',     menteeId: 'T-1042', topic: 'Análise de crédito · caso real',  dur: 75, status: 'done',     local: 'Sede BFA · Sala 4.2',     notes: 'Apresentou proposta ao comité. Muito bom trabalho.' },
    { id: 'S-0074', date: '2026-03-20', time: '10:00', mentee: 'Kiala Domingos',    menteeId: 'T-1048', topic: 'Gestão de equipas',              dur: 60, status: 'done',     local: 'Sede BFA · Sala 4.2',     notes: 'Trabalhando estilos de liderança situacional.' }
  ]);

  const [evals, setEvals] = React.useState(myMentees.map(t => ({
    talentId: t.id, talentName: t.name, program: t.program,
    cycle: 'Q2 2026', due: '15 Jun 2026',
    submitted: t.perf > 93
  })));

  const upcoming = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status === 'done');
  const pendingEvals = evals.filter(e => !e.submitted);

  const markDone = (id) => setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'done' } : s));

  const COMPS = ['Atitude & Motivação', 'Desempenho técnico', 'Iniciativa & Proactividade', 'Comunicação executiva', 'Trabalho em equipa'];

  const getScore = (field) => evalScores[field] || 3;
  const setScore = (field, val) => setEvalScores(prev => ({ ...prev, [field]: val }));

  const submitEval = () => {
    if (!showEvalModal) return;
    setEvals(prev => prev.map(e => e.talentId === showEvalModal.talentId ? { ...e, submitted: true } : e));
    setEvalScores({});
    setShowEvalModal(null);
  };

  const pendingAbsences = absences.filter(a => a.status === 'pending');
  const overdueMyTasks = myTasks.filter(t => t.status === 'overdue').length;

  const approveAbsence = (id) => {
    setAbsences(prev => prev.map(a => a.id === id
      ? { ...a, status: 'approved', approvedBy: 'Edmilson Cardoso', mentorNote: absenceNote || 'Aprovado pelo mentor.' }
      : a
    ));
    setAbsenceNote('');
    setShowAbsenceDetail(null);
  };

  const rejectAbsence = (id) => {
    setAbsences(prev => prev.map(a => a.id === id
      ? { ...a, status: 'rejected', approvedBy: 'Edmilson Cardoso', mentorNote: absenceNote || 'Rejeitado pelo mentor.' }
      : a
    ));
    setAbsenceNote('');
    setShowAbsenceDetail(null);
  };

  const markTaskDone = (id) => {
    setMyTasks(prev => prev.map(t => t.id === id
      ? { ...t, status: 'done', completedAt: new Date().toISOString().slice(0, 10) }
      : t
    ));
  };

  const submitNewTask = () => {
    if (!taskForm.title || !taskForm.talentId || !taskForm.dueDate) return;
    const talent = myMentees.find(m => m.id === taskForm.talentId);
    setMyTasks(prev => [{
      id: 'TK-M' + String(prev.length + 1).padStart(3, '0'),
      title: taskForm.title,
      description: taskForm.description,
      talentId: taskForm.talentId,
      talentName: talent?.name || '',
      assignedBy: 'Edmilson Cardoso',
      assignedByRole: 'mentor',
      category: taskForm.category,
      priority: taskForm.priority,
      status: 'pending',
      dueDate: taskForm.dueDate,
      completedAt: null
    }, ...prev]);
    setTaskForm({ title: '', description: '', talentId: '', category: 'Formação', priority: 'média', dueDate: '' });
    setShowNewTask(false);
  };

  const TABS = [
    { id: 'visao',       label: 'Visão geral' },
    { id: 'mentorandos', label: 'Mentorandos', count: myMentees.length },
    { id: 'sessoes',     label: 'Sessões',     count: upcoming.length },
    { id: 'avaliacoes',  label: 'Avaliações',  count: pendingEvals.length },
    { id: 'tarefas',     label: 'Tarefas',     count: overdueMyTasks > 0 ? overdueMyTasks : null },
    { id: 'faltas',      label: 'Faltas',      count: pendingAbsences.length > 0 ? pendingAbsences.length : null },
    { id: 'perfil',      label: 'O meu perfil' }
  ];

  const sTone = { active: 'success', delayed: 'warn', risk: 'danger', completed: 'info', hired: 'primary', onboarding: 'info' };

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Olá, Edmilson 👋</h1>
          <p className="page-subtitle">
            Director · Banca de Empresas · {myMentees.length} mentorandos activos · Ciclo Q2 2026
          </p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Relatório</button>
          <button className="btn btn-primary" onClick={() => setShowNewSession(true)}>
            <Icon name="plus" size={14} /> Registar sessão
          </button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Mentorandos" value={myMentees.length} sub={`capacidade: ${me.mentees}/8`} icon="users" />
        <KPI label="Sessões · Abr–Mai" value={pastSessions.length} sub={`${upcoming.length} agendadas`} deltaTone="up" delta="+3 vs Mar" icon="briefcase" />
        <KPI label="Avaliações pendentes" value={pendingEvals.length} sub="prazo: 15 Jun 2026" deltaTone={pendingEvals.length > 3 ? 'flat' : 'up'} icon="star" />
        <KPI label="Próxima sessão" value="8 Mai" sub="Lwini Capemba · 15h00" icon="calendar" />
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count != null && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ===== VISÃO GERAL ===== */}
      {tab === 'visao' && (
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {pendingEvals.length > 0 && (
              <div className="card" style={{ background: 'var(--warn-bg)', borderColor: 'var(--warn-border)' }}>
                <div className="card-pad" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Icon name="alert" size={20} style={{ color: 'var(--warn)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>
                      {pendingEvals.length} avaliação(ões) por submeter
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      Prazo: 15 Jun 2026 · {pendingEvals.map(e => e.talentName.split(' ')[0]).join(', ')}
                    </div>
                  </div>
                  <button className="btn btn-sm" onClick={() => setTab('avaliacoes')}>Ver avaliações</button>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-head">
                <h3 className="card-title">Próximas sessões</h3>
                <button className="btn btn-sm" onClick={() => setTab('sessoes')}>Ver todas</button>
              </div>
              {upcoming.slice(0, 4).map((s, i) => (
                <div key={s.id} style={{
                  padding: '13px 18px',
                  borderBottom: i < Math.min(upcoming.length, 4) - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex', gap: 14, alignItems: 'center'
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                    background: 'var(--primary-soft)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--primary-deep)', textTransform: 'uppercase' }}>
                      {new Date(s.date).toLocaleDateString('pt-PT', { month: 'short' })}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-deep)', lineHeight: 1 }}>
                      {new Date(s.date).getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Avatar name={s.mentee} size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.mentee}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.time} · {s.dur} min</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>{s.topic}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
                      <Icon name="pin" size={10} /> {s.local}
                    </div>
                  </div>
                  <button className="btn btn-sm" onClick={() => markDone(s.id)}>
                    <Icon name="check" size={12} /> Concluída
                  </button>
                </div>
              ))}
              {upcoming.length === 0 && (
                <div className="card-pad" style={{ textAlign: 'center', color: 'var(--text-3)', padding: 24 }}>
                  <div style={{ fontSize: 13 }}>Sem sessões agendadas · use "Registar sessão" para agendar</div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Mentorandos · estado rápido</h3></div>
              <table className="tbl">
                <thead><tr><th>Mentorando</th><th>Programa</th><th className="num">GPA</th><th>Performance</th><th>Estado</th><th>Última sessão</th></tr></thead>
                <tbody>
                  {myMentees.map(t => {
                    const prog = window.BFA.programs.find(p => p.id === t.program);
                    const lastS = pastSessions.filter(s => s.menteeId === t.id)[0];
                    return (
                      <tr key={t.id}>
                        <td><div className="cell-person"><Avatar name={t.name} size={26} /><div className="meta"><b>{t.name}</b><span className="mono">{t.id}</span></div></div></td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: prog.color }} /><span style={{ fontSize: 12 }}>{prog.name}</span></div></td>
                        <td className="num" style={{ fontWeight: 500 }}>{t.gpa.toFixed(1)}</td>
                        <td style={{ width: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Bar value={t.perf} tone={t.perf >= 80 ? 'success' : t.perf >= 65 ? '' : 'warn'} />
                            <span style={{ fontSize: 11, fontWeight: 500 }}>{t.perf}</span>
                          </div>
                        </td>
                        <td><Pill tone={sTone[t.status] || 'neutral'}>{window.BFA.statuses[t.status]?.label || t.status}</Pill></td>
                        <td className="muted" style={{ fontSize: 11 }}>{lastS ? lastS.date : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head"><h3 className="card-title">As minhas estatísticas</h3></div>
              <div className="card-pad">
                {[
                  ['Total de sessões', me.totalSessions],
                  ['Avaliação média dos mentorandos', me.rating + ' / 5 ★'],
                  ['Anos como mentor', me.years],
                  ['Mentorandos activos', me.mentees],
                  ['Sessões este mês', pastSessions.length]
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-2)' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Avaliações Q2 2026</h3></div>
              <div>
                {evals.map((e, i) => (
                  <div key={e.talentId} style={{
                    padding: '11px 18px',
                    borderBottom: i < evals.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}>
                    <Avatar name={e.talentName} size={28} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.talentName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Prazo: {e.due}</div>
                    </div>
                    {e.submitted
                      ? <Pill tone="success">Submetida</Pill>
                      : <button className="btn btn-sm btn-primary" onClick={() => setShowEvalModal(e)}>Avaliar</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MENTORANDOS ===== */}
      {tab === 'mentorandos' && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {myMentees.map(t => {
            const prog = window.BFA.programs.find(p => p.id === t.program);
            const lastS = pastSessions.filter(s => s.menteeId === t.id)[0];
            const nextS = upcoming.filter(s => s.menteeId === t.id)[0];
            const evalE = evals.find(e => e.talentId === t.id);
            return (
              <div key={t.id} className="card">
                <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <Avatar name={t.name} size={52} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</span>
                        <Pill tone={sTone[t.status] || 'neutral'}>{window.BFA.statuses[t.status]?.label || t.status}</Pill>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: prog.color }} />
                          {prog.name}
                        </span>
                        <span style={{ margin: '0 6px', color: 'var(--text-4)' }}>·</span>
                        {t.university}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: t.riskScore >= 0.4 ? 'var(--danger, #B91C1C)' : t.riskScore >= 0.25 ? 'var(--warn)' : 'var(--success)' }}>
                        {Math.round((1 - t.riskScore) * 100)}%
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>saúde</div>
                    </div>
                  </div>
                </div>
                <div className="card-pad">
                  <div className="grid cols-3" style={{ gap: 10, marginBottom: 12 }}>
                    <div><div className="label">GPA</div><div className="value" style={{ fontWeight: 600 }}>{t.gpa.toFixed(1)}</div></div>
                    <div><div className="label">Performance</div><div className="value" style={{ fontWeight: 600 }}>{t.perf}/100</div></div>
                    <div><div className="label">Subsídio</div><div className="value">{window.BFA.fmtKzShort(t.stipend || 0)}</div></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Performance</span>
                      <span style={{ fontSize: 11, fontWeight: 500 }}>{t.perf}%</span>
                    </div>
                    <Bar value={t.perf} tone={t.perf >= 80 ? 'success' : t.perf >= 65 ? '' : 'warn'} />
                  </div>
                  {(lastS || nextS) && (
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10 }}>
                      {nextS && <div><Icon name="calendar" size={10} /> Próxima: {nextS.date} · {nextS.topic}</div>}
                      {lastS && <div style={{ marginTop: 2 }}><Icon name="check" size={10} /> Última: {lastS.date} · {lastS.topic}</div>}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => setShowNewSession(true)}>
                      <Icon name="calendar" size={12} /> Sessão
                    </button>
                    <button className="btn btn-sm" disabled={evalE?.submitted}
                      style={evalE?.submitted ? { opacity: 0.5 } : {}}
                      onClick={() => !evalE?.submitted && setShowEvalModal(evalE)}>
                      <Icon name="star" size={12} /> {evalE?.submitted ? 'Avaliado ✓' : 'Avaliar'}
                    </button>
                    <div style={{ flex: 1 }} />
                    {t.riskScore >= 0.4 && (
                      <Pill tone="danger">Risco {Math.round(t.riskScore * 100)}%</Pill>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== SESSÕES ===== */}
      {tab === 'sessoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Sessões agendadas · próximas</h3>
                <p className="card-subtitle">{upcoming.length} sessões · clique em "Concluída" para registar</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowNewSession(true)}>
                <Icon name="plus" size={14} /> Nova sessão
              </button>
            </div>
            {upcoming.length === 0 ? (
              <div className="card-pad" style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-3)' }}>
                <div style={{ marginBottom: 8, opacity: 0.35 }}><Icon name="calendar" size={32} /></div>
                <div style={{ fontSize: 13 }}>Sem sessões agendadas</div>
                <button className="btn btn-sm" style={{ marginTop: 12 }} onClick={() => setShowNewSession(true)}>Agendar agora</button>
              </div>
            ) : (
              <table className="tbl">
                <thead><tr><th>Data · Hora</th><th>Mentorando</th><th>Tópico</th><th>Local</th><th>Dur.</th><th></th></tr></thead>
                <tbody>
                  {upcoming.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{s.date}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.time}</div>
                      </td>
                      <td><div className="cell-person"><Avatar name={s.mentee} size={26} /><b style={{ fontSize: 13, fontWeight: 500 }}>{s.mentee}</b></div></td>
                      <td style={{ fontSize: 13 }}>{s.topic}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.local}</td>
                      <td className="num muted">{s.dur} min</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => markDone(s.id)}>
                          <Icon name="check" size={12} /> Concluída
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Histórico de sessões</h3>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{pastSessions.length} sessões registadas</span>
            </div>
            <div>
              {pastSessions.map((s, i) => (
                <div key={s.id} style={{
                  padding: '14px 20px',
                  borderBottom: i < pastSessions.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex', gap: 14
                }}>
                  <div style={{ width: 50, flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {new Date(s.date).toLocaleDateString('pt-PT', { month: 'short' })}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {new Date(s.date).getDate()}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-4)' }}>
                      {new Date(s.date).getFullYear()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                      <Avatar name={s.mentee} size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.mentee}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.time} · {s.dur} min · {s.local}</span>
                      <div style={{ flex: 1 }} />
                      <Pill tone="success">Concluída</Pill>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{s.topic}</div>
                    {s.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== AVALIAÇÕES ===== */}
      {tab === 'avaliacoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pendingEvals.length > 0 && (
            <div className="card" style={{ background: 'var(--warn-bg)', borderColor: 'var(--warn-border)' }}>
              <div className="card-pad" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Icon name="clock" size={20} style={{ color: 'var(--warn)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>
                    {pendingEvals.length} avaliação(ões) por submeter · prazo 15 Jun 2026
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    O feedback do mentor pesa 25% na avaliação final de cada mentorando
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Avaliações 360° · Ciclo Q2 2026</h3>
                <p className="card-subtitle">Mentor + Pares + Auto-avaliação + Gestor · prazo: 15 Jun 2026</p>
              </div>
              <Pill tone={pendingEvals.length === 0 ? 'success' : 'warn'}>
                {evals.filter(e => e.submitted).length}/{evals.length} submetidas
              </Pill>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Mentorando</th>
                  <th>Programa</th>
                  <th>GPA actual</th>
                  <th>Perf. anterior</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {evals.map(e => {
                  const t = myMentees.find(m => m.id === e.talentId);
                  if (!t) return null;
                  const prog = window.BFA.programs.find(p => p.id === t.program);
                  return (
                    <tr key={e.talentId}>
                      <td><div className="cell-person"><Avatar name={t.name} size={26} /><div className="meta"><b>{t.name}</b><span className="mono">{t.id}</span></div></div></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: prog.color }} />
                          <span style={{ fontSize: 12 }}>{prog.name}</span>
                        </div>
                      </td>
                      <td className="num" style={{ fontWeight: 500 }}>{t.gpa.toFixed(1)}</td>
                      <td style={{ width: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Bar value={t.perf} tone={t.perf >= 80 ? 'success' : t.perf >= 65 ? '' : 'warn'} />
                          <span style={{ fontSize: 11, fontWeight: 500 }}>{t.perf}</span>
                        </div>
                      </td>
                      <td>
                        {e.submitted ? <Pill tone="success">Submetida</Pill> : <Pill tone="warn">Pendente</Pill>}
                      </td>
                      <td>
                        {!e.submitted
                          ? <button className="btn btn-sm btn-primary" onClick={() => setShowEvalModal(e)}>
                              <Icon name="star" size={12} /> Avaliar
                            </button>
                          : <button className="btn btn-sm">Ver</button>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== PERFIL ===== */}
      {tab === 'perfil' && (
        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head">
                <h3 className="card-title">O meu perfil de mentor</h3>
                <button className="btn btn-sm"><Icon name="cog" size={12} /> Editar</button>
              </div>
              <div style={{ padding: '20px 18px', display: 'flex', gap: 20, alignItems: 'flex-start', borderBottom: '1px solid var(--border)' }}>
                <Avatar name={me.name} size={72} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{me.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{me.seniority} · {me.dept}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                    <div><div className="label">Avaliação</div><div className="value-strong">{me.rating} ★</div></div>
                    <div><div className="label">Total sessões</div><div className="value-strong">{me.totalSessions}</div></div>
                    <div><div className="label">Mentees</div><div className="value-strong">{me.mentees}/8</div></div>
                    <div><div className="label">Anos BFA</div><div className="value-strong">{me.years}</div></div>
                  </div>
                </div>
              </div>
              <div className="card-pad">
                <div className="label" style={{ marginBottom: 6 }}>Bio (visível para mentorandos)</div>
                <textarea className="input" rows="4" style={{ width: '100%', resize: 'vertical' }}
                  defaultValue="Director da Banca de Empresas no BFA com 12 anos de experiência em análise de crédito corporativo, structured finance e relacionamento com grandes clientes. Mentor desde 2014 — já acompanhei 4 coortes do Programa Futuro BFA." />
                <button className="btn btn-sm" style={{ marginTop: 10 }}>Guardar bio</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head"><h3 className="card-title">Disponibilidade semanal</h3></div>
              <div className="card-pad">
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                  Janelas disponíveis para sessões (editável)
                </div>
                {[
                  ['Segunda',  '14h00 – 17h00', true ],
                  ['Terça',    '—',              false],
                  ['Quarta',   '09h00 – 12h00', true ],
                  ['Quinta',   '14h00 – 17h00', true ],
                  ['Sexta',    '09h00 – 11h00', true ]
                ].map(([d, h, avail], i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 0',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                    fontSize: 13
                  }}>
                    <span style={{ color: 'var(--text-2)', fontWeight: 500, width: 80 }}>{d}</span>
                    <span style={{ flex: 1, color: avail ? 'var(--text)' : 'var(--text-4)', fontStyle: avail ? 'normal' : 'italic' }}>
                      {h}
                    </span>
                    <input type="checkbox" defaultChecked={avail} />
                  </div>
                ))}
                <button className="btn btn-sm" style={{ marginTop: 12, width: '100%' }}>Guardar disponibilidade</button>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Reconhecimentos</h3></div>
              <div>
                {[
                  { year: 2023, label: 'Mentor do Ano · Programa Futuro BFA' },
                  { year: 2021, label: 'Top 10 Banca Empresas · Africa Banker Awards' }
                ].map((a, i) => (
                  <div key={i} style={{ padding: '12px 18px', borderBottom: i < 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Icon name="award" size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13 }}>{a.label}</div>
                    <span className="mono muted" style={{ fontSize: 11 }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAREFAS ===== */}
      {tab === 'tarefas' && (() => {
        const statusMeta = {
          pending:     { label: 'Pendente',  tone: 'neutral' },
          in_progress: { label: 'Em curso',  tone: 'info' },
          done:        { label: 'Concluída', tone: 'success' },
          overdue:     { label: 'Em atraso', tone: 'danger' }
        };
        const priorityMeta = {
          alta:  { label: 'Alta',  tone: 'danger' },
          média: { label: 'Média', tone: 'warn' },
          baixa: { label: 'Baixa', tone: 'neutral' }
        };
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Tarefas dos meus mentorandos</h3>
                  <p className="card-subtitle">{myTasks.length} tarefas · {myTasks.filter(t => t.status === 'overdue').length} em atraso</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowNewTask(true)}>
                  <Icon name="plus" size={14} /> Nova tarefa
                </button>
              </div>
              {myTasks.length === 0 ? (
                <div className="card-pad" style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: 13 }}>Sem tarefas atribuídas aos teus mentorandos.</div>
                  <button className="btn btn-sm" style={{ marginTop: 12 }} onClick={() => setShowNewTask(true)}>Criar primeira tarefa</button>
                </div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr><th>Tarefa</th><th>Mentorando</th><th>Categoria</th><th>Prioridade</th><th>Prazo</th><th>Estado</th><th></th></tr>
                  </thead>
                  <tbody>
                    {myTasks.map(tk => {
                      const sm = statusMeta[tk.status] || statusMeta.pending;
                      const pm = priorityMeta[tk.priority] || priorityMeta.média;
                      return (
                        <tr key={tk.id} className={tk.status === 'overdue' ? 'row-active' : ''}>
                          <td>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{tk.title}</div>
                            {tk.description && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{tk.description.slice(0, 60)}…</div>}
                          </td>
                          <td>{tk.talentName}</td>
                          <td><span className="badge badge-neutral">{tk.category}</span></td>
                          <td><span className={`badge badge-${pm.tone}`}>{pm.label}</span></td>
                          <td style={{ color: tk.status === 'overdue' ? 'var(--danger)' : undefined, fontSize: 12 }}>{tk.dueDate}</td>
                          <td><span className={`badge badge-${sm.tone}`}>{sm.label}</span></td>
                          <td>
                            {tk.status !== 'done' && (
                              <button className="btn btn-sm btn-primary" onClick={() => markTaskDone(tk.id)}>
                                <Icon name="check" size={12} /> Concluir
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })()}

      {showNewTask && (
        <Modal title="Nova tarefa para mentorando" onClose={() => setShowNewTask(false)} width={520}
          footer={
            <>
              <button className="btn" onClick={() => setShowNewTask(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={submitNewTask}
                style={{ opacity: (!taskForm.title || !taskForm.talentId || !taskForm.dueDate) ? 0.5 : 1 }}>
                <Icon name="check" size={12} /> Criar tarefa
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="label">Título da tarefa *</div>
              <input className="input" style={{ width: '100%' }} value={taskForm.title}
                onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Elaborar análise de crédito" />
            </div>
            <div>
              <div className="label">Mentorando *</div>
              <select className="input select" style={{ width: '100%' }} value={taskForm.talentId}
                onChange={e => setTaskForm(f => ({ ...f, talentId: e.target.value }))}>
                <option value="">Seleccionar mentorando…</option>
                {myMentees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Categoria</div>
                <select className="input select" style={{ width: '100%' }} value={taskForm.category}
                  onChange={e => setTaskForm(f => ({ ...f, category: e.target.value }))}>
                  {['Formação','Relatório','PDI','Documento','Apresentação','Certificação','Avaliação'].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
              <div>
                <div className="label">Prioridade</div>
                <select className="input select" style={{ width: '100%' }} value={taskForm.priority}
                  onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="alta">Alta</option>
                  <option value="média">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
            </div>
            <div>
              <div className="label">Prazo *</div>
              <input className="input" type="date" style={{ width: '100%' }} value={taskForm.dueDate}
                onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div>
              <div className="label">Instruções / descrição</div>
              <textarea className="input" rows="3" style={{ width: '100%', resize: 'vertical' }}
                value={taskForm.description}
                onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descreve o que o mentorando deve fazer…" />
            </div>
          </div>
        </Modal>
      )}

      {/* ===== FALTAS ===== */}
      {tab === 'faltas' && (() => {
        const statusMeta = {
          pending:  { label: 'Pendente',  tone: 'warn' },
          approved: { label: 'Aprovada',  tone: 'success' },
          rejected: { label: 'Rejeitada', tone: 'danger' }
        };
        const typeMeta = {
          justificada:   { label: 'Justificada',   tone: 'info' },
          injustificada: { label: 'Injustificada', tone: 'danger' }
        };
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pendingAbsences.length > 0 && (
              <div className="card" style={{ background: 'var(--warn-bg)', borderColor: 'var(--warn-border)' }}>
                <div className="card-pad" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Icon name="clock" size={20} style={{ color: 'var(--warn)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>
                      {pendingAbsences.length} pedido(s) de falta por aprovar
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      {pendingAbsences.map(a => a.talentName.split(' ')[0]).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="card">
              <div className="card-head">
                <h3 className="card-title">Faltas dos meus mentorandos</h3>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{absences.length} registos</span>
              </div>
              {absences.length === 0 ? (
                <div className="card-pad" style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-3)', fontSize: 13 }}>
                  Sem faltas registadas para os teus mentorandos.
                </div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr><th>Mentorando</th><th>Tipo</th><th>Motivo</th><th>Data</th><th>Dias</th><th>Estado</th><th>Acções</th></tr>
                  </thead>
                  <tbody>
                    {absences.map(a => {
                      const sm = statusMeta[a.status];
                      const tm = typeMeta[a.type];
                      return (
                        <tr key={a.id}>
                          <td>{a.talentName}</td>
                          <td><span className={`badge badge-${tm.tone}`}>{tm.label}</span></td>
                          <td style={{ fontSize: 12 }}>{a.reason || <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                          <td style={{ fontSize: 12 }}>{a.date}</td>
                          <td style={{ textAlign: 'center' }}>{a.days}d</td>
                          <td><span className={`badge badge-${sm.tone}`}>{sm.label}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-sm" onClick={() => { setAbsenceNote(''); setShowAbsenceDetail(a); }}>Ver</button>
                              {a.status === 'pending' && (
                                <button className="btn btn-sm btn-primary" onClick={() => { setAbsenceNote(''); setShowAbsenceDetail(a); }}>Decidir</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })()}

      {showAbsenceDetail && (
        <Modal title={showAbsenceDetail.id + ' · Pedido de falta'} onClose={() => setShowAbsenceDetail(null)} width={500}
          footer={
            showAbsenceDetail.status === 'pending' ? (
              <>
                <button className="btn btn-primary" onClick={() => approveAbsence(showAbsenceDetail.id)}>Aprovar</button>
                <button className="btn btn-danger" onClick={() => rejectAbsence(showAbsenceDetail.id)}>Rejeitar</button>
                <button className="btn" onClick={() => setShowAbsenceDetail(null)}>Cancelar</button>
              </>
            ) : (
              <button className="btn" onClick={() => setShowAbsenceDetail(null)}>Fechar</button>
            )
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="info-grid">
              <div className="info-item"><span>Mentorando</span><b>{showAbsenceDetail.talentName}</b></div>
              <div className="info-item"><span>Data</span><b>{showAbsenceDetail.date}</b></div>
              <div className="info-item"><span>Tipo</span><b>{showAbsenceDetail.type}</b></div>
              <div className="info-item"><span>Dias</span><b>{showAbsenceDetail.days}</b></div>
            </div>
            {showAbsenceDetail.reason && (
              <div>
                <div className="label">Motivo apresentado</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                  {showAbsenceDetail.reason}
                </div>
              </div>
            )}
            {showAbsenceDetail.status === 'pending' && (
              <div>
                <div className="label">Nota / observação</div>
                <textarea className="input" rows="2" style={{ width: '100%' }}
                  value={absenceNote} onChange={e => setAbsenceNote(e.target.value)}
                  placeholder="Adicionar comentário à decisão…" />
              </div>
            )}
            {showAbsenceDetail.mentorNote && showAbsenceDetail.status !== 'pending' && (
              <div>
                <div className="label">Nota do mentor</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                  {showAbsenceDetail.mentorNote}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ===== MODALS ===== */}

      {showNewSession && (
        <Modal title="Registar / agendar sessão de mentoria" onClose={() => setShowNewSession(false)} width={560}
          footer={
            <>
              <button className="btn" onClick={() => setShowNewSession(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowNewSession(false)}>
                <Icon name="check" size={12} /> Guardar sessão
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="label">Mentorando</div>
              <select className="input select" style={{ width: '100%' }}>
                {myMentees.map(t => <option key={t.id} value={t.id}>{t.name} · {t.id}</option>)}
              </select>
            </div>
            <div>
              <div className="label">Tópico da sessão</div>
              <input className="input" style={{ width: '100%' }} placeholder="Ex: Revisão PDI · análise de crédito" />
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Data</div>
                <input className="input" type="date" style={{ width: '100%' }} />
              </div>
              <div>
                <div className="label">Hora</div>
                <input className="input" type="time" style={{ width: '100%' }} defaultValue="15:00" />
              </div>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Duração</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option>60 minutos</option>
                  <option>45 minutos</option>
                  <option>75 minutos</option>
                  <option>90 minutos</option>
                </select>
              </div>
              <div>
                <div className="label">Local</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option>Sede BFA · Sala 4.2</option>
                  <option>Videochamada · Teams</option>
                  <option>Videochamada · Zoom</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>
            <div>
              <div className="label">Notas / resultado (se sessão já realizada)</div>
              <textarea className="input" rows="3" style={{ width: '100%', resize: 'vertical' }}
                placeholder="Resumo da sessão, próximos passos…" />
            </div>
          </div>
        </Modal>
      )}

      {showEvalModal && (() => {
        const t = myMentees.find(m => m.id === showEvalModal.talentId);
        return (
          <Modal title={`Avaliação 360° · ${showEvalModal.talentName}`} onClose={() => setShowEvalModal(null)} width={600}
            footer={
              <>
                <button className="btn" onClick={() => setShowEvalModal(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={submitEval}>
                  <Icon name="star" size={12} /> Submeter avaliação
                </button>
              </>
            }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 12, background: 'var(--surface-2)', borderRadius: 6 }}>
                <Avatar name={showEvalModal.talentName} size={44} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{showEvalModal.talentName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    Ciclo {showEvalModal.cycle} · GPA actual: {t?.gpa.toFixed(1)} · Performance anterior: {t?.perf}
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <Pill tone="warn">Pendente</Pill>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 12 }}>
                  Competências (1 = Insuficiente · 5 = Excelente)
                </div>
                {COMPS.map((comp, i) => {
                  const key = `${showEvalModal.talentId}_${i}`;
                  const val = getScore(key);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                      <div style={{ width: 200, fontSize: 13, color: 'var(--text-2)' }}>{comp}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setScore(key, n)} style={{
                            width: 34, height: 34, borderRadius: 6, border: '1px solid',
                            borderColor: val >= n ? 'var(--primary)' : 'var(--border)',
                            background: val >= n ? 'var(--primary)' : 'var(--surface)',
                            color: val >= n ? '#fff' : 'var(--text-3)',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer'
                          }}>{n}</button>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', width: 80 }}>
                        {['', 'Insuficiente', 'A melhorar', 'Adequado', 'Bom', 'Excelente'][val]}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <div className="label">Pontos fortes observados</div>
                <textarea className="input" rows="2" style={{ width: '100%', resize: 'vertical' }}
                  placeholder="O que o mentorando faz bem, onde se destaca…" />
              </div>
              <div>
                <div className="label">Áreas a desenvolver</div>
                <textarea className="input" rows="2" style={{ width: '100%', resize: 'vertical' }}
                  placeholder="O que deve melhorar, lacunas identificadas…" />
              </div>
              <div>
                <div className="label">Recomendação geral</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option>Continuar programa · bom progresso</option>
                  <option>Continuar programa · monitorização reforçada</option>
                  <option>Rever programa · intervenção necessária</option>
                  <option>Propor contratação no BFA</option>
                </select>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};
