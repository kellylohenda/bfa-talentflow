import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Reply, Trash2 } from 'lucide-react';
import { BfaAvatar } from '@/components/ui/avatar';
import { destroy, index, show } from '@/routes/mensagens';
import type { Message } from '@/types';

type Props = { mensagem: Message };

export default function MensagensShow({ mensagem }: Props) {
    function handleDelete() {
        if (confirm('Apagar esta mensagem?')) {
            router.delete(destroy(mensagem.id).url);
        }
    }

    return (
        <>
            <Head title={mensagem.subject} />
            <div className="section">
                <div className="page-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft size={14} />
                        </Link>
                        <div>
                            <h1 className="page-title">{mensagem.subject}</h1>
                            <p className="page-subtitle">{mensagem.tipo}</p>
                        </div>
                        {!mensagem.read_at && <span className="pill pill-danger">Não lida</span>}
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 className="card-title">Detalhes</h3>
                            <button className="btn btn-ghost btn-sm" onClick={handleDelete}>
                                <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                        </div>
                    </div>
                    <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'var(--surface-2)', borderRadius: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-3)' }}>De</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <BfaAvatar name={mensagem.from?.name ?? '—'} size={16} />
                                    {mensagem.from?.name ?? '—'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-3)' }}>Para</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <BfaAvatar name={mensagem.to?.name ?? '—'} size={16} />
                                    {mensagem.to?.name ?? '—'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-3)' }}>Data</span>
                                <span>{new Date(mensagem.created_at).toLocaleString('pt-PT')}</span>
                            </div>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{mensagem.body}</div>
                    </div>
                </div>

                <div style={{ maxWidth: 640 }}>
                    <Link href={index().url} className="btn btn-ghost btn-sm">
                        <Reply size={14} /> Voltar à Caixa de Entrada
                    </Link>
                </div>
            </div>
        </>
    );
}

MensagensShow.layout = {
    breadcrumbs: [{ title: 'Mensagens' }],
};
