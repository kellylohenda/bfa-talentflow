'use client'

import { ReactNode, useEffect } from 'react'
import Icon from './Icon'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  width?: string | number
}

export default function Modal({
  title,
  children,
  onClose,
  footer,
  width = 720,
}: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Fechar">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
