import { router, usePage } from '@inertiajs/react';
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { BreadcrumbItem } from '@/types';

type SearchResult = {
    id: string;
    label: string;
    sub: string;
    icon: string;
    href: string;
    category: string;
};

type NotifItem = {
    id: string;
    icon: string;
    tone: 'danger' | 'warn' | 'info' | 'neutral';
    title: string;
    sub: string;
};

type Props = {
    breadcrumbs?: BreadcrumbItem[];
    collapsed: boolean;
    onToggleDesktop: () => void;
    onToggleMobile: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
};

const CATEGORY_LABELS: Record<string, string> = {
    talentos: 'Talentos',
    candidaturas: 'Candidaturas',
    pagamentos: 'Pagamentos',
    tarefas: 'Tarefas',
    eventos: 'Eventos',
    paginas: 'Páginas',
};

const PATH_LABELS: Record<string, string> = {
    dashboard: 'Visão Geral',
    candidaturas: 'Candidaturas',
    talentos: 'Talentos',
    pagamentos: 'Pagamentos',
    avaliacoes: 'Avaliações 360',
    mentoria: 'Mentoria',
    estagiarios: 'Estagiários',
    tarefas: 'Tarefas',
    faltas: 'Faltas',
    sucessao: 'Sucessão — 9-Box',
    geografia: 'Mapa Geográfico',
    roi: 'ROI & Custos',
    workflows: 'Aprovações',
    retencao: 'Retenção',
    compliance: 'Compliance',
    mentor: 'Portal do Mentor',
    bolseiro: 'Portal do Bolseiro',
    voluntario: 'Portal do Voluntário',
    agenda: 'Agenda & Workshops',
    documentos: 'Documentos',
    voluntarios: 'Voluntários',
    actividades: 'Actividades',
    horas: 'Horas',
    chat: 'Mensagens',
    notificacoes: 'Notificações',
    'relatorios-voluntariado': 'Relatórios de Voluntariado',
    relatorios: 'Relatórios',
    settings: 'Definições',
    teams: 'Equipas',
    welcome: 'Início',
    portal: 'Portal',
    candidatura: 'Candidatura',
    profile: 'Perfil',
    security: 'Segurança',
    appearance: 'Aparência',
};

function getNotifIcon(icon: string): string {
    const map: Record<string, string> = {
        users: '👥',
        'credit-card': '💳',
        clipboard: '📋',
        'check-square': '✓',
        alert: '⚠',
    };

    return map[icon] ?? '•';
}

function getNotifToneColor(tone: string): { bg: string; color: string } {
    switch (tone) {
        case 'danger': return { bg: '#FEE2E2', color: '#DC2626' };
        case 'warn': return { bg: '#FEF3C7', color: '#D97706' };
        case 'info': return { bg: '#DBEAFE', color: '#2563EB' };
        default: return { bg: '#F3F4F6', color: '#6B7280' };
    }
}

export function AppSidebarHeader({
    breadcrumbs = [],
    collapsed,
    onToggleDesktop,
    onToggleMobile,
    theme,
    onToggleTheme,
}: Props) {
    const page = usePage<{
        auth: { user: { bfa_role?: string } };
    }>();
    const role = page.props.auth.user?.bfa_role ?? 'rh';

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Notifications state
    const [notifOpen, setNotifOpen] = useState(false);
    const [notificacoes, setNotificacoes] = useState<NotifItem[]>([]);
    const notifRef = useRef<HTMLDivElement>(null);

    // Breadcrumbs
    const last = breadcrumbs[breadcrumbs.length - 1];
    const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

    // Search: debounce + API call
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setSearchResults([]);
            setSearchOpen(false);

            return;
        }

        const timer = setTimeout(async () => {
            setSearchLoading(true);

            try {
                const res = await fetch(`/api/v1/pesquisa?q=${encodeURIComponent(searchQuery)}`);

                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                    setSearchOpen(data.length > 0);
                }
            } catch {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside: close search
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }

            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);

        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard: Escape closes search
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                searchInputRef.current?.blur();
            }
        };
        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, []);

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchResults.length > 0) {
            router.visit(searchResults[0].href);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    // Group results by category
    const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
        (acc[r.category] ??= []).push(r);

        return acc;
    }, {});

    // Notifications: generate based on role + page data
    const generateNotifications = useCallback(() => {
        const notifs: NotifItem[] = [];
        const pageProps = page.props as Record<string, unknown>;

        if (role === 'rh' || role === 'direcao') {
            // Check for pending payments
            const pagamentos = (pageProps as { pagamentos?: { data?: Array<{ status: string }> } }).pagamentos?.data;

            if (pagamentos) {
                const pending = pagamentos.filter((p) => p.status === 'pendente');

                if (pending.length > 0) {
                    notifs.push({
                        id: 'pay-pending',
                        icon: 'credit-card',
                        tone: 'warn',
                        title: `${pending.length} pagamento(s) pendente(s)`,
                        sub: 'Pagamentos aguardam processamento',
                    });
                }
            }

            // Check for new applications
            const candidaturas = (pageProps as { candidaturas?: { data?: Array<{ stage: string }> } }).candidaturas?.data;

            if (candidaturas) {
                const triagem = candidaturas.filter((c) => c.stage === 'analise');

                if (triagem.length > 0) {
                    notifs.push({
                        id: 'app-triagem',
                        icon: 'clipboard',
                        tone: 'info',
                        title: `${triagem.length} candidatura(s) em análise`,
                        sub: 'Novas candidaturas recebidas',
                    });
                }
            }

            // Check for at-risk talents
            const talents = (pageProps as { talents?: { data?: Array<{ risk_score: number }> } }).talents?.data;

            if (talents) {
                const atRisk = talents.filter((t) => t.risk_score >= 0.4);

                if (atRisk.length > 0) {
                    notifs.push({
                        id: 'talent-risk',
                        icon: 'users',
                        tone: 'danger',
                        title: `${atRisk.length} talento(s) em risco`,
                        sub: 'Talentos com score de risco elevado',
                    });
                }
            }
        }

        if (role === 'mentor') {
            const tasks = (pageProps as { tarefas?: Array<{ status: string }> }).tarefas;

            if (tasks) {
                const overdue = tasks.filter((t) => t.status === 'atrasada' || t.status === 'overdue');

                if (overdue.length > 0) {
                    notifs.push({
                        id: 'task-overdue',
                        icon: 'check-square',
                        tone: 'danger',
                        title: `${overdue.length} tarefa(s) em atraso`,
                        sub: 'Tarefas dos seus mentorandos',
                    });
                }
            }
        }

        if (role === 'bolseiro' || role === 'estagiario') {
            const pagamentos = (pageProps as { pagamentos?: Array<{ status: string }> }).pagamentos;

            if (pagamentos) {
                const pending = pagamentos.filter((p) => p.status === 'pendente');

                if (pending.length > 0) {
                    notifs.push({
                        id: 'my-pay-pending',
                        icon: 'credit-card',
                        tone: 'info',
                        title: `${pending.length} pagamento(s) pendente(s)`,
                        sub: 'Os seus pagamentos',
                    });
                }
            }
        }

        return notifs;
    }, [role, page.props]);

    // Load notifications on mount and when page changes
    useEffect(() => {
        setNotificacoes(generateNotifications());
    }, [generateNotifications]);

    const unreadCount = notificacoes.length;

    return (
        <header className="topbar">
            {/* Hamburger */}
            <button
                className="btn btn-ghost tb-toggle-desktop"
                onClick={() => (window.innerWidth <= 768 ? onToggleMobile() : onToggleDesktop())}
                title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
                aria-label="Abrir menu"
                style={{ padding: '6px', flexShrink: 0 }}
            >
                <Menu size={18} />
            </button>

            {/* Breadcrumb */}
            <div className="tb-crumb">
                {parent && (
                    <>
                        <span style={{ opacity: 0.5 }}>{parent.title}</span>
                        <span className="tb-crumb-sep">/</span>
                    </>
                )}
                {last && <b>{last.title}</b>}
                {!last && (
                    <b>
                        {(() => {
                            const segment = window.location.pathname.split('/').filter(Boolean)[0] ?? '';

                            return PATH_LABELS[segment] ?? 'BFA TalentFlow';
                        })()}
                    </b>
                )}
            </div>

            {/* Search */}
            <div className="tb-search" ref={searchRef} style={{ position: 'relative' }}>
                <Search size={14} />
                <input
                    ref={searchInputRef}
                    placeholder="Pesquisar..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSearchOpen(false);
                        }}
                        style={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 2,
                            opacity: 0.5,
                        }}
                    >
                        <X size={12} />
                    </button>
                )}

                {/* Search dropdown */}
                {searchOpen && searchResults.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            right: 0,
                            minWidth: 320,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r-lg)',
                            boxShadow: 'var(--shadow-3)',
                            zIndex: 200,
                            overflow: 'hidden',
                            maxHeight: 380,
                            overflowY: 'auto',
                        }}
                    >
                        {Object.entries(groupedResults).map(([category, items]) => (
                            <div key={category}>
                                <div
                                    style={{
                                        padding: '8px 14px',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: 'var(--text-3)',
                                        background: 'var(--surface-2)',
                                    }}
                                >
                                    {CATEGORY_LABELS[category] ?? category}
                                </div>
                                {items.map((r) => (
                                    <button
                                        key={`${r.category}-${r.id}`}
                                        onClick={() => {
                                            router.visit(r.href);
                                            setSearchQuery('');
                                            setSearchOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            width: '100%',
                                            padding: '10px 14px',
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: 13,
                                            color: 'var(--text)',
                                            borderBottom: '1px solid var(--border)',
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = 'none';
                                        }}
                                    >
                                        <span style={{ fontSize: 14, opacity: 0.5 }}>{getNotifIcon(r.icon)}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {r.label}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.sub}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {searchOpen && searchResults.length === 0 && !searchLoading && searchQuery.length >= 2 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            right: 0,
                            padding: '24px 14px',
                            textAlign: 'center',
                            fontSize: 13,
                            color: 'var(--text-3)',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r-lg)',
                            boxShadow: 'var(--shadow-3)',
                            zIndex: 200,
                        }}
                    >
                        Sem resultados para "{searchQuery}"
                    </div>
                )}
            </div>

            <div className="tb-spacer" />

            <span className="tb-env">Beta · 2026</span>

            <div className="tb-divider" />

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                    className="tb-icon-btn"
                    aria-label="Notificações"
                    onClick={() => setNotifOpen((o) => !o)}
                    style={{ position: 'relative' }}
                >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#DC2626',
                                border: '2px solid var(--surface)',
                            }}
                        />
                    )}
                </button>

                {notifOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 8px)',
                            width: 360,
                            maxHeight: 400,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r-xl)',
                            boxShadow: 'var(--shadow-3)',
                            zIndex: 200,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: '14px 16px',
                                borderBottom: '1px solid var(--border)',
                                fontWeight: 700,
                                fontSize: 14,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <span>Notificações</span>
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        background: '#DC2626',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--r-pill)',
                                    }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                            {notificacoes.length === 0 ? (
                                <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, opacity: 0.4 }}>
                                    Sem notificações pendentes
                                </div>
                            ) : (
                                notificacoes.map((n) => {
                                    const toneColor = getNotifToneColor(n.tone);

                                    return (
                                        <div
                                            key={n.id}
                                            style={{
                                                display: 'flex',
                                                gap: 10,
                                                padding: '12px 16px',
                                                borderBottom: '1px solid var(--border)',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'none';
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 'var(--r-md)',
                                                    background: toneColor.bg,
                                                    color: toneColor.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 13,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {getNotifIcon(n.icon)}
                                            </span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{n.sub}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Theme toggle */}
            <button
                className="tb-icon-btn"
                aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                onClick={onToggleTheme}
            >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
        </header>
    );
}
