import { Head, router } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { BfaAvatar } from '@/components/ui/avatar';
import { index } from '@/routes/chat';
import type { Conversation, Mentor, Message } from '@/types';

type Props = { conversations: (Conversation & { messages: Message[] })[]; currentUser: Mentor };

export default function ChatIndex({ conversations, currentUser }: Props) {
    const [activeConv, setActiveConv] = useState<number | null>(
        conversations.length > 0 ? conversations[0].id : null,
    );
    const [messageText, setMessageText] = useState('');

    const activeConversation = conversations.find((c) => c.id === activeConv);

    function sendMessage() {
        if (!messageText.trim() || !activeConv) {
            return;
        }

        router.post(`/chat/${activeConv}/messages`, {
            body: messageText,
        }, {
            onSuccess: () => setMessageText(''),
        });
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            <Head title="Chat" />
            <div className="section" style={{ height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Chat</h1>
                        <p className="page-subtitle">Mensagens e conversas</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flex: 1, gap: 16, overflow: 'hidden' }}>
                    <div style={{ width: 288, flexShrink: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {conversations.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveConv(c.id)}
                                className="card"
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderColor: activeConv === c.id ? 'var(--primary)' : undefined,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                        <BfaAvatar name={c.participant?.name ?? '?'} size={28} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 500 }}>
                                            {c.participant?.name ?? '—'}
                                        </span>
                                    </div>
                                    {c.unread_count > 0 && (
                                        <span className="pill pill-danger" style={{ flexShrink: 0, fontSize: 11, padding: '2px 6px' }}>
                                            {c.unread_count}
                                        </span>
                                    )}
                                </div>
                                {c.last_message && (
                                    <p style={{ marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-3)' }}>{c.last_message}</p>
                                )}
                            </button>
                        ))}
                        {conversations.length === 0 && (
                            <p style={{ padding: 24, textAlign: 'center', fontSize: 14, color: 'var(--text-3)' }}>Nenhuma conversa.</p>
                        )}
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        {activeConversation ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
                                    <BfaAvatar name={activeConversation.participant?.name ?? '?'} size={28} />
                                    <span style={{ fontWeight: 500, fontSize: 14 }}>
                                        {activeConversation.participant?.name ?? '—'}
                                    </span>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {activeConversation.messages.map((msg) => {
                                        const isMine = msg.from?.id === currentUser.id;

                                        return (
                                            <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                                <div
                                                    style={{
                                                        maxWidth: '70%',
                                                        borderRadius: 8,
                                                        padding: '8px 12px',
                                                        fontSize: 14,
                                                        background: isMine ? 'var(--primary)' : 'var(--surface-2)',
                                                        color: isMine ? 'var(--primary-fg)' : undefined,
                                                    }}
                                                >
                                                    <p>{msg.body}</p>
                                                    <p style={{ marginTop: 2, fontSize: 11, color: isMine ? 'rgba(255,255,255,0.7)' : 'var(--text-3)' }}>
                                                        {new Date(msg.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)', padding: 12 }}>
                                    <input
                                        className="input"
                                        style={{ flex: 1 }}
                                        placeholder="Escrever mensagem…"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button className="btn btn-primary" onClick={sendMessage}>
                                        <Send size={14} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                                Seleccione uma conversa
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ChatIndex.layout = () => ({
    breadcrumbs: [{ title: 'Chat', href: index().url }],
});
