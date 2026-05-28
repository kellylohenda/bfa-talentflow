import { Head, router } from '@inertiajs/react';
import { Bell, BellRing, Check, CheckCheck } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { index } from '@/routes/notificacoes';
import type { Notification, Paginated } from '@/types';

type Props = { notificacoes: Paginated<Notification>; naoLidasCount: number };

export default function NotificacoesIndex({ notificacoes, naoLidasCount }: Props) {
    function markAsRead(id: number) {
        router.patch(`/notificacoes/${id}`, { read_at: new Date().toISOString() });
    }

    function markAllAsRead() {
        router.post('/notificacoes/read-all');
    }

    return (
        <>
            <Head title="Notificações" />
            <div className="section">
                <div className="page-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div>
                            <h1 className="page-title">Notificações</h1>
                            <p className="page-subtitle">Centro de notificações</p>
                        </div>
                        {naoLidasCount > 0 && (
                            <span className="pill pill-danger">{naoLidasCount} não lidas</span>
                        )}
                    </div>
                    {naoLidasCount > 0 && (
                        <div className="page-actions">
                            <button className="btn btn-ghost btn-sm" onClick={markAllAsRead}>
                                <CheckCheck size={14} /> Marcar todas como lidas
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notificacoes.data.map((n) => {
                        const isUnread = !n.read_at;

                        return (
                            <div
                                key={n.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 12,
                                    padding: 16,
                                    background: isUnread ? 'var(--primary-muted)' : undefined,
                                }}
                            >
                                <div style={{ marginTop: 2 }}>
                                    {isUnread ? (
                                        <BellRing size={16} style={{ color: 'var(--primary)' }} />
                                    ) : (
                                        <Bell size={16} style={{ color: 'var(--text-3)' }} />
                                    )}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: isUnread ? 500 : undefined }}>{n.title}</span>
                                        <span style={{ flexShrink: 0, fontSize: 12, color: 'var(--text-3)' }}>
                                            {new Date(n.created_at).toLocaleDateString('pt-PT')}
                                        </span>
                                    </div>
                                    <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-3)' }}>{n.message}</p>
                                </div>
                                {isUnread && (
                                    <button className="btn btn-ghost btn-sm" onClick={() => markAsRead(n.id)} style={{ flexShrink: 0 }}>
                                        <Check size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {notificacoes.data.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                            Nenhuma notificação.
                        </div>
                    )}
                </div>

                <TablePagination links={notificacoes.links} />
            </div>
        </>
    );
}

NotificacoesIndex.layout = () => ({
    breadcrumbs: [{ title: 'Notificações', href: index().url }],
});
