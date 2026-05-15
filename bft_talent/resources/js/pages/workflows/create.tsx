import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/workflows';
import type { Talent } from '@/types';

type Props = { talents: Pick<Talent, 'id' | 'name' | 'talent_code'>[] };

export default function WorkflowsCreate({ talents }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        talent_id: '',
        type: 'pagamento',
        descricao: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Novo Workflow" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Novo Workflow" description="Iniciar processo de aprovação" />
                </div>
                <Card className="max-w-lg">
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="talent_id">Talento *</Label>
                                <Select value={data.talent_id} onValueChange={(v) => setData('talent_id', v)}>
                                    <SelectTrigger id="talent_id"><SelectValue placeholder="Seleccionar talento" /></SelectTrigger>
                                    <SelectContent>
                                        {talents.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {t.name} — {t.talent_code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.talent_id} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="type">Tipo *</Label>
                                <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                    <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pagamento">Pagamento</SelectItem>
                                        <SelectItem value="contrato">Contrato</SelectItem>
                                        <SelectItem value="renovacao">Renovação</SelectItem>
                                        <SelectItem value="rescisao">Rescisão</SelectItem>
                                        <SelectItem value="outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
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
                                <Button type="submit" disabled={processing}>Criar Workflow</Button>
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

WorkflowsCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Workflows', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Novo', href: '#' },
    ],
});
