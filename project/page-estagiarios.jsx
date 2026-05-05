// BFA TalentFlow — Gestão de Estagiários (módulo completo)
window.PageEstagiarios = function PageEstagiarios({ setPage, setSelectedTalent }) {
  const [tab, setTab] = React.useState('lista');
  const [showModal, setShowModal] = React.useState(null);
  const [selectedOnboarding, setSelectedOnboarding] = React.useState(null);
  const [checklistState, setChecklistState] = React.useState({});

  const allTalents = window.BFA.talents;

  const onboardingChecklist = [
    { id: 'docs',     label: 'Documentação pessoal entregue',    mandatory: true  },
    { id: 'iban',     label: 'IBAN validado e registado',        mandatory: true  },
    { id: 'contract', label: 'Contrato assinado',                mandatory: true  },
    { id: 'system',   label: 'Acesso aos sistemas BFA criado',   mandatory: true  },
    { id: 'badge',    label: 'Crachá e acessos físicos',         mandatory: false },
    { id: 'mentor',   label: 'Mentor atribuído',                 mandatory: true  },
    { id: 'welcome',  label: 'Sessão de boas-vindas RH',         mandatory: false },
    { id: 'dept',     label: 'Apresentação ao departamento',     mandatory: false },
    { id: 'pdi',      label: 'PDI inicial elaborado',            mandatory: true  }
  ];

  const onboardingTalents = allTalents.filter(t => {
    const daysIn = (new Date() - new Date(t.startDate)) / (1000 * 60 * 60 * 24);
    return t.status === 'onboarding' || daysIn < 90;
  });

  const getChecked = (talentId, itemId) => {
    const key = `${talentId}_${itemId}`;
    if (checklistState[key] !== undefined) return checklistState[key];
    const t = allTalents.find(x => x.id === talentId);
    if (!t) return false;
    const idx = onboardingChecklist.findIndex(c => c.id === itemId);
    const threshold = t.riskScore < 0.2 ? 8 : t.riskScore < 0.4 ? 6 : 4;
    return idx < threshold;
  };

  const toggleChecklist = (talentId, itemId) => {
    const key = `${talentId}_${itemId}`;
    setChecklistState(prev => ({ ...prev, [key]: !getChecked(talentId, itemId) }));
  };

  const rotations = [
    { trainee: 'Lwini Capemba',   id: 'T-1042', current: 'Banca de Empresas',  next: 'Tesouraria',        start: '2026-07-01', dur: '3 meses' },
    { trainee: 'Yuran Bumba',     id: 'T-1045', current: 'TI / Sistemas',      next: 'Operações',         start: '2026-06-01', dur: '3 meses' },
    { trainee: 'Aida Bento',      id: 'T-1053', current: 'Marketing',          next: 'Banca de Retalho',  start: '2026-07-01', dur: '3 meses' },
    { trainee: 'Mateus Cabuenha', id: 'T-1056', current: 'Auditoria Interna',  next: 'Compliance',        start: '2026-06-15', dur: '3 meses' },
    { trainee: 'Fernando Ngoma',  id: 'T-1050', current: 'Risco de Crédito',   next: 'Banca de Empresas', start: '2026-06-01', dur: '3 meses' },
    { trainee: 'Kiala Domingos',  id: 'T-1048', current: 'Banca Privada',      next: 'Tesouraria',        start: '2026-09-01', dur: '3 meses' },
    { trainee: 'Alberto Massano', id: 'T-1058', current: 'Banca de Empresas',  next: 'Efectivado',        start: '—',          dur: 'Efectivo' }
  ];

  const contracts = allTalents.map(t => {
    const start = new Date(t.startDate);
    const durationYears = ['bif', 'mest'].includes(t.program) ? 2 : 3;
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + durationYears);
    const daysLeft = Math.floor((end - new Date()) / (1000 * 60 * 60 * 24));
    const st =
      t.status === 'hired'      ? 'efectivo'  :
      t.status === 'completed'  ? 'concluido' :
      daysLeft < 0              ? 'expirado'  :
      daysLeft < 90             ? 'a_renovar' : 'activo';
    return { ...t, contractEnd: end.toISOString().slice(0, 10), daysLeft, contractStatus: st };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  const TABS = [
    { id: 'lista',      label: 'Todos os estagiários', count: allTalents.length         },
    { id: 'onboarding', label: 'Onboarding',           count: onboardingTalents.length  },
    { id: 'rotacoes',   label: 'Rotações de Dept.',    count: rotations.length          },
    { id: 'contratos',  label: 'Contratos',            count: contracts.length          }
  ];

  const cTone  = { efectivo: 'primary', concluido: 'success', expirado: 'danger', a_renovar: 'warn', activo: 'success' };
  const cLabel = { efectivo: 'Efectivo', concluido: 'Concluído', expirado: 'Expirado', a_renovar: 'Renovar <90d', activo: 'Activo' };
  const sTone  = { active: 'success', delayed: 'warn', risk: 'danger', completed: 'info', hired: 'primary', onboarding: 'info', pending: 'neutral' };

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Gestão de Estagiários</h1>
          <p className="page-subtitle">
            {allTalents.length} colaboradores em {window.BFA.programs.length} programas ·
            onboarding, rotações de departamento e contratos
          </p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setShowModal('novo')}>
            <Icon name="plus" size={14} /> Novo estagiário
          </button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Total activos" value={allTalents.filter(t => ['active','onboarding'].includes(t.status)).length}
          sub="em todos os programas" deltaTone="up" delta="+4 vs Q1" icon="users" />
        <KPI label="Em onboarding" value={onboardingTalents.length}
          sub="< 90 dias no programa" deltaTone="flat" icon="zap" />
        <KPI label="Em risco" value={allTalents.filter(t => t.riskScore >= 0.4).length}
          sub="intervenção necessária" deltaTone="down" delta="atenção" icon="alert" />
        <KPI label="Contratos a renovar" value={contracts.filter(c => c.contractStatus === 'a_renovar').length}
          sub="nos próximos 90 dias" deltaTone="flat" icon="clock" />
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}<span className="tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* ===== LISTA ===== */}
      {tab === 'lista' && (
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Todos os estagiários & bolseiros</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="input input-search" placeholder="Pesquisar…" style={{ width: 200 }} />
              <select className="input select">
                <option>Todos os programas</option>
                {window.BFA.programs.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
              <select className="input select">
                <option>Todos os estados</option>
                <option>Activo</option>
                <option>Em risco</option>
                <option>Atraso</option>
                <option>Onboarding</option>
              </select>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Estagiário</th>
                <th>Programa</th>
                <th>Universidade · Local</th>
                <th className="num">GPA</th>
                <th>Perf.</th>
                <th>Estado</th>
                <th>Mentor</th>
                <th>Risco</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allTalents.map(t => {
                const prog = window.BFA.programs.find(p => p.id === t.program);
                return (
                  <tr key={t.id}>
                    <td>
                      <div className="cell-person">
                        <Avatar name={t.name} size={28} />
                        <div className="meta">
                          <b>{t.name}</b>
                          <span className="mono">{t.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: prog.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12 }}>{prog.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{t.university}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {t.dept !== '—' ? t.dept : `${t.city} · ${t.country}`}
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 500 }}>{t.gpa.toFixed(1)}</td>
                    <td style={{ width: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bar value={t.perf} tone={t.perf >= 80 ? 'success' : t.perf >= 65 ? '' : 'warn'} />
                        <span style={{ fontSize: 11, fontWeight: 500, minWidth: 28 }}>{t.perf}</span>
                      </div>
                    </td>
                    <td>
                      <Pill tone={sTone[t.status] || 'neutral'}>
                        {window.BFA.statuses[t.status]?.label || t.status}
                      </Pill>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.mentor}</td>
                    <td>
                      <Pill tone={t.riskScore >= 0.5 ? 'danger' : t.riskScore >= 0.3 ? 'warn' : 'success'}>
                        {Math.round(t.riskScore * 100)}%
                      </Pill>
                    </td>
                    <td>
                      <button className="btn btn-sm"
                        onClick={() => { setSelectedTalent(t.id); setPage('talento'); }}>
                        Ficha
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== ONBOARDING ===== */}
      {tab === 'onboarding' && (
        <div className="grid" style={{ gridTemplateColumns: '1.1fr 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Novos estagiários · em onboarding</h3>
              <Pill tone="info">{onboardingTalents.length} activos</Pill>
            </div>
            <table className="tbl">
              <thead>
                <tr><th>Estagiário</th><th>Início</th><th>Progresso</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody>
                {onboardingTalents.map(t => {
                  const done  = onboardingChecklist.filter(item => getChecked(t.id, item.id)).length;
                  const total = onboardingChecklist.length;
                  return (
                    <tr key={t.id} style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedOnboarding(t)}>
                      <td>
                        <div className="cell-person">
                          <Avatar name={t.name} size={26} />
                          <div className="meta">
                            <b>{t.name}</b>
                            <span className="mono">{t.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{t.startDate}</td>
                      <td style={{ minWidth: 130 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Bar value={(done / total) * 100}
                            tone={done >= 7 ? 'success' : done >= 5 ? '' : 'warn'} />
                          <span style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {done}/{total}
                          </span>
                        </div>
                      </td>
                      <td>
                        {done >= total       ? <Pill tone="success">Completo</Pill> :
                         done >= 6           ? <Pill tone="info">Em curso</Pill> :
                                               <Pill tone="warn">Pendente</Pill>}
                      </td>
                      <td>
                        <button className="btn btn-sm"
                          onClick={e => { e.stopPropagation(); setSelectedOnboarding(t); }}>
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card">
            {selectedOnboarding ? (() => {
              const done  = onboardingChecklist.filter(item => getChecked(selectedOnboarding.id, item.id)).length;
              const total = onboardingChecklist.length;
              return (
                <>
                  <div className="card-head">
                    <div>
                      <h3 className="card-title">Checklist · {selectedOnboarding.name}</h3>
                      <p className="card-subtitle">{done}/{total} tarefas concluídas</p>
                    </div>
                    <Pill tone={done >= 7 ? 'success' : 'warn'}>
                      {Math.round((done / total) * 100)}%
                    </Pill>
                  </div>
                  <div>
                    {onboardingChecklist.map((item, i) => {
                      const checked = getChecked(selectedOnboarding.id, item.id);
                      return (
                        <div key={item.id} style={{
                          padding: '10px 18px',
                          borderBottom: i < onboardingChecklist.length - 1 ? '1px solid var(--border)' : 'none',
                          display: 'flex', alignItems: 'center', gap: 12,
                          background: checked ? 'var(--success-bg)' : 'transparent',
                          transition: 'background 150ms'
                        }}>
                          <input type="checkbox" checked={checked}
                            onChange={() => toggleChecklist(selectedOnboarding.id, item.id)} />
                          <div style={{
                            flex: 1, fontSize: 13,
                            textDecoration: checked ? 'line-through' : 'none',
                            color: checked ? 'var(--text-3)' : 'var(--text)'
                          }}>
                            {item.label}
                          </div>
                          {item.mandatory && (
                            <span style={{ fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase',
                              letterSpacing: '0.05em', flexShrink: 0 }}>
                              Obrig.
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ padding: '12px 18px', display: 'flex', gap: 8, borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-sm">Enviar lembrete</button>
                    <div style={{ flex: 1 }} />
                    <button className="btn btn-sm btn-primary">Concluir onboarding</button>
                  </div>
                </>
              );
            })() : (
              <div className="card-pad" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-3)' }}>
                <div style={{ marginBottom: 12, opacity: 0.35 }}><Icon name="users" size={36} /></div>
                <div style={{ fontSize: 13 }}>
                  Seleccione um estagiário para ver e gerir o seu checklist de onboarding
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ROTAÇÕES ===== */}
      {tab === 'rotacoes' && (
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Plano de rotações · Q2–Q3 2026</h3>
              <p className="card-subtitle">
                Rotações trimestrais entre departamentos · Programa Futuro BFA & Liderança+
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal('nova-rotacao')}>
              <Icon name="plus" size={14} /> Planear rotação
            </button>
          </div>

          <div className="card-pad" style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4,
            paddingBottom: 14, borderBottom: '1px solid var(--border)'
          }}>
            {[
              { color: 'var(--success)', label: 'Em rotação' },
              { color: 'var(--primary)', label: 'Efectivado' },
              { color: 'var(--warn)',    label: 'Em breve (<30d)' },
              { color: 'var(--text-4)', label: 'Planeado' }
            ].map((l, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-2)' }}>
                <span style={{ width: 8, height: 8, background: l.color, borderRadius: '50%' }} />
                {l.label}
              </span>
            ))}
          </div>

          <table className="tbl">
            <thead>
              <tr>
                <th>Estagiário</th>
                <th>Dept. actual</th>
                <th style={{ width: 28 }}></th>
                <th>Próxima rotação</th>
                <th>Data transição</th>
                <th>Duração</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rotations.map((r, i) => {
                const isEffective = r.next === 'Efectivado';
                const transDate   = r.start !== '—' ? new Date(r.start) : null;
                const daysToTrans = transDate ? Math.floor((transDate - new Date()) / (1000 * 60 * 60 * 24)) : null;
                const isPast      = daysToTrans !== null && daysToTrans < 0;
                const isNear      = daysToTrans !== null && daysToTrans >= 0 && daysToTrans < 30;
                return (
                  <tr key={i}>
                    <td>
                      <div className="cell-person">
                        <Avatar name={r.trainee} size={26} />
                        <div className="meta">
                          <b>{r.trainee}</b>
                          <span className="mono">{r.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                        {r.current}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-4)' }}>
                      <Icon name="arrowRight" size={14} />
                    </td>
                    <td>
                      {isEffective
                        ? <span style={{ color: 'var(--success)', fontWeight: 500 }}>Efectivado no BFA</span>
                        : r.next}
                    </td>
                    <td className="muted">{r.start}</td>
                    <td className="muted">{r.dur}</td>
                    <td>
                      {isEffective ? <Pill tone="primary">Efectivo</Pill>  :
                       isPast      ? <Pill tone="success">Em rotação</Pill> :
                       isNear      ? <Pill tone="warn">Em {daysToTrans}d</Pill> :
                                     <Pill tone="neutral">Planeado</Pill>}
                    </td>
                    <td>
                      {!isEffective && (
                        <button className="btn btn-sm" onClick={() => setShowModal('editar-rotacao')}>
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== CONTRATOS ===== */}
      {tab === 'contratos' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
            {contracts.filter(c => c.contractStatus === 'expirado').length > 0 && (
              <div className="card" style={{ flex: 1, background: 'var(--warn-bg)', borderColor: 'var(--warn-border)' }}>
                <div className="card-pad" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Icon name="alert" size={18} style={{ color: 'var(--danger, #B91C1C)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {contracts.filter(c => c.contractStatus === 'expirado').length} contrato(s) expirado(s)
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      Acção imediata necessária · renovação ou rescisão
                    </div>
                  </div>
                  <button className="btn btn-sm">Ver todos</button>
                </div>
              </div>
            )}
            {contracts.filter(c => c.contractStatus === 'a_renovar').length > 0 && (
              <div className="card" style={{ flex: 1, background: 'var(--warn-bg)', borderColor: 'var(--warn-border)' }}>
                <div className="card-pad" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Icon name="clock" size={18} style={{ color: 'var(--warn)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warn)' }}>
                      {contracts.filter(c => c.contractStatus === 'a_renovar').length} a renovar nos próximos 90 dias
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      Iniciar processo de renovação atempadamente
                    </div>
                  </div>
                  <button className="btn btn-sm" onClick={() => setShowModal('renovar-lote')}>
                    Renovar em lote
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Contratos & acordos de bolsa · estado actual</h3>
                <p className="card-subtitle">
                  Ordenado por dias restantes · compromisso pós-formação de 3 anos após conclusão
                </p>
              </div>
              <button className="btn btn-sm"><Icon name="download" size={12} /> Exportar</button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Estagiário</th>
                  <th>Programa</th>
                  <th>Início</th>
                  <th>Fim previsto</th>
                  <th>Dias restantes</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(t => {
                  const prog    = window.BFA.programs.find(p => p.id === t.program);
                  const dColor  = t.daysLeft < 0 ? 'danger' : t.daysLeft < 90 ? 'warn' : t.daysLeft < 180 ? 'info' : 'neutral';
                  const rowCls  = t.contractStatus === 'expirado' ? 'row-danger' :
                                  t.contractStatus === 'a_renovar' ? 'row-warn' : '';
                  return (
                    <tr key={t.id} className={rowCls}>
                      <td>
                        <div className="cell-person">
                          <Avatar name={t.name} size={26} />
                          <div className="meta">
                            <b>{t.name}</b>
                            <span className="mono">{t.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: prog.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12 }}>{prog.name}</span>
                        </div>
                      </td>
                      <td className="muted">{t.startDate}</td>
                      <td className="muted">{t.contractEnd}</td>
                      <td>
                        <Pill tone={dColor}>
                          {t.daysLeft < 0
                            ? `Expirou há ${Math.abs(t.daysLeft)}d`
                            : `${t.daysLeft}d`}
                        </Pill>
                      </td>
                      <td><Pill tone={cTone[t.contractStatus]}>{cLabel[t.contractStatus]}</Pill></td>
                      <td>
                        {(t.contractStatus === 'a_renovar' || t.contractStatus === 'expirado') && (
                          <button className="btn btn-sm btn-primary" onClick={() => setShowModal('renovar')}>
                            Renovar
                          </button>
                        )}
                        {(t.contractStatus === 'activo' || t.contractStatus === 'efectivo') && (
                          <button className="btn btn-sm"
                            onClick={() => { setSelectedTalent(t.id); setPage('talento'); }}>
                            Ficha
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== MODALS ===== */}

      {showModal === 'novo' && (
        <Modal title="Registar novo estagiário / bolseiro" onClose={() => setShowModal(null)} width={640}
          footer={
            <>
              <button className="btn" onClick={() => setShowModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowModal(null)}>
                Registar & iniciar onboarding
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Nome completo</div>
                <input className="input" style={{ width: '100%' }} placeholder="Nome e apelido" />
              </div>
              <div>
                <div className="label">Nº BI / Passaporte</div>
                <input className="input" style={{ width: '100%' }} placeholder="000000000LA000" />
              </div>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Programa</div>
                <select className="input select" style={{ width: '100%' }}>
                  {window.BFA.programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <div className="label">Universidade</div>
                <select className="input select" style={{ width: '100%' }}>
                  {window.BFA.universities.map((u, i) => <option key={i}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Data de início</div>
                <input className="input" type="date" style={{ width: '100%' }} />
              </div>
              <div>
                <div className="label">Departamento de acolhimento</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option value="">— Seleccionar —</option>
                  {window.BFA.departments.map((d, i) => <option key={i}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Mentor</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option value="">— Seleccionar —</option>
                  {window.BFA.mentors.map((m, i) => (
                    <option key={i}>{m.name} · {m.dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">Subsídio mensal (Kz)</div>
                <input className="input" type="number" style={{ width: '100%' }} placeholder="380000" />
              </div>
            </div>
            <div>
              <div className="label">IBAN</div>
              <input className="input" style={{ width: '100%' }} placeholder="AO06 0040 0000 0000 0000 0000 0" />
            </div>
          </div>
        </Modal>
      )}

      {showModal === 'nova-rotacao' && (
        <Modal title="Planear nova rotação de departamento" onClose={() => setShowModal(null)} width={520}
          footer={
            <>
              <button className="btn" onClick={() => setShowModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowModal(null)}>
                <Icon name="check" size={12} /> Confirmar rotação
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="label">Estagiário</div>
              <select className="input select" style={{ width: '100%' }}>
                {window.BFA.talents.filter(t => t.dept !== '—').map(t => (
                  <option key={t.id}>{t.name} · {t.id}</option>
                ))}
              </select>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Dept. de origem</div>
                <select className="input select" style={{ width: '100%' }}>
                  {window.BFA.departments.map((d, i) => <option key={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <div className="label">Dept. de destino</div>
                <select className="input select" style={{ width: '100%' }}>
                  {window.BFA.departments.map((d, i) => <option key={i}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <div>
                <div className="label">Data de início</div>
                <input className="input" type="date" style={{ width: '100%' }} />
              </div>
              <div>
                <div className="label">Duração</div>
                <select className="input select" style={{ width: '100%' }}>
                  <option>3 meses</option>
                  <option>6 meses</option>
                  <option>1 mês</option>
                </select>
              </div>
            </div>
            <div>
              <div className="label">Objectivos da rotação</div>
              <textarea className="input" rows="3" style={{ width: '100%', resize: 'vertical' }}
                placeholder="O que o estagiário deve aprender / entregar neste departamento…" />
            </div>
          </div>
        </Modal>
      )}

      {(showModal === 'editar-rotacao') && (
        <Modal title="Editar rotação" onClose={() => setShowModal(null)} width={480}
          footer={
            <>
              <button className="btn" onClick={() => setShowModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowModal(null)}>
                Submeter para aprovação
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 12, background: 'var(--info-bg)', borderRadius: 6, borderLeft: '3px solid var(--info)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>
                As alterações requerem aprovação do gestor do departamento de destino.
              </div>
            </div>
            <div>
              <div className="label">Nova data de transição</div>
              <input className="input" type="date" style={{ width: '100%' }} />
            </div>
            <div>
              <div className="label">Nova duração</div>
              <select className="input select" style={{ width: '100%' }}>
                <option>3 meses</option><option>6 meses</option><option>1 mês</option>
              </select>
            </div>
            <div>
              <div className="label">Justificação</div>
              <textarea className="input" rows="3" style={{ width: '100%', resize: 'vertical' }}
                placeholder="Motivo da alteração…" />
            </div>
          </div>
        </Modal>
      )}

      {(showModal === 'renovar' || showModal === 'renovar-lote') && (
        <Modal
          title={showModal === 'renovar-lote' ? 'Renovação em lote · contratos a expirar' : 'Renovar contrato'}
          onClose={() => setShowModal(null)} width={480}
          footer={
            <>
              <button className="btn" onClick={() => setShowModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowModal(null)}>
                Submeter para aprovação
              </button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 12, background: 'var(--info-bg)', borderRadius: 6, borderLeft: '3px solid var(--info)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>
                A renovação requer aprovação do Director de RH e da Tesouraria antes de ser efectiva.
              </div>
            </div>
            <div>
              <div className="label">Nova data de fim</div>
              <input className="input" type="date" style={{ width: '100%' }} />
            </div>
            <div>
              <div className="label">Novo valor do subsídio (Kz)</div>
              <input className="input" type="number" style={{ width: '100%' }} placeholder="380000" />
            </div>
            <div>
              <div className="label">Justificação</div>
              <textarea className="input" rows="3" style={{ width: '100%', resize: 'vertical' }}
                placeholder="Motivo da renovação e desempenho do estagiário…" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
