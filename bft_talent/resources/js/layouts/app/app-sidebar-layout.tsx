import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem } from '@/types';

type Props = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function AppSidebarLayout({ children, breadcrumbs = [] }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const theme = resolvedAppearance;

    useEffect(() => {
        const savedCollapsed = localStorage.getItem('sb-collapsed') === 'true';

        if (savedCollapsed) {
setCollapsed(true);
}
    }, []);

    const toggleDesktop = () => {
        setCollapsed((c) => {
            const next = !c;
            localStorage.setItem('sb-collapsed', String(next));

            return next;
        });
    };

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const toggleMobile = () => setMobileOpen((o) => !o);
    const closeMobile = () => setMobileOpen(false);

    return (
        <div
            className="app"
            data-sidebar={collapsed ? 'icon' : 'expanded'}
            data-mobile-open={mobileOpen ? 'true' : 'false'}
        >
            {mobileOpen && <div className="sb-overlay" onClick={closeMobile} />}

            <AppSidebar collapsed={collapsed} />

            <div className="main">
                <AppSidebarHeader
                    breadcrumbs={breadcrumbs}
                    collapsed={collapsed}
                    onToggleDesktop={toggleDesktop}
                    onToggleMobile={toggleMobile}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                />
                <div className="page">{children}</div>
            </div>
        </div>
    );
}
