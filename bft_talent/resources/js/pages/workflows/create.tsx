import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { index, store } from '@/routes/workflows';
import type { Talent } from '@/types';

type Props = { talents: Pick<Talent, 'id' | 'name' | 'talent_code'>[] };

export default function WorkflowsCreate({ talents }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        talent_id: '',
        type: 'pagamento',
        descricao: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url);
    }

    return (
        <>
            <Head title="Novo Workflow" />

            <div className="section">
                <div className="page-head">
                    <h1>Novo Workflow</h1>
                    <p>Iniciar processo de aprovação</p>
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

                            <div className="form-group">
                                <label className="form-label">Tipo *</label>
                                <select className="input select" value={data.type} onChange={e => setData('type', e.target.value)}>
                                    <option value="pagamento">Pagamento</option>
                                    <option value="contrato">Contrato</option>
                                    <option value="renovacao">Renovação</option>
                                    <option value="rescisao">Rescisão</option>
                                    <option value="outro">Outro</option>
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descrição</label>
                                <textarea className="input" rows={3} value={data.descricao} onChange={e => setData('descricao', e.target.value)} />
                                <InputError message={errors.descricao} />
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: '1px solid #F5F5F5' }}>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'A gravar...' : 'Criar Workflow'}
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

WorkflowsCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Workflows', href: index().url },
        { title: 'Novo', href: '#' },
    ],
});
