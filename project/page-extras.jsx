// BFA TalentFlow — ROI, Avaliações, Mentoria, Bolseiro Portal
window.PageROI = function PageROI() {
  const programs = window.BFA.programs;
  const programData = [
    { id: 'fbfa', invested: 480000000, returned: 1632000000, hires: 38, completion: 92 },
    { id: 'bif',  invested: 720000000, returned: 2160000000, hires: 18, completion: 86 },
    { id: 'bnac', invested: 220000000, returned: 580000000,  hires: 24, completion: 78 },
    { id: 'lid',  invested: 180000000, returned: 720000000,  hires: 9,  completion: 95 },
    { id: 'mest', invested: 432000000, returned: 1080000000, hires: 12, completion: 88 }
  ];
  const total = programData.reduce((a, p) => ({
    invested: a.invested + p.invested,
    returned: a.returned + p.returned,
    hires: a.hires + p.hires
  }), { invested: 0, returned: 0, hires: 0 });

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">ROI por Programa</h1>
          <p className="page-subtitle">Análise consolidada 2021–2026 · Investimento × Retorno (salários poupados em recrutamento + valor gerado)</p>
        </div>
        <div className="page-actions">
          <button className="btn">Período: 5 anos</button>
          <button className="btn"><Icon name="download" size={14} /> Exportar PDF</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Investimento total" value={window.BFA.fmtKzShort(total.invested)} sub="2021–2026" icon="cash" />
        <KPI label="Retorno estimado" value={window.BFA.fmtKzShort(total.returned)} sub={(total.returned / total.invested).toFixed(1) + '× investido'} deltaTone="up" delta="+0.4× yoy" icon="trending" />
        <KPI label="Talentos contratados" value={total.hires} sub="quadros activos do BFA" deltaTone="up" delta="+9" icon="users" />
        <KPI label="Custo médio / contratação" value={window.BFA.fmtKzShort(total.invested / total.hires)} sub="vs. mercado: Kz 28M" deltaTone="up" delta="−42%" icon="zap" />
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="card-title">Comparação por programa</h3>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Programa</th>
              <th className="num">Investido</th>
              <th className="num">Retorno</th>
              <th className="num">ROI</th>
              <th className="num">Contratados</th>
              <th className="num">Conclusão</th>
              <th>Eficiência</th>
            </tr>
          </thead>
          <tbody>
            {programData.map((d, i) => {
              const p = programs.find(x => x.id === d.id);
              const roi = d.returned / d.invested;
              return (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, background: p.color, borderRadius: 3 }} />
                      <b style={{ fontWeight: 500 }}>{p.name}</b>
                    </div>
                  </td>
                  <td className="num">{window.BFA.fmtKzShort(d.invested)}</td>
                  <td className="num">{window.BFA.fmtKzShort(d.returned)}</td>
                  <td className="num" style={{ fontWeight: 600, color: 'var(--success)' }}>{roi.toFixed(1)}×</td>
                  <td className="num">{d.hires}</td>
                  <td className="num">{d.completion}%</td>
                  <td style={{ width: 200 }}>
                    <Bar value={roi * 25} tone={roi >= 3 ? 'success' : roi >= 2 ? '' : 'warn'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--surface-2)', fontWeight: 600 }}>
              <td>Total / Média</td>
              <td className="num">{window.BFA.fmtKzShort(total.invested)}</td>
              <td className="num">{window.BFA.fmtKzShort(total.returned)}</td>
              <td className="num" style={{ color: 'var(--success)' }}>{(total.returned/total.invested).toFixed(1)}×</td>
              <td className="num">{total.hires}</td>
              <td className="num">88%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="card-head"><h3 className="card-title">Evolução do ROI</h3></div>
          <div className="card-pad">
            <LineChart series={[
              { data: [1.8, 2.1, 2.4, 2.8, 3.1, 3.4], labels: ['2021','2022','2023','2024','2025','2026'], color: '#FF7607', area: true }
            ]} height={200} width={500} format={(v) => v + '×'} />
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3 className="card-title">Retenção pós-contratação</h3></div>
          <div className="card-pad">
            <HBar data={[
              { label: '1 ano', value: 94 },
              { label: '3 anos', value: 81 },
              { label: '5 anos', value: 68 },
              { label: '10 anos', value: 47 }
            ]} max={100} format={(v) => v + '%'} />
          </div>
        </div>
      </div>
    </div>
  );
};

window.PageAvaliacoes = function PageAvaliacoes() {
  const cycles = [
    { id: 'C-2026Q2', name: 'Ciclo Q2 2026', status: 'active', target: 247, completed: 168, due: '15 Jun 2026' },
    { id: 'C-2026Q1', name: 'Ciclo Q1 2026', status: 'closed', target: 235, completed: 235, due: '15 Mar 2026' },
    { id: 'C-90D-LB', name: 'Avaliação 90 dias · Liliana B.', status: 'active', target: 1, completed: 0, due: '12 Mai 2026' }
  ];

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Avaliações 360° · Ciclos Activos</h1>
          <p className="page-subtitle">Performance management · Mentor + Pares + Auto + Gestor</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={14} /> Relatório consolidado</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo ciclo</button>
        </div>
      </div>

      <div className="grid cols-3">
        <KPI label="Ciclo Q2 em curso" value="68%" sub="168 de 247 concluídas" deltaTone="up" delta="+12% esta semana" icon="star" />
        <KPI label="Score médio" value="84,2" sub="vs. 81,7 ciclo anterior" deltaTone="up" delta="+2.5pp" icon="trending" />
        <KPI label="Por concluir até prazo" value="79" sub="prazo: 15 Jun · 6 semanas" deltaTone="flat" icon="clock" />
      </div>

      <div className="card">
        <div className="card-head"><h3 className="card-title">Ciclos de avaliação</h3></div>
        <table className="tbl">
          <thead><tr><th>Ciclo</th><th>Estado</th><th>Progresso</th><th>Prazo</th><th>Responsável</th><th></th></tr></thead>
          <tbody>
            {cycles.map(c => (
              <tr key={c.id}>
                <td><b style={{ fontWeight: 500 }}>{c.name}</b><div className="mono muted" style={{ fontSize: 11 }}>{c.id}</div></td>
                <td><Pill tone={c.status === 'active' ? 'primary' : 'success'}>{c.status === 'active' ? 'Em curso' : 'Encerrado'}</Pill></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
                    <Bar value={(c.completed / c.target) * 100} tone="success" />
                    <span style={{ fontSize: 12, fontWeight: 500, minWidth: 64 }}>{c.completed}/{c.target}</span>
                  </div>
                </td>
                <td className="muted">{c.due}</td>
                <td>RH · Mariana Quissama</td>
                <td><button className="btn btn-sm">Abrir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">Avaliações pendentes · Q2 2026</h3>
            <p className="card-subtitle">Talentos sem feedback de mentor ou pares</p>
          </div>
          <button className="btn btn-sm">Enviar lembretes em massa</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Talento</th><th>Programa</th><th>Auto</th><th>Pares</th><th>Mentor</th><th>Gestor</th><th>Status</th></tr></thead>
          <tbody>
            {window.BFA.talents.slice(0, 8).map(t => {
              const auto = Math.random() > 0.3;
              const pares = Math.random() > 0.5;
              const mentor = Math.random() > 0.4;
              const gestor = Math.random() > 0.6;
              const done = [auto, pares, mentor, gestor].filter(Boolean).length;
              const Cell = ({ ok }) => ok
                ? <span style={{ color: 'var(--success)' }}><Icon name="check" size={14} /></span>
                : <span style={{ color: 'var(--text-4)' }}>—</span>;
              return (
                <tr key={t.id}>
                  <td><div className="cell-person"><Avatar name={t.name} size={24} /><div className="meta"><b>{t.name}</b><span className="mono">{t.id}</span></div></div></td>
                  <td>{window.BFA.programs.find(p => p.id === t.program).name}</td>
                  <td><Cell ok={auto} /></td>
                  <td><Cell ok={pares} /></td>
                  <td><Cell ok={mentor} /></td>
                  <td><Cell ok={gestor} /></td>
                  <td>
                    {done === 4 ? <Pill tone="success">Completo</Pill> :
                     done >= 2 ? <Pill tone="warn">{done}/4 recolhidas</Pill> :
                     <Pill tone="danger">{done}/4 — atrasado</Pill>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.PageMentoria = function PageMentoria() {
  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Mentoria · Pares & Sessões</h1>
          <p className="page-subtitle">{window.BFA.mentors.length} mentores activos · 25 mentorandos · Média 2,3 sessões/mês</p>
        </div>
        <div className="page-actions">
          <button className="btn">Calendário</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Atribuir mentoria</button>
        </div>
      </div>

      <div className="grid cols-3">
        <KPI label="Sessões registadas · mês" value="47" sub="média 92 min/sessão" deltaTone="up" delta="+12" icon="briefcase" />
        <KPI label="Satisfação média" value="4,6/5" sub="feedback bolseiros" icon="star" />
        <KPI label="Mentores activos" value={window.BFA.mentors.length} sub="6 departamentos" icon="users" />
      </div>

      <div className="card">
        <div className="card-head"><h3 className="card-title">Pool de mentores</h3></div>
        <table className="tbl">
          <thead><tr><th>Mentor</th><th>Departamento</th><th>Mentorandos</th><th>Sessões/mês</th><th>Avaliação</th><th>Capacidade</th></tr></thead>
          <tbody>
            {window.BFA.mentors.map((m, i) => (
              <tr key={i}>
                <td><div className="cell-person"><Avatar name={m.name} size={26} /><div className="meta"><b>{m.name}</b><span>Sénior · 8+ anos BFA</span></div></div></td>
                <td>{m.dept}</td>
                <td className="num">{m.mentees}</td>
                <td className="num">{(m.mentees * 2 + Math.floor(Math.random()*3))}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="star" size={12} fill="#FF7607" stroke={0} />
                    <b style={{ fontWeight: 500 }}>{m.rating.toFixed(1)}</b>
                  </span>
                </td>
                <td style={{ width: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bar value={(m.mentees / 8) * 100} tone={m.mentees >= 6 ? 'warn' : 'success'} />
                    <span style={{ fontSize: 11 }}>{m.mentees}/8</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===== Portal do Bolseiro =====
window.PageBolseiroHome = function PageBolseiroHome() {
  const me = window.BFA.talents.find(t => t.name === 'Lwini Capemba') || window.BFA.talents[0];
  const prog = window.BFA.programs.find(p => p.id === me.program);

  return (
    <div className="section">
      <div className="page-head">
        <div>
          <h1 className="page-title">Olá, Lwini 👋</h1>
          <p className="page-subtitle">Aqui está o resumo do seu programa · {new Date().toLocaleDateString('pt-PT', { dateStyle: 'long' })}</p>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="doc" size={14} /> Submeter documento</button>
          <button className="btn btn-primary"><Icon name="mail" size={14} /> Contactar mentor</button>
        </div>
      </div>

      <div className="grid cols-4">
        <KPI label="Próximo pagamento" value="28 Mai" sub={window.BFA.fmtKzShort(me.stipend)} icon="cash" />
        <KPI label="GPA actual" value={me.gpa.toFixed(1)} sub="máx 20.0" deltaTone="up" delta="+0.4" icon="graduation" />
        <KPI label="Sessões mentoria · mês" value="2" sub="próx: 8 Mai · 15h00" icon="briefcase" />
        <KPI label="Documentos pendentes" value="1" sub="boletim semestral · 15 Mai" deltaTone="flat" icon="doc" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">O Meu Programa</h3>
              <p className="card-subtitle">{prog.name} · {me.year}</p>
            </div>
            <Pill tone="success">Activo · em boa situação</Pill>
          </div>
          <div className="card-pad">
            <div className="grid cols-2" style={{ gap: 14 }}>
              {[
                ['Universidade', me.university],
                ['Curso', me.course],
                ['Departamento de rotação', me.dept],
                ['Mentor', me.mentor],
                ['Início', me.startDate],
                ['Subsídio mensal', window.BFA.fmtKz(me.stipend)],
                ['Compromisso pós-formação', '3 anos no BFA'],
                ['IBAN', '0040 ···· ···· 7821 ···']
              ].map(([k, v], i) => (
                <div key={i}>
                  <div className="label">{k}</div>
                  <div className="value">{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22 }}>
              <div className="row-between" style={{ marginBottom: 6 }}>
                <span className="label">Progresso curricular</span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>124 / 180 ECTS · 68%</span>
              </div>
              <Bar value={68} tone="success" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3 className="card-title">Notificações</h3></div>
          <div>
            {window.BFA.bolseiroNotifs.map(n => (
              <div key={n.id} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{n.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3 className="card-title">Pagamentos recentes</h3></div>
        <table className="tbl">
          <thead><tr><th>Ref.</th><th>Tipo</th><th>Período</th><th className="num">Valor</th><th>Estado</th><th>Data</th></tr></thead>
          <tbody>
            {window.BFA.bolseiroPayments.map(p => (
              <tr key={p.id}>
                <td className="mono muted">{p.id}</td>
                <td>{p.type}</td>
                <td className="muted">{p.period}</td>
                <td className="num" style={{ fontWeight: 500 }}>{window.BFA.fmtKz(p.amount)}</td>
                <td><PaymentStatusPill status={p.status} /></td>
                <td className="muted">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
