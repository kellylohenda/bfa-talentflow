// BFA TalentFlow — Gestão de Tarefas (RH)
window.PageTarefas = function PageTarefas() {
  const { useState } = React;
  const [tab, setTab] = useState('lista');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [showDetail, setShowDetail] = useState(null);

  const [tasks, setTasks] = useState([...window.BFA.tasks]);

  const [form, setForm] = useState({
    title: '', description: '', talentId: '', assignedBy: 'Mariana Quissama',
    category: 'Relatório', priority: 'média', dueDate: ''
  });

  const talents = window.BFA.talents.filter(t => ['active','onboarding','delayed','risk'].includes(t.status));

  const statusMeta = {
    pending:     { label: 'Pendente',     tone: 'neutral' },
    in_progress: { label: 'Em curso',     tone: 'info' },
    done:        { label: 'Concluída',    tone: 'success' },
    overdue:     { label: 'Em atraso',    tone: 'danger' }
  };
  const priorityMeta = {
    alta:  { label: 'Alta',  tone: 'danger' },
    média: { label: 'Média', tone: 'warn' },
    baixa: { label: 'Baixa', tone: 'neutral' }
  };

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const kpis = {
    total:       tasks.length,
    pending:     tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    overdue:     tasks.filter(t => t.status === 'overdue').length,
    done:        tasks.filter(t => t.status === 'done').length
  };

  const markDone = (id) => {
    setTasks(prev => prev.map(t => t.id === id
      ? { ...t, status: 'done', completedAt: new Date().toISOString().slice(0,10) }
      : t
    ));
    setShowDetail(prev => prev && prev.id === id ? { ...prev, status: 'done' } : prev);
  };

  const submitNewTask = () => {
    if (!form.title || !form.talentId || !form.dueDate) return;
    const talent = talents.find(t => t.id === form.talentId);
    const newTask = {
      id: 'TK-' + String(tasks.length + 100).padStart(4,'0'),
      title: form.title,
      description: form.description,
      talentId: form.talentId,
      talentName: talent?.name || '',
      assignedBy: form.assignedBy,
      assignedByRole: 'rh',
      category: form.category,
      priority: form.priority,
      status: 'pending',
      dueDate: form.dueDate,
      completedAt: null
    };
    setTasks(prev => [newTask, ...prev]);
    setForm({ title: '', description: '', talentId: '', assignedBy: 'Mariana Quissama', category: 'Relatório', priority: 'média', dueDate: '' });
    setShowNewTask(false);
    setTab('lista');
  };

  const byTalent = talents.map(t => ({
    talent: t,
    tasks: tasks.filter(tk => tk.talentId === t.id)
  })).filter(g => g.tasks.length > 0);

  const TABS = [
    { id: 'lista',   label: 'Todas as tarefas', count: tasks.length },
    { id: 'talento', label: 'Por talento' },
    { id: 'criar',   label: '+ Nova tarefa' }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Gestão de Tarefas</h1>
          <p className="page-subtitle">Atribua e acompanhe tarefas a bolseiros e trainees</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setTab('criar')}>
            <Icon name="plus" size={14} /> Nova tarefa
          </button>
        </div>
      </div>

      <div className="grid cols-5" style={{ marginBottom: '1.5rem' }}>
        <KPI label="Total" value={kpis.total} icon="check" />
        <KPI label="Pendentes" value={kpis.pending} icon="clock" deltaTone="flat" />
        <KPI label="Em curso" value={kpis.in_progress} icon="briefcase" deltaTone="up" />
        <KPI label="Em atraso" value={kpis.overdue} icon="alert" deltaTone={kpis.overdue > 0 ? 'down' : 'up'} />
        <KPI label="Concluídas" value={kpis.done} icon="star" deltaTone="up" />
      </div>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count != null && <span className="tab-badge">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'lista' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Tarefas ({filtered.length})</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Todos os estados</option>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em curso</option>
                <option value="overdue">Em atraso</option>
                <option value="done">Concluída</option>
              </select>
              <select className="select-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                <option value="all">Todas as prioridades</option>
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
              <div>Nenhuma tarefa com estes filtros.</div>
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tarefa</th>
                  <th>Talento</th>
                  <th>Categoria</th>
                  <th>Prioridade</th>
                  <th>Prazo</th>
                  <th>Estado</th>
                  <th>Acções</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tk => {
                  const sm = statusMeta[tk.status] || statusMeta.pending;
                  const pm = priorityMeta[tk.priority] || priorityMeta.média;
                  const isOverdue = tk.status === 'overdue';
                  return (
                    <tr key={tk.id} className={isOverdue ? 'row-active' : ''}>
                      <td><span className="mono">{tk.id}</span></td>
                      <td>
                        <button className="link-btn" onClick={() => setShowDetail(tk)}>{tk.title}</button>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>por {tk.assignedBy}</div>
                      </td>
                      <td>{tk.talentName}</td>
                      <td><span className="badge badge-neutral">{tk.category}</span></td>
                      <td><span className={`badge badge-${pm.tone}`}>{pm.label}</span></td>
                      <td style={{ color: isOverdue ? 'var(--danger)' : undefined }}>{tk.dueDate}</td>
                      <td><span className={`badge badge-${sm.tone}`}>{sm.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-xs" onClick={() => setShowDetail(tk)}>Ver</button>
                          {tk.status !== 'done' && (
                            <button className="btn btn-xs btn-primary" onClick={() => markDone(tk.id)}>
                              Concluir
                            </button>
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
      )}

      {tab === 'talento' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {byTalent.map(g => {
            const t = g.talent;
            const done = g.tasks.filter(tk => tk.status === 'done').length;
            const overdue = g.tasks.filter(tk => tk.status === 'overdue').length;
            return (
              <div key={t.id} className="card">
                <div className="card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar">{window.BFA.initials(t.name)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{t.mentor} · {t.dept !== '—' ? t.dept : t.university}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {overdue > 0 && <span className="badge badge-danger">{overdue} em atraso</span>}
                    <span className="badge badge-neutral">{done}/{g.tasks.length} concluídas</span>
                    <button className="btn btn-xs btn-primary" onClick={() => { setForm(f => ({ ...f, talentId: t.id })); setTab('criar'); }}>
                      + Tarefa
                    </button>
                  </div>
                </div>
                <div style={{ padding: '0 1.25rem 1rem' }}>
                  {g.tasks.map(tk => {
                    const sm = statusMeta[tk.status] || statusMeta.pending;
                    const pm = priorityMeta[tk.priority] || priorityMeta.média;
                    return (
                      <div key={tk.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ flex: 1 }}>
                          <button className="link-btn" onClick={() => setShowDetail(tk)}>{tk.title}</button>
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: 'var(--text-2)' }}>{tk.category}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>Prazo: {tk.dueDate}</span>
                        <span className={`badge badge-${pm.tone}`}>{pm.label}</span>
                        <span className={`badge badge-${sm.tone}`}>{sm.label}</span>
                        {tk.status !== 'done' && (
                          <button className="btn btn-xs btn-primary" onClick={() => markDone(tk.id)}>✓</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'criar' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <div className="card-head">
            <span className="card-title">Nova tarefa</span>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Título da tarefa *</label>
              <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Relatório semestral Q2 2026" />
            </div>
            <div className="form-group">
              <label className="form-label">Descrição / Instruções</label>
              <textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descreve o que o talento deve fazer…" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Talento *</label>
                <select className="input" value={form.talentId} onChange={e => setForm(f => ({ ...f, talentId: e.target.value }))}>
                  <option value="">Seleccionar talento…</option>
                  {talents.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Atribuída por</label>
                <input className="input" value={form.assignedBy} onChange={e => setForm(f => ({ ...f, assignedBy: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['Relatório','Formação','Documento','PDI','Apresentação','Avaliação','Certificação'].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Prioridade</label>
                <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="alta">Alta</option>
                  <option value="média">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Prazo *</label>
                <input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" onClick={submitNewTask}
                style={{ opacity: (!form.title || !form.talentId || !form.dueDate) ? 0.5 : 1 }}>
                Criar tarefa
              </button>
              <button className="btn" onClick={() => { setTab('lista'); setForm({ title: '', description: '', talentId: '', assignedBy: 'Mariana Quissama', category: 'Relatório', priority: 'média', dueDate: '' }); }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && (
        <window.Modal title={showDetail.id + ' · ' + showDetail.title} onClose={() => setShowDetail(null)} width="560px"
          footer={
            <>
              {showDetail.status !== 'done' && (
                <button className="btn btn-primary" onClick={() => markDone(showDetail.id)}>
                  Marcar como concluída
                </button>
              )}
              <button className="btn" onClick={() => setShowDetail(null)}>Fechar</button>
            </>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(() => {
                const sm = statusMeta[showDetail.status] || statusMeta.pending;
                const pm = priorityMeta[showDetail.priority] || priorityMeta.média;
                return <>
                  <span className={`badge badge-${sm.tone}`}>{sm.label}</span>
                  <span className={`badge badge-${pm.tone}`}>Prioridade {pm.label}</span>
                  <span className="badge badge-neutral">{showDetail.category}</span>
                </>;
              })()}
            </div>
            <div className="info-grid">
              <div className="info-item"><span>Talento</span><b>{showDetail.talentName}</b></div>
              <div className="info-item"><span>Atribuída por</span><b>{showDetail.assignedBy}</b></div>
              <div className="info-item"><span>Prazo</span><b>{showDetail.dueDate}</b></div>
              <div className="info-item"><span>Concluída em</span><b>{showDetail.completedAt || '—'}</b></div>
            </div>
            {showDetail.description && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: '0.25rem' }}>Descrição</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {showDetail.description}
                </div>
              </div>
            )}
          </div>
        </window.Modal>
      )}
    </div>
  );
};
