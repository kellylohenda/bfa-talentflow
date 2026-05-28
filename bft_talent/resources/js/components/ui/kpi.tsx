type DeltaTone = 'up' | 'down' | 'flat';

type KPIProps = {
    label: string;
    value: string | number;
    sub?: string;
    delta?: string;
    deltaTone?: DeltaTone;
    icon?: string;
};

const ICON_MAP: Record<string, string> = {
    dashboard: '📊',
    users: '👥',
    briefcase: '💼',
    funnel: '📋',
    grid: '⊞',
    globe: '🌍',
    cash: '💰',
    chart: '📈',
    star: '⭐',
    cog: '⚙',
    shield: '🛡',
    bell: '🔔',
    search: '🔍',
    download: '⬇',
    plus: '+',
    check: '✓',
    x: '✕',
    alert: '⚠',
    doc: '📄',
    calendar: '📅',
    pin: '📍',
    graduation: '🎓',
    clock: '🕐',
    award: '🏆',
    arrowRight: '→',
    trending: '📈',
    mail: '✉',
    flag: '🚩',
    building: '🏢',
    layers: '📑',
};

export function KPI({ label, value, sub, delta, deltaTone = 'up', icon }: KPIProps) {
    return (
        <div className="kpi">
            {icon && (
                <div style={{ fontSize: 18, marginBottom: 6, opacity: 0.6 }}>
                    {ICON_MAP[icon] ?? '•'}
                </div>
            )}
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            {sub && <div className="kpi-sub">{sub}</div>}
            {delta && (
                <div className={`kpi-delta ${deltaTone}`}>
                    {deltaTone === 'up' && '↑'}
                    {deltaTone === 'down' && '↓'}
                    {' '}{delta}
                </div>
            )}
        </div>
    );
}
