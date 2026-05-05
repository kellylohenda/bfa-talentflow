// BFA TalentFlow — 9-Box, Geográfico, Pagamentos, Avaliações
window.PageSucessao = function PageSucessao({ setPage, setSelectedTalent }) {
  const [filter, setFilter] = React.useState('todos');
  const data = window.BFA.nineBox;
  const counts = {};
  data.forEach(d => {
    const k = `${d.x}-${d.y}`;
    counts[k] = (counts[k] || 0) + 1;
  });

  const labels = {
    '1-3': { name: 'Future Star',          tone: '#FF7607', desc: 'Alto potencial · ainda em desenvolvimento' },
    '2-3': { name: 'Future Leader',        tone: '#9C4500', desc: 'Pronto para próxima função' },
    '3-3': { name: 'High Potential',       tone: '#0E7C4A', desc: 'Sucessores prioritários · plano activo' },
    '1-2': { name: 'Talento Emergente',    tone: '#1D4ED8', desc: 'Investir em desenvolvimento' },
    '2-2': { name: 'Core Performer',       tone: '#525252', desc: 'Coluna vertebral · reter' },
    '3-2': { name: 'Estrela Confiável',    tone: '#0E7C4A', desc: 'Manter motivação' },
    '1-1': { name: 'Risco',                tone: '#B91C1C', desc: 'Plano de transição ou exit' },
    '2-1': { name: 'Performer Inconsistente', tone: '#B45309', desc: 'Coaching obrigatório' },
    '3-1': { name: 'Sólido em Plateau',    tone: '#525252', desc: 'Especialista · sem crescimento vertical' }
  };

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">9-Box Grid · Sucessão & Potencial</h1>
          <p className="page-subtitle">Mapeamento de {data.length} talentos por desempenho × potencial · Ciclo 2026</p>
        </div>
        <div className="page-actions">
          <button className="btn">Programa: Todos</button>
          <button className="btn">Departamento: Todos</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
          <button className="btn btn-primary">Iniciar ciclo de calibração</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="High Potentials" value={(counts['3-3']||0) + (counts['2-3']||0)} sub="prontos / quase prontos" deltaTone="up" delta="+2 vs ciclo" icon="award" />
        <KPI label="Em risco" value={counts['1-1']||0} sub="acção imediata necessária" deltaTone="down" delta="−1" icon="alert" />
        <KPI label="Core Performers" value={counts['2-2']||0} sub="estabilidade operacional" icon="users" />
        <KPI label="Talento Emergente" value={counts['1-2']||0} sub="investimento prioritário" icon="trending" />
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">Matriz de Sucessão</h3>
            <p className="card-subtitle">Eixo X: Desempenho actual · Eixo Y: Potencial avaliado · Toque num talento para abrir ficha</p>
          </div>
          <div className="row">
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Legenda:</span>
            {[['#0E7C4A','Estratégico'],['#FF7607','Desenvolver'],['#B45309','Atenção'],['#B91C1C','Risco']].map(([c,l],i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, background: c, borderRadius: 2 }} />{l}
              </span>
            ))}
          </div>
        </div>

        <div className="card-pad" style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 6 }}>
            {['Alto','Médio','Baixo'].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {l}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, height: 460 }}>
              {[3,2,1].map(y => [1,2,3].map(x => {
                const cellData = data.filter(d => d.x === x && d.y === y);
                const meta = labels[`${x}-${y}`];
                const tone = (x+y) >= 5 ? '#0E7C4A' : (x+y) >= 4 ? '#FF7607' : (x+y) >= 3 ? '#B45309' : '#B91C1C';
                return (
                  <div key={`${x}-${y}`} style={{
                    background: tone + '08',
                    border: `1px solid ${tone}30`,
                    borderRadius: 6,
                    padding: 10,
                    display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: tone }}>{meta.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{meta.desc}</div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: tone, fontFeatureSettings: '"tnum"' }}>{cellData.length}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignContent: 'flex-start' }}>
                      {cellData.map(d => (
                        <button key={d.id} onClick={() => { setSelectedTalent(d.id); setPage('talento'); }}
                          title={d.name}
                          style={{ padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}>
                          <Avatar name={d.name} size={26} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
              {['Baixo','Médio','Alto'].map((l, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>← Desempenho →</div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.PageGeografia = function PageGeografia() {
  const geo = window.BFA.geo;
  const total = geo.reduce((a, g) => a + g.count, 0);
  const totalCost = geo.reduce((a, g) => a + g.cost, 0);

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Mapa Geográfico de Talento</h1>
          <p className="page-subtitle">{total} talentos distribuídos por {geo.length} cidades · Investimento total {window.BFA.fmtKzShort(totalCost)}</p>
        </div>
        <div className="page-actions">
          <button className="btn">Vista: Mapa</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Em Angola" value={geo.filter(g => g.country === 'Angola').reduce((a,g) => a+g.count, 0)} sub="bolseiros nacionais" deltaTone="up" delta="+12" icon="pin" />
        <KPI label="No Estrangeiro" value={geo.filter(g => g.country !== 'Angola').reduce((a,g) => a+g.count, 0)} sub="Portugal · UE · Brasil" deltaTone="up" delta="+6" icon="globe" />
        <KPI label="Custo médio / talento" value={window.BFA.fmtKzShort(totalCost / total)} sub="anualizado" icon="cash" />
        <KPI label="Cidades únicas" value={geo.length} sub="7 cidades em 5 países" icon="building" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Distribuição geográfica</h3>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Tamanho do círculo = nº de talentos</span>
          </div>
          <div className="card-pad">
            <MapView geo={geo} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Por cidade · custo & contagem</h3>
          </div>
          <table className="tbl">
            <thead><tr><th>Cidade</th><th className="num">Talentos</th><th className="num">Investido</th><th className="num">Custo médio</th></tr></thead>
            <tbody>
              {geo.sort((a,b) => b.count - a.count).map((g, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="pin" size={12} style={{ color: g.country === 'Angola' ? 'var(--primary)' : 'var(--info)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{g.city}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{g.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num" style={{ fontWeight: 500 }}>{g.count}</td>
                  <td className="num">{window.BFA.fmtKzShort(g.cost)}</td>
                  <td className="num muted">{window.BFA.fmtKzShort(g.cost / g.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.MapView = function MapView({ geo }) {
  // Stylized map — Angola + EU + Brazil region with simple landmasses
  const cities = {
    'Luanda':    { x: 480, y: 360 },
    'Lisboa':    { x: 350, y: 195 },
    'Porto':     { x: 348, y: 175 },
    'Coimbra':   { x: 354, y: 185 },
    'Paris':     { x: 410, y: 145 },
    'Londres':   { x: 392, y: 120 },
    'São Paulo': { x: 175, y: 330 }
  };
  const max = Math.max(...geo.map(g => g.count));

  return (
    <svg viewBox="0 0 760 480" width="100%" style={{ background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
      {/* abstract continent shapes */}
      <g fill="var(--surface-3)" stroke="var(--border-strong)" strokeWidth="1">
        {/* Europe */}
        <path d="M340 80 Q380 70 430 90 Q470 110 480 150 Q470 200 440 230 Q400 240 360 220 Q320 200 320 150 Q320 110 340 80 Z" />
        {/* Africa */}
        <path d="M380 240 Q430 230 480 260 Q520 300 530 360 Q520 420 480 440 Q430 450 400 420 Q370 380 370 320 Q370 270 380 240 Z" />
        {/* South America */}
        <path d="M120 280 Q170 270 200 290 Q230 320 230 380 Q210 430 170 440 Q130 430 110 390 Q100 340 120 280 Z" />
      </g>
      {/* Angola highlight */}
      <path d="M450 330 Q480 325 500 345 Q510 370 495 395 Q470 405 450 390 Q435 365 450 330 Z" fill="#FF760722" stroke="#FF7607" strokeWidth="1.5" />
      <text x="475" y="368" fontSize="10" fill="#9C4500" fontFamily="Inter" fontWeight="600" textAnchor="middle">ANGOLA</text>

      {/* dotted grid */}
      <g opacity="0.3">
        {[100,200,300,400].map(y => <line key={'h'+y} x1="0" x2="760" y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 6" />)}
        {[100,200,300,400,500,600,700].map(x => <line key={'v'+x} x1={x} x2={x} y1="0" y2="480" stroke="var(--border)" strokeDasharray="2 6" />)}
      </g>

      {/* connecting lines from Luanda */}
      {geo.filter(g => g.city !== 'Luanda').map(g => {
        const c = cities[g.city]; const o = cities['Luanda'];
        if (!c) return null;
        return <line key={g.city} x1={o.x} y1={o.y} x2={c.x} y2={c.y} stroke="#FF7607" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4" />;
      })}

      {/* city dots */}
      {geo.map(g => {
        const c = cities[g.city];
        if (!c) return null;
        const r = 6 + (g.count / max) * 22;
        return (
          <g key={g.city}>
            <circle cx={c.x} cy={c.y} r={r} fill="#FF7607" opacity="0.18" />
            <circle cx={c.x} cy={c.y} r={r * 0.55} fill="#FF7607" opacity="0.9" />
            <circle cx={c.x} cy={c.y} r="2.5" fill="#fff" />
            <text x={c.x} y={c.y - r - 6} fontSize="11" fontWeight="600" fill="var(--text)" fontFamily="Inter" textAnchor="middle">{g.city}</text>
            <text x={c.x} y={c.y - r - 18} fontSize="10" fill="var(--text-3)" fontFamily="Inter" textAnchor="middle">{g.count} · {window.BFA.fmtKzShort(g.cost)}</text>
          </g>
        );
      })}
    </svg>
  );
};

window.PagePagamentos = function PagePagamentos() {
  const [tab, setTab] = React.useState('todos');
  const [selected, setSelected] = React.useState([]);

  let rows = window.BFA.payments;
  if (tab !== 'todos') rows = rows.filter(p => p.status === tab);

  const counts = {
    todos: window.BFA.payments.length,
    paid: window.BFA.payments.filter(p => p.status === 'paid').length,
    pending: window.BFA.payments.filter(p => p.status === 'pending').length,
    failed: window.BFA.payments.filter(p => p.status === 'failed').length,
    hold: window.BFA.payments.filter(p => p.status === 'hold').length
  };

  const sumPaid = window.BFA.payments.filter(p => p.status === 'paid').reduce((a,p) => a+p.amount, 0);
  const sumPending = window.BFA.payments.filter(p => p.status !== 'paid').reduce((a,p) => a+p.amount, 0);

  const toggleSel = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Pagamentos · Bolsas & Subsídios</h1>
          <p className="page-subtitle">Ciclo Abril 2026 · {window.BFA.payments.length} transacções · Integração Core Banking BFA</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={14} /> Período: Abr 2026</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar SAP</button>
          <button className="btn btn-primary"><Icon name="zap" size={14} /> Processar lote</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Total processado · mês" value={window.BFA.fmtKzShort(sumPaid)} sub={counts.paid + ' transacções'} deltaTone="up" delta="+8.2%" icon="cash" />
        <KPI label="Pendente de aprovação" value={window.BFA.fmtKzShort(sumPending)} sub={(counts.pending + counts.hold) + ' a libertar'} deltaTone="flat" icon="clock" />
        <KPI label="Falhas SWIFT" value={counts.failed} sub="reprocessar manualmente" deltaTone="down" delta="atenção" icon="alert" />
        <KPI label="Orçamento Q2 2026" value="74%" sub="Kz 1,18B / 1,6B utilizado" icon="chart" />
      </div>

      <div className="card">
        <div className="tabs">
          {[
            { id: 'todos',   label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'paid',    label: 'Pagos' },
            { id: 'failed',  label: 'Falhas' },
            { id: 'hold',    label: 'Bloqueados' }
          ].map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}<span className="tab-count">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <div className="toolbar">
          <input className="input input-search" placeholder="Pesquisar por talento, ID, IBAN…" style={{ width: 280 }} />
          <select className="input select"><option>Tipo · Todos</option><option>Subsídio mensal</option><option>Propina</option><option>Alojamento</option></select>
          <select className="input select"><option>Método · Todos</option><option>Transferência BFA</option><option>SWIFT</option></select>
          <div style={{ flex: 1 }} />
          {selected.length > 0 && (
            <>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{selected.length} seleccionado(s)</span>
              <button className="btn btn-sm">Aprovar lote</button>
              <button className="btn btn-sm btn-primary"><Icon name="zap" size={12} /> Executar</button>
            </>
          )}
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 28 }}><input type="checkbox" /></th>
              <th>Ref.</th>
              <th>Beneficiário</th>
              <th>Tipo</th>
              <th>Período</th>
              <th>Método</th>
              <th className="num">Valor</th>
              <th>Estado</th>
              <th>Pago em</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className={p.status === 'failed' ? 'row-danger' : p.status === 'pending' ? 'row-warn' : ''}>
                <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSel(p.id)} onClick={e => e.stopPropagation()} /></td>
                <td className="mono muted">{p.id}</td>
                <td>
                  <div className="cell-person">
                    <Avatar name={p.talentName} size={24} />
                    <div className="meta"><b>{p.talentName}</b><span className="mono">{p.talent}</span></div>
                  </div>
                </td>
                <td>{p.type}</td>
                <td className="muted">{p.period}</td>
                <td><span className="pill pill-neutral">{p.method}</span></td>
                <td className="num" style={{ fontWeight: 500 }}>{window.BFA.fmtKz(p.amount)}</td>
                <td><PaymentStatusPill status={p.status} /></td>
                <td className="muted">{p.paidAt || '—'}</td>
                <td><button className="btn-ghost btn-xs"><Icon name="more" size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
