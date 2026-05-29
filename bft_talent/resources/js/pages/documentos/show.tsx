import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { index } from '@/routes/documentos';
import type { Document } from '@/types';

type Props = {
    documento: Document & {
        owner?: { id: number; name: string } | null;
        uploadedBy?: { id: number; name: string } | null;
        version?: string | null;
        mime_type?: string | null;
        size_bytes?: number | null;
    };
};

const pillClass: Record<string, string> = {
    pendente: 'pill pill-warn',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
};

function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) {
return '—';
}

    if (bytes < 1024) {
return `${bytes} B`;
}

    if (bytes < 1048576) {
return `${(bytes / 1024).toFixed(1)} KB`;
}

    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DocumentosShow({ documento }: Props) {
    const ownerName = documento.owner?.name
        ?? `${documento.owner_type?.split('\\').pop() ?? 'Unknown'} #${documento.owner_id}`;

    return (
        <>
            <Head title={documento.name} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 12 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">{documento.name}</h1>
                            <p className="page-subtitle">{documento.category}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <span className={pillClass[documento.status] ?? 'pill pill-neutral'}>{documento.status}</span>
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <div className="kpi">
                        <span className="kpi-label">Categoria</span>
                        <span className="kpi-value">{documento.category}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Estado</span>
                        <span className="kpi-value">
                            <span className={pillClass[documento.status] ?? 'pill pill-neutral'}>{documento.status}</span>
                        </span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Versão</span>
                        <span className="kpi-value">{documento.version ?? '—'}</span>
                    </div>
                    <div className="kpi">
                        <span className="kpi-label">Tamanho</span>
                        <span className="kpi-value">{formatBytes(documento.size_bytes)}</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-head">
                        <span className="card-title">Detalhe do Documento</span>
                    </div>
                    <div className="card-pad">
                        <div className="row-between">
                            <span className="muted">Nome</span>
                            <span><b>{documento.name}</b></span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Owner</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <BfaAvatar name={ownerName} size={20} />
                                <b>{ownerName}</b>
                            </span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Quem uploadou</span>
                            <span>
                                {documento.uploadedBy?.name ?? '—'}
                            </span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Data</span>
                            <span>{new Date(documento.created_at).toLocaleDateString('pt-PT')}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">MIME type</span>
                            <span className="mono">{documento.mime_type ?? '—'}</span>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ gap: 8, marginTop: 24 }}>
                    {documento.storage_path && (
                        <a
                            href={documento.storage_path}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-sm"
                        >
                            <Download style={{ width: 14, height: 14 }} /> Descarregar
                        </a>
                    )}
                    {documento.status === 'pendente' && (
                        <>
                            <button
                                className="btn btn-primary"
                                onClick={() => router.patch(`/documentos/${documento.id}/revisar`, { status: 'aprovado' })}
                            >
                                Aprovar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => router.patch(`/documentos/${documento.id}/revisar`, { status: 'rejeitado' })}
                            >
                                Rejeitar
                            </button>
                        </>
                    )}
                </div>

                <div style={{ marginTop: 24 }}>
                    <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                </div>
            </div>
        </>
    );
}

DocumentosShow.layout = {
    breadcrumbs: [{ title: 'Documentos' }],
};
