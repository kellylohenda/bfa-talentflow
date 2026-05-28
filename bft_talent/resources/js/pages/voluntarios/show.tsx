import { Head, Link } from '@inertiajs/react';
import { index, show } from '@/routes/voluntarios';
import type { Volunteer } from '@/types';

type Props = { voluntario: Volunteer };

const statusPill: Record<string, string> = {
    activo: 'pill-success',
    inactivo: 'pill-neutral',
    suspenso: 'pill-danger',
};

export default function VoluntariosShow({ voluntario }: Props) {
    return (
        <>
            <Head title={voluntario.nome} />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">{voluntario.nome}</h1>
                        <p className="page-subtitle">{voluntario.volunteer_code}</p>
                    </div>
                    <div className="page-actions">
                        <span className={`pill ${statusPill[voluntario.status] ?? 'pill-neutral'}`}>
                            {voluntario.status}
                        </span>
                        <Link href={index().url} className="btn btn-ghost btn-sm">← Voltar</Link>
                    </div>
                </div>
                <div className="card" style={{ maxWidth: 640 }}>
                    <div className="card-head">
                        <span className="card-title">Perfil</span>
                    </div>
                    <div className="card-pad">
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span className="muted">E-mail</span>
                            <span>{voluntario.email}</span>
                        </div>
                        {voluntario.phone && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                <span className="muted">Telefone</span>
                                <span>{voluntario.phone}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span className="muted">Área de Actuação</span>
                            <span>{voluntario.area_actuacao}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span className="muted">Total de Horas</span>
                            <span style={{ fontWeight: 500 }}>{parseFloat(voluntario.total_horas).toFixed(0)}h</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span className="muted">Data de Início</span>
                            <span>{new Date(voluntario.data_inicio).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {voluntario.mentor && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                <span className="muted">Mentor</span>
                                <span>{voluntario.mentor.name}</span>
                            </div>
                        )}
                        {voluntario.motivacao && (
                            <div style={{ paddingTop: 12 }}>
                                <span className="muted">Motivação</span>
                                <p style={{ marginTop: 4 }}>{voluntario.motivacao}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

VoluntariosShow.layout = {
    breadcrumbs: [{ title: 'Voluntários' }],
};
