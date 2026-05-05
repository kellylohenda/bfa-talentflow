// BFA TalentFlow — Page: Dashboard Executivo (RH + Direção)
window.PageOverview = function PageOverview({ role, setPage, setSelectedTalent }) {
  const T = window.BFA.talents;
  const totalTalents = T.length;
  const inRisk = T.filter(t => t.status === 'risk' || t.status === 'delayed').length;
  const avgGpa = (T.reduce((a, t) => a + t.gpa, 0) / T.length).toFixed(1);
  const totalBudget = window.BFA.geo.reduce((a, g) => a + g.cost, 0);
  const hires = T.filter(t => t.status === 'hired').length + 24; // historical

  const programDist = window.BFA.programs.map(p => ({
    label: p.name,
    value: T.filter(t => t.program === p.id).length + Math.round(Math.random()*8 + 4),
    color: p.color
  }));

  const monthlyHires = {
    labels: ['Mai','Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr'],
    data:   [3, 4, 2, 5, 8, 6, 4, 3, 6, 7, 5, 9]
  };

  const completionTrend = {
    labels: ['2021','2022','2023','2024','2025','2026 YTD'],
    data:   [68, 72, 76, 81, 84, 87]
  };

  const recent = window.BFA.activity.slice(0, 7);
  const alerts = T.filter(t => t.status === 'risk' || t.status === 'delayed').slice(0, 4);

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">{role === 'direcao' ? 'Dashboard Executivo' : 'Visão Geral Operacional'}</h1>
          <p className="page-subtitle">
            {role === 'direcao'
              ? 'Indicadores estratégicos · ROI, sucessão e compliance · Período: Maio 2025 – Abril 2026'
              : 'Estado actual de bolseiros e trainees · ' + new Date().toLocaleDateString('pt-PT', {dateStyle: 'long'})}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={14} /> Últimos 12 meses</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo programa</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid cols-5">
        <KPI label="Total de talentos" value={totalTalents + 92} sub="vs. 215 ano anterior" delta="+9.3%" deltaTone="up" spark={[180,184,189,196,201,207,215,222,228,234,238,247]} icon="users" />
        <KPI label="Investido (12 m)" value="Kz 2,03B" sub="orçamento 2026: Kz 2,4B" delta="+12.4%" deltaTone="up" spark={[120,135,142,158,170,185,192,201,210,218,225,238]} sparkColor="#1D4ED8" icon="cash" />
        <KPI label="Taxa de conclusão" value="87%" sub="meta institucional: 85%" delta="+3pp" deltaTone="up" spark={[68,72,76,81,82,84,84,85,86,86,87,87]} sparkColor="#0E7C4A" icon="award" />
        <KPI label="Retorno ao BFA" value="73%" sub="contratam após formação" delta="+5pp" deltaTone="up" spark={[60,62,64,65,68,68,70,71,71,72,72,73]} sparkColor="#7C3AED" icon="trending" />
        <KPI label="Talento em risco" value={inRisk + 2} sub="atraso ou baixo desempenho" delta={`${Math.round((inRisk+2)/(totalTalents+92)*100)}% do total`} deltaTone="flat" spark={[8,9,11,10,12,11,13,12,11,10,9,8]} sparkColor="#B45309" icon="alert" />
      </div>

      {/* Charts row */}
      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Contratações pós-formação · 12 meses</h3>
              <p className="card-subtitle">Bolseiros e trainees integrados em quadros do BFA</p>
            </div>
            <div className="row">
              <span className="pill pill-primary"><span className="dot"></span>Contratados</span>
              <span className="pill pill-neutral"><span className="dot"></span>Concluídos</span>
            </div>
          </div>
          <div className="card-pad" style={{ paddingTop: 8 }}>
            <LineChart
              series={[
                { data: monthlyHires.data, labels: monthlyHires.labels, color: '#FF7607', area: true },
                { data: monthlyHires.data.map(d => d + Math.round(Math.random()*4 + 2)), labels: monthlyHires.labels, color: '#9CA3AF' }
              ]}
              height={220} width={680} format={(v) => v}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Distribuição por programa</h3>
            <button className="btn-ghost btn-xs">Ver detalhe</button>
          </div>
          <div className="card-pad" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Donut
              segments={programDist.map(p => ({ value: p.value, color: p.color }))}
              size={130} thickness={18}
              label={programDist.reduce((a, p) => a + p.value, 0)}
              sub="talentos"
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {programDist.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, background: p.color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.label}</span>
                  <span style={{ fontWeight: 500, fontFeatureSettings: '"tnum"' }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: alerts + activity + completion trend */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Alertas críticos</h3>
              <p className="card-subtitle">Requerem acção imediata</p>
            </div>
            <span className="pill pill-warn"><span className="dot"></span>{alerts.length} abertos</span>
          </div>
          <div>
            {alerts.map(t => (
              <div key={t.id} onClick={() => { setSelectedTalent(t.id); setPage('talento'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <Avatar name={t.name} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {t.status === 'risk' ? 'Desempenho baixo · GPA ' + t.gpa : 'Relatório em atraso · ' + t.lastReport}
                  </div>
                </div>
                <StatusPill status={t.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Actividade recente</h3>
              <p className="card-subtitle">Sistema · operações · workflow</p>
            </div>
          </div>
          <div>
            {recent.map(a => {
              const iconMap = { payment: 'cash', alert: 'alert', evaluation: 'star', application: 'funnel', doc: 'doc', hire: 'check', mentor: 'briefcase' };
              const toneMap = { payment: 'var(--success)', alert: 'var(--warn)', evaluation: '#7C3AED', application: 'var(--info)', doc: 'var(--text-2)', hire: 'var(--primary)', mentor: '#0891B2' };
              return (
                <div key={a.id} style={{ display: 'flex', gap: 10, padding: '10px 18px', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--surface-3)', color: toneMap[a.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon name={iconMap[a.type] || 'doc'} size={12} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, lineHeight: 1.4 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{a.actor} · há {a.when}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Taxa de conclusão · histórico</h3>
              <p className="card-subtitle">% de talentos que concluem o programa</p>
            </div>
            <span className="kpi-delta up">▲ +19pp em 5 anos</span>
          </div>
          <div className="card-pad" style={{ paddingTop: 8 }}>
            <LineChart
              series={[{ data: completionTrend.data, labels: completionTrend.labels, color: '#0E7C4A', area: true }]}
              height={140} width={400} format={(v) => v + '%'}
            />
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div className="row-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diversidade de género</span>
                <span style={{ fontSize: 11, fontWeight: 500 }}>54% F · 46% M</span>
              </div>
              <div className="bar-track" style={{ height: 8 }}>
                <div style={{ width: '54%', height: '100%', background: '#7C3AED', display: 'inline-block' }} />
              </div>
              <div className="row-between" style={{ marginTop: 14, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROI médio (5 anos)</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--success)' }}>3,4× investido</span>
              </div>
              <div className="bar-track" style={{ height: 8 }}>
                <div style={{ width: '78%', height: '100%', background: 'var(--success)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
