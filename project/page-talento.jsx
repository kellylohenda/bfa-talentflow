// BFA TalentFlow — Page: Ficha 360° do Talento
window.PageTalento = function PageTalento({ talentId, setPage }) {
  const t = window.BFA.talents.find(x => x.id === talentId) || window.BFA.talents[0];
  const prog = window.BFA.programs.find(p => p.id === t.program);
  const [tab, setTab] = React.useState('overview');

  const skills = [
    { name: 'Análise Financeira', value: 85 },
    { name: 'Excel / Modelação',  value: 92 },
    { name: 'Comunicação',         value: 78 },
    { name: 'Liderança',           value: t.potential === 'alto' ? 82 : 64 },
    { name: 'Risco & Compliance',  value: 71 },
    { name: 'Inglês',              value: 88 }
  ];

  const timeline = [
    { date: '2026-04-22', icon: 'doc',    title: 'Boletim semestral submetido', sub: `Média ${t.gpa.toFixed(1)} · ${t.university}` },
    { date: '2026-04-15', icon: 'star',   title: 'Avaliação de mentor', sub: `${t.mentor} · Performance ${t.perf}/100` },
    { date: '2026-04-01', icon: 'cash',   title: 'Pagamento de subsídio · Abril', sub: window.BFA.fmtKz(t.stipend) },
    { date: '2026-03-12', icon: 'briefcase', title: 'Sessão de mentoria', sub: '60 min · revisão de PDI' },
    { date: '2026-02-08', icon: 'award',  title: 'Workshop "Fundamentos de Risco"', sub: 'Concluído · 18h · Sede BFA' },
    { date: '2025-09-01', icon: 'flag',   title: 'Início do programa', sub: prog.name + ' · ' + t.year }
  ];

  const docs = [
    { name: 'Contrato de Bolsa.pdf',         size: '284 KB', date: '2025-08-15', tag: 'Contrato' },
    { name: 'Cláusula de Retorno.pdf',       size: '142 KB', date: '2025-08-15', tag: 'Contrato' },
    { name: 'Boletim 1º Semestre 2026.pdf',  size: '512 KB', date: '2026-04-22', tag: 'Académico' },
    { name: 'Comprovativo IBAN.pdf',         size: '88 KB',  date: '2025-08-20', tag: 'Financeiro' },
    { name: 'Visto Schengen 2025-2026.pdf',  size: '1,2 MB', date: '2025-07-10', tag: 'Documentação' }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="btn-ghost btn-sm" onClick={() => setPage('talentos')}>
            <Icon name="arrowRight" size={12} style={{ transform: 'rotate(180deg)' }} /> Voltar
          </button>
          <Avatar name={t.name} size={56} />
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>{t.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-2)', flexWrap: 'wrap' }}>
              <span className="mono">{t.id}</span>
              <span className="dot-sep">·</span>
              <span className="pill pill-neutral" style={{ borderColor: prog.color + '50', color: prog.color, background: prog.color + '12' }}>
                <span className="dot" style={{ background: prog.color }} />{prog.name}
              </span>
              <span className="dot-sep">·</span>
              <StatusPill status={t.status} />
              <span className="dot-sep">·</span>
              <span><Icon name="pin" size={11} style={{ verticalAlign: '-2px' }} /> {t.city}, {t.country}</span>
              <span className="dot-sep">·</span>
              <span><Icon name="calendar" size={11} style={{ verticalAlign: '-2px' }} /> Desde {t.startDate}</span>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="mail" size={14} /> Mensagem</button>
          <button className="btn"><Icon name="doc" size={14} /> Gerar relatório</button>
          <button className="btn btn-primary">Editar perfil</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid cols-5">
        <KPI label="GPA actual" value={t.gpa.toFixed(1)} sub="escala 0–20 · período actual" delta={t.gpa >= 16 ? '+0.4' : '-0.2'} deltaTone={t.gpa >= 16 ? 'up' : 'down'} icon="graduation" />
        <KPI label="Performance" value={`${t.perf}/100`} sub="avaliação consolidada" delta="+6" deltaTone="up" icon="trending" />
        <KPI label="Risco de abandono" value={`${Math.round(t.riskScore * 100)}%`} sub="modelo preditivo" deltaTone={t.riskScore < 0.2 ? 'up' : 'down'} delta={t.riskScore < 0.2 ? 'baixo' : t.riskScore < 0.5 ? 'médio' : 'alto'} icon="shield" />
        <KPI label="Investido até hoje" value={window.BFA.fmtKzShort(t.stipend * 8)} sub={`${t.stipend ? window.BFA.fmtKzShort(t.stipend) : 'Kz 0'} / mês`} icon="cash" />
        <KPI label="Compromisso" value="3 anos" sub="cláusula de retorno pós-formação" icon="briefcase" />
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs">
          {['overview','academico','desempenho','financeiro','documentos','timeline'].map(id => (
            <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              {{overview:'Resumo', academico:'Académico', desempenho:'Desempenho', financeiro:'Financeiro', documentos:'Documentos', timeline:'Histórico'}[id]}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0 }}>
            <div className="card-pad" style={{ borderRight: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 12px' }}>Dados Pessoais & Académicos</h4>
              <div className="grid cols-2" style={{ gap: 12 }}>
                {[
                  ['Curso', `${t.course} · ${t.year}`],
                  ['Universidade', t.university],
                  ['Localização', `${t.city}, ${t.country}`],
                  ['Mentor', t.mentor],
                  ['Departamento', t.dept || 'Em alocação'],
                  ['Início programa', t.startDate],
                  ['Email institucional', `${t.name.toLowerCase().split(' ')[0]}.${t.name.toLowerCase().split(' ').slice(-1)[0]}@bfa.ao`],
                  ['Telefone', '+244 9' + (Math.floor(Math.random()*90000000)+10000000)]
                ].map(([k, v], i) => (
                  <div key={i}>
                    <div className="label">{k}</div>
                    <div className="value">{v}</div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '24px 0 12px' }}>Skills Matrix</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {skills.map((s, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 36px', alignItems: 'center', gap: 12, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-2)' }}>{s.name}</span>
                    <Bar value={s.value} tone={s.value >= 85 ? 'success' : s.value >= 70 ? '' : 'warn'} />
                    <span style={{ textAlign: 'right', fontFeatureSettings: '"tnum"', fontWeight: 500 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="card-pad" style={{ borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 10px' }}>Posicionamento 9-Box</h4>
                <NineBoxMini perf={t.perf} potential={t.potential} />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, textAlign: 'center' }}>
                  {t.potential === 'alto' && t.perf >= 85 ? '★ High Potential — alvo de plano de sucessão' :
                   t.potential === 'baixo' || t.perf < 65 ? '⚠ Risco — requer plano de retenção ou transição' :
                   'Performer sólido — desenvolvimento contínuo'}
                </div>
              </div>
              <div className="card-pad">
                <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 10px' }}>Próximas Acções</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: 'calendar', title: 'Avaliação semestral', date: '15 Jun 2026' },
                    { icon: 'cash',     title: 'Próximo pagamento',   date: '28 Mai 2026' },
                    { icon: 'doc',      title: 'Boletim 2º semestre', date: 'Até 30 Jul 2026' },
                    { icon: 'briefcase',title: 'Sessão de mentoria',  date: '8 Mai · 15h00' }
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
                      <Icon name={a.icon} size={14} />
                      <div style={{ flex: 1, fontSize: 12 }}>{a.title}</div>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="card-pad">
            <div style={{ position: 'relative', paddingLeft: 28 }}>
              <div style={{ position: 'absolute', left: 11, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
              {timeline.map((ev, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: 20 }}>
                  <div style={{ position: 'absolute', left: -22, top: 2, width: 22, height: 22, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Icon name={ev.icon} size={11} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{ev.date}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{ev.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'documentos' && (
          <table className="tbl">
            <thead><tr><th>Documento</th><th>Categoria</th><th>Tamanho</th><th>Data</th><th></th></tr></thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={i}>
                  <td><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="doc" size={14} /><b style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</b></div></td>
                  <td><span className="pill pill-neutral">{d.tag}</span></td>
                  <td className="muted">{d.size}</td>
                  <td className="muted">{d.date}</td>
                  <td><button className="btn-ghost btn-xs"><Icon name="download" size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'academico' && (
          <div className="card-pad">
            <div className="grid cols-3" style={{ marginBottom: 18 }}>
              <KPI label="GPA Actual" value={t.gpa.toFixed(1)} sub="máx 20.0" />
              <KPI label="Créditos concluídos" value="124/180" sub="68% do plano curricular" />
              <KPI label="Frequência" value="96%" sub="presença em aulas" />
            </div>
            <table className="tbl">
              <thead><tr><th>Período</th><th>Cadeira</th><th>ECTS</th><th>Nota</th><th>Resultado</th></tr></thead>
              <tbody>
                {[
                  ['2026 S1', 'Análise de Demonstrações Financeiras', 6, 17, 'Aprovado'],
                  ['2026 S1', 'Macroeconomia Avançada', 6, 16, 'Aprovado'],
                  ['2026 S1', 'Risco de Crédito Bancário', 6, 18, 'Aprovado'],
                  ['2025 S2', 'Estatística Aplicada', 6, 15, 'Aprovado'],
                  ['2025 S2', 'Direito Bancário Angolano', 6, 17, 'Aprovado'],
                  ['2025 S2', 'Inglês Financeiro', 4, 18, 'Aprovado']
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="mono muted">{r[0]}</td>
                    <td><b style={{ fontWeight: 500 }}>{r[1]}</b></td>
                    <td className="num">{r[2]}</td>
                    <td className="num" style={{ fontWeight: 600, color: r[3] >= 16 ? 'var(--success)' : r[3] >= 13 ? 'var(--text)' : 'var(--warn)' }}>{r[3]}</td>
                    <td><Pill tone="success">{r[4]}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'desempenho' && (
          <div className="card-pad">
            <div className="grid cols-2" style={{ gap: 18 }}>
              <div>
                <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 12px' }}>Avaliações 360°</h4>
                {[
                  { who: 'Auto-avaliação', score: t.perf - 4, color: '#7C3AED' },
                  { who: 'Mentor (' + t.mentor + ')', score: t.perf, color: '#FF7607' },
                  { who: 'Pares', score: t.perf - 2, color: '#0E7C4A' },
                  { who: 'Gestor de programa', score: t.perf + 1, color: '#1D4ED8' }
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div className="row-between" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 12 }}>{r.who}</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{r.score}/100</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: r.score + '%', background: r.color }} /></div>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 0 12px' }}>Evolução de Performance · 12 meses</h4>
                <LineChart
                  series={[{ data: [72, 74, 75, 78, 80, 82, 83, 84, 85, 87, 88, t.perf], labels: ['Mai','Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr'], color: '#FF7607', area: true }]}
                  height={180} width={460}
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'financeiro' && (
          <div>
            <div className="card-pad" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="grid cols-4">
                <KPI label="Investido total" value={window.BFA.fmtKzShort(t.stipend * 12)} sub="desde início" />
                <KPI label="Subsídio mensal" value={window.BFA.fmtKzShort(t.stipend)} sub="brut + auxílios" />
                <KPI label="Próximo pagamento" value="28 Mai" sub={window.BFA.fmtKzShort(t.stipend)} />
                <KPI label="ROI projectado" value="3,2×" sub="modelo financeiro" deltaTone="up" delta="positivo" />
              </div>
            </div>
            <table className="tbl">
              <thead><tr><th>Ref.</th><th>Tipo</th><th>Período</th><th className="num">Valor</th><th>Estado</th><th>Pago em</th></tr></thead>
              <tbody>
                {window.BFA.payments.filter(p => p.talent === t.id || Math.random() < 0.4).slice(0, 6).map((p, i) => (
                  <tr key={i}>
                    <td className="mono muted">{p.id}</td>
                    <td>{p.type}</td>
                    <td className="muted">{p.period}</td>
                    <td className="num" style={{ fontWeight: 500 }}>{window.BFA.fmtKz(p.amount)}</td>
                    <td><PaymentStatusPill status={p.status} /></td>
                    <td className="muted">{p.paidAt || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

window.PaymentStatusPill = function PaymentStatusPill({ status }) {
  const m = {
    paid:    { label: 'Pago',     tone: 'success' },
    pending: { label: 'Pendente', tone: 'warn' },
    hold:    { label: 'Bloqueado', tone: 'neutral' },
    failed:  { label: 'Falhou',   tone: 'danger' }
  };
  const s = m[status] || { label: status, tone: 'neutral' };
  return <Pill tone={s.tone}>{s.label}</Pill>;
};

window.NineBoxMini = function NineBoxMini({ perf, potential }) {
  // Convert to 1..3
  const px = perf >= 85 ? 3 : perf >= 70 ? 2 : 1;
  const py = potential === 'alto' ? 3 : potential === 'médio' ? 2 : 1;
  const labels = [
    ['Risco', 'Performer Inconsistente', 'Sólido em Plateau'],
    ['Talento Emergente', 'Core Performer', 'Estrela Confiável'],
    ['Future Star', 'Future Leader', 'High Potential']
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
      {[3,2,1].map(y => [1,2,3].map(x => {
        const active = x === px && y === py;
        const tone = (x + y) >= 5 ? 'var(--success)' : (x + y) >= 4 ? 'var(--primary)' : (x + y) >= 3 ? 'var(--warn)' : 'var(--danger)';
        return (
          <div key={`${x}-${y}`} style={{
            aspectRatio: '1.4 / 1',
            borderRadius: 4,
            background: active ? tone : 'var(--surface-3)',
            color: active ? '#fff' : 'var(--text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 500, padding: 4, textAlign: 'center', lineHeight: 1.1,
            border: active ? `1px solid ${tone}` : '1px solid var(--border)'
          }}>
            {labels[y-1][x-1]}
          </div>
        );
      }))}
    </div>
  );
};
