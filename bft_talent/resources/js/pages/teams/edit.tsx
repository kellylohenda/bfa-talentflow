import { Form, Head, router } from '@inertiajs/react';
import { ChevronDown, Mail, UserPlus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
import DeleteTeamModal from '@/components/delete-team-modal';
import InviteMemberModal from '@/components/invite-member-modal';
import RemoveMemberModal from '@/components/remove-member-modal';
import { BfaAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { edit, index, update } from '@/routes/teams';
import { update as updateMember } from '@/routes/teams/members';
import type {
    RoleOption,
    Team,
    TeamInvitation,
    TeamMember,
    TeamPermissions,
} from '@/types';

type Props = {
    team: Team;
    members: TeamMember[];
    invitations: TeamInvitation[];
    permissions: TeamPermissions;
    availableRoles: RoleOption[];
};

export default function TeamEdit({
    team,
    members,
    invitations,
    permissions,
    availableRoles,
}: Props) {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(
        null,
    );
    const [cancelInvitationDialogOpen, setCancelInvitationDialogOpen] =
        useState(false);
    const [invitationToCancel, setInvitationToCancel] =
        useState<TeamInvitation | null>(null);

    const pageTitle = useMemo(
        () =>
            permissions.canUpdateTeam
                ? `Edit ${team.name}`
                : `View ${team.name}`,
        [permissions.canUpdateTeam, team.name],
    );

    const updateMemberRole = (member: TeamMember, newRole: string) => {
        router.visit(updateMember([team.slug, member.id]), {
            data: { role: newRole },
            preserveScroll: true,
        });
    };

    const confirmRemoveMember = (member: TeamMember) => {
        setMemberToRemove(member);
        setRemoveMemberDialogOpen(true);
    };

    const confirmCancelInvitation = (invitation: TeamInvitation) => {
        setInvitationToCancel(invitation);
        setCancelInvitationDialogOpen(true);
    };

    return (
        <>
            <Head title={pageTitle} />

            <div className="section">
                {permissions.canUpdateTeam ? (
                    <>
                        <div className="page-head">
                            <div>
                                <h1 className="page-title">Team settings</h1>
                                <p className="page-subtitle">Update your team name and settings</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-pad">
                                <Form
                                    {...update.form(team.slug)}
                                >
                                    {({ errors, processing }) => (
                                        <>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="name">
                                                    Team name
                                                </label>
                                                <input
                                                    className="input"
                                                    id="name"
                                                    name="name"
                                                    data-test="team-name-input"
                                                    defaultValue={team.name}
                                                    required
                                                />
                                                <span className="input-error">{errors.name}</span>
                                            </div>

                                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    data-test="team-save-button"
                                                    disabled={processing}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="page-head">
                            <div>
                                <h1 className="page-title">{team.name}</h1>
                            </div>
                        </div>
                    </>
                )}

                <div className="page-head">
                    <div>
                        <h1 className="page-title">Team members</h1>
                        {permissions.canCreateInvitation && (
                            <p className="page-subtitle">Manage who belongs to this team</p>
                        )}
                    </div>
                    {permissions.canCreateInvitation && (
                        <div className="page-actions">
                            <button
                                className="btn btn-primary"
                                data-test="invite-member-button"
                                onClick={() => setInviteDialogOpen(true)}
                            >
                                <UserPlus size={14} /> Invite member
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {members.map((member) => (
                        <div
                            key={member.id}
                            data-test="member-row"
                            className="card"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div className="card-pad" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <BfaAvatar name={member.name} size={32} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>
                                            {member.name}
                                        </div>
                                        <div className="muted">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {member.role !== 'owner' &&
                                    permissions.canUpdateMember ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    data-test="member-role-trigger"
                                                >
                                                    {member.role_label}
                                                    <ChevronDown size={14} style={{ opacity: 0.5 }} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {availableRoles.map((role) => (
                                                    <DropdownMenuItem
                                                        key={role.value}
                                                        data-test="member-role-option"
                                                        onSelect={() =>
                                                            updateMemberRole(
                                                                member,
                                                                role.value,
                                                            )
                                                        }
                                                    >
                                                        {role.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Badge variant="secondary">
                                            {member.role_label}
                                        </Badge>
                                    )}

                                    {member.role !== 'owner' &&
                                    permissions.canRemoveMember ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        data-test="member-remove-button"
                                                        onClick={() =>
                                                            confirmRemoveMember(
                                                                member,
                                                            )
                                                        }
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Remove member</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {invitations.length > 0 ? (
                    <>
                        <div className="page-head">
                            <div>
                                <h1 className="page-title">Pending invitations</h1>
                                <p className="page-subtitle">Invitations that haven't been accepted yet</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {invitations.map((invitation) => (
                                <div
                                    key={invitation.code}
                                    data-test="invitation-row"
                                    className="card"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    <div className="card-pad" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Mail size={16} style={{ color: 'var(--text-3)' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>
                                                    {invitation.email}
                                                </div>
                                                <div className="muted">
                                                    {invitation.role_label}
                                                </div>
                                            </div>
                                        </div>

                                        {permissions.canCancelInvitation ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className="btn btn-ghost btn-sm"
                                                            data-test="invitation-cancel-button"
                                                            onClick={() =>
                                                                confirmCancelInvitation(
                                                                    invitation,
                                                                )
                                                            }
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Cancel invitation</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : null}

                {permissions.canDeleteTeam && !team.isPersonal ? (
                    <>
                        <div className="page-head">
                            <div>
                                <h1 className="page-title">Delete team</h1>
                                <p className="page-subtitle">Permanently delete your team</p>
                            </div>
                        </div>

                        <div className="card" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)' }}>
                            <div className="card-pad">
                                <div style={{ marginBottom: 12 }}>
                                    <p style={{ fontWeight: 500, color: 'var(--danger)' }}>Warning</p>
                                    <p className="muted">
                                        Please proceed with caution, this cannot be
                                        undone.
                                    </p>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    data-test="delete-team-button"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    Delete team
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            {permissions.canCreateInvitation ? (
                <InviteMemberModal
                    team={team}
                    availableRoles={availableRoles}
                    open={inviteDialogOpen}
                    onOpenChange={setInviteDialogOpen}
                />
            ) : null}

            <RemoveMemberModal
                team={team}
                member={memberToRemove}
                open={removeMemberDialogOpen}
                onOpenChange={setRemoveMemberDialogOpen}
            />

            <CancelInvitationModal
                team={team}
                invitation={invitationToCancel}
                open={cancelInvitationDialogOpen}
                onOpenChange={setCancelInvitationDialogOpen}
            />

            {permissions.canDeleteTeam && !team.isPersonal ? (
                <DeleteTeamModal
                    team={team}
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                />
            ) : null}
        </>
    );
}

TeamEdit.layout = {
    breadcrumbs: [{ title: 'Teams' }],
};
