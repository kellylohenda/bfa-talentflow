import { Link } from '@inertiajs/react';
import { candidatura, home, portal } from '@/routes';
import type { ReactNode } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div style={{ background: '#FAFAF9', minHeight: '100vh', color: '#1A1A1A', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(255,255,255,0.94)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #E7E5E1',
            }}>
                <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', gap: 32 }}>
                    <Link href={home()} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#1A1A1A', fontWeight: 700, fontSize: 17 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#FF7607,#9C4500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, borderRadius: 6 }}>B</div>
                        BFA Talento
                    </Link>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                        <Link href={portal()} style={{ fontSize: 13, color: '#525252', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, transition: 'background 120ms' }}>
                            Portal candidato
                        </Link>
                        <Link href={candidatura()} style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#1A1A1A', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, transition: 'background 120ms' }}>
                            Candidatar-me →
                        </Link>
                    </nav>
                </div>
            </header>
            <main>{children}</main>
            <footer style={{ borderTop: '1px solid #E7E5E1', padding: '32px', textAlign: 'center', fontSize: 13, color: '#8A8A87' }}>
                © {new Date().getFullYear()} BFA — Banco de Fomento Angola. Todos os direitos reservados.
            </footer>
        </div>
    );
}
