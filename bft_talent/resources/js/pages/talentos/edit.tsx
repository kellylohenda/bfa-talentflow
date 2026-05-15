import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, show, update } from '@/routes/talentos';
import type { Department, Mentor, Program, Talent, University } from '@/types';

type Props = {
    talent: Talent;
    programs: Program[];
    universities: University[];
    departments: Department[];
    mentors: Mentor[];
};

export default function TalentosEdit({ talent, programs, universities, departments, mentors }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: talent.name,
        email: talent.email ?? '',
        department_id: String(talent.department?.id ?? ''),
        mentor_user_id: String(talent.mentor?.id ?? ''),
        stipend: talent.stipend ?? '',
        status: talent.status,
        perf: String(talent.perf ?? ''),
        end_date: talent.end_date ?? '',
        observacoes: talent.observacoes ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(update(talent.id).url);
    }

    return (
        <>
            <Head title={`Editar — ${talent.name}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={show(talent.id).url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading title="Editar Talento" description={talent.talent_code} />
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v as Talent['status'])}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="activo">Activo</SelectItem>
                                            <SelectItem value="suspenso">Suspenso</SelectItem>
                                            <SelectItem value="concluido">Concluído</SelectItem>
                                            <SelectItem value="cancelado">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
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
                                            <SelectValue placeholder="Seleccionar" />
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
                                        value={String(data.stipend)}
                                        onChange={(e) => setData('stipend', e.target.value)}
                                    />
                                    <InputError message={errors.stipend} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="perf">Desempenho (%)</Label>
                                    <Input
                                        id="perf"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.perf}
                                        onChange={(e) => setData('perf', e.target.value)}
                                    />
                                    <InputError message={errors.perf} />
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
                                    Guardar Alterações
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={show(talent.id).url}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TalentosEdit.layout = (props: { currentTeam?: { slug: string } | null; talent?: Talent }) => ({
    breadcrumbs: [
        { title: 'Talentos', href: index().url },
        { title: props.talent?.name ?? 'Editar', href: show(props.talent.id).url },
        { title: 'Editar', href: '#' },
    ],
});
