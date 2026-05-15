import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/agenda';
import type { Evento } from '@/types';

type Props = { eventos: Evento[]; mesAtual: string };

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function AgendaIndex({ eventos, mesAtual }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

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

    function getEventsForDay(day: number) {
        const dateStr = new Date(year, month, day).toDateString();
        return eventos.filter((e) => new Date(e.data_inicio).toDateString() === dateStr);
    }

    return (
        <>
            <Head title="Agenda" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Agenda" description="Calendário de eventos e actividades" />

                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {monthNames[month]} {year}
                            </CardTitle>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" onClick={prevMonth}>&lt;</Button>
                                <Button variant="outline" size="sm" onClick={nextMonth}>&gt;</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                                <div key={d} className="py-1 text-xs font-medium text-muted-foreground">{d}</div>
                            ))}
                            {emptyDays.map((i) => <div key={`e${i}`} />)}
                            {days.map((day) => {
                                const hasEvent = eventDates.has(new Date(year, month, day).toDateString());
                                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                                return (
                                    <div
                                        key={day}
                                        className={`rounded-md py-1.5 text-sm ${
                                            isToday ? 'bg-primary font-bold text-primary-foreground' : ''
                                        } ${hasEvent ? 'font-medium text-primary' : ''}`}
                                    >
                                        <span>{day}</span>
                                        {hasEvent && <div className="mx-auto mt-0.5 h-1 w-1 rounded-full bg-primary" />}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Eventos do Mês</h3>
                    {eventos.map((e) => (
                        <Card key={e.id}>
                            <CardContent className="flex items-center gap-4 pt-6">
                                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10">
                                    <span className="text-lg font-bold text-primary">
                                        {new Date(e.data_inicio).getDate()}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {monthNames[new Date(e.data_inicio).getMonth()].slice(0, 3)}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{e.titulo}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(e.data_inicio).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {e.local && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {e.local}
                                            </span>
                                        )}
                                        {e.vagas && (
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {e.vagas} vagas
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Badge variant={e.status === 'confirmado' ? 'default' : 'secondary'}>{e.status}</Badge>
                            </CardContent>
                        </Card>
                    ))}
                    {eventos.length === 0 && (
                        <div className="py-10 text-center text-sm text-muted-foreground">Nenhum evento este mês.</div>
                    )}
                </div>
            </div>
        </>
    );
}

AgendaIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Agenda', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
