import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/talentos';
import type { Department, Mentor, Program, University } from '@/types';

type Props = {
    programs: Program[];
    universities: University[];
    departments: Department[];
    mentors: Mentor[];
};

export default function TalentosCreate({ programs, universities, departments, mentors }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        kind: 'bolseiro' as 'bolseiro' | 'estagiario',
        program_id: '',
        university_id: '',
        department_id: '',
        mentor_user_id: '',
        stipend: '',
        start_date: '',
        end_date: '',
        observacoes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Novo Talento" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading title="Novo Talento" description="Registar bolseiro ou estagiário" />
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Nome *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="kind">Tipo *</Label>
                                <Select value={data.kind} onValueChange={(v) => setData('kind', v as 'bolseiro' | 'estagiario')}>
                                    <SelectTrigger id="kind">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bolseiro">Bolseiro</SelectItem>
                                        <SelectItem value="estagiario">Estagiário</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kind} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="program_id">Programa *</Label>
                                <Select value={data.program_id} onValueChange={(v) => setData('program_id', v)}>
                                    <SelectTrigger id="program_id">
                                        <SelectValue placeholder="Seleccionar programa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {programs.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.program_id} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="university_id">Universidade</Label>
                                    <Select value={data.university_id} onValueChange={(v) => setData('university_id', v)}>
                                        <SelectTrigger id="university_id">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {universities.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.university_id} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="department_id">Departamento</Label>
                                    <Select value={data.department_id} onValueChange={(v) => setData('department_id', v)}>
                                        <SelectTrigger id="department_id">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((d) => (
                                                <SelectItem key={d.id} value={String(d.id)}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.department_id} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="mentor_user_id">Mentor</Label>
                                    <Select value={data.mentor_user_id} onValueChange={(v) => setData('mentor_user_id', v)}>
                                        <SelectTrigger id="mentor_user_id">
                                            <SelectValue placeholder="Seleccionar mentor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mentors.map((m) => (
                                                <SelectItem key={m.id} value={String(m.id)}>
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.mentor_user_id} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="stipend">Bolsa (AOA)</Label>
                                    <Input
                                        id="stipend"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.stipend}
                                        onChange={(e) => setData('stipend', e.target.value)}
                                    />
                                    <InputError message={errors.stipend} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="start_date">Data de Início</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="end_date">Data de Fim</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
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
                                <Button type="submit" disabled={processing}>
                                    Criar Talento
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={index().url}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TalentosCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Talentos', href: index().url },
        { title: 'Novo', href: '#' },
    ],
});
