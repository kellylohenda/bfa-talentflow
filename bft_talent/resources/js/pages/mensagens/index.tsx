import { Head, Link, router, usePage } from '@inertiajs/react';
import { Mail, MailOpen, MailPlus } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { create, index, show } from '@/routes/mensagens';
import type { Message, Paginated } from '@/types';

type Props = {
    mensagens: Paginated<Message>;
    naoLidasCount: number;
    filters: { nao_lidas?: string };
};

export default function MensagensIndex({ mensagens, naoLidasCount, filters }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const showingUnread = filters.nao_lidas === '1';

    function toggleUnread() {
        router.get(
            index(team).url,
            showingUnread ? {} : { nao_lidas: '1' },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Mensagens" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Heading title="Mensagens" description="Caixa de entrada" />
                        {naoLidasCount > 0 && (
                            <Badge variant="destructive">{naoLidasCount} não lidas</Badge>
                        )}
                    </div>
                    <Button asChild>
                        <Link href={create(team).url}><MailPlus className="h-4 w-4" /> Nova Mensagem</Link>
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={showingUnread ? 'default' : 'outline'}
                        size="sm"
                        onClick={toggleUnread}
                        className="h-8 gap-1.5"
                    >
                        <Mail className="h-3.5 w-3.5" />
                        {showingUnread ? 'Mostrar todas' : 'Apenas não lidas'}
                    </Button>
                </div>

                <div className="space-y-1">
                    {mensagens.data.map((m) => (
                        <Link
                            key={m.id}
                            href={show([team, m.id]).url}
                            className={`flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30 ${!m.read_at ? 'bg-muted/10 font-medium' : ''}`}
                        >
                            <MailOpen className={`mt-0.5 h-4 w-4 shrink-0 ${m.read_at ? 'text-muted-foreground' : 'text-primary'}`} />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-sm">{m.subject}</span>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {new Date(m.created_at).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    De: {m.from?.name ?? '—'}
                                </p>
                            </div>
                        </Link>
                    ))}
                    {mensagens.data.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">
                            {showingUnread ? 'Sem mensagens não lidas.' : 'Nenhuma mensagem na caixa de entrada.'}
                        </div>
                    )}
                </div>

                <TablePagination links={mensagens.links} filters={showingUnread ? { nao_lidas: '1' } : {}} />
            </div>
        </>
    );
}

MensagensIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Mensagens', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
