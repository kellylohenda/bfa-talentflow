import { Head, Link, router } from '@inertiajs/react';
import { Mail, MailOpen, MailPlus } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import { BfaAvatar } from '@/components/ui/avatar';
import { create, index, show } from '@/routes/mensagens';
import type { Message, Paginated } from '@/types';

type Props = {
    mensagens: Paginated<Message>;
    naoLidasCount: number;
    filters: { nao_lidas?: string };
};

export default function MensagensIndex({ mensagens, naoLidasCount, filters }: Props) {
    const showingUnread = filters.nao_lidas === '1';

    function toggleUnread() {
        router.get(
            index().url,
            showingUnread ? {} : { nao_lidas: '1' },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Mensagens" />
            <div className="section">
                <div className="page-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div>
                            <h1 className="page-title">Mensagens</h1>
                            <p className="page-subtitle">Caixa de entrada</p>
                        </div>
                        {naoLidasCount > 0 && (
                            <span className="pill pill-danger">{naoLidasCount} não lidas</span>
                        )}
                    </div>
                    <div className="page-actions">
                        <Link href={create().url} className="btn btn-primary">
                            <MailPlus size={14} /> Nova Mensagem
                        </Link>
                    </div>
                </div>

                <div className="toolbar">
                    <button
                        className={`btn ${showingUnread ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                        onClick={toggleUnread}
                    >
                        <Mail size={14} />
                        {showingUnread ? 'Mostrar todas' : 'Apenas não lidas'}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {mensagens.data.map((m) => (
                        <Link
                            key={m.id}
                            href={show(m.id).url}
                            className="card"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 16,
                                padding: 16,
                                fontWeight: !m.read_at ? 500 : undefined,
                                background: !m.read_at ? 'var(--primary-muted)' : undefined,
                            }}
                        >
                            <MailOpen style={{ marginTop: 2, flexShrink: 0, color: m.read_at ? 'var(--text-3)' : 'var(--primary)' }} size={16} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>{m.subject}</span>
                                    <span style={{ flexShrink: 0, fontSize: 12, color: 'var(--text-3)' }}>
                                        {new Date(m.created_at).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                                <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-3)' }}>
                                    De: <BfaAvatar name={m.from?.name ?? '—'} size={16} /> {m.from?.name ?? '—'}
                                </p>
                            </div>
                        </Link>
                    ))}
                    {mensagens.data.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                            {showingUnread ? 'Sem mensagens não lidas.' : 'Nenhuma mensagem na caixa de entrada.'}
                        </div>
                    )}
                </div>

                <TablePagination links={mensagens.links} filters={showingUnread ? { nao_lidas: '1' } : {}} />
            </div>
        </>
    );
}

MensagensIndex.layout = () => ({
    breadcrumbs: [{ title: 'Mensagens', href: index().url }],
});
