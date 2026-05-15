import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/eventos';

export default function EventosCreate() {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        tipo: 'formacao',
        formato: 'presencial',
        descricao: '',
        data_inicio: new Date().toISOString().slice(0, 10),
        data_fim: '',
        local: '',
        vagas: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Novo Evento" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Novo Evento" description="Agendar evento ou actividade" />
                </div>
                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="titulo">Título *</Label>
                                <Input id="titulo" value={data.titulo} onChange={(e) => setData('titulo', e.target.value)} autoFocus />
                                <InputError message={errors.titulo} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="tipo">Tipo *</Label>
                                    <Select value={data.tipo} onValueChange={(v) => setData('tipo', v)}>
                                        <SelectTrigger id="tipo"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="formacao">Formação</SelectItem>
                                            <SelectItem value="palestra">Palestra</SelectItem>
                                            <SelectItem value="workshop">Workshop</SelectItem>
                                            <SelectItem value="networking">Networking</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.tipo} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="formato">Formato *</Label>
                                    <Select value={data.formato} onValueChange={(v) => setData('formato', v)}>
                                        <SelectTrigger id="formato"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="presencial">Presencial</SelectItem>
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="hibrido">Híbrido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.formato} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="data_inicio">Data de Início *</Label>
                                    <Input id="data_inicio" type="date" value={data.data_inicio} onChange={(e) => setData('data_inicio', e.target.value)} />
                                    <InputError message={errors.data_inicio} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="data_fim">Data de Fim</Label>
                                    <Input id="data_fim" type="date" value={data.data_fim} onChange={(e) => setData('data_fim', e.target.value)} />
                                    <InputError message={errors.data_fim} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="local">Local</Label>
                                    <Input id="local" value={data.local} onChange={(e) => setData('local', e.target.value)} />
                                    <InputError message={errors.local} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="vagas">Vagas</Label>
                                    <Input id="vagas" type="number" min="1" value={data.vagas} onChange={(e) => setData('vagas', e.target.value)} />
                                    <InputError message={errors.vagas} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="descricao">Descrição</Label>
                                <textarea
                                    id="descricao"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.descricao}
                                    onChange={(e) => setData('descricao', e.target.value)}
                                />
                                <InputError message={errors.descricao} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Criar Evento</Button>
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

EventosCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Eventos', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Novo', href: '#' },
    ],
});
