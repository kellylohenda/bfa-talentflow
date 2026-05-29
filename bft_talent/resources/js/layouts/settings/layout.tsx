import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { index as teams } from '@/routes/teams';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    { title: 'Perfil', href: edit(), icon: null },
    { title: 'Segurança', href: editSecurity(), icon: null },
    { title: 'Equipas', href: teams(), icon: null },
    { title: 'Aparência', href: editAppearance(), icon: null },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="section" style={{ padding: '20px 24px' }}>
            <div className="page-head">
                <div>
                    <h1 className="page-title">Definições</h1>
                    <p className="page-subtitle">Gerir perfil e configurações da conta</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
                <nav className="col" style={{ gap: 4 }}>
                    {sidebarNavItems.map((item, index) => {
                        const active = isCurrentOrParentUrl(item.href);

                        return (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={`btn btn-ghost`}
                                style={{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    fontWeight: active ? 600 : 400,
                                    background: active ? 'var(--surface-3)' : undefined,
                                }}
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div>
                    <div className="card">
                        <div className="card-pad">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
