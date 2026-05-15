import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
    collapsed: boolean;
    onToggleDesktop: () => void;
    onToggleMobile: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
};

export function AppSidebarHeader({
    breadcrumbs = [],
    collapsed,
    onToggleDesktop,
    onToggleMobile,
    theme,
    onToggleTheme,
}: Props) {
    const [notifOpen, setNotifOpen] = useState(false);

    const last = breadcrumbs[breadcrumbs.length - 1];
    const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

    return (
        <header className="topbar">
            {/* Hamburger — collapse sidebar on desktop, overlay on mobile */}
            <button
                className="btn btn-ghost tb-toggle-desktop"
                onClick={() => window.innerWidth <= 768 ? onToggleMobile() : onToggleDesktop()}
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
                {!last && <b>BFA TalentFlow</b>}
            </div>

            {/* Search */}
            <div className="tb-search">
                <Search size={14} />
                <input placeholder="Pesquisar..." type="search" />
            </div>

            <div className="tb-spacer" />

            <span className="tb-env">Beta · 2026</span>

            <div className="tb-divider" />

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
                <button
                    className="tb-icon-btn"
                    aria-label="Notificações"
                    onClick={() => setNotifOpen((o) => !o)}
                >
                    <Bell size={16} />
                    <span className="dot" style={{ width: 7, height: 7, top: 7, right: 7 }} />
                </button>

                {notifOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 8px)',
                            width: 320,
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
                            }}
                        >
                            Notificações
                        </div>
                        <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, opacity: 0.4 }}>
                            Sem notificações pendentes
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
