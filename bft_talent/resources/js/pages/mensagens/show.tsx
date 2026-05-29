import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Reply, Trash2, MailOpen } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, destroy, index } from '@/routes/mensagens';
import type { Message } from '@/types';

type Props = { mensagem: Message };

const tipoPill: Record<string, string> = {
    geral: 'pill-info',
    notificacao: 'pill-warn',
    alerta: 'pill-danger',
};

export default function MensagensShow({ mensagem }: Props) {
    const isLida = mensagem.read_at !== null;

    function handleDelete() {
        if (confirm('Eliminar esta mensagem?')) {
            router.delete(destroy(mensagem.id).url);
        }
    }

    function handleMarcarLida() {
        router.patch(`/mensagens/${mensagem.id}/marcar-lida`, {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title={mensagem.subject} />
            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="page-title">{mensagem.subject}</h1>
                            <p className="page-subtitle">
                                <span className={`pill ${tipoPill[mensagem.tipo] ?? 'pill-neutral'}`} style={{ marginRight: 8 }}>
                                    {mensagem.tipo}
                                </span>
                                {isLida ? (
                                    <span className="pill pill-success">Lida</span>
                                ) : (
                                    <span className="pill pill-danger">Não lida</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="page-actions">
                        <Link
                            href={`${create().url}?to_user_id=${mensagem.from?.id ?? ''}`}
                            className="btn btn-ghost btn-sm"
                        >
                            <Reply size={14} /> Responder
                        </Link>
                        {!isLida && (
                            <button className="btn btn-ghost btn-sm" onClick={handleMarcarLida}>
                                <MailOpen size={14} /> Marcar como Lida
                            </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                            <Trash2 size={14} /> Eliminar
                        </button>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <span className="card-title">Mensagem</span>
                    </div>
                    <div className="card-pad">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'var(--surface-2)', borderRadius: 6, fontSize: 12 }}>
                            <div className="row-between">
                                <span className="muted">De</span>
                                <div className="cell-person">
                                    <BfaAvatar name={mensagem.from?.name ?? '—'} size={16} />
                                    <span>{mensagem.from?.name ?? '—'}</span>
                                </div>
                            </div>
                            <div className="row-between">
                                <span className="muted">Para</span>
                                <div className="cell-person">
                                    <BfaAvatar name={mensagem.to?.name ?? '—'} size={16} />
                                    <span>{mensagem.to?.name ?? '—'}</span>
                                </div>
                            </div>
                            <div className="row-between">
                                <span className="muted">Data</span>
                                <span>{new Date(mensagem.created_at).toLocaleString('pt-PT')}</span>
                            </div>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: 16 }}>
                            {mensagem.body}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 640 }}>
                    <Link href={index().url} className="btn btn-ghost btn-sm">
                        <ArrowLeft size={14} /> Voltar à Caixa de Entrada
                    </Link>
                </div>
            </div>
        </>
    );
}

MensagensShow.layout = {
    breadcrumbs: [{ title: 'Mensagens' }],
};
