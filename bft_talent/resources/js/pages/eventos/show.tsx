import { Head, Link } from '@inertiajs/react';
import { index, show } from '@/routes/eventos';
import type { Evento } from '@/types';

type Props = { evento: Evento };

const statusPill: Record<string, string> = {
    planeado: 'pill-info',
    confirmado: 'pill-success',
    concluido: 'pill-neutral',
    cancelado: 'pill-danger',
};

export default function EventosShow({ evento }: Props) {
    return (
        <>
            <Head title={evento.titulo} />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">{evento.titulo}</h1>
                        <p className="page-subtitle">{evento.tipo} · {evento.formato}</p>
                    </div>
                    <div className="page-actions">
                        <span className={`pill ${statusPill[evento.status] ?? 'pill-neutral'}`}>
                            {evento.status}
                        </span>
                        <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                    </div>
                </div>
                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <span className="card-title">Detalhes</span>
                    </div>
                    <div className="card-pad">
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span className="muted">Data de Início</span>
                            <span>{new Date(evento.data_inicio).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {evento.data_fim && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                <span className="muted">Data de Fim</span>
                                <span>{new Date(evento.data_fim).toLocaleDateString('pt-PT')}</span>
                            </div>
                        )}
                        {evento.local && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                <span className="muted">Local</span>
                                <span>{evento.local}</span>
                            </div>
                        )}
                        {evento.vagas !== null && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                <span className="muted">Vagas</span>
                                <span>{evento.vagas}</span>
                            </div>
                        )}
                        {evento.descricao && (
                            <div style={{ paddingTop: 12 }}>
                                <p className="muted" style={{ marginBottom: 4 }}>Descrição</p>
                                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{evento.descricao}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

EventosShow.layout = {
    breadcrumbs: [{ title: 'Eventos' }],
};
