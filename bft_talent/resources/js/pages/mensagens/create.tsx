import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/mensagens';

type Utilizador = { id: number; name: string; email: string };
type Props = { utilizadores: Utilizador[] };

export default function MensagensCreate({ utilizadores }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        to_user_id: '',
        subject: '',
        body: '',
        tipo: 'geral',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Nova Mensagem" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Nova Mensagem" description="Enviar mensagem interna" />
                </div>
                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="to_user_id">Destinatário *</Label>
                                <Select value={data.to_user_id} onValueChange={(v) => setData('to_user_id', v)}>
                                    <SelectTrigger id="to_user_id"><SelectValue placeholder="Seleccionar utilizador" /></SelectTrigger>
                                    <SelectContent>
                                        {utilizadores.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>{u.name} — {u.email}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.to_user_id} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="subject">Assunto *</Label>
                                <Input id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} autoFocus />
                                <InputError message={errors.subject} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tipo">Tipo</Label>
                                <Select value={data.tipo} onValueChange={(v) => setData('tipo', v)}>
                                    <SelectTrigger id="tipo"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="geral">Geral</SelectItem>
                                        <SelectItem value="notificacao">Notificação</SelectItem>
                                        <SelectItem value="alerta">Alerta</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tipo} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="body">Mensagem *</Label>
                                <textarea
                                    id="body"
                                    rows={6}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                />
                                <InputError message={errors.body} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Enviar Mensagem</Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={index(team).url}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MensagensCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Mensagens', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Nova', href: '#' },
    ],
});
