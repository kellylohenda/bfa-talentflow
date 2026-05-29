import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Briefcase, Calendar, Info, Clock } from 'lucide-react';
import { useState } from 'react';
import { index } from '@/routes/candidaturas';
import type { Application } from '@/types';

type Props = { candidatura: Application };

export default function CandidaturasShow({ candidatura }: Props) {
    const [notes, setNotes] = useState(candidatura.observacoes || '');
    const initials = candidatura.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <Head title={`Candidatura: ${candidatura.name}`} />

            <div className="section" style={{ padding: '24px 32px 60px' }}>
                <div className="page-head" style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Link href={index().url} className="btn btn-ghost" style={{ padding: 10 }}>
                            <ArrowLeft style={{ width: 18, height: 18 }} />
                        </Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ 
                                width: 56, height: 56, borderRadius: 12, 
                                background: 'linear-gradient(135deg, #FF7607, #FF9B45)', 
                                color: '#fff', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', fontSize: 20, fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(255, 118, 7, 0.2)'
                            }}>
                                {initials}
                            </div>
                            <div>
                                <h1 className="page-title" style={{ fontSize: 28, marginBottom: 2 }}>{candidatura.name}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="pill pill-info" style={{ textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em', fontWeight: 700 }}>
                                        {candidatura.stage}
                                    </span>
                                    <span className="muted" style={{ fontSize: 13 }}>ID: {candidatura.application_ref || 'BFA-' + (1000 + (candidatura.id % 9000))}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
                    
                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        
                        {/* Biografic Info */}
                        <div className="card">
                            <div className="card-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Info style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                                <span className="card-title">Informação Pessoal</span>
                            </div>
                            <div className="card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                                <div className="field-group">
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Email</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                                        <Mail style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        {candidatura.email}
                                    </div>
                                </div>
                                <div className="field-group">
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Telefone</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                                        <Phone style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        {candidatura.phone || '—'}
                                    </div>
                                </div>
                                <div className="field-group">
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Gênero / BI</label>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{candidatura.tipo || '—'}</div>
                                </div>
                                <div className="field-group">
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Localização</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                                        <MapPin style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        {candidatura.university?.name || '—'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="card">
                            <div className="card-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <GraduationCap style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                                <span className="card-title">Percurso Académico</span>
                            </div>
                            <div className="card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                                <div className="field-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Universidade / Instituição</label>
                                    <div style={{ fontSize: 15, fontWeight: 600 }}>{candidatura.university?.name || '—'}</div>
                                </div>
                                <div className="field-group">
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Curso</label>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{candidatura.tipo || '—'}</div>
                                </div>
                                <div className="field-group">
                                    <label className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Grau / Nível de Graduação</label>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{candidatura.observacoes || '—'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Motivation / Description */}
                        <div className="card">
                            <div className="card-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Briefcase style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                                <span className="card-title">Motivação e Descrição</span>
                            </div>
                            <div className="card-pad">
                                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-2)', background: 'var(--surface-sunken)', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
                                    {candidatura.observacoes || 'Nenhuma motivação ou observação fornecida pelo candidato.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Side */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Metadados</span>
                            </div>
                            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="row-between">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Briefcase style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        <span className="muted" style={{ fontSize: 13 }}>Programa</span>
                                    </div>
                                    <b style={{ fontSize: 13 }}>{candidatura.program?.name || '—'}</b>
                                </div>
                                <div className="row-between">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Calendar style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        <span className="muted" style={{ fontSize: 13 }}>Submetido em</span>
                                    </div>
                                    <b style={{ fontSize: 13 }}>{new Date(candidatura.created_at).toLocaleDateString('pt-PT')}</b>
                                </div>
                                <div className="row-between">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Clock style={{ width: 14, height: 14, color: 'var(--text-3)' }} />
                                        <span className="muted" style={{ fontSize: 13 }}>Última Actualização</span>
                                    </div>
                                    <b style={{ fontSize: 13 }}>{new Date(candidatura.updated_at || candidatura.created_at).toLocaleDateString('pt-PT')}</b>
                                </div>
                            </div>
                            <div style={{ padding: '0 24px 24px' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '12px 0', fontSize: 13 }}
                                    onClick={() => alert('Funcionalidade de gestão de candidatura em desenvolvimento.')}
                                >
                                    Gerir Candidatura
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    style={{ width: '100%', marginTop: 8, padding: '10px 0', fontSize: 12 }}
                                    onClick={() => alert('Descarga de CV em desenvolvimento.')}
                                >
                                    Descarregar CV (PDF)
                                </button>
                            </div>
                        </div>
                        
                        <div className="card" style={{ background: 'var(--surface-sunken)', borderStyle: 'dashed' }}>
                            <div className="card-pad" style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>Zona de Notas Internas</p>
                                <textarea 
                                    placeholder="Adicionar nota..." 
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{ width: '100%', background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: 8, fontSize: 12, minHeight: 80, outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

CandidaturasShow.layout = {
    breadcrumbs: [{ title: 'Candidaturas' }],
};
