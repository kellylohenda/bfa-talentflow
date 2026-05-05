// BFA TalentFlow — Gestão de Faltas (RH)
window.PageFaltas = function PageFaltas() {
  const { useState } = React;
  const [tab, setTab] = useState('pendentes');
  const [showDetail, setShowDetail] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const [absences, setAbsences] = useState([...window.BFA.absences]);

  const pending  = absences.filter(a => a.status === 'pending');
  const approved = absences.filter(a => a.status === 'approved');
  const rejected = absences.filter(a => a.status === 'rejected');

  const statusMeta = {
    pending:  { label: 'Pendente',  tone: 'warn' },
    approved: { label: 'Aprovada',  tone: 'success' },
    rejected: { label: 'Rejeitada', tone: 'danger' }
  };
  const typeMeta = {
    justificada:   { label: 'Justificada',   tone: 'info' },
    injustificada: { label: 'Injustificada', tone: 'danger' }
  };

  const approve = (id) => {
    setAbsences(prev => prev.map(a => a.id === id
      ? { ...a, status: 'approved', approvedBy: 'Mariana Quissama (RH)', rhNote: noteInput || null }
      : a
    ));
    setNoteInput('');
    setShowDetail(null);
  };

  const reject = (id) => {
    setAbsences(prev => prev.map(a => a.id === id
      ? { ...a, status: 'rejected', approvedBy: 'Mariana Quissama (RH)', rhNote: noteInput || 'Rejeitado pelo RH.' }
      : a
    ));
    setNoteInput('');
    setShowDetail(null);
  };

  // Impact: count absences per talent
  const talentImpact = window.BFA.talents
    .map(t => {
      const ta = absences.filter(a => a.talentId === t.id);
      return {
        talent: t,
        total: ta.length,
        approved: ta.filter(a => a.status === 'approved').length,
        injustificada: ta.filter(a => a.type === 'injustificada' && a.status !== 'rejected').length,
        days: ta.filter(a => a.status === 'approved').reduce((s, a) => s + a.days, 0)
      };
    })
    .filter(g => g.total > 0)
    .sort((a, b) => b.injustificada - a.injustificada || b.days - a.days);

  const TABS = [
    { id: 'pendentes', label: 'Pendentes', count: pending.length },
    { id: 'historico', label: 'Histórico', count: absences.length },
    { id: 'impacto',   label: 'Impacto por talento' }
  ];

  const AbsenceRow = ({ a, showActions }) => {
    const sm = statusMeta[a.status];
    const tm = typeMeta[a.type];
    return (
      <tr>
        <td><span className="mono">{a.id}</span></td>
        <td>{a.talentName}</td>
        <td><span className={`badge badge-${tm.tone}`}>{tm.label}</span></td>
        <td>{a.reason || <span style={{ color: 'var(--text-2)' }}>—</span>}</td>
        <td>{a.date}</td>
        <td>{a.days}d</td>
        <td><span className={`badge badge-${sm.tone}`}>{sm.label}</span></td>
        <td>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-xs" onClick={() => { setNoteInput(''); setShowDetail(a); }}>Ver</button>
            {showActions && a.status === 'pending' && (
              <>
                <button className="btn btn-xs btn-primary" onClick={() => { setShowDetail(a); setNoteInput(''); }}>Decidir</button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Gestão de Faltas</h1>
          <p className="page-subtitle">Acompanhe e aprove pedidos de falta de bolseiros e trainees</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: '1.5rem' }}>
        <KPI label="Pendentes" value={pending.length} icon="clock" deltaTone={pending.length > 3 ? 'down' : 'flat'} />
        <KPI label="Aprovadas" value={approved.length} icon="check" deltaTone="up" />
        <KPI label="Rejeitadas" value={rejected.length} icon="alert" deltaTone="flat" />
        <KPI label="Injustificadas (aprovadas)" value={absences.filter(a => a.type === 'injustificada' && a.status === 'approved').length} icon="alert" deltaTone="down" />
      </div>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count != null && <span className="tab-badge">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'pendentes' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Pedidos pendentes ({pending.length})</span>
          </div>
          {pending.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
              <div>Sem pedidos pendentes de aprovação.</div>
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>ID</th><th>Talento</th><th>Tipo</th><th>Motivo</th><th>Data</th><th>Dias</th><th>Estado</th><th>Acções</th></tr>
              </thead>
              <tbody>
                {pending.map(a => <AbsenceRow key={a.id} a={a} showActions />)}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'historico' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Histórico completo ({absences.length})</span>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Talento</th><th>Tipo</th><th>Motivo</th><th>Data</th><th>Dias</th><th>Estado</th><th>Acções</th></tr>
            </thead>
            <tbody>
              {absences.map(a => <AbsenceRow key={a.id} a={a} showActions={false} />)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'impacto' && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">Impacto por talento</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Talento</th>
                <th>Programa</th>
                <th>Mentor</th>
                <th>Total faltas</th>
                <th>Aprovadas</th>
                <th>Injustificadas</th>
                <th>Dias perdidos</th>
                <th>Risco</th>
              </tr>
            </thead>
            <tbody>
              {talentImpact.map(g => {
                const risk = g.injustificada >= 3 ? 'danger' : g.injustificada >= 2 ? 'warn' : 'success';
                const riskLabel = g.injustificada >= 3 ? 'Alto' : g.injustificada >= 2 ? 'Médio' : 'Baixo';
                return (
                  <tr key={g.talent.id}>
                    <td>{g.talent.name}</td>
                    <td>
                      {(() => {
                        const prog = window.BFA.programs.find(p => p.id === g.talent.program);
                        return prog ? <span className="badge badge-neutral">{prog.name}</span> : '—';
                      })()}
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{g.talent.mentor}</td>
                    <td style={{ textAlign: 'center' }}>{g.total}</td>
                    <td style={{ textAlign: 'center' }}>{g.approved}</td>
                    <td style={{ textAlign: 'center', color: g.injustificada > 0 ? 'var(--danger)' : undefined, fontWeight: g.injustificada > 0 ? 600 : undefined }}>{g.injustificada}</td>
                    <td style={{ textAlign: 'center' }}>{g.days}d</td>
                    <td><span className={`badge badge-${risk}`}>{riskLabel}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showDetail && (
        <window.Modal
          title={showDetail.id + ' · Detalhe da falta'}
          onClose={() => setShowDetail(null)}
          width="520px"
          footer={
            showDetail.status === 'pending' ? (
              <>
                <button className="btn btn-primary" onClick={() => approve(showDetail.id)}>Aprovar</button>
                <button className="btn btn-danger" onClick={() => reject(showDetail.id)}>Rejeitar</button>
                <button className="btn" onClick={() => setShowDetail(null)}>Cancelar</button>
              </>
            ) : (
              <button className="btn" onClick={() => setShowDetail(null)}>Fechar</button>
            )
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`badge badge-${typeMeta[showDetail.type]?.tone}`}>{typeMeta[showDetail.type]?.label}</span>
              <span className={`badge badge-${statusMeta[showDetail.status]?.tone}`}>{statusMeta[showDetail.status]?.label}</span>
            </div>
            <div className="info-grid">
              <div className="info-item"><span>Talento</span><b>{showDetail.talentName}</b></div>
              <div className="info-item"><span>Data</span><b>{showDetail.date}</b></div>
              <div className="info-item"><span>Dias</span><b>{showDetail.days}</b></div>
              <div className="info-item"><span>Pedido em</span><b>{showDetail.requestedAt}</b></div>
            </div>
            {showDetail.reason && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: '0.25rem' }}>Motivo apresentado</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.875rem' }}>{showDetail.reason}</div>
              </div>
            )}
            {showDetail.mentorNote && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: '0.25rem' }}>Nota do mentor ({showDetail.approvedBy})</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.875rem' }}>{showDetail.mentorNote}</div>
              </div>
            )}
            {showDetail.rhNote && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: '0.25rem' }}>Nota RH</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.875rem' }}>{showDetail.rhNote}</div>
              </div>
            )}
            {showDetail.status === 'pending' && (
              <div>
                <label className="form-label">Nota / Observação (opcional)</label>
                <textarea className="input" rows={2} value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Adicionar nota à decisão…" />
              </div>
            )}
          </div>
        </window.Modal>
      )}
    </div>
  );
};
