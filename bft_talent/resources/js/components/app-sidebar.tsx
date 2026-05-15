import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    BookOpen,
    Calendar,
    CheckSquare,
    ClipboardList,
    CreditCard,
    FileText,
    GitBranch,
    Globe,
    HandHeart,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    MessageSquare,
    Shield,
    TrendingUp,
    Trophy,
    UserCheck,
    UserPlus,
    Users,
    XCircle,
} from 'lucide-react';
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
        auth: { user: { name: string; email: string; bfa_role?: string } };
        ziggy?: { location?: string };
    }>();

    const user = page.props.auth.user;
    if (!user) return null;
    const role = user.bfa_role ?? 'rh';
    const currentUrl = page.props.ziggy?.location ?? window.location.href;

    const isStaff = ['rh', 'direcao', 'mentor'].includes(role);
    const isParticipant = ['bolseiro', 'estagiario'].includes(role);
    const isVoluntario = role === 'voluntario';
    const isRH = role === 'rh' || role === 'direcao';
    const isMentor = role === 'mentor';

    const operacao: NavItem[] = [];
    const desenvolvimento: NavItem[] = [];
    const analise: NavItem[] = [];
    const voluntariadoNav: NavItem[] = [];

    if (role === 'rh') {
        operacao.push(
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Candidaturas', href: '/candidaturas', icon: ClipboardList },
            { title: 'Talentos', href: '/talentos', icon: Users },
            { title: 'Estagiários', href: '/estagiarios', icon: UserPlus },
            { title: 'Tarefas', href: '/tarefas', icon: CheckSquare },
            { title: 'Faltas', href: '/faltas', icon: XCircle },
            { title: 'Agenda', href: '/agenda', icon: Calendar },
            { title: 'Pagamentos', href: '/pagamentos', icon: CreditCard },
            { title: 'Workflows', href: '/workflows', icon: GitBranch },
            { title: 'Documentos', href: '/documentos', icon: FileText },
            { title: 'Mensagens', href: '/mensagens', icon: Mail },
            { title: 'Notificações', href: '/notificacoes', icon: Activity },
        );
        desenvolvimento.push(
            { title: 'Avaliações', href: '/avaliacoes', icon: CheckSquare },
            { title: 'Mentoria', href: '/mentor', icon: BookOpen },
            { title: 'Sucessão', href: '/sucessao', icon: TrendingUp },
            { title: 'Retenção', href: '/retencao', icon: UserCheck },
        );
        analise.push(
            { title: 'Geografia', href: '/geografia', icon: Globe },
            { title: 'ROI', href: '/roi', icon: BarChart3 },
            { title: 'Compliance', href: '/compliance', icon: Shield },
        );
        voluntariadoNav.push(
            { title: 'Voluntários', href: '/voluntarios', icon: Users },
            { title: 'Actividades', href: '/actividades', icon: Calendar },
            { title: 'Horas', href: '/horas', icon: Clock },
            { title: 'Relatórios', href: '/relatorios-voluntariado', icon: BarChart3 },
        );
    } else if (role === 'direcao') {
        operacao.push(
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        );
        desenvolvimento.push(
            { title: 'Talentos', href: '/talentos', icon: Users },
            { title: 'Agenda', href: '/agenda', icon: Calendar },
            { title: 'Avaliações', href: '/avaliacoes', icon: CheckSquare },
            { title: 'Retenção', href: '/retencao', icon: UserCheck },
        );
        analise.push(
            { title: 'ROI', href: '/roi', icon: BarChart3 },
            { title: 'Sucessão', href: '/sucessao', icon: TrendingUp },
            { title: 'Geografia', href: '/geografia', icon: Globe },
            { title: 'Compliance', href: '/compliance', icon: Shield },
        );
        voluntariadoNav.push(
            { title: 'Voluntários', href: '/voluntarios', icon: Users },
            { title: 'Relatórios', href: '/relatorios-voluntariado', icon: BarChart3 },
        );
    } else if (role === 'mentor') {
        operacao.push(
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Mentorandos', href: '/mentor', icon: Users },
            { title: 'Agenda', href: '/agenda', icon: Calendar },
            { title: 'Tarefas', href: '/tarefas', icon: CheckSquare },
            { title: 'Faltas', href: '/faltas', icon: XCircle },
            { title: 'Avaliações', href: '/avaliacoes', icon: CheckSquare },
            { title: 'Mensagens', href: '/mensagens', icon: Mail },
            { title: 'Notificações', href: '/notificacoes', icon: Activity },
        );
    } else if (isParticipant) {
        operacao.push(
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'O Meu Programa', href: '/bolseiro', icon: BookOpen },
            { title: 'Agenda', href: '/agenda', icon: Calendar },
            { title: 'As Minhas Tarefas', href: '/tarefas', icon: CheckSquare },
            { title: 'Faltas', href: '/faltas', icon: XCircle },
            { title: 'Documentos', href: '/documentos', icon: FileText },
            { title: 'Mensagens', href: '/mensagens', icon: MessageSquare },
        );
    } else if (isVoluntario) {
        operacao.push(
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'O Meu Perfil', href: '/bolseiro', icon: UserCheck },
            { title: 'Agenda', href: '/agenda', icon: Calendar },
            { title: 'Actividades', href: '/actividades', icon: HandHeart },
            { title: 'As Minhas Horas', href: '/horas', icon: Clock },
            { title: 'Mensagens', href: '/mensagens', icon: MessageSquare },
        );
    }

    const sectionLabel = (label: string) => (
        <div className="sb-section-label">{label}</div>
    );

    const renderNav = (items: NavItem[]) =>
        items.map((item) => {
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
        });

    const userInitials = initials(user.name);

    return (
        <aside className="sidebar">
            <div className="sb-brand">
                <div className="sb-logo">B</div>
                <div className="sb-brand-text">
                    <b>TalentFlow</b>
                    <span>BFA · {new Date().getFullYear()}</span>
                </div>
            </div>

            <nav className="sb-nav">
                {operacao.length > 0 && (
                    <>
                        {sectionLabel('Operação')}
                        {renderNav(operacao)}
                    </>
                )}
                {desenvolvimento.length > 0 && (
                    <>
                        {sectionLabel('Desenvolvimento')}
                        {renderNav(desenvolvimento)}
                    </>
                )}
                {analise.length > 0 && (
                    <>
                        {sectionLabel('Análise')}
                        {renderNav(analise)}
                    </>
                )}
                {voluntariadoNav.length > 0 && (
                    <>
                        {sectionLabel('Voluntariado')}
                        {renderNav(voluntariadoNav)}
                    </>
                )}
            </nav>

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

const Clock = ({ size = 16 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>
);
