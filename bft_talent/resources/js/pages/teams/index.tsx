import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus } from 'lucide-react';
import CreateTeamModal from '@/components/create-team-modal';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { edit, index } from '@/routes/teams';
import type { Team } from '@/types';

type Props = {
    teams: Team[];
};

export default function TeamsIndex({ teams }: Props) {
    return (
        <>
            <Head title="Equipas" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Equipas</h1>
                        <p className="page-subtitle">Gerir equipas e membros</p>
                    </div>
                    <div className="page-actions">
                        <CreateTeamModal>
                            <button className="btn btn-primary" data-test="teams-new-team-button">
                                <Plus size={14} /> Nova equipa
                            </button>
                        </CreateTeamModal>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            data-test="team-row"
                            className="card"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div className="card-pad" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontWeight: 500 }}>
                                            {team.name}
                                        </span>
                                        {team.isPersonal ? (
                                            <Badge variant="secondary">
                                                Pessoal
                                            </Badge>
                                        ) : null}
                                    </div>
                                    <span className="muted">
                                        {team.roleLabel}
                                    </span>
                                </div>

                                <TooltipProvider>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {team.role === 'member' ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={edit(team.slug)}
                                                        className="btn btn-ghost btn-sm"
                                                        data-test="team-view-button"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ver equipa</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={edit(team.slug)}
                                                        className="btn btn-ghost btn-sm"
                                                        data-test="team-edit-button"
                                                    >
                                                        <Pencil size={14} />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Editar equipa</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TooltipProvider>
                            </div>
                        </div>
                    ))}

                    {teams.length === 0 ? (
                        <p className="muted" style={{ padding: 32, textAlign: 'center' }}>
                            Ainda não pertence a nenhuma equipa.
                        </p>
                    ) : null}
                </div>
            </div>
        </>
    );
}

TeamsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Equipas',
            href: index(),
        },
    ],
};
