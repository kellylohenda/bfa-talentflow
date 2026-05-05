'use client'

import { usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const PATH_LABELS: Record<string, string> = {
  overview: 'Visão Geral',
  candidaturas: 'Candidaturas',
  talentos: 'Talentos',
  pagamentos: 'Pagamentos',
  avaliacoes: 'Avaliações 360°',
  mentoria: 'Mentoria',
  estagiarios: 'Gestão de Estagiários',
  tarefas: 'Gestão de Tarefas',
  faltas: 'Gestão de Faltas',
  sucessao: '9-Box / Sucessão',
  geografia: 'Mapa Geográfico',
  roi: 'ROI por Programa',
  workflows: 'Aprovações',
  retencao: 'Retenção',
  compliance: 'Compliance · APD',
  mentor: 'Dashboard do Mentor',
  bolseiro: 'Início',
  documentos: 'Documentos',
  eventos: 'Eventos',
}

export default function Topbar() {
  const pathname = usePathname()
  const segment = pathname.replace('/', '').split('/')[0]
  const label = PATH_LABELS[segment] ?? segment

  return (
    <header className="topbar">
      <div className="tb-crumb">
        <span style={{ opacity: 0.45, fontSize: 13 }}>BFA TalentFlow</span>
        <span style={{ opacity: 0.3, margin: '0 6px' }}>/</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
      </div>

      <div className="tb-search">
        <Icon name="search" size={14} style={{ opacity: 0.4 }} />
        <input
          className="input input-search"
          placeholder="Pesquisar..."
          type="search"
        />
      </div>

      <div className="tb-spacer" />

      <div className="tb-env">
        <span className="pill pill-success" style={{ fontSize: 11 }}>
          Produção · APD ✓
        </span>
      </div>

      <div className="tb-divider" />

      <button className="btn btn-ghost" style={{ position: 'relative' }} aria-label="Notificações">
        <Icon name="bell" size={18} />
        <span
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--danger, #e53e3e)',
            border: '1.5px solid var(--surface, #fff)',
          }}
        />
      </button>

      <button className="btn btn-ghost" aria-label="Documentos">
        <Icon name="doc" size={18} />
      </button>

      <button className="btn btn-ghost" aria-label="Definições">
        <Icon name="cog" size={18} />
      </button>
    </header>
  )
}
