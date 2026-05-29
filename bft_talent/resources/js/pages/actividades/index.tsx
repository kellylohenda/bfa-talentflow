import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { index } from '@/routes/actividades';
import { inscrever } from '@/routes/api/v1/actividades';
import type { VolunteerActivity } from '@/types';

type Props = { actividades: VolunteerActivity[] };

export default function ActividadesIndex({ actividades }: Props) {
    return (
        <>
            <Head title="Actividades" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Actividades de Voluntariado</h1>
                        <p className="page-subtitle">Catálogo de actividades disponíveis</p>
                    </div>
                </div>

                <div className="grid cols-3">
                    {actividades.map((a) => (
                        <div key={a.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <h3 style={{ fontWeight: 500 }}>{a.title}</h3>
                                    <span className="pill pill-info" style={{ textTransform: 'capitalize' }}>{a.area}</span>
                                </div>
                                {a.description && (
                                    <p style={{ fontSize: 14, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.description}</p>
                                )}
                                <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-3)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Calendar size={12} />
                                        {new Date(a.date).toLocaleDateString('pt-PT')}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={12} /> {a.total_horas}h
                                    </span>
                                    {a.local && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <MapPin size={12} /> {a.local}
                                        </span>
                                    )}
                                    {a.vagas !== null && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Users size={12} /> {a.vagas} vagas
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ marginTop: 8, width: '100%' }}
                                    onClick={() => router.post(inscrever.url(a.id))}
                                >
                                    Inscrever-me
                                </button>
                            </div>
                        </div>
                    ))}
                    {actividades.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                            Nenhuma actividade disponível de momento.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ActividadesIndex.layout = () => ({
    breadcrumbs: [{ title: 'Actividades', href: index().url }],
});
