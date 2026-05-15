import { Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    ClipboardList,
    CreditCard,
    FileText,
    GitBranch,
    HandHeart,
    LayoutGrid,
    LogOut,
    Mail,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';
import { index as candidaturasIndex } from '@/routes/candidaturas';
import { index as documentosIndex } from '@/routes/documentos';
import { index as eventosIndex } from '@/routes/eventos';
import { index as mensagensIndex } from '@/routes/mensagens';
import { index as pagamentosIndex } from '@/routes/pagamentos';
import { index as relatoriosIndex } from '@/routes/relatorios';
import { index as talentosIndex } from '@/routes/talentos';
import { index as voluntariosIndex } from '@/routes/voluntarios';
import { index as workflowsIndex } from '@/routes/workflows';
import { logout } from '@/routes';
import type { LucideIcon } from 'lucide-react';

type NavItem = { title: string; href: string; icon: LucideIcon; badge?: number };

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function isActive(href: string, currentUrl: string): boolean {
    try {
        const path = new URL(currentUrl).pathname;
        const target = new URL(href, currentUrl).pathname;
        if (target === '/') return path === '/';
        return path.startsWith(target);
    } catch {
        return false;
    }
}

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
    const page = usePage<{
        currentTeam?: { slug: string; name: string } | null;
        auth: { user: { name: string; email: string } };
        ziggy?: { location?: string };
    }>();

    const team = page.props.currentTeam?.slug;
    const user = page.props.auth.user;
    const currentUrl = page.props.ziggy?.location ?? window.location.href;

    const mainNav: NavItem[] = team
        ? [
              { title: 'Dashboard', href: dashboard(team).url, icon: LayoutGrid },
              { title: 'Talentos', href: talentosIndex(team).url, icon: Users },
              { title: 'Candidaturas', href: candidaturasIndex(team).url, icon: ClipboardList },
              { title: 'Pagamentos', href: pagamentosIndex(team).url, icon: CreditCard, badge: 3 },
              { title: 'Workflows', href: workflowsIndex(team).url, icon: GitBranch, badge: 6 },
              { title: 'Voluntários', href: voluntariosIndex(team).url, icon: HandHeart },
              { title: 'Mensagens', href: mensagensIndex(team).url, icon: Mail },
              { title: 'Documentos', href: documentosIndex(team).url, icon: FileText },
              { title: 'Eventos', href: eventosIndex(team).url, icon: Calendar },
              { title: 'Relatórios', href: relatoriosIndex(team).url, icon: BarChart3 },
          ]
        : [{ title: 'Dashboard', href: '/', icon: LayoutGrid }];

    const userInitials = initials(user.name);

    function handleLogout() {
        router.flushAll();
    }

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sb-brand">
                <div className="sb-logo">B</div>
                <div className="sb-brand-text">
                    <b>TalentFlow</b>
                    <span>BFA · {new Date().getFullYear()}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sb-nav">
                <div className="sb-section-label">Operação</div>
                {mainNav.map((item) => {
                    const active = isActive(item.href, currentUrl);
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`sb-link${active ? ' active' : ''}`}
                            title={collapsed ? item.title : undefined}
                        >
                            <span className="sb-icon">
                                <item.icon size={16} />
                            </span>
                            <span>{item.title}</span>
                            {item.badge != null && (
                                <span className="sb-badge">{item.badge}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="sb-user">
                <div className="sb-avatar" title={user.name}>
                    {userInitials}
                </div>
                <div className="sb-user-text">
                    <b>{user.name}</b>
                    <span>{user.email}</span>
                </div>
                <Link
                    href={logout().url}
                    method="post"
                    as="button"
                    onClick={handleLogout}
                    className="btn btn-ghost"
                    title="Terminar sessão"
                    style={{ marginLeft: 'auto', padding: '6px', opacity: 0.55, flexShrink: 0 }}
                >
                    <LogOut size={15} />
                </Link>
            </div>
        </aside>
    );
}
