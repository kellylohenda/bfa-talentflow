'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STEPS = [
  { id: 1, title: 'Programa',      desc: 'Escolha do percurso' },
  { id: 2, title: 'Identificação', desc: 'Dados pessoais' },
  { id: 3, title: 'Académico',     desc: 'Formação e notas' },
  { id: 4, title: 'Motivação',     desc: 'Carta e ensaio curto' },
  { id: 5, title: 'Documentos',    desc: 'CV e histórico' },
  { id: 6, title: 'Revisão',       desc: 'Confirmar e submeter' },
]

const PROGRAMS = [
  { id: 'fbfa', name: 'Futuro BFA',          desc: '24 meses · trainee · contrato no fim · sede Luanda' },
  { id: 'bif',  name: 'Bolsa Internacional', desc: 'Mestrado em Portugal/Europa · cobertura integral · cláusula 5 anos' },
  { id: 'bnac', name: 'Bolsa Nacional',      desc: 'Licenciatura em universidade angolana · subsídio + propinas' },
  { id: 'lid',  name: 'Programa Liderança+', desc: 'Apenas colaboradores BFA · MBA executivo · 18 meses' },
]

const PROVINCIAS = ['Luanda','Benguela','Huambo','Huíla','Cabinda','Bié','Cuanza Norte','Cuanza Sul','Cunene','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire','Bengo','Cuando Cubango']

type FormData = {
  program: string; program2: string
  nome: string; genero: string; bi: string; dob: string
  email: string; tel: string; morada: string; provincia: string
  grau: string; curso: string; uni: string; anoFim: string; media: string; ingles: string
  motivacao: string; futuro: string
  cv: string | null; historico: string | null
  rgpd: boolean; novidades: boolean
}

const INIT: FormData = {
  program: '', program2: '',
  nome: '', genero: '', bi: '', dob: '', email: '', tel: '', morada: '', provincia: '',
  grau: '', curso: '', uni: '', anoFim: '', media: '', ingles: '',
  motivacao: '', futuro: '',
  cv: null, historico: null,
  rgpd: false, novidades: true,
}

export default function CandidaturaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState<number[]>([])
  const [d, setD] = useState<FormData>(INIT)
  const [ref, setRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (k: keyof FormData, v: string | boolean | null) => setD(prev => ({ ...prev, [k]: v }))

  const valid: Record<number, boolean> = {
    1: !!d.program,
    2: !!(d.nome && d.bi && d.email && d.tel && d.dob && d.provincia),
    3: !!(d.grau && d.curso && d.uni && d.media),
    4: d.motivacao.length >= 80,
    5: !!d.cv,
    6: d.rgpd,
  }

  const next = () => {
    setDone(prev => Array.from(new Set([...prev, step])))
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const prev = () => { setStep(s => s - 1); window.scrollTo({ top: 0 }) }

  const progName = PROGRAMS.find(p => p.id === d.program)?.name ?? ''

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/candidaturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
      if (!res.ok) throw new Error()
      const { ref: newRef } = await res.json()
      setRef(newRef)
      setDone(prev => [...prev, 6])
      setStep(7)
      window.scrollTo({ top: 0 })
    } catch {
      setSubmitError('Erro ao submeter. Verifica a tua ligação e tenta de novo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFAF9; color: #1A1A1A; font-family: Inter, system-ui, sans-serif; }
        .pub-top { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E1; }
        .pub-top-inner { max-width: 1240px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 32px; }
        .pub-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #1A1A1A; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
        .pub-logo { width: 32px; height: 32px; background: #1A1A1A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border-radius: 5px; }
        .pub-cta { display: inline-flex; align-items: center; padding: 10px 18px; background: #1A1A1A; color: #fff; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: background 120ms; }
        .pub-cta:hover { background: #FF7607; }
        .shell-main { max-width: 1200px; margin: 40px auto; padding: 0 32px 80px; display: grid; grid-template-columns: 300px 1fr; gap: 40px; align-items: start; }
        .stepper { position: sticky; top: 88px; background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 28px; }
        .stepper h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A8A87; font-weight: 600; margin-bottom: 20px; }
        .step-item { display: flex; gap: 12px; padding: 10px 0; cursor: pointer; align-items: flex-start; }
        .step-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: #F2F2F0; color: #8A8A87; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; border: 2px solid transparent; }
        .step-item.s-active .step-num { background: #FF7607; color: #fff; border-color: #FFDDB8; }
        .step-item.s-done .step-num { background: #fff; color: #FF7607; border-color: #FF7607; }
        .step-text b { display: block; font-size: 14px; color: #525252; font-weight: 500; }
        .step-item.s-active .step-text b { color: #1A1A1A; font-weight: 600; }
        .step-text span { font-size: 12px; color: #8A8A87; }
        .step-line { width: 2px; height: 12px; background: #E7E5E1; margin: 0 13px; }
        .progress-strip { height: 4px; background: #F2F2F0; border-radius: 2px; overflow: hidden; margin-top: 24px; }
        .progress-fill { height: 100%; background: #FF7607; transition: width 240ms; }
        .progress-text { margin-top: 8px; font-size: 11px; color: #8A8A87; display: flex; justify-content: space-between; }
        .form-card { background: #fff; border: 1px solid #E7E5E1; border-radius: 12px; padding: 40px 48px; }
        .form-head h1 { font-size: 28px; letter-spacing: -0.02em; font-weight: 600; margin-bottom: 6px; }
        .form-head p { font-size: 14px; color: #525252; margin-bottom: 32px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-full { grid-column: 1 / -1; }
        .field label { font-size: 12px; font-weight: 500; color: #525252; }
        .req { color: #FF7607; margin-left: 2px; }
        .field input, .field select, .field textarea { padding: 11px 13px; border: 1px solid #E7E5E1; border-radius: 8px; font-size: 14px; font-family: inherit; color: #1A1A1A; background: #fff; outline: none; transition: border-color 120ms, box-shadow 120ms; width: 100%; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #FF7607; box-shadow: 0 0 0 3px #FFF0E5; }
        .field textarea { resize: vertical; min-height: 120px; }
        .hint { font-size: 11px; color: #8A8A87; }
        .radio-group { display: flex; flex-direction: column; gap: 8px; }
        .radio-card { border: 1px solid #E7E5E1; border-radius: 10px; padding: 14px 16px; display: flex; gap: 12px; cursor: pointer; transition: border-color 120ms, background 120ms; }
        .radio-card:hover { border-color: #FF7607; }
        .radio-card.selected { border-color: #FF7607; background: #FFF8F2; }
        .radio-card input { margin-top: 3px; accent-color: #FF7607; }
        .radio-card .meta b { display: block; font-size: 14px; font-weight: 600; color: #1A1A1A; margin-bottom: 2px; }
        .radio-card .meta span { font-size: 12px; color: #525252; }
        .upload-zone { border: 2px dashed #E7E5E1; border-radius: 10px; padding: 28px; text-align: center; cursor: pointer; transition: border-color 120ms, background 120ms; display: block; }
        .upload-zone:hover { border-color: #FF7607; background: #FFF8F2; }
        .upload-zone .ttl { font-size: 14px; font-weight: 500; margin-top: 8px; }
        .upload-zone .sub { font-size: 12px; color: #8A8A87; margin-top: 4px; }
        .uploaded { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #F2F2F0; border-radius: 8px; font-size: 13px; margin-top: 8px; }
        .uploaded b { font-weight: 500; flex: 1; }
        .x-btn { background: none; border: none; color: #8A8A87; font-size: 18px; line-height: 1; cursor: pointer; }
        .consent { display: flex; gap: 12px; padding: 16px; background: #F2F2F0; border-radius: 8px; margin-top: 12px; }
        .consent input { margin-top: 3px; accent-color: #FF7607; flex-shrink: 0; }
        .consent p { font-size: 12px; color: #525252; line-height: 1.55; }
        .consent a { color: #FF7607; text-decoration: underline; }
        .form-actions { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E7E5E1; }
        .btn-back { background: none; border: 1px solid #E7E5E1; padding: 11px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #525252; cursor: pointer; font-family: inherit; }
        .btn-back:hover:not(:disabled) { background: #F2F2F0; color: #1A1A1A; }
        .btn-back:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-next { background: #FF7607; color: #fff; border: none; padding: 11px 22px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; }
        .btn-next:hover:not(:disabled) { background: #9C4500; }
        .btn-next:disabled { background: #F2F2F0; color: #B0AEA9; cursor: not-allowed; }
        .btn-submit { background: #1A1A1A; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; }
        .btn-submit:hover:not(:disabled) { background: #FF7607; }
        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
        .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 24px; }
        .review-section { padding: 18px 20px; background: #FAFAF9; border-radius: 8px; }
        .review-section h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #8A8A87; font-weight: 600; margin-bottom: 12px; }
        .review-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #E7E5E1; }
        .review-row:last-of-type { border: none; }
        .review-row span { color: #8A8A87; }
        .review-row b { color: #1A1A1A; font-weight: 500; }
        .review-edit { background: none; border: none; color: #FF7607; font-size: 12px; margin-top: 8px; cursor: pointer; font-weight: 500; font-family: inherit; }
        .success-wrap { text-align: center; padding: 64px 32px; }
        .success-icon { width: 80px; height: 80px; border-radius: 50%; background: #FFF0E5; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .success-wrap h1 { font-size: 32px; letter-spacing: -0.02em; font-weight: 600; margin-bottom: 12px; }
        .success-wrap p { font-size: 15px; color: #525252; max-width: 480px; margin: 0 auto 24px; line-height: 1.6; }
        .success-ref { display: inline-block; padding: 12px 20px; background: #F2F2F0; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-bottom: 24px; }
        .success-ref b { color: #FF7607; }
        @media (max-width: 900px) {
          .shell-main { grid-template-columns: 1fr; padding: 0 20px 60px; }
          .stepper { position: static; }
          .form-card { padding: 24px; }
          .form-grid { grid-template-columns: 1fr; }
          .review-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Topbar */}
      <div className="pub-top">
        <div className="pub-top-inner">
          <Link href="/programa" className="pub-brand">
            <div className="pub-logo">B</div>
            <div>BFA Talento <small style={{ fontWeight: 400, color: '#8A8A87', fontSize: 12 }}>· Candidatura 2026</small></div>
          </Link>
          <div style={{ marginLeft: 'auto' }}>
            <Link href="/programa" className="pub-cta" style={{ background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1' }}>← Voltar ao programa</Link>
          </div>
        </div>
      </div>

      {step === 7 ? (
        <div className="shell-main" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-card">
            <div className="success-wrap">
              <div className="success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF7607" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5 9-11" />
                </svg>
              </div>
              <h1>Candidatura submetida!</h1>
              <p>Obrigado, {d.nome.split(' ')[0] || 'candidato'}. Recebemos a tua candidatura ao programa <b>{progName}</b>. Enviámos uma confirmação para <b>{d.email}</b>.</p>
              <div className="success-ref">Referência · <b>{ref}</b></div>
              <p style={{ fontSize: 13 }}><b>Próximos passos:</b><br />Análise inicial em até 14 dias úteis. Podes acompanhar o estado no portal do candidato.</p>
              <Link href="/portal" className="pub-cta" style={{ marginTop: 24, padding: '12px 22px', display: 'inline-flex', background: '#FF7607' }}>Ver estado da candidatura →</Link>
              <br />
              <Link href="/programa" className="pub-cta" style={{ marginTop: 12, padding: '10px 20px', display: 'inline-flex', background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1' }}>Voltar ao programa</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="shell-main">
          {/* Stepper */}
          <div className="stepper">
            <h3>Candidatura · {STEPS.length} etapas</h3>
            {STEPS.map((s, i) => (
              <div key={s.id}>
                <div
                  className={`step-item ${step === s.id ? 's-active' : ''} ${done.includes(s.id) ? 's-done' : ''}`}
                  onClick={() => done.includes(s.id) && setStep(s.id)}
                  style={{ cursor: done.includes(s.id) ? 'pointer' : 'default' }}
                >
                  <div className="step-num">{done.includes(s.id) ? '✓' : s.id}</div>
                  <div className="step-text"><b>{s.title}</b><span>{s.desc}</span></div>
                </div>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
            <div className="progress-strip">
              <div className="progress-fill" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <div className="progress-text">
              <span>Etapa {step} de {STEPS.length}</span>
              <span>{Math.round(((step - 1) / (STEPS.length - 1)) * 100)}%</span>
            </div>
          </div>

          {/* Form */}
          <div className="form-card">
            {step === 1 && (
              <>
                <div className="form-head">
                  <h1>A que programa te queres candidatar?</h1>
                  <p>Podes seleccionar até dois programas em ordem de preferência. Avaliamos ambos com a mesma candidatura.</p>
                </div>
                <div className="radio-group">
                  {PROGRAMS.map(p => (
                    <label key={p.id} className={`radio-card ${d.program === p.id ? 'selected' : ''}`}>
                      <input type="radio" name="program" checked={d.program === p.id} onChange={() => set('program', p.id)} />
                      <div className="meta"><b>{p.name}</b><span>{p.desc}</span></div>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: '#525252', display: 'block', marginBottom: 6 }}>2ª preferência (opcional)</label>
                  <select style={{ width: '100%', padding: 11, border: '1px solid #E7E5E1', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#1A1A1A', background: '#fff', outline: 'none' }}
                    value={d.program2} onChange={e => set('program2', e.target.value)}>
                    <option value="">— Nenhuma —</option>
                    {PROGRAMS.filter(p => p.id !== d.program).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-head">
                  <h1>Identificação</h1>
                  <p>Os teus dados pessoais. Tudo encriptado e em conformidade com a Lei 22/11 (APD).</p>
                </div>
                <div className="form-grid">
                  <div className="field field-full"><label>Nome completo<span className="req">*</span></label><input type="text" placeholder="Como aparece no BI" value={d.nome} onChange={e => set('nome', e.target.value)} /></div>
                  <div className="field"><label>Nº do BI<span className="req">*</span></label><input type="text" placeholder="000000000LA000" value={d.bi} onChange={e => set('bi', e.target.value)} /></div>
                  <div className="field"><label>Data de nascimento<span className="req">*</span></label><input type="date" value={d.dob} onChange={e => set('dob', e.target.value)} /></div>
                  <div className="field"><label>Género</label>
                    <select value={d.genero} onChange={e => set('genero', e.target.value)}>
                      <option value="">—</option><option>Feminino</option><option>Masculino</option><option>Prefiro não dizer</option>
                    </select>
                  </div>
                  <div className="field"><label>Província de residência<span className="req">*</span></label>
                    <select value={d.provincia} onChange={e => set('provincia', e.target.value)}>
                      <option value="">—</option>
                      {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Email<span className="req">*</span></label><input type="email" placeholder="o.teu@email.com" value={d.email} onChange={e => set('email', e.target.value)} /></div>
                  <div className="field"><label>Telemóvel<span className="req">*</span></label><input type="tel" placeholder="+244 9XX XXX XXX" value={d.tel} onChange={e => set('tel', e.target.value)} /></div>
                  <div className="field field-full"><label>Morada</label><input type="text" placeholder="Rua, número, bairro, município" value={d.morada} onChange={e => set('morada', e.target.value)} /></div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-head">
                  <h1>Percurso académico</h1>
                  <p>A tua formação mais recente. Se ainda estás a estudar, indica a média actual.</p>
                </div>
                <div className="form-grid">
                  <div className="field"><label>Grau<span className="req">*</span></label>
                    <select value={d.grau} onChange={e => set('grau', e.target.value)}>
                      <option value="">—</option><option>Ensino médio</option><option>Licenciatura em curso</option><option>Licenciatura concluída</option><option>Mestrado</option>
                    </select>
                  </div>
                  <div className="field"><label>Curso<span className="req">*</span></label><input type="text" placeholder="Ex: Economia" value={d.curso} onChange={e => set('curso', e.target.value)} /></div>
                  <div className="field field-full"><label>Universidade<span className="req">*</span></label><input type="text" placeholder="Ex: Universidade Agostinho Neto" value={d.uni} onChange={e => set('uni', e.target.value)} /></div>
                  <div className="field"><label>Ano de conclusão (previsto)</label><input type="number" placeholder="2026" min="2020" max="2030" value={d.anoFim} onChange={e => set('anoFim', e.target.value)} /></div>
                  <div className="field"><label>Média final<span className="req">*</span></label><input type="number" placeholder="0–20" min="0" max="20" step="0.1" value={d.media} onChange={e => set('media', e.target.value)} /></div>
                  <div className="field field-full"><label>Nível de inglês</label>
                    <select value={d.ingles} onChange={e => set('ingles', e.target.value)}>
                      <option value="">—</option><option>Básico (A1–A2)</option><option>Intermédio (B1–B2)</option><option>Avançado (C1–C2)</option><option>Nativo</option>
                    </select>
                    <span className="hint">Necessário para os programas internacionais</span>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="form-head">
                  <h1>Conta-nos quem és</h1>
                  <p>Duas perguntas curtas. Sê genuíno — é o que mais conta.</p>
                </div>
                <div className="form-grid">
                  <div className="field field-full">
                    <label>Porque te queres candidatar a este programa?<span className="req">*</span></label>
                    <textarea rows={6} placeholder="Mínimo 80 caracteres. Conta-nos o que te motiva, o que esperas aprender e como esta oportunidade encaixa nos teus planos." value={d.motivacao} onChange={e => set('motivacao', e.target.value)} />
                    <span className="hint" style={{ color: d.motivacao.length >= 80 ? '#FF7607' : '#8A8A87' }}>{d.motivacao.length} / 80 caracteres mínimos</span>
                  </div>
                  <div className="field field-full">
                    <label>Onde te imaginas daqui a 5 anos?</label>
                    <textarea rows={5} placeholder="Opcional, mas valorizamos." value={d.futuro} onChange={e => set('futuro', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <div className="form-head">
                  <h1>Documentos de suporte</h1>
                  <p>Apenas dois ficheiros. Aceitamos PDF, DOCX e JPG até 10 MB cada.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#525252', display: 'block', marginBottom: 8 }}>Curriculum Vitae<span className="req">*</span></label>
                    {!d.cv ? (
                      <label className="upload-zone">
                        <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => set('cv', e.target.files?.[0]?.name ?? null)} />
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A8A87" strokeWidth="1.6" strokeLinecap="round"><path d="M12 4v12M6 11l6 6 6-6" /><path d="M4 21h16" /></svg>
                        <div className="ttl">Arrasta o ficheiro ou clica para escolher</div>
                        <div className="sub">PDF, DOCX · máx 10 MB</div>
                      </label>
                    ) : (
                      <div className="uploaded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF7607" strokeWidth="2"><path d="M6 3h9l5 5v13H6z" /></svg>
                        <b>{d.cv}</b>
                        <span style={{ color: '#8A8A87', fontSize: 12 }}>Pronto</span>
                        <button className="x-btn" onClick={() => set('cv', null)}>×</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#525252', display: 'block', marginBottom: 8 }}>Histórico académico (certidão de notas)</label>
                    {!d.historico ? (
                      <label className="upload-zone">
                        <input type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={e => set('historico', e.target.files?.[0]?.name ?? null)} />
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A8A87" strokeWidth="1.6" strokeLinecap="round"><path d="M12 4v12M6 11l6 6 6-6" /><path d="M4 21h16" /></svg>
                        <div className="ttl">Adicionar histórico</div>
                        <div className="sub">Opcional nesta fase · podes enviar depois</div>
                      </label>
                    ) : (
                      <div className="uploaded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF7607" strokeWidth="2"><path d="M6 3h9l5 5v13H6z" /></svg>
                        <b>{d.historico}</b>
                        <button className="x-btn" onClick={() => set('historico', null)}>×</button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <div className="form-head">
                  <h1>Revê e submete</h1>
                  <p>Confere os teus dados antes de enviar. Podes voltar a qualquer etapa.</p>
                </div>
                <div className="review-grid">
                  <div className="review-section">
                    <h4>Programa</h4>
                    <div className="review-row"><span>1ª preferência</span><b>{progName || '—'}</b></div>
                    {d.program2 && <div className="review-row"><span>2ª preferência</span><b>{PROGRAMS.find(p => p.id === d.program2)?.name}</b></div>}
                    <button className="review-edit" onClick={() => setStep(1)}>Editar →</button>
                  </div>
                  <div className="review-section">
                    <h4>Identificação</h4>
                    <div className="review-row"><span>Nome</span><b>{d.nome}</b></div>
                    <div className="review-row"><span>Email</span><b>{d.email}</b></div>
                    <div className="review-row"><span>Província</span><b>{d.provincia}</b></div>
                    <button className="review-edit" onClick={() => setStep(2)}>Editar →</button>
                  </div>
                  <div className="review-section">
                    <h4>Académico</h4>
                    <div className="review-row"><span>Curso</span><b>{d.curso}</b></div>
                    <div className="review-row"><span>Universidade</span><b>{d.uni}</b></div>
                    <div className="review-row"><span>Média</span><b>{d.media}/20</b></div>
                    <button className="review-edit" onClick={() => setStep(3)}>Editar →</button>
                  </div>
                  <div className="review-section">
                    <h4>Documentos</h4>
                    <div className="review-row"><span>CV</span><b>{d.cv || '—'}</b></div>
                    <div className="review-row"><span>Histórico</span><b>{d.historico || 'Não enviado'}</b></div>
                    <button className="review-edit" onClick={() => setStep(5)}>Editar →</button>
                  </div>
                </div>
                <div className="consent">
                  <input type="checkbox" id="rgpd" checked={d.rgpd} onChange={e => set('rgpd', e.target.checked)} />
                  <p><label htmlFor="rgpd">Confirmo que os dados fornecidos são verdadeiros e autorizo o BFA a tratar a minha informação ao abrigo da <a href="#">Política de Privacidade</a> e da Lei 22/11 da APD.</label></p>
                </div>
                <div className="consent">
                  <input type="checkbox" id="news" checked={d.novidades} onChange={e => set('novidades', e.target.checked)} />
                  <p><label htmlFor="news">Quero receber novidades sobre o programa e oportunidades futuras.</label></p>
                </div>
              </>
            )}

            {submitError && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 16 }}>{submitError}</div>
            )}
            <div className="form-actions">
              <button className="btn-back" onClick={prev} disabled={step === 1}>← Voltar</button>
              {step < 6
                ? <button className="btn-next" onClick={next} disabled={!valid[step]}>Continuar →</button>
                : <button className="btn-submit" onClick={handleSubmit} disabled={!valid[6] || submitting}>{submitting ? 'A enviar…' : 'Submeter candidatura'}</button>
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
