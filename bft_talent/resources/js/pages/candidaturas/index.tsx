import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, destroy, index, show } from '@/routes/candidaturas';
import type { Application, Paginated } from '@/types';

type Filters = { stage?: string; tipo?: string; search?: string };
type Props = { candidaturas: Paginated<Application>; filters: Filters };

const stageTone: Record<string, string> = {
    analise: 'info',
    entrevista: 'info',
    avaliacao: 'warn',
    oferta: 'success',
    convertido: 'success',
    rejeitado: 'danger',
};

const stageLabel: Record<string, string> = {
    analise: 'Análise',
    entrevista: 'Entrevista',
    avaliacao: 'Avaliação',
    oferta: 'Oferta',
    convertido: 'Convertido',
    rejeitado: 'Rejeitado',
};

const clean = (f: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined));

export default function CandidaturasIndex({ candidaturas, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;

            return;
        }

        const t = setTimeout(() => {
            router.get(index().url, clean({ ...filters, search }), { preserveState: true, replace: true });
        }, 350);

        return () => clearTimeout(t);
    }, [search]);

    function setFilter(key: keyof Filters, value: string) {
        router.get(index().url, clean({ ...filters, [key]: value }), { preserveState: true, replace: true });
    }

    function clearFilters() {
        setSearch('');
        router.get(index().url, {}, { preserveState: false, replace: true });
    }

    const hasFilters = !!(filters.search || filters.stage || filters.tipo);

    function handleDelete(c: Application) {
        if (confirm(`Apagar candidatura de "${c.name}"?`)) {
            router.delete(destroy(c.id).url);
        }
    }

    return (
        <>
            <Head title="Candidaturas" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Candidaturas</h1>
                        <p className="page-subtitle">Gestão de candidaturas ao programa</p>
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary">
                            <Plus size={14} /> Nova Candidatura
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="toolbar">
                    <input
                        className="input input-search"
                        placeholder="Pesquisar por nome…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="input select"
                        value={filters.stage || ''}
                        onChange={(e) => setFilter('stage', e.target.value)}
                    >
                        <option value="">Todas as fases</option>
                        <option value="analise">Análise</option>
                        <option value="entrevista">Entrevista</option>
                        <option value="avaliacao">Avaliação</option>
                        <option value="oferta">Oferta</option>
                        <option value="convertido">Convertido</option>
                        <option value="rejeitado">Rejeitado</option>
                    </select>
                    <select
                        className="input select"
                        value={filters.tipo || ''}
                        onChange={(e) => setFilter('tipo', e.target.value)}
                    >
                        <option value="">Todos os tipos</option>
                        <option value="bolseiro">Bolseiro</option>
                        <option value="estagiario">Estagiário</option>
                    </select>
                    {hasFilters && (
                        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                            <X size={12} /> Limpar
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Programa</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Data</th>
                                <th style={{ textAlign: 'right' }}>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidaturas.data.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="cell-person">
                                            <BfaAvatar name={c.name} size={26} />
                                            <div className="meta">
                                                <b>{c.name}</b>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-2)' }}>{c.email}</td>
                                    <td style={{ color: 'var(--text-2)' }}>{c.program?.name ?? '—'}</td>
                                    <td>
                                        {c.tipo && <span className="pill pill-neutral">{c.tipo}</span>}
                                    </td>
                                    <td>
                                        <span className={`pill pill-${stageTone[c.stage] ?? 'neutral'}`}>
                                            {stageLabel[c.stage] ?? c.stage}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                                        {new Date(c.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                                            <Link href={show(c.id).url} className="btn btn-ghost btn-sm" title="Ver">
                                                <Eye size={14} />
                                            </Link>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c)} title="Apagar">
                                                <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {candidaturas.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>
                                        Nenhuma candidatura encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination links={candidaturas.links} filters={clean(filters)} />
            </div>
        </>
    );
}

CandidaturasIndex.layout = () => ({
    breadcrumbs: [{ title: 'Candidaturas', href: index().url }],
});
