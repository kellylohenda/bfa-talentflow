'use client'

import { useState, useRef, useEffect } from 'react'
import { useRole } from '@/lib/useRole'
import Avatar from '@/components/ui/Avatar'

interface Message {
  id: string
  from: string
  text: string
  ts: string
  mine: boolean
}

interface Conversation {
  id: string
  name: string
  role: string
  lastMsg: string
  lastTs: string
  unread: number
  messages: Message[]
}

const CONV_BY_ROLE: Record<string, Conversation[]> = {
  rh: [
    {
      id: 'c1', name: 'Lwini Capemba', role: 'Estagiária · Futuro BFA',
      lastMsg: 'Obrigada pela confirmação!', lastTs: '09:42', unread: 0,
      messages: [
        { id: 'm1', from: 'Lwini Capemba', text: 'Bom dia Mariana! Tenho uma dúvida sobre o relatório Q1 que precisava de submeter.', ts: '09:30', mine: false },
        { id: 'm2', from: 'Mariana Quissama', text: 'Bom dia Lwini! Claro, em que posso ajudar?', ts: '09:33', mine: true },
        { id: 'm3', from: 'Lwini Capemba', text: 'O prazo de submissão ainda é esta sexta-feira? O módulo de documentos mostra "pendente".', ts: '09:38', mine: false },
        { id: 'm4', from: 'Mariana Quissama', text: 'Sim, a data limite é 10 de Maio. Pode submeter pelo portal em Documentos → + Submeter Documento.', ts: '09:40', mine: true },
        { id: 'm5', from: 'Lwini Capemba', text: 'Obrigada pela confirmação!', ts: '09:42', mine: false },
      ],
    },
    {
      id: 'c2', name: 'Joaquim Tchindemba', role: 'Bolseiro · BIF · Nova SBE',
      lastMsg: 'Recebi, muito obrigado.', lastTs: 'Ontem', unread: 2,
      messages: [
        { id: 'm1', from: 'Joaquim Tchindemba', text: 'Boa tarde! O subsídio de Abril ainda não foi processado na minha conta.', ts: '14:10', mine: false },
        { id: 'm2', from: 'Mariana Quissama', text: 'Olá Joaquim, vou verificar junto da equipa financeira. Aguarde por favor.', ts: '14:25', mine: true },
        { id: 'm3', from: 'Mariana Quissama', text: 'Confirmado — houve um atraso de processamento. O pagamento será efectuado até amanhã.', ts: '15:02', mine: true },
        { id: 'm4', from: 'Joaquim Tchindemba', text: 'Recebi, muito obrigado.', ts: '15:10', mine: false },
      ],
    },
    {
      id: 'c3', name: 'Edmilson Cardoso', role: 'Mentor · Director Banca',
      lastMsg: 'Enviei o relatório de avaliação.', lastTs: 'Seg', unread: 0,
      messages: [
        { id: 'm1', from: 'Edmilson Cardoso', text: 'Mariana, já terminei as avaliações 360° dos meus três mentorandos.', ts: '10:00', mine: false },
        { id: 'm2', from: 'Mariana Quissama', text: 'Excelente, Edmilson! Já estão visíveis no módulo de Avaliações.', ts: '10:15', mine: true },
        { id: 'm3', from: 'Edmilson Cardoso', text: 'Enviei o relatório de avaliação.', ts: '10:20', mine: false },
      ],
    },
    {
      id: 'c4', name: 'Kiala Domingos', role: 'Bolseiro · Liderança+ · BFA',
      lastMsg: 'Confirmado para a sessão de mentoria.', lastTs: 'Ter', unread: 0,
      messages: [
        { id: 'm1', from: 'Kiala Domingos', text: 'Boa tarde, estava a verificar a minha agenda e tenho conflito com a sessão de avaliação do dia 19.', ts: '11:30', mine: false },
        { id: 'm2', from: 'Mariana Quissama', text: 'Olá Kiala! A presença na convocatória de avaliação é obrigatória. Pode reagendar o conflito?', ts: '11:45', mine: true },
        { id: 'm3', from: 'Kiala Domingos', text: 'Confirmado para a sessão de mentoria.', ts: '12:00', mine: false },
      ],
    },
  ],
  mentor: [
    {
      id: 'c1', name: 'Lwini Capemba', role: 'Estagiária · Futuro BFA',
      lastMsg: 'Obrigada mentor, vejo-o quinta-feira!', lastTs: '10:15', unread: 1,
      messages: [
        { id: 'm1', from: 'Edmilson Cardoso', text: 'Lwini, preparaste já os pontos para a nossa sessão de quinta-feira?', ts: '09:00', mine: true },
        { id: 'm2', from: 'Lwini Capemba', text: 'Sim! Tenho questões sobre a rotação para o departamento de Risco de Crédito.', ts: '09:15', mine: false },
        { id: 'm3', from: 'Edmilson Cardoso', text: 'Ótimo. Leva também o relatório Q1 para rever juntos.', ts: '09:22', mine: true },
        { id: 'm4', from: 'Lwini Capemba', text: 'Obrigada mentor, vejo-o quinta-feira!', ts: '10:15', mine: false },
      ],
    },
    {
      id: 'c2', name: 'Kiala Domingos', role: 'Bolseiro · Liderança+',
      lastMsg: 'Excelente, muito obrigado!', lastTs: 'Ontem', unread: 0,
      messages: [
        { id: 'm1', from: 'Kiala Domingos', text: 'Bom dia Edmilson, pode partilhar os materiais da última sessão de liderança?', ts: '08:30', mine: false },
        { id: 'm2', from: 'Edmilson Cardoso', text: 'Claro Kiala! Vou enviar por email ainda hoje.', ts: '08:45', mine: true },
        { id: 'm3', from: 'Kiala Domingos', text: 'Excelente, muito obrigado!', ts: '08:50', mine: false },
      ],
    },
    {
      id: 'c3', name: 'Mariana Quissama', role: 'Gestora de Programa · RH',
      lastMsg: 'Até logo!', lastTs: 'Seg', unread: 0,
      messages: [
        { id: 'm1', from: 'Edmilson Cardoso', text: 'Mariana, já submeti as avaliações dos meus mentorandos para Q2.', ts: '16:00', mine: true },
        { id: 'm2', from: 'Mariana Quissama', text: 'Obrigada Edmilson! Estão todos aprovados no prazo. 👍', ts: '16:10', mine: false },
        { id: 'm3', from: 'Edmilson Cardoso', text: 'Até logo!', ts: '16:12', mine: true },
      ],
    },
  ],
  bolseiro: [
    {
      id: 'c1', name: 'Sofia Mendes', role: 'Mentora · Direcção BFA',
      lastMsg: 'Qualquer dúvida avisa!', lastTs: '11:30', unread: 1,
      messages: [
        { id: 'm1', from: 'Sofia Mendes', text: 'Joaquim, como correu a apresentação no seminário de Finanças?', ts: '10:00', mine: false },
        { id: 'm2', from: 'Joaquim Tchindemba', text: 'Correu muito bem! O professor ficou satisfeito com a análise de risco.', ts: '10:15', mine: true },
        { id: 'm3', from: 'Sofia Mendes', text: 'Óptimo! Lembra-te de incluir esse feedback no relatório semestral.', ts: '11:20', mine: false },
        { id: 'm4', from: 'Sofia Mendes', text: 'Qualquer dúvida avisa!', ts: '11:30', mine: false },
      ],
    },
    {
      id: 'c2', name: 'Mariana Quissama', role: 'Gestora de Programa · RH',
      lastMsg: 'Recebi, muito obrigado.', lastTs: 'Ontem', unread: 0,
      messages: [
        { id: 'm1', from: 'Joaquim Tchindemba', text: 'Boa tarde! O subsídio de Abril ainda não foi processado na minha conta.', ts: '14:10', mine: true },
        { id: 'm2', from: 'Mariana Quissama', text: 'Olá Joaquim, vou verificar junto da equipa financeira. Aguarde por favor.', ts: '14:25', mine: false },
        { id: 'm3', from: 'Mariana Quissama', text: 'Confirmado — houve um atraso de processamento. O pagamento será efectuado até amanhã.', ts: '15:02', mine: false },
        { id: 'm4', from: 'Joaquim Tchindemba', text: 'Recebi, muito obrigado.', ts: '15:10', mine: true },
      ],
    },
  ],
  estagiario: [
    {
      id: 'c1', name: 'Edmilson Cardoso', role: 'Mentor · Director Banca',
      lastMsg: 'Obrigada mentor, vejo-o quinta-feira!', lastTs: '10:15', unread: 0,
      messages: [
        { id: 'm1', from: 'Edmilson Cardoso', text: 'Lwini, preparaste já os pontos para a nossa sessão de quinta-feira?', ts: '09:00', mine: false },
        { id: 'm2', from: 'Lwini Capemba', text: 'Sim! Tenho questões sobre a rotação para o departamento de Risco de Crédito.', ts: '09:15', mine: true },
        { id: 'm3', from: 'Edmilson Cardoso', text: 'Ótimo. Leva também o relatório Q1 para rever juntos.', ts: '09:22', mine: false },
        { id: 'm4', from: 'Lwini Capemba', text: 'Obrigada mentor, vejo-o quinta-feira!', ts: '10:15', mine: true },
      ],
    },
    {
      id: 'c2', name: 'Mariana Quissama', role: 'Gestora de Programa · RH',
      lastMsg: 'Obrigada pela confirmação!', lastTs: '09:42', unread: 0,
      messages: [
        { id: 'm1', from: 'Lwini Capemba', text: 'Bom dia Mariana! Tenho uma dúvida sobre o relatório Q1 que precisava de submeter.', ts: '09:30', mine: true },
        { id: 'm2', from: 'Mariana Quissama', text: 'Bom dia Lwini! Claro, em que posso ajudar?', ts: '09:33', mine: false },
        { id: 'm3', from: 'Lwini Capemba', text: 'O prazo de submissão ainda é esta sexta-feira? O módulo de documentos mostra "pendente".', ts: '09:38', mine: true },
        { id: 'm4', from: 'Mariana Quissama', text: 'Sim, a data limite é 10 de Maio. Pode submeter pelo portal em Documentos → + Submeter Documento.', ts: '09:40', mine: false },
        { id: 'm5', from: 'Lwini Capemba', text: 'Obrigada pela confirmação!', ts: '09:42', mine: true },
      ],
    },
  ],
  voluntario: [
    {
      id: 'c1', name: 'Mariana Quissama', role: 'Gestora de Programa · RH',
      lastMsg: 'As suas horas foram validadas. Parabéns!', lastTs: '14:05', unread: 1,
      messages: [
        { id: 'm1', from: 'Ana Paula Kiala', text: 'Bom dia! Quando serão validadas as minhas horas de Abril?', ts: '13:50', mine: true },
        { id: 'm2', from: 'Mariana Quissama', text: 'Olá Ana Paula! Estamos a processar. Deve receber confirmação até ao final do dia.', ts: '14:00', mine: false },
        { id: 'm3', from: 'Mariana Quissama', text: 'As suas horas foram validadas. Parabéns!', ts: '14:05', mine: false },
      ],
    },
  ],
  direcao: [
    {
      id: 'c1', name: 'Mariana Quissama', role: 'Gestora de Programa · RH',
      lastMsg: 'Relatório enviado por email.', lastTs: 'Hoje', unread: 0,
      messages: [
        { id: 'm1', from: 'Dr. Manuel Bemba', text: 'Mariana, preciso do relatório de KPIs do Q1 para a reunião de amanhã.', ts: '08:00', mine: true },
        { id: 'm2', from: 'Mariana Quissama', text: 'Bom dia Doutor Manuel! Já está a preparar, envio em breve.', ts: '08:15', mine: false },
        { id: 'm3', from: 'Mariana Quissama', text: 'Relatório enviado por email.', ts: '08:45', mine: false },
      ],
    },
  ],
}

const MY_NAMES: Record<string, string> = {
  rh: 'Mariana Quissama',
  direcao: 'Dr. Manuel Bemba',
  mentor: 'Edmilson Cardoso',
  bolseiro: 'Joaquim Tchindemba',
  estagiario: 'Lwini Capemba',
  voluntario: 'Ana Paula Kiala',
}

export default function ChatPage() {
  const role = useRole()
  const myName = MY_NAMES[role] ?? 'Eu'
  const convList = CONV_BY_ROLE[role] ?? CONV_BY_ROLE.rh

  const [convs, setConvs] = useState<Conversation[]>(convList)
  const [activeId, setActiveId] = useState<string>(convs[0]?.id ?? '')
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const active = convs.find(c => c.id === activeId) ?? convs[0]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, active?.messages.length])

  const selectConv = (id: string) => {
    setActiveId(id)
    setConvs(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text || !active) return
    const now = new Date()
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: myName,
      text,
      ts,
      mine: true,
    }
    setConvs(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, newMsg], lastMsg: text, lastTs: ts }
        : c
    ))
    setInput('')
  }

  const totalUnread = convs.reduce((s, c) => s + c.unread, 0)

  return (
    <div className="section" style={{ paddingBottom: 0 }}>
      <div className="page-head" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Mensagens</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Chat directo com a sua equipa e mentores
          </p>
        </div>
        {totalUnread > 0 && (
          <span style={{ padding: '4px 12px', borderRadius: 20, background: '#FEE2E2', color: '#991B1B', fontSize: 13, fontWeight: 600 }}>
            {totalUnread} não lida{totalUnread > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0, height: 'calc(100vh - 200px)', minHeight: 480, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* Conversation list */}
        <div style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)', overflowY: 'auto' }}>
          {convs.map(c => (
            <div
              key={c.id}
              onClick={() => selectConv(c.id)}
              style={{
                display: 'flex',
                gap: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                background: c.id === activeId ? 'var(--surface-2)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                borderLeft: c.id === activeId ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'background 0.1s',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Avatar name={c.name} size={36} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  <span style={{ fontSize: 11, opacity: 0.45, flexShrink: 0, marginLeft: 6 }}>{c.lastTs}</span>
                </div>
                <div style={{ fontSize: 11, opacity: 0.55, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{c.role}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.lastMsg}</span>
                  {c.unread > 0 && (
                    <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 4 }}>{c.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat panel */}
        {active && (
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={active.name} size={36} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{active.name}</div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>{active.role}</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {active.messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: msg.mine ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                  }}
                >
                  {!msg.mine && (
                    <div style={{ flexShrink: 0 }}>
                      <Avatar name={msg.from} size={28} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '65%',
                      padding: '10px 14px',
                      borderRadius: msg.mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.mine ? 'var(--primary)' : 'var(--surface)',
                      color: msg.mine ? '#fff' : 'var(--text)',
                      fontSize: 13,
                      lineHeight: 1.5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  >
                    {msg.text}
                    <div style={{ fontSize: 10, opacity: 0.55, marginTop: 4, textAlign: msg.mine ? 'right' : 'left' }}>{msg.ts}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '14px 20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <input
                className="input"
                style={{ flex: 1 }}
                placeholder={`Mensagem para ${active.name}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{ flexShrink: 0, minWidth: 80 }}
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
