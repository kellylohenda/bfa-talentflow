import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Pencil, 
    AlertCircle, 
    CheckCircle2, 
    FileText, 
    Download, 
    Upload as UploadIcon,
    Trash2,
    Calendar,
    Users,
    TrendingUp,
    CircleDollarSign,
    Clock,
    Trophy,
    GraduationCap,
    Building2,
    Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { index, edit as editRoute } from '@/routes/talentos';
import type { Talent, Program, University, Department, Mentor, Document } from '@/types';

type Props = {
    talent: Talent & { documents?: Document[] };
    canEdit: boolean;
};

export default function TalentosShow({ talent, canEdit }: Props) {
    const [uploading, setUploading] = useState(false);

    const talentId = talent?.id;
    const riskScore = parseFloat(String(talent?.risk_score ?? '0'));
    const riskTone = riskScore >= 0.6 ? 'danger' : riskScore >= 0.3 ? 'warn' : 'success';

    const fields = [
        { key: 'email', label: 'E-mail' },
        { key: 'program', label: 'Programa' },
        { key: 'university', label: 'Universidade' },
        { key: 'department', label: 'Departamento' },
        { key: 'mentor', label: 'Mentor' },
        { key: 'stipend', label: 'Bolsa' },
        { key: 'perf', label: 'Performance' },
        { key: 'start_date', label: 'Data Início' },
    ];
    const filledFields = talent ? fields.filter(f => talent[f.key as keyof Talent]) : [];
    const missingFields = talent ? fields.filter(f => !talent[f.key as keyof Talent]) : fields;
    const completeness = Math.round((filledFields.length / fields.length) * 100);

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
        name: '',
        category: 'identidade',
        owner_type: 'App\\Models\\Talent',
        owner_id: talentId ?? 0,
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/v1/documentos', {
            onSuccess: () => {
                setUploading(false);
                reset();
            },
            forceFormData: true,
        });
    };

    if (!talent) {
return <div className="card card-pad">Erro: Talento não encontrado.</div>;
}

    return (
        <>
            <Head title={`Perfil: ${talent.name}`} />

            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={index().url} className="btn btn-ghost btn-sm">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="page-title">{talent.name}</h1>
                            <p className="page-subtitle">{talent.talent_code} &middot; {talent.kind === 'bolseiro' ? 'Bolseiro' : 'Estagiário'}</p>
                        </div>
                    </div>
                    <div className="page-actions">
                        {canEdit && (
                            <Link href={editRoute(talentId).url} className="btn btn-primary">
                                <Pencil size={14} /> Editar Perfil
                            </Link>
                        )}
                        <span className={`pill ${talent.status === 'activo' ? 'pill-success' : talent.status === 'concluido' ? 'pill-info' : talent.status === 'suspenso' ? 'pill-warn' : 'pill-danger'}`}>
                             {talent.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="grid cols-4" style={{ marginBottom: 24 }}>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--primary)' }}><Briefcase size={18} /></div>
                        <div className="kpi-label">Tipo de Talento</div>
                        <div className="kpi-value">{talent.kind === 'bolseiro' ? 'Bolseiro' : 'Estagiário'}</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--success)' }}><TrendingUp size={18} /></div>
                        <div className="kpi-label">Performance</div>
                        <div className="kpi-value">{(talent.perf ?? 0)}%</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-icon" style={{ color: `var(--${riskTone})` }}><AlertCircle size={18} /></div>
                        <div className="kpi-label">Risco de Retenção</div>
                        <div className="kpi-value">{riskScore > 0 ? `${Math.round(riskScore * 100)}%` : 'Baixo'}</div>
                    </div>
                     <div className="kpi">
                        <div className="kpi-icon" style={{ color: 'var(--info)' }}><CircleDollarSign size={18} /></div>
                        <div className="kpi-label">Bolsa Mensal</div>
                        <div className="kpi-value">{talent.stipend ? `${parseFloat(talent.stipend).toLocaleString('pt-AO')} Kz` : '—'}</div>
                    </div>
                </div>

                <div className="grid cols-3" style={{ gap: 24 }}>
                    <div className="col-span-2">
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Documentação Académica e Profissional</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => setUploading(!uploading)}>
                                    <UploadIcon size={14} /> Carregar Novo
                                </button>
                            </div>
                            
                            {uploading && (
                                <div className="card-pad" style={{ background: '#F9FAFB', borderBottom: '1px solid #F0F0F0' }}>
                                    <form onSubmit={handleUpload} className="grid cols-3" style={{ gap: 12, alignItems: 'end' }}>
                                        <div className="field">
                                            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Ficheiro</label>
                                            <input type="file" onChange={e => setData('file', e.target.files?.[0] || null)} style={{ fontSize: 12 }} />
                                        </div>
                                        <div className="field">
                                            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Nome</label>
                                            <input className="input" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Ex: BI, Certificado..." />
                                        </div>
                                        <div className="row" style={{ gap: 8 }}>
                                            <button type="submit" className="btn btn-primary btn-sm" disabled={processing || !data.file}>Submeter</button>
                                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setUploading(false)}>Cancelar</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="table-wrap">
                                <table className="tbl">
                                    <thead>
                                        <tr>
                                            <th>Nome do Ficheiro</th>
                                            <th>Categoria</th>
                                            <th>Data</th>
                                            <th style={{ textAlign: 'right' }}>Acções</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {talent.documents?.map(doc => (
                                            <tr key={doc.id}>
                                                <td>
                                                    <div className="row" style={{ gap: 8 }}>
                                                        <FileText size={16} style={{ color: 'var(--info)' }} />
                                                        <span style={{ fontWeight: 500 }}>{doc.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="pill pill-neutral">{doc.category}</span></td>
                                                <td className="muted">{new Date(doc.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="row" style={{ justifyContent: 'flex-end', gap: 4 }}>
                                                        <a href={doc.storage_path ?? undefined} target="_blank" className="btn btn-ghost btn-sm"><Download size={14} /></a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!talent.documents || talent.documents.length === 0) && (
                                            <tr>
                                                <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: 'var(--text-4)' }}>
                                                    Nenhum arquivo anexado a este perfil.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Rotações */}
                        <div className="card" style={{ marginTop: 24 }}>
                            <div className="card-head">
                                <span className="card-title">Plano de Rotações</span>
                            </div>
                            <div className="table-wrap">
                                <table className="tbl">
                                    <thead>
                                        <tr>
                                            <th>Unidade Orgânica</th>
                                            <th>Responsável</th>
                                            <th>Período</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {talent.rotations?.map((r:any) => (
                                            <tr key={r.id}>
                                                <td><div className="row" style={{ gap: 8 }}><Building2 size={14} /> {r.department?.name}</div></td>
                                                <td>{r.supervisor}</td>
                                                <td className="muted">{r.start_date} - {r.end_date}</td>
                                                <td><span className={`pill ${r.status === 'activa' ? 'pill-success' : 'pill-neutral'}`}>{r.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card">
                            <div className="card-head">
                                <span className="card-title">Detalhes Institucionais</span>
                            </div>
                            <div className="card-pad">
                                <div className="meta-row">
                                    <GraduationCap size={16} />
                                    <div>
                                        <label>Universidade</label>
                                        <p>{talent.university?.name ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="divider" />
                                <div className="meta-row">
                                    <Users size={16} />
                                    <div>
                                        <label>Mentor Atribuído</label>
                                        <p>{talent.mentor?.name ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="divider" />
                                <div className="meta-row">
                                    <Clock size={16} />
                                    <div>
                                        <label>Data de Início</label>
                                        <p>{talent.start_date ? new Date(talent.start_date).toLocaleDateString() : '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: 24 }}>
                             <div className="card-head">
                                <span className="card-title">Completude do Dossier</span>
                            </div>
                            <div className="card-pad">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div className="bar-track" style={{ flex: 1 }}>
                                        <div className="bar-fill" style={{ width: `${completeness}%`, background: completeness === 100 ? 'var(--success)' : 'var(--primary)' }} />
                                    </div>
                                    <b style={{ fontSize: 13 }}>{completeness}%</b>
                                </div>
                                {missingFields.length > 0 ? (
                                    <div style={{ color: 'var(--warn)', fontSize: 11, fontWeight: 600 }}>
                                        PENDENTE: {missingFields.length} campos obrigatórios.
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--success)', fontSize: 11, fontWeight: 600 }}>
                                        DOSSIER COMPLETO E VERIFICADO
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .meta-row { display: flex; gap: 14px; align-items: flex-start; padding: 4px 0; }
                .meta-row svg { margin-top: 4px; color: var(--text-4); }
                .meta-row label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-3); margin-bottom: 2px; }
                .meta-row p { margin: 0; font-size: 14px; font-weight: 500; color: var(--text); }
            `}</style>
        </>
    );
}

TalentosShow.layout = {
    breadcrumbs: [{ title: 'Talentos' }],
};
