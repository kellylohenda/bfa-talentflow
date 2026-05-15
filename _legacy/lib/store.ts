import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'candidaturas.json')

export interface CandidaturaRecord {
  ref: string
  email: string
  nome: string
  program: string
  program2?: string
  status: 'pendente' | 'aprovada' | 'recusada'
  submittedAt: string
  bi: string
  dob: string
  genero: string
  tel: string
  morada: string
  provincia: string
  grau: string
  curso: string
  uni: string
  anoFim?: string
  media: string
  ingles?: string
  motivacao: string
  futuro?: string
  cv?: string
  historico?: string
}

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
}

export function getAll(): CandidaturaRecord[] {
  ensureFile()
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export function getByRef(ref: string): CandidaturaRecord | null {
  return getAll().find(c => c.ref === ref) ?? null
}

export function create(record: CandidaturaRecord): void {
  ensureFile()
  const all = getAll()
  all.unshift(record)
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2))
}

export function updateStatus(ref: string, status: 'aprovada' | 'recusada'): CandidaturaRecord | null {
  ensureFile()
  const all = getAll()
  const idx = all.findIndex(c => c.ref === ref)
  if (idx < 0) return null
  all[idx] = { ...all[idx], status }
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2))
  return all[idx]
}
