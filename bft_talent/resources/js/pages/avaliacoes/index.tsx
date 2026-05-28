import { Head, router, useForm } from '@inertiajs/react';
import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import { index, store } from '@/routes/avaliacoes';
import type { Avaliacao, Mentor, Paginated, Talent } from '@/types';

type Filters = { periodo?: string; criterio?: string };
type Props = {
    avaliacoes: Paginated<Avaliacao>;
    filters: Filters;
    talents: Talent[];
    mentors: Mentor[];
};

const criterioTone: Record<string, string> = {
    desempenho: 'primary',
    competencia: 'info',
    comportamento: 'warn',
    lideranca: 'success',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function AvaliacoesIndex({ avaliacoes, filters, talents, mentors }: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        target_id: '',
        reviewer_id: '',
        criterio: '',
        score: '',
        feedback: '',
        periodo: '',
    });

    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.periodo || filters.criterio);

    function openModal() {
        reset();
        setModalOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(store().url, {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    }

    return (
        <>
            <Head title="Avaliações" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Avaliações 360°</h1>
                        <p className="page-subtitle">Avaliações de desempenho</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn btn-primary" onClick={openModal}>
                            <Star size={14} /> Nova Avaliação
                        </button>
                    </div>
                </div>

                <div className="toolbar">
                    <select
                        className="input select"
                        value={filters.criterio || ''}
                        onChange={(e) => setFilter('criterio', e.target.value)}
                    >
                        <option value="">Todos os critérios</option>
                        <option value="desempenho">Desempenho</option>
                        <option value="competencia">Competência</option>
                        <option value="comportamento">Comportamento</option>
                        <option value="lideranca">Liderança</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={() => router.get(index().url, {})}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Avaliado</th>
                                <th>Avaliador</th>
                                <th>Critério</th>
                                <th>Pontuação</th>
                                <th>Período</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avaliacoes.data.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.target?.name ?? '—'}</td>
                                    <td style={{ color: 'var(--text-2)' }}>{a.reviewer?.name ?? '—'}</td>
                                    <td>
                                        <span className={`pill pill-${criterioTone[a.criterio] ?? 'neutral'}`}>
                                            {a.criterio}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Star size={13} style={{ color: '#eab308', fill: '#eab308' }} />
                                            <span style={{ fontWeight: 500 }}>{a.score !== null ? `${a.score}/100` : '—'}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{a.periodo}</td>
                                    <td style={{ color: 'var(--text-2)' }}>
                                        {new Date(a.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                </tr>
                            ))}
                            {avaliacoes.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhuma avaliação encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={avaliacoes.links} filters={clean(filters)} />

                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }} onClick={() => setModalOpen(false)}>
                        <div className="card" style={{ width: 520, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                            <div className="card-head">
                                <h3 className="card-title">Nova Avaliação</h3>
                            </div>
                            <div className="card-pad">
                                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Avaliado *</label>
                                        <select className="input select" value={data.target_id} onChange={(e) => setData('target_id', e.target.value)}>
                                            <option value="">Seleccionar</option>
                                            {talents.map((t) => (
                                                <option key={t.id} value={String(t.id)}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Avaliador *</label>
                                        <select className="input select" value={data.reviewer_id} onChange={(e) => setData('reviewer_id', e.target.value)}>
                                            <option value="">Seleccionar</option>
                                            {mentors.map((m) => (
                                                <option key={m.id} value={String(m.id)}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid cols-2">
                                        <div className="form-group">
                                            <label className="form-label">Critério *</label>
                                            <select className="input select" value={data.criterio} onChange={(e) => setData('criterio', e.target.value)}>
                                                <option value="">Seleccionar</option>
                                                <option value="desempenho">Desempenho</option>
                                                <option value="competencia">Competência</option>
                                                <option value="comportamento">Comportamento</option>
                                                <option value="lideranca">Liderança</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Pontuação (0-100)</label>
                                            <input
                                                className="input"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={data.score}
                                                onChange={(e) => setData('score', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Período</label>
                                        <input
                                            className="input"
                                            value={data.periodo}
                                            onChange={(e) => setData('periodo', e.target.value)}
                                            placeholder="ex: 2026-S1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Feedback</label>
                                        <textarea
                                            className="input"
                                            rows={3}
                                            value={data.feedback}
                                            onChange={(e) => setData('feedback', e.target.value)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                                        <button type="submit" className="btn btn-primary" disabled={processing}>Guardar Avaliação</button>
                                        <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AvaliacoesIndex.layout = () => ({
    breadcrumbs: [{ title: 'Avaliações', href: index().url }],
});
