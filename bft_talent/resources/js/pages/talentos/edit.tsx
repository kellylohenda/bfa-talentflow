import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { show, update } from '@/routes/talentos';
import type { Department, Mentor, Talent, Program, University } from '@/types';

type Props = {
    talent: Talent;
    programs: Program[];
    universities: University[];
    departments: Department[];
    mentors: Mentor[];
};

export default function TalentosEdit({ talent, programs, universities, departments, mentors }: Props) {
    console.log('Talent Edit Data:', talent);
    const talentId = talent.id || (talent as any).talento_id;

    const { data, setData, patch, processing, errors } = useForm({
        name: talent.name,
        email: talent.email ?? '',
        status: talent.status,
        program_id: String(talent.program?.id ?? ''),
        university_id: String(talent.university?.id ?? ''),
        department_id: String(talent.department?.id ?? ''),
        mentor_user_id: String(talent.mentor?.id ?? ''),
        stipend: talent.stipend ?? '',
        perf: String(talent.perf ?? ''),
        risk_score: talent.risk_score ?? '',
        start_date: talent.start_date ?? '',
        end_date: talent.end_date ?? '',
        observacoes: talent.observacoes ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (talentId) {
            patch(update(talentId).url);
        }
    }

    return (
        <>
            <Head title={`Editar — ${talent.name}`} />

            <div className="section">
                <div className="page-head">
                    <div className="row" style={{ gap: 16 }}>
                        <Link href={talentId ? show(talentId).url : '#'} className="btn btn-ghost btn-sm">
                            <ArrowLeft style={{ width: 14, height: 14 }} />
                        </Link>
                        <div>
                            <h1 className="page-title">Editar Perfil</h1>
                            <p className="page-subtitle">{talent.talent_code} &middot; {talent.name}</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ maxWidth: 800 }}>
                    <form onSubmit={submit}>
                        <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            
                            {/* ── Informação Básica ── */}
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label">Nome Completo</label>
                                    <input 
                                        className="input" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        required
                                    />
                                    {errors.name && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">E-mail Corporativo</label>
                                    <input 
                                        className="input" 
                                        type="email"
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)} 
                                    />
                                    {errors.email && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.email}</span>}
                                </div>
                            </div>

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label">Estado do Talento</label>
                                    <select className="input select" value={data.status} onChange={e => setData('status', e.target.value as any)}>
                                        <option value="activo">Activo</option>
                                        <option value="suspenso">Suspenso</option>
                                        <option value="concluido">Concluído</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                    {errors.status && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.status}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Programa</label>
                                    <select className="input select" value={data.program_id} onChange={e => setData('program_id', e.target.value)}>
                                        <option value="">Seleccionar programa</option>
                                        {programs.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.program_id && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.program_id}</span>}
                                </div>
                            </div>

                            {/* ── Institucional ── */}
                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label">Universidade / Instituição</label>
                                    <select className="input select" value={data.university_id} onChange={e => setData('university_id', e.target.value)}>
                                        <option value="">Seleccionar instituição</option>
                                        {universities.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                    {errors.university_id && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.university_id}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Departamento Alocado</label>
                                    <select className="input select" value={data.department_id} onChange={e => setData('department_id', e.target.value)}>
                                        <option value="">Seleccionar departamento</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    {errors.department_id && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.department_id}</span>}
                                </div>
                            </div>

                            <div className="grid cols-2">
                                <div className="form-group">
                                    <label className="form-label">Mentor Responsável</label>
                                    <select className="input select" value={data.mentor_user_id} onChange={e => setData('mentor_user_id', e.target.value)}>
                                        <option value="">Seleccionar mentor</option>
                                        {mentors.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                    {errors.mentor_user_id && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.mentor_user_id}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bolsa Mensal (AOA)</label>
                                    <input 
                                        className="input" 
                                        type="number"
                                        value={data.stipend} 
                                        onChange={e => setData('stipend', e.target.value)} 
                                    />
                                    {errors.stipend && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.stipend}</span>}
                                </div>
                            </div>

                            {/* ── Performance ── */}
                            <div className="grid cols-3">
                                <div className="form-group">
                                    <label className="form-label">Performance (%)</label>
                                    <input 
                                        className="input" 
                                        type="number"
                                        min="0" max="100"
                                        value={data.perf} 
                                        onChange={e => setData('perf', e.target.value)} 
                                    />
                                    {errors.perf && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.perf}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Score de Risco (0-100)</label>
                                    <input 
                                        className="input" 
                                        type="number"
                                        step="0.01"
                                        value={data.risk_score} 
                                        onChange={e => setData('risk_score', e.target.value)} 
                                    />
                                    {errors.risk_score && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.risk_score}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Data Prevista de Fim</label>
                                    <input 
                                        className="input" 
                                        type="date"
                                        value={data.end_date} 
                                        onChange={e => setData('end_date', e.target.value)} 
                                    />
                                    {errors.end_date && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.end_date}</span>}
                                </div>
                            </div>

                            {/* ── Observações ── */}
                            <div className="form-group">
                                <label className="form-label">Observações Internas</label>
                                <textarea 
                                    className="input" 
                                    style={{ height: 100, paddingTop: 8 }}
                                    value={data.observacoes} 
                                    onChange={e => setData('observacoes', e.target.value)} 
                                />
                                {errors.observacoes && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors.observacoes}</span>}
                            </div>

                        </div>
                        <div className="modal-foot">
                            <Link href={show(talent.id).url} className="btn btn-ghost">
                                <X size={14} /> Cancelar
                            </Link>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                <Save size={14} /> Guardar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

TalentosEdit.layout = {
    breadcrumbs: [{ title: 'Talentos' }],
};
