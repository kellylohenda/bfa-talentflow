import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/faltas';
import type { Talent } from '@/types';

type Props = { talents: Talent[] };

export default function FaltasCreate({ talents }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        type: '',
        reason: '',
        start_date: '',
        end_date: '',
        justificado: false,
        talent_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Nova Falta" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Nova Falta" description="Registar falta ou ausência" />
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="talent_id">Talento *</Label>
                                <Select value={data.talent_id} onValueChange={(v) => setData('talent_id', v)}>
                                    <SelectTrigger id="talent_id"><SelectValue placeholder="Seleccionar talento" /></SelectTrigger>
                                    <SelectContent>
                                        {talents.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.talent_id} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="start_date">Data Início *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="end_date">Data Fim *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="type">Tipo *</Label>
                                    <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                        <SelectTrigger id="type"><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="doenca">Doença</SelectItem>
                                            <SelectItem value="pessoal">Motivo Pessoal</SelectItem>
                                            <SelectItem value="ferias">Férias</SelectItem>
                                            <SelectItem value="academico">Compromisso Académico</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="justificado">Justificado</Label>
                                    <Select
                                        value={data.justificado ? 'sim' : 'nao'}
                                        onValueChange={(v) => setData('justificado', v === 'sim')}
                                    >
                                        <SelectTrigger id="justificado"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nao">Não</SelectItem>
                                            <SelectItem value="sim">Sim</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.justificado} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="reason">Motivo</Label>
                                <textarea
                                    id="reason"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                />
                                <InputError message={errors.reason} />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Criar Falta</Button>
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

FaltasCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Faltas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Nova', href: '#' },
    ],
});
