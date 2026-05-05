// BFA TalentFlow — Mentoria expandida (gestão de mentores)
window.PageMentoriaPro = function PageMentoriaPro() {
  const [tab, setTab] = React.useState('pares');
  const [selected, setSelected] = React.useState(null);
  const [showAtribuirModal, setShowAtribuirModal] = React.useState(false);

  const mentors = window.BFA.mentors.map((m, i) => ({
    ...m,
    id: 'M-' + (210 + i),
    seniority: ['Sénior', 'Director', 'Sénior', 'Director', 'Sénior', 'Sénior'][i] || 'Sénior',
    years: [12, 15, 9, 18, 11, 8][i] || 10,
    languages: [['Português', 'Inglês'], ['Português', 'Inglês', 'Francês'], ['Português', 'Inglês'], ['Português', 'Inglês'], ['Português'], ['Português', 'Inglês']][i] || ['Português'],
    expertise: [
      ['Banca corporativa', 'Análise de crédito', 'Modelação financeira'],
      ['Mercados internacionais', 'Trade finance', 'FX'],
      ['Cibersegurança', 'Cloud', 'Arquitectura'],
      ['Wealth management', 'Investimentos'],
      ['Risco operacional', 'Compliance'],
      ['Marketing digital', 'Customer experience']
    ][i] || [],
    capacity: 8,
    nextSession: ['8 Mai · 15h00', '12 Mai · 10h30', '14 Mai · 09h00', '9 Mai · 16h00', '20 Mai · 11h00', '15 Mai · 14h00'][i],
    avatar: m.name
  }));

  const sessions = [
    { date: '2026-04-30', time: '15:00', mentor: 'Edmilson Cardoso', mentee: 'Lwini Capemba',         topic: 'Revisão PDI Q2',          duration: 60, status: 'done' },
    { date: '2026-05-02', time: '10:30', mentor: 'Sofia Mendes',     mentee: 'Joaquim Tchindemba',    topic: 'Trade finance · case study', duration: 75, status: 'done' },
    { date: '2026-05-08', time: '15:00', mentor: 'Edmilson Cardoso', mentee: 'Lwini Capemba',         topic: 'Modelação · spread analysis', duration: 60, status: 'scheduled' },
    { date: '2026-05-09', time: '16:00', mentor: 'José Almeida',     mentee: 'Kiala Domingos',        topic: 'Wealth management · AUM',  duration: 60, status: 'scheduled' },
    { date: '2026-05-12', time: '11:00', mentor: 'Sofia Mendes',     mentee: 'Nzinga Matondo',        topic: 'Roadmap pós-mestrado',     duration: 75, status: 'scheduled' },
    { date: '2026-05-14', time: '09:00', mentor: 'Patrícia Lopes',   mentee: 'Yuran Bumba',           topic: 'Code review · projecto interno', duration: 90, status: 'scheduled' },
    { date: '2026-05-15', time: '14:00', mentor: 'Lina Cazimba',     mentee: 'Adélio Sebastião',      topic: 'Plano de recuperação',     duration: 90, status: 'urgent' }
  ];

  const [matchSuggestions, setMatchSuggestions] = React.useState([
    { mentee: 'Carla Bunga',           program: 'HEC Paris', suggested: 'Sofia Mendes',    score: 94, why: 'Trade finance · língua FR · disponibilidade' },
    { mentee: 'Heitor Quitumba',       program: 'LSE',       suggested: 'José Almeida',    score: 89, why: 'Wealth · mercados internacionais' },
    { mentee: 'Walter Tchitangueleca', program: 'UCAN',      suggested: 'Domingos Vieira', score: 81, why: 'Risco · proximidade geográfica' }
  ]);

  const TABS = [
    { id: 'pares',     label: 'Pares activos', count: 25 },
    { id: 'pool',      label: 'Pool de mentores', count: mentors.length },
    { id: 'sessoes',   label: 'Sessões', count: sessions.length },
    { id: 'matching',  label: 'Matching IA', count: matchSuggestions.length, badge: matchSuggestions.length > 0 }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Mentoria · Gestão Integrada</h1>
          <p className="page-subtitle">{mentors.length} mentores · 25 mentorandos · agenda Q2 2026 · matching algorítmico</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={14} /> Agenda completa</button>
          <button className="btn"><Icon name="download" size={14} /> Relatório mensal</button>
          <button className="btn btn-primary" onClick={() => setShowAtribuirModal(true)}>
            <Icon name="plus" size={14} /> Atribuir mentoria
          </button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Sessões · mês" value="47" sub="+12 vs Abr" deltaTone="up" delta="+34%" icon="briefcase" />
        <KPI label="Carga média" value="4,2 / mentor" sub="capacidade 8" icon="users" />
        <KPI label="Satisfação" value="4,6/5" sub="247 avaliações" deltaTone="up" delta="+0,2" icon="star" />
        <KPI label="Pares por atribuir" value="3" sub="aguardam matching" deltaTone="flat" icon="link" />
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}<span className="tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'pool' && (
        <div className="grid cols-3" style={{ gap: 14 }}>
          {mentors.map(m => (
            <div key={m.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(m)}>
              <div className="card-pad">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar name={m.name} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.seniority} · {m.years} anos · {m.dept}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600 }}>
                    <Icon name="star" size={11} fill="#FF7607" stroke={0} />
                    {m.rating.toFixed(1)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {m.expertise.slice(0, 3).map((e, i) => <Pill key={i} tone="neutral">{e}</Pill>)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Bar value={(m.mentees / m.capacity) * 100} tone={m.mentees >= 6 ? 'warn' : 'success'} />
                  <span style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{m.mentees}/{m.capacity} mentees</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="calendar" size={11} /> Próxima sessão: {m.nextSession}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'pares' && (
        <div className="card">
          <div className="card-head"><h3 className="card-title">Pares mentor · mentorando</h3></div>
          <table className="tbl">
            <thead><tr><th>Mentor</th><th></th><th>Mentorando</th><th>Programa</th><th>Sessões</th><th>Início</th><th>Última sessão</th><th>Saúde</th></tr></thead>
            <tbody>
              {[
                { mentor: 'Edmilson Cardoso', mentee: 'Lwini Capemba',         menteeId: 'T-1042', prog: 'Futuro BFA',     sessions: 8,  start: '2024-09', last: 'há 4 dias',  health: 'good' },
                { mentor: 'Sofia Mendes',     mentee: 'Joaquim Tchindemba',    menteeId: 'T-1043', prog: 'Bolsa Internac.', sessions: 12, start: '2024-09', last: 'há 6 dias',  health: 'good' },
                { mentor: 'Sofia Mendes',     mentee: 'Nzinga Matondo',        menteeId: 'T-1049', prog: 'Bolsa Internac.', sessions: 10, start: '2024-09', last: 'há 8 dias',  health: 'good' },
                { mentor: 'Patrícia Lopes',   mentee: 'Yuran Bumba',           menteeId: 'T-1045', prog: 'Futuro BFA',     sessions: 9,  start: '2023-09', last: 'há 5 dias',  health: 'good' },
                { mentor: 'José Almeida',     mentee: 'Kiala Domingos',        menteeId: 'T-1048', prog: 'Liderança+',     sessions: 6,  start: '2025-02', last: 'há 2 dias',  health: 'good' },
                { mentor: 'Edmilson Cardoso', mentee: 'Domingas Kassinda',     menteeId: 'T-1046', prog: 'Mestrado',       sessions: 5,  start: '2025-09', last: 'há 3 dias',  health: 'good' },
                { mentor: 'Lina Cazimba',     mentee: 'Adélio Sebastião',      menteeId: 'T-1047', prog: 'Bolsa Nac.',     sessions: 4,  start: '2022-09', last: 'há 22 dias', health: 'risk' },
                { mentor: 'Domingos Vieira',  mentee: 'Esperança Quimbamba',   menteeId: 'T-1044', prog: 'Bolsa Nac.',     sessions: 6,  start: '2023-10', last: 'há 14 dias', health: 'warn' }
              ].map((p, i) => (
                <tr key={i}>
                  <td><div className="cell-person"><Avatar name={p.mentor} size={26} /><div className="meta"><b>{p.mentor}</b><span>Mentor</span></div></div></td>
                  <td style={{ width: 28, color: 'var(--text-4)', textAlign: 'center' }}><Icon name="link" size={12} /></td>
                  <td><div className="cell-person"><Avatar name={p.mentee} size={26} /><div className="meta"><b>{p.mentee}</b><span className="mono">{p.menteeId}</span></div></div></td>
                  <td>{p.prog}</td>
                  <td className="num">{p.sessions}</td>
                  <td className="muted">{p.start}</td>
                  <td className="muted">{p.last}</td>
                  <td>
                    {p.health === 'good' ? <Pill tone="success">Saudável</Pill> :
                     p.health === 'warn' ? <Pill tone="warn">A acompanhar</Pill> :
                     <Pill tone="danger">Em risco</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'sessoes' && (
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Agenda · próximos 15 dias</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="chip-filter active">Todos</button>
              <button className="chip-filter">Hoje</button>
              <button className="chip-filter">Esta semana</button>
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>Quando</th><th>Mentor</th><th>Mentorando</th><th>Tópico</th><th>Duração</th><th>Estado</th></tr></thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{s.date}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.time}</div>
                  </td>
                  <td><div className="cell-person"><Avatar name={s.mentor} size={24} /><b style={{ fontWeight: 500, fontSize: 13 }}>{s.mentor}</b></div></td>
                  <td><div className="cell-person"><Avatar name={s.mentee} size={24} /><b style={{ fontWeight: 500, fontSize: 13 }}>{s.mentee}</b></div></td>
                  <td style={{ fontSize: 13 }}>{s.topic}</td>
                  <td className="num muted">{s.duration} min</td>
                  <td>
                    {s.status === 'done' ? <Pill tone="success">Concluída</Pill> :
                     s.status === 'urgent' ? <Pill tone="danger">Urgente</Pill> :
                     <Pill tone="info">Agendada</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'matching' && (
        <>
          <div className="card" style={{ background: 'var(--info-bg)', borderColor: 'var(--info-border)' }}>
            <div className="card-pad" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Icon name="zap" size={20} style={{ color: 'var(--info)', marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--info)', marginBottom: 4 }}>Algoritmo de matching</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>
                  Pesa <b>especialização</b> (40%), <b>capacidade disponível</b> (25%), <b>histórico de sucesso em pares similares</b> (20%), <b>idioma e fuso horário</b> (10%) e <b>preferências declaradas</b> (5%). Validação humana obrigatória antes de atribuir.
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Sugestões pendentes · 3 mentorandos a aguardar par</h3>
            </div>
            {matchSuggestions.map((s, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: i < matchSuggestions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar name={s.mentee} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.mentee}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.program}</div>
                  </div>
                  <Icon name="arrowRight" size={14} style={{ color: 'var(--text-3)' }} />
                  <Avatar name={s.suggested} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.suggested}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.why}</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 70 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.score >= 90 ? 'var(--success)' : 'var(--primary)' }}>{s.score}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>match score</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm"
                      onClick={() => setMatchSuggestions(prev => prev.filter(x => x.mentee !== s.mentee))}>
                      Rejeitar
                    </button>
                    <button className="btn btn-sm btn-primary"
                      onClick={() => setMatchSuggestions(prev => prev.filter(x => x.mentee !== s.mentee))}>
                      <Icon name="check" size={12} /> Aprovar par
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'matching' && matchSuggestions.length === 0 && (
        <div className="card">
          <div className="card-pad" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-3)' }}>
            <div style={{ marginBottom: 12, opacity: 0.35 }}><Icon name="check" size={36} /></div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Todas as sugestões foram processadas</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Não há mentorandos a aguardar par de mentor</div>
          </div>
        </div>
      )}

      {showAtribuirModal && (
        <Modal title="Atribuir nova mentoria" onClose={() => setShowAtribuirModal(false)} width={560}
          footer={
            <>
              <button className="btn" onClick={() => setShowAtribuirModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowAtribuirModal(false)}>
                <Icon name="check" size={12} /> Confirmar atribuição
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="label">Mentorando</div>
              <select className="input select" style={{ width: '100%' }}>
                <option value="">— Seleccionar bolseiro / trainee —</option>
                {window.BFA.talents.map(t => (
                  <option key={t.id}>{t.name} · {t.id} · {window.BFA.programs.find(p => p.id === t.program)?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">Mentor</div>
              <select className="input select" style={{ width: '100%' }}>
                <option value="">— Seleccionar mentor —</option>
                {window.BFA.mentors.map((m, i) => (
                  <option key={i}>{m.name} · {m.dept} · {m.mentees}/8 mentees · ★ {m.rating.toFixed(1)}</option>
                ))}
              </select>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Data de início</div>
                <input className="input" type="date" style={{ width: '100%' }} />
              </div>
              <div>
                <div className="label">Frequência das sessões</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option>Mensal</option>
                  <option>Quinzenal</option>
                  <option>Semanal</option>
                </select>
              </div>
            </div>
            <div>
              <div className="label">Objectivos da mentoria (opcional)</div>
              <textarea className="input" rows="3" style={{ width: '100%', resize: 'vertical' }}
                placeholder="Áreas de foco, metas a atingir…" />
            </div>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} width={720}
          footer={<><button className="btn">Ver agenda</button><button className="btn btn-primary">Atribuir novo mentee</button></>}>
          <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
            <Avatar name={selected.name} size={72} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{selected.seniority} · {selected.dept}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{selected.years} anos no BFA · idiomas: {selected.languages.join(', ')}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                <div><div className="label">Avaliação</div><div className="value-strong">{selected.rating.toFixed(1)} / 5</div></div>
                <div><div className="label">Mentees</div><div className="value-strong">{selected.mentees} / {selected.capacity}</div></div>
                <div><div className="label">Próxima sessão</div><div className="value-strong">{selected.nextSession}</div></div>
              </div>
            </div>
          </div>
          <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 8px' }}>Áreas de especialização</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selected.expertise.map((e, i) => <Pill key={i} tone="primary">{e}</Pill>)}
          </div>
        </Modal>
      )}
    </div>
  );
};
