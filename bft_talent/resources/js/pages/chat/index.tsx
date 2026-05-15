import { Head, router, usePage } from '@inertiajs/react';
import { Send, User } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index } from '@/routes/chat';
import type { Conversation, Mentor, Message } from '@/types';

type Props = { conversations: (Conversation & { messages: Message[] })[]; currentUser: Mentor };

export default function ChatIndex({ conversations, currentUser }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    const [activeConv, setActiveConv] = useState<number | null>(
        conversations.length > 0 ? conversations[0].id : null,
    );
    const [messageText, setMessageText] = useState('');

    const activeConversation = conversations.find((c) => c.id === activeConv);

    function sendMessage() {
        if (!messageText.trim() || !activeConv) return;
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
            <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 p-4">
                <Heading title="Chat" description="Mensagens e conversas" />

                <div className="flex flex-1 gap-4 overflow-hidden">
                    <div className="w-72 shrink-0 space-y-1 overflow-y-auto">
                        {conversations.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveConv(c.id)}
                                className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/30 ${
                                    activeConv === c.id ? 'border-primary bg-muted/20' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {c.participant?.name?.charAt(0) ?? '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="truncate text-sm font-medium">
                                            {c.participant?.name ?? '—'}
                                        </span>
                                    </div>
                                    {c.unread_count > 0 && (
                                        <Badge variant="destructive" className="h-5 px-1.5 text-xs shrink-0">
                                            {c.unread_count}
                                        </Badge>
                                    )}
                                </div>
                                {c.last_message && (
                                    <p className="mt-1 truncate text-xs text-muted-foreground">{c.last_message}</p>
                                )}
                            </button>
                        ))}
                        {conversations.length === 0 && (
                            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma conversa.</p>
                        )}
                    </div>

                    <Card className="flex flex-1 flex-col overflow-hidden">
                        {activeConversation ? (
                            <>
                                <div className="flex items-center gap-2 border-b px-4 py-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                            {activeConversation.participant?.name?.charAt(0) ?? '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">
                                        {activeConversation.participant?.name ?? '—'}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                                    {activeConversation.messages.map((msg) => {
                                        const isMine = msg.from?.id === currentUser.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                                                        isMine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                    }`}
                                                >
                                                    <p>{msg.body}</p>
                                                    <p className={`mt-0.5 text-xs ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 border-t p-3">
                                    <Input
                                        placeholder="Escrever mensagem…"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1"
                                    />
                                    <Button size="icon" onClick={sendMessage}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                                Seleccione uma conversa
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}

ChatIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Chat', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
