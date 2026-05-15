import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, store } from '@/routes/pagamentos';
import type { Talent } from '@/types';

type Props = { talents: Pick<Talent, 'id' | 'name' | 'talent_code'>[] };

export default function PagamentosCreate({ talents }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const { data, setData, post, processing, errors } = useForm({
        talent_id: '',
        type: 'bolsa',
        period: new Date().toISOString().slice(0, 7),
        amount: '',
        currency: 'AOA',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store(team).url);
    }

    return (
        <>
            <Head title="Novo Pagamento" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="Novo Pagamento" description="Registar bolsa ou subsídio" />
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
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="type">Tipo *</Label>
                                    <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                        <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bolsa">Bolsa</SelectItem>
                                            <SelectItem value="subsidio_alimentacao">Subsídio de Alimentação</SelectItem>
                                            <SelectItem value="ajuda_custo">Ajuda de Custo</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="period">Período *</Label>
                                    <Input id="period" type="month" value={data.period} onChange={(e) => setData('period', e.target.value)} />
                                    <InputError message={errors.period} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="amount">Valor *</Label>
                                    <Input id="amount" type="number" min="0" step="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                                    <InputError message={errors.amount} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="currency">Moeda</Label>
                                    <Input id="currency" value={data.currency} onChange={(e) => setData('currency', e.target.value)} maxLength={3} />
                                    <InputError message={errors.currency} />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>Criar Pagamento</Button>
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

PagamentosCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        { title: 'Pagamentos', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        { title: 'Novo', href: '#' },
    ],
});
