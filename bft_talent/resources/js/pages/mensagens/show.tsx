import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Reply, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { destroy, index, show } from '@/routes/mensagens';
import type { Message } from '@/types';

type Props = { mensagem: Message };

export default function MensagensShow({ mensagem }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    function handleDelete() {
        if (confirm('Apagar esta mensagem?')) {
            router.delete(destroy([team, mensagem.id]).url);
        }
    }

    return (
        <>
            <Head title={mensagem.subject} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={mensagem.subject} description={mensagem.tipo} />
                    {!mensagem.read_at && <Badge variant="destructive" className="ml-auto">Não lida</Badge>}
                </div>
                <Card className="max-w-2xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Detalhes</CardTitle>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid gap-2 rounded-md bg-muted/30 p-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">De</span>
                                <span>{mensagem.from?.name ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Para</span>
                                <span>{mensagem.to?.name ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Data</span>
                                <span>{new Date(mensagem.created_at).toLocaleString('pt-PT')}</span>
                            </div>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">{mensagem.body}</div>
                    </CardContent>
                </Card>
                <div className="max-w-2xl">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index(team).url}><Reply className="mr-1 h-4 w-4" /> Voltar à Caixa de Entrada</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

MensagensShow.layout = (props: { currentTeam?: { slug: string } | null; mensagem?: Message }) => ({
    breadcrumbs: [
        { title: 'Mensagens', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.mensagem?.subject ?? 'Mensagem',
            href: props.currentTeam && props.mensagem
                ? show([props.currentTeam.slug, props.mensagem.id]).url
                : '/',
        },
    ],
});
