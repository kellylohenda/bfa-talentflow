import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/candidaturas';
import type { Program, University } from '@/types';

type Props = { programs: Program[]; universities: University[] };

export default function CandidaturasCreate({ programs, universities }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        program_id: '',
        university_id: '',
        tipo: '' as '' | 'bolseiro' | 'estagiario',
        observacoes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Nova Candidatura" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading title="Nova Candidatura" description="Registar candidatura ao programa" />
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Nome *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                                    <InputError message={errors.name} />
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
                                    <Label htmlFor="tipo">Tipo</Label>
                                    <Select value={data.tipo} onValueChange={(v) => setData('tipo', v as '' | 'bolseiro' | 'estagiario')}>
                                        <SelectTrigger id="tipo"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bolseiro">Bolseiro</SelectItem>
                                            <SelectItem value="estagiario">Estagiário</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.tipo} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="program_id">Programa *</Label>
                                <Select value={data.program_id} onValueChange={(v) => setData('program_id', v)}>
                                    <SelectTrigger id="program_id"><SelectValue placeholder="Seleccionar programa" /></SelectTrigger>
                                    <SelectContent>
                                        {programs.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.program_id} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="university_id">Universidade</Label>
                                <Select value={data.university_id} onValueChange={(v) => setData('university_id', v)}>
                                    <SelectTrigger id="university_id"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                    <SelectContent>
                                        {universities.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.university_id} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="observacoes">Observações</Label>
                                <textarea
                                    id="observacoes"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.observacoes}
                                    onChange={(e) => setData('observacoes', e.target.value)}
                                />
                                <InputError message={errors.observacoes} />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Criar Candidatura</Button>
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

CandidaturasCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Candidaturas', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Nova', href: '#' },
    ],
});
