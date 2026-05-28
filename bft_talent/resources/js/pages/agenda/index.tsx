import { Head } from '@inertiajs/react';
import { Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { index } from '@/routes/agenda';
import type { Evento } from '@/types';

type Props = { eventos: Evento[]; mesAtual: string };

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const statusTone: Record<string, string> = {
    confirmado: 'success',
    planeado: 'info',
    cancelado: 'danger',
    concluido: 'neutral',
};

export default function AgendaIndex({ eventos, mesAtual }: Props) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(() => new Date(mesAtual ?? today));

    function prevMonth() {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }

    function nextMonth() {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    const eventDates = new Set(
        eventos.map((e) => new Date(e.data_inicio).toDateString()),
    );

    return (
        <>
            <Head title="Agenda" />
            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Agenda</h1>
                        <p className="page-subtitle">Calendário de eventos e actividades</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-head">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 className="card-title">{monthNames[month]} {year}</h3>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <button className="btn btn-ghost btn-sm" onClick={prevMonth}>&lt;</button>
                                <button className="btn btn-ghost btn-sm" onClick={nextMonth}>&gt;</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-pad">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontSize: 14 }}>
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                                <div key={d} style={{ padding: 4, fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}>{d}</div>
                            ))}
                            {emptyDays.map((i) => <div key={`e${i}`} />)}
                            {days.map((day) => {
                                const hasEvent = eventDates.has(new Date(year, month, day).toDateString());
                                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

                                return (
                                    <div
                                        key={day}
                                        style={{
                                            padding: '6px 0',
                                            borderRadius: 6,
                                            fontWeight: isToday ? 700 : hasEvent ? 500 : undefined,
                                            background: isToday ? 'var(--primary)' : undefined,
                                            color: isToday ? 'var(--primary-fg)' : hasEvent ? 'var(--primary)' : undefined,
                                        }}
                                    >
                                        <span>{day}</span>
                                        {hasEvent && <div style={{ margin: '2px auto 0', width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-3)' }}>Eventos do Mês</h3>
                    {eventos.map((e) => (
                        <div key={e.id} className="card">
                            <div className="card-pad" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ display: 'flex', width: 48, height: 48, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--primary-muted)' }}>
                                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
                                        {new Date(e.data_inicio).getDate()}
                                    </span>
                                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                                        {monthNames[new Date(e.data_inicio).getMonth()].slice(0, 3)}
                                    </span>
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>{e.titulo}</div>
                                    <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-3)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} />
                                            {new Date(e.data_inicio).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {e.local && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <MapPin size={12} /> {e.local}
                                            </span>
                                        )}
                                        {e.vagas && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Users size={12} /> {e.vagas} vagas
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`pill pill-${statusTone[e.status] ?? 'neutral'}`}>{e.status}</span>
                            </div>
                        </div>
                    ))}
                    {eventos.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: 'var(--text-3)' }}>Nenhum evento este mês.</div>
                    )}
                </div>
            </div>
        </>
    );
}

AgendaIndex.layout = () => ({
    breadcrumbs: [{ title: 'Agenda', href: index().url }],
});
