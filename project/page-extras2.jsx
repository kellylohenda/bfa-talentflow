// BFA TalentFlow — Workflows, Retenção, Compliance, Bolseiro extra
// ===== Workflows de aprovação multi-nível (pagamentos) =====
window.PageWorkflows = function PageWorkflows() {
  const [selected, setSelected] = React.useState(null);

  const workflows = [
    { id: 'WF-2451', talent: 'Heitor Quitumba', talentId: 'T-1054', type: 'Propina LSE',          amount: 3120000, urgency: 'high',   submitted: '2026-04-28 09:14', step: 3, totalSteps: 4 },
    { id: 'WF-2452', talent: 'Carla Bunga',     talentId: 'T-1051', type: 'Propina HEC Paris',    amount: 2640000, urgency: 'normal', submitted: '2026-04-27 16:02', step: 2, totalSteps: 4 },
    { id: 'WF-2453', talent: 'Domingas Kassinda', talentId: 'T-1046', type: 'Alojamento Porto',   amount: 480000,  urgency: 'normal', submitted: '2026-04-27 11:48', step: 4, totalSteps: 4 },
    { id: 'WF-2454', talent: 'Lote · 38 trainees', talentId: '—',    type: 'Subsídio mensal Abr',  amount: 14440000, urgency: 'high',  submitted: '2026-04-26 08:00', step: 2, totalSteps: 4 },
    { id: 'WF-2455', talent: 'Walter Tchitangueleca', talentId: 'T-1052', type: 'Subsídio · revisão', amount: 200000, urgency: 'low', submitted: '2026-04-25 14:33', step: 1, totalSteps: 4 },
    { id: 'WF-2456', talent: 'Nzinga Matondo',  talentId: 'T-1049', type: 'Reprocessamento SWIFT', amount: 1780000, urgency: 'high', submitted: '2026-04-25 10:15', step: 1, totalSteps: 4 }
  ];

  const STEPS = [
    { id: 1, label: 'Submissão',     role: 'Gestor de Programa', icon: 'doc' },
    { id: 2, label: 'Validação RH',  role: 'Director de RH',     icon: 'users' },
    { id: 3, label: 'Tesouraria',    role: 'Director Financeiro', icon: 'cash' },
    { id: 4, label: 'Execução',      role: 'Core Banking · SAP',  icon: 'zap' }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Workflows de Aprovação</h1>
          <p className="page-subtitle">Cadeia de aprovação multi-nível para pagamentos · 4 etapas · Política BFA-RH-2024.07</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="filter" size={14} /> Filtros</button>
          <button className="btn"><Icon name="download" size={14} /> Auditoria</button>
          <button className="btn btn-primary"><Icon name="check" size={14} /> Aprovar todos seleccionados</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Pendentes" value={workflows.length} sub="aguardam acção" deltaTone="flat" icon="clock" />
        <KPI label="Aprovados hoje" value="14" sub="14 transacções · Kz 5,8M" deltaTone="up" delta="+22%" icon="check" />
        <KPI label="Tempo médio · ciclo" value="8h 12m" sub="meta SLA: 24h" deltaTone="up" delta="−2h vs Mar" icon="zap" />
        <KPI label="Em escalada" value="2" sub=">48h sem acção" deltaTone="down" delta="atenção" icon="alert" />
      </div>

      <div className="card">
        <div className="card-head"><h3 className="card-title">Fila de aprovação · {workflows.length} workflows</h3></div>
        <table className="tbl">
          <thead><tr><th>Workflow</th><th>Beneficiário</th><th>Tipo</th><th className="num">Valor</th><th>Urgência</th><th style={{ width: 280 }}>Progresso</th><th>Submetido</th><th></th></tr></thead>
          <tbody>
            {workflows.map(w => (
              <tr key={w.id} onClick={() => setSelected(w)} style={{ cursor: 'pointer' }}>
                <td className="mono muted">{w.id}</td>
                <td>{w.talent !== 'Lote · 38 trainees'
                  ? <div className="cell-person"><Avatar name={w.talent} size={24} /><div className="meta"><b>{w.talent}</b><span className="mono">{w.talentId}</span></div></div>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="layers" size={14} /><b style={{ fontWeight: 500 }}>{w.talent}</b></div>
                }</td>
                <td>{w.type}</td>
                <td className="num" style={{ fontWeight: 600 }}>{window.BFA.fmtKz(w.amount)}</td>
                <td>
                  {w.urgency === 'high' ? <Pill tone="danger">Alta</Pill> :
                   w.urgency === 'normal' ? <Pill tone="info">Normal</Pill> :
                   <Pill tone="neutral">Baixa</Pill>}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {STEPS.map((s, i) => {
                      const done = w.step > s.id;
                      const current = w.step === s.id;
                      const next = w.step < s.id;
                      return (
                        <React.Fragment key={s.id}>
                          <div title={s.label} style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--surface-3)',
                            color: done || current ? '#fff' : 'var(--text-3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: current ? '2px solid var(--primary-glow)' : '1px solid var(--border)',
                            fontSize: 9, fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {done ? <Icon name="check" size={11} /> : s.id}
                          </div>
                          {i < STEPS.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: w.step > i + 1 ? 'var(--success)' : 'var(--border)', minWidth: 12 }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                    Etapa {w.step} de {w.totalSteps} · {STEPS[w.step-1].label}
                  </div>
                </td>
                <td className="muted" style={{ fontSize: 11 }}>{w.submitted}</td>
                <td><button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(w); }}>Rever</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`${selected.id} · ${selected.type}`} onClose={() => setSelected(null)}
          footer={
            <>
              <button className="btn">Adicionar comentário</button>
              <button className="btn btn-danger">Rejeitar</button>
              <button className="btn btn-primary"><Icon name="check" size={12} /> Aprovar e avançar</button>
            </>
          } width={780}>
          <div className="grid cols-3" style={{ gap: 14, marginBottom: 18 }}>
            <div><div className="label">Beneficiário</div><div className="value">{selected.talent}</div></div>
            <div><div className="label">Valor</div><div className="value-strong">{window.BFA.fmtKz(selected.amount)}</div></div>
            <div><div className="label">Urgência</div><div>{selected.urgency === 'high' ? <Pill tone="danger">Alta</Pill> : <Pill tone="info">Normal</Pill>}</div></div>
          </div>

          <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 12px' }}>Cadeia de aprovação</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STEPS.map(s => {
              const done = selected.step > s.id;
              const current = selected.step === s.id;
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: current ? 'var(--primary-soft)' : done ? 'var(--success-bg)' : 'var(--surface-2)',
                  border: '1px solid ' + (current ? 'var(--primary)' : done ? 'var(--success-border)' : 'var(--border)'),
                  borderRadius: 6
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--surface-3)',
                    color: done || current ? '#fff' : 'var(--text-3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {done ? <Icon name="check" size={14} /> : <Icon name={s.icon} size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.role}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {done ? '✓ Aprovado · há 2h' : current ? 'A aguardar acção' : 'Pendente'}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ===== Plano de Retenção Individual =====
window.PageRetencao = function PageRetencao({ setPage, setSelectedTalent }) {
  const atRisk = window.BFA.talents
    .filter(t => t.riskScore >= 0.3)
    .sort((a, b) => b.riskScore - a.riskScore);

  const actions = {
    'T-1047': [
      { type: 'mentor',    text: 'Reforçar acompanhamento — sessões semanais', who: 'Lina Cazimba', due: '15 Mai', done: true },
      { type: 'academic',  text: 'Plano de recuperação académica · cadeiras em atraso', who: 'Coordenação UAN', due: '30 Mai', done: false },
      { type: 'meeting',   text: 'Reunião com bolseiro · revisão de motivação', who: 'RH', due: '12 Mai', done: false },
      { type: 'financial', text: 'Avaliar suspensão temporária do subsídio', who: 'Tesouraria', due: '20 Mai', done: false }
    ]
  };

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Planos de Retenção Individual</h1>
          <p className="page-subtitle">{atRisk.length} talentos com sinais de risco · acção preventiva sobre abandono e baixo desempenho</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo plano</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Talentos em risco" value={atRisk.length} sub="modelo preditivo · score ≥ 0,3" icon="alert" deltaTone="flat" />
        <KPI label="Planos activos" value="6" sub="com acções em curso" deltaTone="up" delta="+2" icon="shield" />
        <KPI label="Recuperações · 12m" value="11" sub="73% taxa de sucesso" deltaTone="up" delta="meta: 70%" icon="check" />
        <KPI label="Custo evitado" value="Kz 142M" sub="vs. abandono total" deltaTone="up" delta="estimativa" icon="cash" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 16, alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Lista priorizada</h3>
            <span className="pill pill-danger"><span className="dot"></span>Risco alto</span>
          </div>
          <table className="tbl">
            <thead><tr><th>Talento</th><th>Score</th><th>Sinais</th></tr></thead>
            <tbody>
              {atRisk.map(t => (
                <tr key={t.id} onClick={() => { setSelectedTalent(t.id); setPage('talento'); }} style={{ cursor: 'pointer' }}>
                  <td><div className="cell-person"><Avatar name={t.name} size={26} /><div className="meta"><b>{t.name}</b><span className="mono">{t.id}</span></div></div></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Bar value={t.riskScore * 100} tone={t.riskScore > 0.6 ? 'danger' : 'warn'} />
                      <span style={{ fontWeight: 600, fontSize: 12 }}>{Math.round(t.riskScore * 100)}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {t.gpa < 14 && <Pill tone="warn">GPA baixo</Pill>}
                      {t.perf < 70 && <Pill tone="warn">Perf baixa</Pill>}
                      {t.status === 'risk' && <Pill tone="danger">Em risco</Pill>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Plano · Adélio Sebastião (T-1047)</h3>
              <p className="card-subtitle">Risco 78% · GPA 13.2 · Perf 58 · Última actualização há 4 dias</p>
            </div>
            <Pill tone="danger">Crítico</Pill>
          </div>
          <div className="card-pad">
            <div className="grid cols-3" style={{ gap: 12, marginBottom: 16 }}>
              <div><div className="label">Mentor</div><div className="value">Lina Cazimba</div></div>
              <div><div className="label">Próxima revisão</div><div className="value">12 Mai 2026</div></div>
              <div><div className="label">Investido até hoje</div><div className="value">Kz 8,4M</div></div>
            </div>

            <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 10px' }}>Acções definidas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {actions['T-1047'].map((a, i) => {
                const tones = { mentor: '#0891B2', academic: '#7C3AED', meeting: '#1D4ED8', financial: '#B45309' };
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', background: a.done ? 'var(--success-bg)' : 'var(--surface-2)',
                    borderRadius: 6, border: '1px solid ' + (a.done ? 'var(--success-border)' : 'var(--border)')
                  }}>
                    <input type="checkbox" defaultChecked={a.done} />
                    <div style={{ width: 4, height: 28, background: tones[a.type], borderRadius: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, textDecoration: a.done ? 'line-through' : 'none', color: a.done ? 'var(--text-3)' : 'var(--text)' }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{a.who} · prazo {a.due}</div>
                    </div>
                    {a.done ? <Pill tone="success">Feito</Pill> : <Pill tone="warn">Pendente</Pill>}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 18, padding: 12, background: 'var(--info-bg)', borderRadius: 6, borderLeft: '3px solid var(--info)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--info)', marginBottom: 4 }}>Recomendação do modelo IA</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                Probabilidade de recuperação: <b>52%</b> com plano completo · <b>14%</b> sem intervenção. Talentos com perfil similar tiveram melhor recuperação com mentoria intensiva (sessões semanais) + apoio académico estruturado.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Compliance / APD / Auditoria =====
window.PageCompliance = function PageCompliance() {
  const auditLog = [
    { ts: '2026-04-30 14:22:08', user: 'mariana.quissama@bfa.ao', action: 'PAYMENT_APPROVE', target: 'WF-2453', ip: '10.4.18.22', risk: 'low' },
    { ts: '2026-04-30 14:18:51', user: 'manuel.bemba@bfa.ao',     action: 'TALENT_VIEW',     target: 'T-1042', ip: '10.4.18.07', risk: 'low' },
    { ts: '2026-04-30 13:55:14', user: 'sistema · job-001',       action: 'BATCH_PAYMENT_RUN', target: '38 transacções', ip: 'internal', risk: 'low' },
    { ts: '2026-04-30 13:42:09', user: 'patricia.lopes@bfa.ao',   action: 'EVAL_SUBMIT',      target: 'T-1045', ip: '10.4.19.41', risk: 'low' },
    { ts: '2026-04-30 12:08:33', user: 'admin.ti@bfa.ao',         action: 'PERM_GRANT',       target: 'role:gestor → joao.cabral', ip: '10.4.18.01', risk: 'medium' },
    { ts: '2026-04-30 11:14:02', user: 'externo · ?',             action: 'LOGIN_FAILED',     target: 'mariana.quissama (5x)', ip: '102.64.18.122', risk: 'high' },
    { ts: '2026-04-30 10:48:21', user: 'mariana.quissama@bfa.ao', action: 'EXPORT_CSV',       target: '247 registos · talentos', ip: '10.4.18.22', risk: 'medium' },
    { ts: '2026-04-30 09:22:17', user: 'lwini.capemba@bolseiro',  action: 'DOC_UPLOAD',       target: 'Boletim 1S 2026.pdf', ip: '197.249.32.18', risk: 'low' }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Compliance · APD · Auditoria</h1>
          <p className="page-subtitle">Conformidade com Lei 22/11 (APD Angola) · Logs imutáveis · Retenção 7 anos</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Exportar log</button>
          <button className="btn"><Icon name="shield" size={14} /> Reportar à APD</button>
          <button className="btn btn-primary">Gerar evidência</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Eventos · 24h" value="1.842" sub="auditoria activa" deltaTone="up" delta="+8%" icon="layers" />
        <KPI label="Acessos suspeitos" value="3" sub="bloqueados automaticamente" deltaTone="down" delta="atenção" icon="alert" />
        <KPI label="Conformidade APD" value="100%" sub="auto-avaliação Q2 2026" deltaTone="up" delta="✓ certificada" icon="shield" />
        <KPI label="Retenção de dados" value="7 anos" sub="conforme Lei 22/11" icon="clock" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Estado de conformidade</h3></div>
          <div>
            {[
              { item: 'Encriptação em repouso (AES-256)',    status: 'ok' },
              { item: 'Encriptação em trânsito (TLS 1.3)',   status: 'ok' },
              { item: 'Direito ao apagamento (art. 21)',     status: 'ok' },
              { item: 'Notificação de violação 72h (art. 24)', status: 'ok' },
              { item: 'Termo de consentimento bolseiros',     status: 'ok' },
              { item: 'DPO designado · Dr. António Mavinga', status: 'ok' },
              { item: 'Avaliação de impacto · revisão',      status: 'warn' },
              { item: 'Transferências internacionais (UE)',  status: 'ok' }
            ].map((c, i) => (
              <div key={i} style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: c.status === 'ok' ? 'var(--success-bg)' : 'var(--warn-bg)',
                  color: c.status === 'ok' ? 'var(--success)' : 'var(--warn)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon name={c.status === 'ok' ? 'check' : 'alert'} size={12} />
                </div>
                <div style={{ flex: 1, fontSize: 13 }}>{c.item}</div>
                {c.status === 'ok' ? <Pill tone="success">Conforme</Pill> : <Pill tone="warn">Revisão devida</Pill>}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Permissões por perfil</h3>
            <button className="btn btn-sm">Editar</button>
          </div>
          <table className="tbl">
            <thead><tr><th>Permissão</th><th>RH</th><th>Direcção</th><th>Mentor</th><th>Audit.</th><th>Bolseiro</th></tr></thead>
            <tbody>
              {[
                ['Ver todos os talentos',     [1,1,0,1,0]],
                ['Editar perfil de talento',  [1,0,0,0,0]],
                ['Aprovar pagamentos',        [0,1,0,0,0]],
                ['Submeter avaliações',       [1,1,1,0,0]],
                ['Exportar dados (PII)',      [1,1,0,1,0]],
                ['Ver auditoria',             [0,1,0,1,0]],
                ['Aceder ao próprio perfil',  [1,1,1,1,1]]
              ].map(([perm, vals], i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>{perm}</td>
                  {vals.map((v, j) => (
                    <td key={j} style={{ textAlign: 'center' }}>
                      {v ? <Icon name="check" size={14} style={{ color: 'var(--success)' }} /> : <span style={{ color: 'var(--text-4)' }}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">Log de auditoria · últimas 24h</h3>
            <p className="card-subtitle">Imutável · assinado criptograficamente · pesquisável</p>
          </div>
          <input className="input input-search" placeholder="Pesquisar log…" style={{ width: 260 }} />
        </div>
        <table className="tbl">
          <thead><tr><th>Timestamp</th><th>Utilizador</th><th>Acção</th><th>Alvo</th><th>IP</th><th>Risco</th></tr></thead>
          <tbody>
            {auditLog.map((l, i) => (
              <tr key={i} className={l.risk === 'high' ? 'row-danger' : l.risk === 'medium' ? 'row-warn' : ''}>
                <td className="mono muted" style={{ fontSize: 11 }}>{l.ts}</td>
                <td className="mono" style={{ fontSize: 12 }}>{l.user}</td>
                <td><Pill tone={l.action.includes('FAILED') ? 'danger' : l.action.includes('EXPORT') || l.action.includes('GRANT') ? 'warn' : 'neutral'}>{l.action}</Pill></td>
                <td style={{ fontSize: 12 }}>{l.target}</td>
                <td className="mono muted" style={{ fontSize: 11 }}>{l.ip}</td>
                <td>{l.risk === 'high' ? <Pill tone="danger">Alto</Pill> : l.risk === 'medium' ? <Pill tone="warn">Médio</Pill> : <Pill tone="neutral">Baixo</Pill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===== Bolseiro extras: Documentos, Mentoria, Eventos =====
window.PageBolseiroDocs = function PageBolseiroDocs() {
  const [uploading, setUploading] = React.useState(false);
  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Os Meus Documentos</h1>
          <p className="page-subtitle">Submissões académicas e contratuais · todas encriptadas e auditadas</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setUploading(true)}><Icon name="plus" size={14} /> Submeter documento</button>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--warn-bg)', borderColor: 'var(--warn-border)' }}>
        <div className="card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="alert" size={22} style={{ color: 'var(--warn)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>Boletim 1º semestre 2026</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Submissão pendente · prazo 15 Mai 2026 (12 dias)</div>
          </div>
          <button className="btn">Submeter agora</button>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3 className="card-title">Histórico de documentos</h3></div>
        <table className="tbl">
          <thead><tr><th>Documento</th><th>Categoria</th><th>Data</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {[
              ['Contrato de Bolsa.pdf',         'Contrato',    '2025-08-15', 'verified'],
              ['Cláusula de Retorno.pdf',       'Contrato',    '2025-08-15', 'verified'],
              ['Boletim 1S 2026.pdf',           'Académico',   '2026-04-22', 'pending'],
              ['Boletim 2S 2025.pdf',           'Académico',   '2025-09-15', 'verified'],
              ['Comprovativo IBAN.pdf',         'Financeiro',  '2025-08-20', 'verified'],
              ['Carta de Recomendação UAN.pdf', 'Académico',   '2025-08-10', 'verified']
            ].map((d, i) => (
              <tr key={i}>
                <td><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="doc" size={14} /><b style={{ fontSize: 13, fontWeight: 500 }}>{d[0]}</b></div></td>
                <td><Pill tone="neutral">{d[1]}</Pill></td>
                <td className="muted">{d[2]}</td>
                <td>{d[3] === 'verified' ? <Pill tone="success">Validado</Pill> : <Pill tone="warn">Em análise</Pill>}</td>
                <td><button className="btn-ghost btn-xs"><Icon name="download" size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uploading && (
        <Modal title="Submeter novo documento" onClose={() => setUploading(false)}
          footer={<><button className="btn" onClick={() => setUploading(false)}>Cancelar</button><button className="btn btn-primary">Enviar</button></>}>
          <div className="col" style={{ gap: 14 }}>
            <div><div className="label">Categoria</div>
              <select className="input select" style={{ width: '100%' }}><option>Académico</option><option>Financeiro</option><option>Contratual</option><option>Pessoal</option></select>
            </div>
            <div><div className="label">Período de referência</div>
              <input className="input" placeholder="Ex: 1º semestre 2026" style={{ width: '100%' }} />
            </div>
            <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 8, padding: 32, textAlign: 'center' }}>
              <Icon name="download" size={28} style={{ color: 'var(--text-3)', transform: 'rotate(180deg)' }} />
              <div style={{ fontSize: 13, marginTop: 8 }}>Arraste o ficheiro ou <a href="#" style={{ color: 'var(--primary)' }}>seleccione do computador</a></div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>PDF, DOCX, JPG · máx 10 MB</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

window.PageBolseiroMentor = function PageBolseiroMentor() {
  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">A Minha Mentoria</h1>
          <p className="page-subtitle">Edmilson Cardoso · Banca de Empresas · 8 sessões realizadas</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary"><Icon name="calendar" size={14} /> Agendar sessão</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <div className="card">
          <div className="card-pad" style={{ textAlign: 'center' }}>
            <Avatar name="Edmilson Cardoso" size={72} />
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>Edmilson Cardoso</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Director · Banca de Empresas</div>
            <div style={{ marginTop: 14, padding: 12, background: 'var(--surface-2)', borderRadius: 6, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Próxima sessão</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>8 Mai 2026 · 15h00</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Sede BFA · Sala 4.2 · 60 min</div>
            </div>
            <button className="btn btn-sm" style={{ marginTop: 10, width: '100%' }}><Icon name="mail" size={12} /> Enviar mensagem</button>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3 className="card-title">Sessões anteriores</h3></div>
          <table className="tbl">
            <thead><tr><th>Data</th><th>Tópico</th><th>Duração</th><th>Notas</th></tr></thead>
            <tbody>
              {[
                ['2026-04-15', 'Revisão de PDI · plano Q2',          '60 min', 'Foco em capacidades de modelação financeira'],
                ['2026-03-22', 'Carreira pós-formação',                '75 min', 'Discussão sobre rotações em Banca Empresas'],
                ['2026-02-18', 'Avaliação semestral · feedback',     '90 min', 'Resultados acima da média do programa'],
                ['2026-01-14', 'Definição de objectivos 2026',       '60 min', 'Metas SMART definidas e validadas']
              ].map((s, i) => (
                <tr key={i}>
                  <td className="muted">{s[0]}</td>
                  <td><b style={{ fontWeight: 500 }}>{s[1]}</b></td>
                  <td className="muted">{s[2]}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{s[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.PageBolseiroEventos = function PageBolseiroEventos() {
  const events = [
    { date: '12 Mai', month: 'Maio', title: 'Workshop "Banca em Angola"',         where: 'Sede BFA · Luanda',     spots: '12/30',  type: 'Workshop' },
    { date: '18 Mai', month: 'Maio', title: 'Webinar Risco de Crédito Internacional', where: 'Online · Zoom',     spots: '47/100', type: 'Webinar' },
    { date: '04 Jun', month: 'Junho', title: 'Networking com alumni Futuro BFA', where: 'Hotel Talatona · Luanda', spots: '23/80', type: 'Networking' },
    { date: '15 Jun', month: 'Junho', title: 'Career Day · Rotação de Departamentos', where: 'Sede BFA',           spots: 'Todos · obrigatório', type: 'Programa' }
  ];
  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Eventos & Workshops</h1>
          <p className="page-subtitle">Oportunidades de formação e networking · próximos 60 dias</p>
        </div>
      </div>
      <div className="grid cols-2">
        {events.map((e, i) => (
          <div key={i} className="card" style={{ display: 'flex' }}>
            <div style={{ width: 80, padding: '18px 12px', background: 'var(--primary-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-deep)', letterSpacing: '-0.02em' }}>{e.date.split(' ')[0]}</div>
              <div style={{ fontSize: 11, color: 'var(--primary-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{e.month}</div>
            </div>
            <div className="card-pad" style={{ flex: 1 }}>
              <Pill tone="primary">{e.type}</Pill>
              <div style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 4px' }}>{e.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="pin" size={11} /> {e.where}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{e.spots}</span>
                <div style={{ flex: 1 }} />
                <button className="btn btn-sm btn-primary">Inscrever-me</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
