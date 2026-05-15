import { Link } from '@inertiajs/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { candidatura, home, login, portal, register } from '@/routes';
import { useState, type ReactNode } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

export function PublicLayout({ children }: { children: ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <style>{`
                .pl-header {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    background: var(--surface);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border);
                }
                .pl-header-inner {
                    max-width: 1240px;
                    margin: 0 auto;
                    padding: 0 clamp(16px, 4vw, 32px);
                    height: 64px;
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }
                .pl-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    color: var(--text);
                    font-weight: 700;
                    font-size: 17px;
                }
                .pl-logo-badge {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-deep));
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    border-radius: 6px;
                    flex-shrink: 0;
                }
                .pl-nav {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-left: auto;
                }
                .pl-nav-link {
                    font-size: 13px;
                    color: var(--text-2);
                    text-decoration: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    transition: background 120ms;
                }
                .pl-nav-link:hover {
                    background: var(--surface-3);
                }
                .pl-nav-cta {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--bg);
                    background: var(--text);
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    transition: background 120ms, color 120ms;
                }
                .pl-nav-cta:hover {
                    background: var(--text-2);
                }
                .pl-theme-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    color: var(--text-2);
                    cursor: pointer;
                    transition: background 120ms, color 120ms;
                }
                .pl-theme-btn:hover {
                    background: var(--surface-3);
                    color: var(--text);
                }
                .pl-hamburger {
                    display: none;
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text);
                    padding: 8px;
                    border-radius: 6px;
                }
                .pl-hamburger:hover {
                    background: var(--surface-3);
                }
                .pl-mobile-menu {
                    display: none;
                    position: absolute;
                    top: 64px;
                    left: 0;
                    right: 0;
                    background: var(--surface);
                    border-bottom: 1px solid var(--border);
                    padding: 12px clamp(16px, 4vw, 32px);
                    flex-direction: column;
                    gap: 4px;
                }
                .pl-mobile-menu.open {
                    display: flex;
                }
                .pl-mobile-link {
                    font-size: 14px;
                    color: var(--text-2);
                    text-decoration: none;
                    padding: 10px 12px;
                    border-radius: 6px;
                    transition: background 120ms;
                }
                .pl-mobile-link:hover {
                    background: var(--surface-3);
                }
                .pl-mobile-cta {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--bg);
                    background: var(--text);
                    text-decoration: none;
                    padding: 10px 12px;
                    border-radius: 6px;
                    text-align: center;
                    margin-top: 4px;
                    transition: background 120ms;
                }
                .pl-mobile-cta:hover {
                    background: var(--text-2);
                }
                .pl-footer {
                    border-top: 1px solid var(--border);
                    padding: clamp(20px, 4vw, 32px);
                    text-align: center;
                    font-size: 13px;
                    color: var(--text-3);
                }
                @media (max-width: 639px) {
                    .pl-nav { display: none; }
                    .pl-hamburger { display: flex; align-items: center; justify-content: center; }
                }
            `}</style>
            <header className="pl-header">
                <div className="pl-header-inner">
                    <Link href={home().url} className="pl-logo">
                        <div className="pl-logo-badge">B</div>
                        BFA Talento
                    </Link>
                    <nav className="pl-nav">
                        <Link href={portal().url} className="pl-nav-link">Portal candidato</Link>
                        <Link href={login().url} className="pl-nav-link">Entrar</Link>
                        <Link href={register().url} className="pl-nav-link">Registar</Link>
                        <button
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            aria-label={resolvedAppearance === 'dark' ? 'Modo claro' : 'Modo escuro'}
                            className="pl-theme-btn"
                        >
                            {resolvedAppearance === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <Link href={candidatura().url} className="pl-nav-cta">Candidatar-me →</Link>
                    </nav>
                    <button
                        className="pl-hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <div className={`pl-mobile-menu${menuOpen ? ' open' : ''}`}>
                    <Link href={portal().url} className="pl-mobile-link" onClick={() => setMenuOpen(false)}>Portal candidato</Link>
                    <Link href={login().url} className="pl-mobile-link" onClick={() => setMenuOpen(false)}>Entrar</Link>
                    <Link href={register().url} className="pl-mobile-link" onClick={() => setMenuOpen(false)}>Registar</Link>
                    <button
                        onClick={() => { updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark'); setMenuOpen(false); }}
                        className="pl-mobile-link"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, color: 'var(--text-2)', padding: '10px 12px' }}
                    >
                        {resolvedAppearance === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        {resolvedAppearance === 'dark' ? 'Modo claro' : 'Modo escuro'}
                    </button>
                    <Link href={candidatura().url} className="pl-mobile-cta" onClick={() => setMenuOpen(false)}>Candidatar-me →</Link>
                </div>
            </header>
            <main>{children}</main>
            <footer className="pl-footer">
                © {new Date().getFullYear()} BFA — Banco de Fomento Angola. Todos os direitos reservados.
            </footer>
        </div>
    );
}
