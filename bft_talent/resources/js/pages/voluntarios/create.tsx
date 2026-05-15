import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/voluntarios';
import type { Mentor } from '@/types';

type Props = { mentors: Mentor[] };

export default function VoluntariosCreate({ mentors }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        email: '',
        phone: '',
        area_actuacao: '',
        mentor_user_id: '',
        data_inicio: new Date().toISOString().slice(0, 10),
        motivacao: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Novo Voluntário" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Novo Voluntário" description="Registar voluntário no programa" />
                </div>
                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="nome">Nome *</Label>
                                    <Input id="nome" value={data.nome} onChange={(e) => setData('nome', e.target.value)} autoFocus />
                                    <InputError message={errors.nome} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="area_actuacao">Área de Actuação *</Label>
                                    <Input id="area_actuacao" value={data.area_actuacao} onChange={(e) => setData('area_actuacao', e.target.value)} />
                                    <InputError message={errors.area_actuacao} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="data_inicio">Data de Início *</Label>
                                    <Input id="data_inicio" type="date" value={data.data_inicio} onChange={(e) => setData('data_inicio', e.target.value)} />
                                    <InputError message={errors.data_inicio} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="mentor_user_id">Mentor</Label>
                                    <Select value={data.mentor_user_id} onValueChange={(v) => setData('mentor_user_id', v)}>
                                        <SelectTrigger id="mentor_user_id"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {mentors.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.mentor_user_id} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="motivacao">Motivação</Label>
                                <textarea
                                    id="motivacao"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.motivacao}
                                    onChange={(e) => setData('motivacao', e.target.value)}
                                />
                                <InputError message={errors.motivacao} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Registar Voluntário</Button>
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

VoluntariosCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Voluntários', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Novo', href: '#' },
    ],
});
