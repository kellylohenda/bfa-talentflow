// BFA TalentFlow — shared icons & primitives
// Exports to window: Icon, Pill, Avatar, Spark, Bar, KPI, Modal

const ICONS = {
  dashboard: <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 9h7v12h-7zM3 12h7v9H3z" />,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19.5c0-3 2.7-5 5.5-5s5.5 2 5.5 5" /><circle cx="16.5" cy="9" r="2.5" /><path d="M14 15.5c.7-.5 1.6-.7 2.5-.7 2.4 0 4 1.7 4 3.7" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="1.5" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></>,
  funnel: <path d="M3 5h18l-7 9v5l-4 2v-7L3 5z" />,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" /></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9.5v5M18 9.5v5" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  star: <path d="M12 3l2.7 5.7 6.3.8-4.7 4.4 1.2 6.3L12 17.2 6.5 20.2l1.2-6.3L3 9.5l6.3-.8L12 3z" />,
  cog: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  shield: <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z" />,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z" /><path d="M10 21h4" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></>,
  filter: <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" />,
  download: <><path d="M12 4v12M6 11l6 6 6-6" /><path d="M4 21h16" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12l5 5 9-11" />,
  x: <path d="M5 5l14 14M19 5L5 19" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowDown: <path d="M12 5v14M5 12l7 7 7-7" />,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  more: <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
  alert: <><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v5M12 18v.5" /></>,
  doc: <><path d="M6 3h9l5 5v13H6z" /><path d="M14 3v6h6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 2c4 0 7 3 7 7 0 5-7 13-7 13S5 14 5 9c0-4 3-7 7-7z" /><circle cx="12" cy="9" r="2.5" /></>,
  building: <><rect x="4" y="4" width="16" height="17" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" /></>,
  graduation: <><path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5" /></>,
  trending: <path d="M3 17l6-6 4 4 8-9" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 7l9 7 9-7" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  flag: <><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></>,
  zap: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  award: <><circle cx="12" cy="9" r="6" /><path d="M8 14l-2 7 6-3 6 3-2-7" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  layers: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 12l10 5 10-5M2 17l10 5 10-5" /></>
};

window.Icon = function Icon({ name, size = 16, stroke = 1.6, fill = 'none', style }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {path}
    </svg>
  );
};

window.Pill = function Pill({ tone = 'neutral', dot = true, children }) {
  return (
    <span className={`pill pill-${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
};

window.StatusPill = function StatusPill({ status }) {
  const s = window.BFA.statuses[status] || { label: status, tone: 'neutral' };
  return <Pill tone={s.tone}>{s.label}</Pill>;
};

window.Avatar = function Avatar({ name, size = 26, color }) {
  const initials = window.BFA.initials(name || '?');
  // deterministic color from name
  const hash = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const palette = ['#FF7607', '#9C4500', '#1D4ED8', '#0E7C4A', '#7C3AED', '#B45309', '#0891B2', '#BE185D'];
  const bg = color || palette[hash % palette.length];
  return (
    <div className="avatar" style={{
      width: size, height: size, fontSize: Math.round(size * 0.38),
      background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
      color: '#fff', borderColor: 'transparent'
    }}>
      {initials}
    </div>
  );
};

window.Spark = function Spark({ data, width = 64, height = 22, color = 'var(--primary)' }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const last = data[data.length - 1];
  const lastX = width;
  const lastY = height - ((last - min) / range) * (height - 2) - 1;
  return (
    <svg className="spark" width={width} height={height}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="1.6" fill={color} />
    </svg>
  );
};

window.Bar = function Bar({ value, max = 100, tone = '' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="bar-track">
      <div className={`bar-fill ${tone}`} style={{ width: pct + '%' }} />
    </div>
  );
};

window.KPI = function KPI({ label, value, sub, delta, deltaTone = 'up', spark, sparkColor, icon }) {
  return (
    <div className="kpi">
      <div className="kpi-label">
        {icon && <Icon name={icon} size={12} />}
        {label}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">
        {delta != null && (
          <span className={`kpi-delta ${deltaTone}`}>
            {deltaTone === 'up' ? '▲' : deltaTone === 'down' ? '▼' : '◆'} {delta}
          </span>
        )}
        {sub && <span>{sub}</span>}
      </div>
      {spark && (
        <div className="kpi-spark">
          <Spark data={spark} color={sparkColor || 'var(--primary)'} width={70} height={26} />
        </div>
      )}
    </div>
  );
};

window.Modal = function Modal({ title, children, onClose, footer, width = 720 }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">{title}</h3>
          <button className="tb-icon-btn" onClick={onClose} aria-label="Fechar">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

// Donut chart
window.Donut = function Donut({ segments, size = 120, thickness = 14, label, sub }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const dasharray = `${len} ${c - len}`;
          const el = (
            <circle key={i}
              cx={size/2} cy={size/2} r={r} fill="none"
              stroke={s.color} strokeWidth={thickness}
              strokeDasharray={dasharray}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {(label || sub) && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {label && <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{label}</div>}
          {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{sub}</div>}
        </div>
      )}
    </div>
  );
};

// Bar chart (horizontal)
window.HBar = function HBar({ data, max, format = (v) => v, height = 22, color = 'var(--primary)' }) {
  const m = max || Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px', alignItems: 'center', gap: 10, fontSize: 12 }}>
          <div style={{ color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
          <div style={{ height, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: ((d.value / m) * 100) + '%',
              height: '100%',
              background: d.color || color,
              transition: 'width 240ms'
            }} />
          </div>
          <div style={{ textAlign: 'right', fontFeatureSettings: '"tnum"', fontWeight: 500 }}>{format(d.value)}</div>
        </div>
      ))}
    </div>
  );
};

// Vertical bar chart
window.VBars = function VBars({ data, height = 100, color = 'var(--primary)', format = (v) => v }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: height + 24 }}>
      {data.map((d, i) => {
        const h = (d.value / max) * height;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontFeatureSettings: '"tnum"' }}>{format(d.value)}</div>
            <div style={{
              width: '100%', maxWidth: 32,
              height: h, background: d.color || color,
              borderRadius: '3px 3px 0 0',
              transition: 'height 240ms'
            }} />
            <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// Line chart
window.LineChart = function LineChart({ series, height = 180, width = 600, format = (v) => v }) {
  const allVals = series.flatMap(s => s.data);
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const padding = { top: 16, right: 16, bottom: 28, left: 40 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;
  const xStep = w / (series[0].data.length - 1);
  const xLabels = series[0].labels || series[0].data.map((_, i) => i);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => min + range * t);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {/* grid */}
      {yTicks.map((tick, i) => {
        const y = padding.top + h - ((tick - min) / range) * h;
        return (
          <g key={i}>
            <line x1={padding.left} x2={padding.left + w} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '2 3'} />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="var(--text-3)" fontFamily="Inter">{format(Math.round(tick))}</text>
          </g>
        );
      })}
      {/* x labels */}
      {xLabels.map((lbl, i) => {
        if (i % Math.ceil(xLabels.length / 8) !== 0 && i !== xLabels.length - 1) return null;
        const x = padding.left + i * xStep;
        return (
          <text key={i} x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="var(--text-3)" fontFamily="Inter">{lbl}</text>
        );
      })}
      {/* lines */}
      {series.map((s, si) => {
        const points = s.data.map((v, i) => {
          const x = padding.left + i * xStep;
          const y = padding.top + h - ((v - min) / range) * h;
          return `${x},${y}`;
        }).join(' ');
        const areaPoints = `${padding.left},${padding.top + h} ${points} ${padding.left + w},${padding.top + h}`;
        return (
          <g key={si}>
            {s.area && <polygon points={areaPoints} fill={s.color} opacity="0.10" />}
            <polyline points={points} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, i) => {
              const x = padding.left + i * xStep;
              const y = padding.top + h - ((v - min) / range) * h;
              return <circle key={i} cx={x} cy={y} r="2.5" fill={s.color} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

Object.assign(window, { Icon: window.Icon, Pill: window.Pill, StatusPill: window.StatusPill, Avatar: window.Avatar, Spark: window.Spark, Bar: window.Bar, KPI: window.KPI, Modal: window.Modal, Donut: window.Donut, HBar: window.HBar, VBars: window.VBars, LineChart: window.LineChart });
