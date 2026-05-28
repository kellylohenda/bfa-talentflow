import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import { index, show } from '@/routes/documentos';
import type { Document } from '@/types';

type Props = { documento: Document & { owner?: { id: number; name: string } | null } };

const pillClass: Record<string, string> = {
    pendente: 'pill pill-warn',
    aprovado: 'pill pill-success',
    rejeitado: 'pill pill-danger',
};

export default function DocumentosShow({ documento }: Props) {
    return (
        <>
            <Head title={documento.name} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 12 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm"><ArrowLeft style={{ width: 14, height: 14 }} /></Link>
                        <div>
                            <h1 className="page-title">{documento.name}</h1>
                            <p className="page-subtitle">{documento.category}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <span className={pillClass[documento.status] ?? 'pill pill-neutral'}>{documento.status}</span>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <span className="card-title">Informações</span>
                    </div>
                    <div className="card-pad">
                        <div className="row-between">
                            <span className="muted">Categoria</span>
                            <span>{documento.category}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Estado</span>
                            <span>
                                <span className={pillClass[documento.status] ?? 'pill pill-neutral'}>{documento.status}</span>
                            </span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Proprietário</span>
                            <span>{documento.owner?.name ?? `${documento.owner_type.split('\\').pop()} #${documento.owner_id}`}</span>
                        </div>
                        <div className="divider" />
                        <div className="row-between">
                            <span className="muted">Data</span>
                            <span>{new Date(documento.created_at).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {documento.storage_path && (
                            <>
                                <div className="divider" />
                                <div className="row">
                                    <a
                                        href={documento.storage_path}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Download style={{ width: 14, height: 14 }} /> Descarregar
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

DocumentosShow.layout = {
    breadcrumbs: [{ title: 'Documentos' }],
};
