import { Head, router, usePage } from '@inertiajs/react';
import { Bell, BellRing, Check, CheckCheck } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/notificacoes';
import type { Notification, Paginated } from '@/types';

type Props = { notificacoes: Paginated<Notification>; naoLidasCount: number };

export default function NotificacoesIndex({ notificacoes, naoLidasCount }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function markAsRead(id: number) {
        router.patch(`/notificacoes/${id}`, { read_at: new Date().toISOString() });
    }

    function markAllAsRead() {
        router.post('/notificacoes/read-all');
    }

    return (
        <>
            <Head title="Notificações" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Heading title="Notificações" description="Centro de notificações" />
                        {naoLidasCount > 0 && (
                            <Badge variant="destructive">{naoLidasCount} não lidas</Badge>
                        )}
                    </div>
                    {naoLidasCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1.5">
                            <CheckCheck className="h-4 w-4" /> Marcar todas como lidas
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    {notificacoes.data.map((n) => {
                        const isUnread = !n.read_at;
                        return (
                            <div
                                key={n.id}
                                className={`flex items-start gap-3 rounded-lg border p-4 ${
                                    isUnread ? 'bg-muted/10' : ''
                                }`}
                            >
                                <div className="mt-0.5">
                                    {isUnread ? (
                                        <BellRing className="h-4 w-4 text-primary" />
                                    ) : (
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`text-sm ${isUnread ? 'font-medium' : ''}`}>{n.title}</span>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {new Date(n.created_at).toLocaleDateString('pt-PT')}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                                </div>
                                {isUnread && (
                                    <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)} className="shrink-0">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                    {notificacoes.data.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">
                            Nenhuma notificação.
                        </div>
                    )}
                </div>

                <TablePagination links={notificacoes.links} />
            </div>
        </>
    );
}

NotificacoesIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Notificações', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
