// BFA TalentFlow — Perfil do Mentor (vista do bolseiro)
window.PageMentorProfile = function PageMentorProfile() {
  const [tab, setTab] = React.useState('sobre');

  const mentor = {
    name: 'Edmilson Cardoso',
    role: 'Director · Banca de Empresas',
    seniority: 'Director', years: 12, sinceBFA: '2014',
    location: 'Sede BFA · Luanda',
    languages: ['Português (nativo)', 'Inglês (C1)', 'Francês (B1)'],
    timezone: 'WAT · UTC+1',
    rating: 4.8, totalSessions: 142, mentees: 6,
    bio: 'Director da Banca de Empresas no BFA com 12 anos de experiência em análise de crédito corporativo, structured finance e relacionamento com grandes clientes do sector petrolífero e diamantífero. Antes do BFA, passou pela Standard Bank (Joanesburgo) e completou o MBA na Nova SBE com bolsa Fulbright. Mentor de 6 trainees em 4 cohorts diferentes.',
    expertise: ['Análise de crédito corporativo', 'Modelação financeira', 'Trade finance', 'Relacionamento com clientes', 'Liderança de equipas', 'Apresentações executivas'],
    education: [
      { year: '2013–2014', what: 'MBA',                where: 'Nova SBE · Lisboa',                  highlight: true },
      { year: '2009–2010', what: 'Pós-graduação Banca', where: 'ISCTE · Lisboa',                    highlight: false },
      { year: '2004–2008', what: 'Licenciatura em Economia', where: 'Universidade Agostinho Neto · Luanda', highlight: false }
    ],
    awards: [
      { year: 2023, what: 'Mentor do Ano · Programa Futuro BFA' },
      { year: 2021, what: 'Top 10 Banca Empresas · Africa Banker Awards' }
    ],
    nextSession: { date: '8 Mai 2026', time: '15h00', dur: 60, where: 'Sede BFA · Sala 4.2', topic: 'Modelação · spread analysis' },
    sessions: [
      { date: '2026-04-15', time: '15:00', topic: 'Revisão de PDI · plano Q2',     dur: 60, mood: 'good',    notes: 'Foco em capacidades de modelação financeira. Próximo passo: caso prático em DCF até dia 30.' },
      { date: '2026-03-22', time: '14:30', topic: 'Carreira pós-formação',          dur: 75, mood: 'great',   notes: 'Discussão sobre rotações em Banca Empresas. Decidimos por 2 trimestres em risco antes de Tesouraria.' },
      { date: '2026-02-18', time: '10:00', topic: 'Avaliação semestral · feedback', dur: 90, mood: 'great',   notes: 'Resultados acima da média do programa. Pontos a reforçar: comunicação executiva.' },
      { date: '2026-01-14', time: '16:00', topic: 'Definição de objectivos 2026',   dur: 60, mood: 'good',    notes: 'Metas SMART definidas e validadas com a coordenação.' },
      { date: '2025-12-10', time: '11:00', topic: 'Reflexão de fim de ano',         dur: 60, mood: 'good',    notes: 'Boa adaptação ao ambiente bancário. Continuar acompanhamento mensal.' },
      { date: '2025-11-05', time: '15:30', topic: 'Análise de caso · cliente real', dur: 90, mood: 'great',   notes: 'Excelente trabalho na proposta de financiamento. Apresentou ao Comité.' },
      { date: '2025-10-08', time: '10:30', topic: 'Onboarding · Banca Empresas',    dur: 60, mood: 'neutral', notes: 'Primeira sessão. Apresentação mútua e definição de método de trabalho.' },
      { date: '2025-09-15', time: '14:00', topic: 'Sessão inaugural',                dur: 45, mood: 'good',    notes: 'Conheci o Edmilson. Boa energia, estilo directo, partilha de muitos exemplos práticos.' }
    ]
  };

  const moodColor = { great: 'var(--success)', good: 'var(--info)', neutral: 'var(--text-3)' };
  const moodIcon = { great: '★★★', good: '★★', neutral: '★' };

  const TABS = [
    { id: 'sobre',    label: 'Sobre' },
    { id: 'sessoes',  label: 'Sessões', count: mentor.sessions.length },
    { id: 'agendar',  label: 'Agendar nova' }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">O Meu Mentor</h1>
          <p className="page-subtitle">A relação de mentoria é o coração do programa · sessões mensais · acompanhamento contínuo</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="mail" size={14} /> Mensagem</button>
          <button className="btn btn-primary"><Icon name="calendar" size={14} /> Agendar sessão</button>
        </div>
      </div>

      {/* Hero card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-soft) 0%, var(--surface-2) 60%)',
          padding: '32px 32px 24px',
          display: 'flex', gap: 24, alignItems: 'flex-start'
        }}>
          <Avatar name={mentor.name} size={96} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>{mentor.name}</h2>
              <Pill tone="success">Activo</Pill>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14 }}>{mentor.role}</div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="pin" size={12} />{mentor.location}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={12} />{mentor.timezone}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="briefcase" size={12} />Mentor desde {mentor.sinceBFA}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>{mentor.rating}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avaliação</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{mentor.totalSessions}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessões</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{mentor.years}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-3)' }}>a</span></div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experiência</div>
            </div>
          </div>
        </div>

        {/* Next session strip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '14px 32px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8,
            background: 'var(--primary)', color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>MAI</div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>08</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Próxima sessão · {mentor.nextSession.topic}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
              {mentor.nextSession.time} · {mentor.nextSession.dur} min · {mentor.nextSession.where}
            </div>
          </div>
          <button className="btn btn-sm">Reagendar</button>
          <button className="btn btn-sm btn-primary">Adicionar à agenda</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}{t.count != null && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'sobre' && (
        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head"><h3 className="card-title">Bio</h3></div>
              <div className="card-pad">
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)', textWrap: 'pretty', margin: 0 }}>{mentor.bio}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Áreas de especialização</h3></div>
              <div className="card-pad">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {mentor.expertise.map((e, i) => <Pill key={i} tone="primary">{e}</Pill>)}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Formação</h3></div>
              <div>
                {mentor.education.map((e, i) => (
                  <div key={i} style={{
                    padding: '14px 18px',
                    borderBottom: i < mentor.education.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', gap: 14, alignItems: 'flex-start'
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: e.highlight ? 'var(--primary-soft)' : 'var(--surface-2)',
                      color: e.highlight ? 'var(--primary-deep)' : 'var(--text-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon name="graduation" size={15} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{e.what}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{e.where}</div>
                    </div>
                    <div className="mono muted" style={{ fontSize: 11 }}>{e.year}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Reconhecimentos</h3></div>
              <div>
                {mentor.awards.map((a, i) => (
                  <div key={i} style={{
                    padding: '12px 18px',
                    borderBottom: i < mentor.awards.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', gap: 12, alignItems: 'center'
                  }}>
                    <Icon name="award" size={16} style={{ color: 'var(--primary)' }} />
                    <div style={{ flex: 1, fontSize: 13 }}>{a.what}</div>
                    <span className="mono muted" style={{ fontSize: 11 }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-head"><h3 className="card-title">Idiomas</h3></div>
              <div className="card-pad">
                {mentor.languages.map((l, i) => (
                  <div key={i} style={{ padding: '6px 0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}></span>
                    {l}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'var(--info-bg)', borderColor: 'var(--info-border)' }}>
              <div className="card-pad">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="zap" size={18} style={{ color: 'var(--info)', marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--info)', marginBottom: 6 }}>Compromisso de mentoria</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>
                      Sessões mensais de 60–90 min · resposta a mensagens em 24h úteis · plano de desenvolvimento individual revisto trimestralmente.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3 className="card-title">Disponibilidade</h3></div>
              <div className="card-pad">
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>Janelas habituais para sessões</div>
                {[
                  ['Segunda',  '14h00 – 17h00'],
                  ['Terça',    '— sem disponibilidade'],
                  ['Quarta',   '09h00 – 12h00'],
                  ['Quinta',   '14h00 – 17h00'],
                  ['Sexta',    '09h00 – 11h00']
                ].map(([d, h], i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                    fontSize: 13
                  }}>
                    <span style={{ color: 'var(--text-2)' }}>{d}</span>
                    <span style={{ color: h.startsWith('—') ? 'var(--text-4)' : 'var(--text)', fontWeight: h.startsWith('—') ? 400 : 500 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-pad">
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Contacto directo</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>edmilson.cardoso@bfa.ao</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Sede BFA · Sala 4.2</div>
                <button className="btn btn-sm" style={{ width: '100%', marginTop: 12 }}><Icon name="mail" size={12} /> Enviar mensagem</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'sessoes' && (
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Histórico de sessões</h3>
              <p className="card-subtitle">{mentor.sessions.length} sessões registadas · todas as notas são partilhadas contigo</p>
            </div>
            <button className="btn btn-sm"><Icon name="download" size={12} /> Exportar</button>
          </div>
          <div>
            {mentor.sessions.map((s, i) => (
              <div key={i} style={{
                padding: '18px 20px',
                borderBottom: i < mentor.sessions.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', gap: 16
              }}>
                <div style={{
                  width: 56, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase' }}>
                    {new Date(s.date).toLocaleDateString('pt-PT', { month: 'short' })}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {new Date(s.date).getDate()}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{new Date(s.date).getFullYear()}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.topic}</div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.time} · {s.dur} min</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: moodColor[s.mood], letterSpacing: '0.05em' }} title={s.mood}>
                      {moodIcon[s.mood]}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>{s.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'agendar' && (
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div className="card">
            <div className="card-head"><h3 className="card-title">Pedir nova sessão</h3></div>
            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div className="label">Tópico da sessão</div>
                <input className="input" placeholder="Ex: Revisão de PDI · Q3" style={{ width: '100%' }} />
              </div>
              <div>
                <div className="label">O que gostarias de discutir? (opcional)</div>
                <textarea className="input" rows="4" style={{ width: '100%', resize: 'vertical' }} placeholder="Algumas linhas para o mentor preparar a sessão" />
              </div>
              <div className="grid cols-2" style={{ gap: 12 }}>
                <div>
                  <div className="label">Data preferencial</div>
                  <input className="input" type="date" style={{ width: '100%' }} />
                </div>
                <div>
                  <div className="label">Duração</div>
                  <select className="input select" style={{ width: '100%' }}>
                    <option>60 minutos</option>
                    <option>45 minutos</option>
                    <option>90 minutos</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="label">Modalidade</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {['Presencial', 'Videochamada', 'Indiferente'].map(m => (
                    <label key={m} style={{
                      flex: 1,
                      padding: '12px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      textAlign: 'center'
                    }}>
                      <input type="radio" name="mode" defaultChecked={m === 'Presencial'} style={{ marginRight: 6 }} />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn">Cancelar</button>
                <div style={{ flex: 1 }} />
                <button className="btn btn-primary"><Icon name="calendar" size={12} /> Enviar pedido</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3 className="card-title">Próximas janelas livres</h3></div>
            <div>
              {[
                ['Segunda 5 Mai',  '14h00 – 15h00'],
                ['Quarta 7 Mai',   '09h30 – 10h30'],
                ['Quinta 8 Mai',   '15h00 – 16h00 · já reservada'],
                ['Sexta 9 Mai',    '09h00 – 10h00'],
                ['Quarta 14 Mai',  '11h00 – 12h00'],
                ['Quinta 15 Mai',  '14h00 – 15h00']
              ].map((s, i) => {
                const taken = s[1].includes('reservada');
                return (
                  <div key={i} style={{
                    padding: '11px 18px',
                    borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                    opacity: taken ? 0.5 : 1
                  }}>
                    <Icon name="clock" size={13} style={{ color: 'var(--text-3)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s[0]}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s[1]}</div>
                    </div>
                    {!taken && <button className="btn btn-xs">Escolher</button>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
