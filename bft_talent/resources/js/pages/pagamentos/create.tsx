import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/pagamentos';
import type { Talent } from '@/types';

type Props = { talents: Pick<Talent, 'id' | 'name' | 'talent_code'>[] };

export default function PagamentosCreate({ talents }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        talent_id: '',
        type: 'bolsa',
        period: new Date().toISOString().slice(0, 7),
        amount: '',
        currency: 'AOA',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Novo Pagamento" />

            <div className="section">
                <div className="page-head">
                    <h1>Novo Pagamento</h1>
                    <p>Registar bolsa ou subsídio</p>
                </div>

                <div className="card" style={{ maxWidth: 600 }}>
                    <div className="card-pad">
                        <form onSubmit={submit}>
                            <div className="form-group">
                                <label className="form-label">Talento *</label>
                                <select className="input select" value={data.talent_id} onChange={e => setData('talent_id', e.target.value)}>
                                    <option value="">Seleccionar talento</option>
                                    {talents.map(t => <option key={t.id} value={String(t.id)}>{t.name} — {t.talent_code}</option>)}
                                </select>
                                <InputError message={errors.talent_id} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Tipo *</label>
                                    <select className="input select" value={data.type} onChange={e => setData('type', e.target.value)}>
                                        <option value="bolsa">Bolsa</option>
                                        <option value="subsidio_alimentacao">Subsídio de Alimentação</option>
                                        <option value="ajuda_custo">Ajuda de Custo</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Período *</label>
                                    <input className="input" type="month" value={data.period} onChange={e => setData('period', e.target.value)} />
                                    <InputError message={errors.period} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Valor *</label>
                                    <input className="input" type="number" min="0" step="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)} />
                                    <InputError message={errors.amount} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Moeda</label>
                                    <input className="input" value={data.currency} onChange={e => setData('currency', e.target.value)} maxLength={3} />
                                    <InputError message={errors.currency} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid #F5F5F5' }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'A gravar...' : 'Criar Pagamento'}
                                </button>
                                <Link href={index().url} className="btn btn-outline">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

PagamentosCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Pagamentos', href: index().url },
        { title: 'Novo', href: '#' },
    ],
});
