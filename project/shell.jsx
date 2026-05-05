// BFA TalentFlow — Sidebar & Topbar
const NAV_BY_ROLE = {
  rh: [
    { section: 'Operação' },
    { id: 'overview',     label: 'Visão Geral',         icon: 'dashboard' },
    { id: 'candidaturas', label: 'Candidaturas',        icon: 'funnel', badge: '12' },
    { id: 'talentos',     label: 'Talentos',            icon: 'users' },
    { id: 'pagamentos',   label: 'Pagamentos',          icon: 'cash', badge: '3' },
    { id: 'workflows',    label: 'Aprovações',          icon: 'check', badge: '6' },
    { id: 'retencao',     label: 'Retenção',            icon: 'shield' },
    { section: 'Desenvolvimento' },
    { id: 'avaliacoes',   label: 'Avaliações 360°',     icon: 'star' },
    { id: 'mentoria',     label: 'Mentoria',            icon: 'briefcase' },
    { id: 'sucessao',     label: '9-Box / Sucessão',    icon: 'grid' },
    { section: 'Análise' },
    { id: 'geografia',    label: 'Mapa Geográfico',     icon: 'globe' },
    { id: 'roi',          label: 'ROI por Programa',    icon: 'chart' },
    { section: 'Governance' },
    { id: 'compliance',   label: 'Compliance · APD',    icon: 'shield' }
  ],
  direcao: [
    { section: 'Estratégico' },
    { id: 'overview',   label: 'Dashboard Executivo', icon: 'dashboard' },
    { id: 'roi',        label: 'ROI por Programa',    icon: 'chart' },
    { id: 'sucessao',   label: '9-Box / Sucessão',    icon: 'grid' },
    { id: 'geografia',  label: 'Mapa Geográfico',     icon: 'globe' },
    { section: 'Talento' },
    { id: 'talentos',   label: 'Talentos',            icon: 'users' },
    { id: 'avaliacoes', label: 'Performance',         icon: 'star' },
    { id: 'retencao',   label: 'Retenção',            icon: 'shield' },
    { section: 'Governance' },
    { id: 'workflows',  label: 'Aprovações',          icon: 'check' },
    { id: 'compliance', label: 'Compliance · APD',    icon: 'shield' }
  ],
  bolseiro: [
    { section: 'O Meu Programa' },
    { id: 'bolseiroHome',     label: 'Início',           icon: 'dashboard' },
    { id: 'bolseiroPagamentos', label: 'Pagamentos',     icon: 'cash' },
    { id: 'bolseiroDocs',     label: 'Documentos',       icon: 'doc' },
    { id: 'bolseiroMentor',   label: 'Mentoria',         icon: 'briefcase' },
    { section: 'Comunidade' },
    { id: 'bolseiroEventos',  label: 'Eventos & Workshops', icon: 'calendar' }
  ]
};

window.NAV_BY_ROLE = NAV_BY_ROLE;

window.Sidebar = function Sidebar({ role, page, setPage, setRole }) {
  const nav = NAV_BY_ROLE[role];
  const userByRole = {
    rh:       { name: 'Mariana Quissama', sub: 'Gestora de Programa · RH' },
    direcao:  { name: 'Dr. Manuel Bemba', sub: 'Direcção de RH' },
    bolseiro: { name: 'Lwini Capemba',    sub: 'Trainee Y1 · Futuro BFA' }
  };
  const user = userByRole[role];

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">B</div>
        <div className="sb-brand-text">
          <b>TalentFlow</b>
          <span>BFA · Gestão de Talento</span>
        </div>
      </div>

      <div className="sb-role">
        <div className="sb-role-label">Perfil activo</div>
        <div className="sb-role-pills">
          <button className={`sb-role-pill ${role === 'rh' ? 'active' : ''}`} onClick={() => setRole('rh')}>RH</button>
          <button className={`sb-role-pill ${role === 'direcao' ? 'active' : ''}`} onClick={() => setRole('direcao')}>Direcção</button>
          <button className={`sb-role-pill ${role === 'bolseiro' ? 'active' : ''}`} onClick={() => setRole('bolseiro')}>Bolseiro</button>
        </div>
      </div>

      <nav className="sb-nav">
        {nav.map((item, i) => {
          if (item.section) {
            return <div key={i} className="sb-section-label">{item.section}</div>;
          }
          return (
            <button key={item.id}
              className={`sb-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
              title={item.label}>
              <span className="sb-icon"><Icon name={item.icon} size={16} /></span>
              <span>{item.label}</span>
              {item.badge && <span className="sb-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sb-user">
        <div className="sb-avatar">{window.BFA.initials(user.name)}</div>
        <div className="sb-user-text">
          <b>{user.name}</b>
          <span>{user.sub}</span>
        </div>
      </div>
    </aside>
  );
};

window.Topbar = function Topbar({ crumb, role }) {
  return (
    <header className="topbar">
      <div className="tb-crumb">
        <span>BFA TalentFlow</span>
        <span className="tb-crumb-sep">/</span>
        <b>{crumb}</b>
      </div>

      <div className="tb-search">
        <Icon name="search" size={14} />
        <input type="text" placeholder="Pesquisar talentos, candidaturas, pagamentos…" />
      </div>

      <div className="tb-spacer" />

      <span className="tb-env">Produção · APD ✓</span>
      <div className="tb-divider" />
      <button className="tb-icon-btn" title="Notificações"><Icon name="bell" size={16} /><span className="dot" /></button>
      <button className="tb-icon-btn" title="Ajuda"><Icon name="doc" size={16} /></button>
      <button className="tb-icon-btn" title="Definições"><Icon name="cog" size={16} /></button>
    </header>
  );
};
