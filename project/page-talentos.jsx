// BFA TalentFlow — Page: Talentos & Candidaturas
window.PageTalentos = function PageTalentos({ setSelectedTalent, setPage }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');
  const [programFilter, setProgramFilter] = React.useState('todos');
  const [sortBy, setSortBy] = React.useState({ key: 'name', dir: 'asc' });

  const programs = window.BFA.programs;
  const programLookup = Object.fromEntries(programs.map(p => [p.id, p]));

  let rows = window.BFA.talents.filter(t => {
    if (statusFilter !== 'todos' && t.status !== statusFilter) return false;
    if (programFilter !== 'todos' && t.program !== programFilter) return false;
    if (search && !(t.name + t.id + t.course + t.university).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  rows.sort((a, b) => {
    const k = sortBy.key;
    let av = a[k], bv = b[k];
    if (typeof av === 'string') return sortBy.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortBy.dir === 'asc' ? av - bv : bv - av;
  });

  const toggleSort = (key) => setSortBy(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  const sortInd = (key) => sortBy.key === key ? <span className="sort-ind">{sortBy.dir === 'asc' ? '↑' : '↓'}</span> : null;

  const counts = {
    todos: window.BFA.talents.length,
    active: window.BFA.talents.filter(t => t.status === 'active').length,
    delayed: window.BFA.talents.filter(t => t.status === 'delayed').length,
    risk: window.BFA.talents.filter(t => t.status === 'risk').length,
    onboarding: window.BFA.talents.filter(t => t.status === 'onboarding').length,
    hired: window.BFA.talents.filter(t => t.status === 'hired').length,
    completed: window.BFA.talents.filter(t => t.status === 'completed').length
  };

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Talentos</h1>
          <p className="page-subtitle">{rows.length} resultados de {window.BFA.talents.length} · Bolseiros e trainees activos no sistema</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="filter" size={14} /> Filtros avançados</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar CSV</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Adicionar talento</button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {[
            { id: 'todos',      label: 'Todos' },
            { id: 'active',     label: 'Activos' },
            { id: 'onboarding', label: 'Onboarding' },
            { id: 'delayed',    label: 'Em atraso' },
            { id: 'risk',       label: 'Em risco' },
            { id: 'hired',      label: 'Contratados' },
            { id: 'completed',  label: 'Concluídos' }
          ].map(t => (
            <button key={t.id} className={`tab ${statusFilter === t.id ? 'active' : ''}`} onClick={() => setStatusFilter(t.id)}>
              {t.label}<span className="tab-count">{counts[t.id]}</span>
            </button>
          ))}
        </div>

        <div className="toolbar">
          <input className="input input-search" placeholder="Pesquisar por nome, curso, ID, universidade…"
                 value={search} onChange={(e) => setSearch(e.target.value)}
                 style={{ width: 320 }} />
          <select className="input select" value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
            <option value="todos">Todos os programas</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="chip-filter">País · Todos <Icon name="chevronDown" size={12} /></button>
          <button className="chip-filter">Ano · Todos <Icon name="chevronDown" size={12} /></button>
          <button className="chip-filter">Mentor · Todos <Icon name="chevronDown" size={12} /></button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{rows.length} de {window.BFA.talents.length}</span>
        </div>

        <div className="table-wrap" style={{ borderRadius: 0, border: 'none', borderTop: '1px solid var(--border)', maxHeight: 'calc(100vh - 360px)' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('name')} style={{ minWidth: 220 }}>Talento {sortInd('name')}</th>
                <th className="sortable" onClick={() => toggleSort('id')}>ID {sortInd('id')}</th>
                <th>Programa</th>
                <th>Universidade · Curso</th>
                <th className="sortable" onClick={() => toggleSort('gpa')}>GPA {sortInd('gpa')}</th>
                <th>Performance</th>
                <th>Estado</th>
                <th className="sortable" onClick={() => toggleSort('stipend')}>Subsídio/mês {sortInd('stipend')}</th>
                <th>Mentor</th>
                <th>Último relatório</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(t => {
                const prog = programLookup[t.program];
                const rowClass = t.status === 'risk' ? 'row-danger' : t.status === 'delayed' ? 'row-warn' : '';
                return (
                  <tr key={t.id} className={rowClass} onClick={() => { setSelectedTalent(t.id); setPage('talento'); }} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="cell-person">
                        <Avatar name={t.name} size={28} />
                        <div className="meta">
                          <b>{t.name}</b>
                          <span>{t.country} · {t.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="mono muted">{t.id}</td>
                    <td>
                      <span className="pill pill-neutral" style={{ borderColor: prog.color + '50', color: prog.color, background: prog.color + '12' }}>
                        <span className="dot" style={{ background: prog.color }} />{prog.name}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{t.university}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.course} · {t.year}</div>
                    </td>
                    <td className="num" style={{ fontWeight: 500 }}>{t.gpa.toFixed(1)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}>
                        <Bar value={t.perf} tone={t.perf >= 85 ? 'success' : t.perf >= 70 ? '' : t.perf >= 60 ? 'warn' : 'danger'} />
                        <span style={{ fontSize: 11, fontWeight: 500, minWidth: 24, textAlign: 'right' }}>{t.perf}</span>
                      </div>
                    </td>
                    <td><StatusPill status={t.status} /></td>
                    <td className="num">{t.stipend ? window.BFA.fmtKzShort(t.stipend) : <span className="dash">—</span>}</td>
                    <td style={{ fontSize: 12 }}>{t.mentor}</td>
                    <td className="muted" style={{ fontSize: 12 }}>{t.lastReport}</td>
                    <td>
                      <button className="btn-ghost btn-xs" onClick={(e) => { e.stopPropagation(); setSelectedTalent(t.id); setPage('talento'); }}>
                        <Icon name="chevronRight" size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan="11" style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Sem resultados para os filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.PageCandidaturas = function PageCandidaturas() {
  const stages = window.BFA.stages;
  const apps = window.BFA.applications;
  const [selectedApp, setSelectedApp] = React.useState(null);

  const byStage = Object.fromEntries(stages.map(s => [s.id, apps.filter(a => a.stage === s.id)]));
  const totalActive = apps.filter(a => a.stage !== 'rejeitado').length;

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Candidaturas · Funil de Selecção</h1>
          <p className="page-subtitle">{totalActive} candidatos activos · 6 etapas · Programas: Futuro BFA, Bolsa Internacional, Bolsa Nacional, Mestrado Patrocinado</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="filter" size={14} /> Programa: Todos</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Nova candidatura</button>
        </div>
      </div>

      <div className="grid cols-6">
        {stages.map((s, i) => (
          <div key={s.id} className="kpi" style={{ padding: '12px 14px' }}>
            <div className="kpi-label" style={{ fontSize: 10 }}>Etapa {i + 1}</div>
            <div className="kpi-value kpi-value-sm" style={{ fontSize: 22 }}>{byStage[s.id]?.length || 0}</div>
            <div className="kpi-sub" style={{ fontSize: 11 }}>{s.label}</div>
            <div className="bar-track" style={{ marginTop: 6 }}>
              <div className="bar-fill" style={{ width: ((byStage[s.id]?.length || 0) / 4 * 100) + '%' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, alignItems: 'flex-start' }}>
        {stages.map(s => (
          <div key={s.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', minHeight: 400 }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFeatureSettings: '"tnum"' }}>{byStage[s.id]?.length || 0}</div>
              </div>
              <button className="tb-icon-btn"><Icon name="more" size={14} /></button>
            </div>
            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(byStage[s.id] || []).map(a => {
                const prog = window.BFA.programs.find(p => p.id === a.program);
                return (
                  <div key={a.id} onClick={() => setSelectedApp(a)}
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 10, cursor: 'pointer', transition: 'all 120ms' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                      <Avatar name={a.name} size={22} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)' }} className="mono">{a.id}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.course} · {a.uni}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <span className="pill pill-neutral" style={{ borderColor: prog.color + '50', color: prog.color, background: prog.color + '12', fontSize: 9, padding: '1px 5px' }}>
                        {prog.name}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: a.score >= 85 ? 'var(--success)' : a.score >= 70 ? 'var(--text-2)' : 'var(--warn)' }}>
                        {a.score}/100
                      </span>
                    </div>
                  </div>
                );
              })}
              <button style={{ background: 'transparent', border: '1px dashed var(--border)', borderRadius: 'var(--r-sm)', padding: 8, fontSize: 11, color: 'var(--text-3)', cursor: 'pointer' }}>
                + Mover candidato
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <Modal title={`Candidatura · ${selectedApp.name}`} onClose={() => setSelectedApp(null)}
          footer={
            <>
              <button className="btn">Rejeitar</button>
              <button className="btn">Adicionar nota</button>
              <button className="btn btn-primary">Avançar de etapa <Icon name="arrowRight" size={12} /></button>
            </>
          }>
          <div className="grid cols-2" style={{ gap: 16 }}>
            <div>
              <div className="label">ID Candidatura</div>
              <div className="value mono">{selectedApp.id}</div>
            </div>
            <div>
              <div className="label">Programa</div>
              <div className="value">{window.BFA.programs.find(p => p.id === selectedApp.program).name}</div>
            </div>
            <div>
              <div className="label">Curso</div>
              <div className="value">{selectedApp.course}</div>
            </div>
            <div>
              <div className="label">Universidade</div>
              <div className="value">{selectedApp.uni}</div>
            </div>
            <div>
              <div className="label">Origem</div>
              <div className="value">{selectedApp.source}</div>
            </div>
            <div>
              <div className="label">Submetido em</div>
              <div className="value">{selectedApp.appliedAt}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="label">Score Algoritmico</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                <Bar value={selectedApp.score} tone={selectedApp.score >= 85 ? 'success' : selectedApp.score >= 70 ? '' : 'warn'} />
                <span style={{ fontSize: 18, fontWeight: 600, fontFeatureSettings: '"tnum"' }}>{selectedApp.score}/100</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                Académico (40%) · Experiência (25%) · Aptidão (20%) · Motivação (15%)
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
