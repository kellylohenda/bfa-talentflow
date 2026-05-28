import React from 'react';
import { 
    Users, 
    Briefcase, 
    ClipboardList, 
    Globe, 
    CircleDollarSign, 
    TrendingUp, 
    Star, 
    Settings, 
    ShieldCheck, 
    Bell, 
    Search, 
    Download, 
    Plus, 
    Check, 
    X, 
    AlertTriangle, 
    FileText, 
    Calendar, 
    MapPin, 
    GraduationCap, 
    Clock, 
    Trophy, 
    ArrowRight, 
    Flag, 
    Building2, 
    Layers,
    LayoutDashboard,
    Filter
} from 'lucide-react';

type DeltaTone = 'up' | 'down' | 'flat';

type KPIProps = {
    label: string;
    value: string | number;
    sub?: string;
    delta?: string;
    deltaTone?: DeltaTone;
    icon?: keyof typeof ICON_MAP;
};

const ICON_MAP = {
    dashboard: <LayoutDashboard size={18} />,
    users: <Users size={18} />,
    briefcase: <Briefcase size={18} />,
    funnel: <Filter size={18} />,
    grid: <Layers size={18} />,
    globe: <Globe size={18} />,
    cash: <CircleDollarSign size={18} />,
    chart: <TrendingUp size={18} />,
    star: <Star size={18} />,
    cog: <Settings size={18} />,
    shield: <ShieldCheck size={18} />,
    bell: <Bell size={18} />,
    search: <Search size={18} />,
    download: <Download size={18} />,
    plus: <Plus size={18} />,
    check: <Check size={18} />,
    x: <X size={18} />,
    alert: <AlertTriangle size={18} />,
    doc: <FileText size={18} />,
    calendar: <Calendar size={18} />,
    pin: <MapPin size={18} />,
    graduation: <GraduationCap size={18} />,
    clock: <Clock size={18} />,
    award: <Trophy size={18} />,
    arrowRight: <ArrowRight size={18} />,
    trending: <TrendingUp size={18} />,
    mail: <FileText size={18} />, // Generic for mail in this context
    flag: <Flag size={18} />,
    building: <Building2 size={18} />,
    layers: <Layers size={18} />,
};

export function KPI({ label, value, sub, delta, deltaTone = 'up', icon }: KPIProps) {
    return (
        <div className="kpi">
            {icon && (
                <div style={{ marginBottom: 8, color: 'var(--primary)', opacity: 0.8 }}>
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
