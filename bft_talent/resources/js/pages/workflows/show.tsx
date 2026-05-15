import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/workflows';
import type { Workflow } from '@/types';

type Props = { workflow: Workflow };

export default function WorkflowsShow({ workflow }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title={workflow.workflow_code} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={workflow.workflow_code} description={`Tipo: ${workflow.type}`} />
                    <Badge className="ml-auto">{workflow.status}</Badge>
                </div>

                <div className="grid gap-4 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Informação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Talento</span>
                                <span className="font-medium">{workflow.talent?.name ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Passo actual</span>
                                <span>{workflow.current_step}/{workflow.total_steps}</span>
                            </div>
                            {workflow.descricao && (
                                <div>
                                    <span className="text-muted-foreground">Descrição</span>
                                    <p className="mt-1">{workflow.descricao}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {workflow.steps?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Passos de Aprovação</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {workflow.steps.map((step) => (
                                    <div key={step.id} className="flex items-center gap-3 text-sm">
                                        {step.decision === 'aprovado' ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : step.decision === 'rejeitado' ? (
                                            <XCircle className="h-4 w-4 text-destructive" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                        )}
                                        <span className="text-muted-foreground">Passo {step.step_number}</span>
                                        <Badge variant="outline" className="ml-auto">{step.approver_role}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

WorkflowsShow.layout = (props: { currentTeam?: { slug: string } | null; workflow?: Workflow }) => ({
    breadcrumbs: [
        { title: 'Workflows', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.workflow?.workflow_code ?? 'Detalhe',
            href: props.currentTeam && props.workflow
                ? show([props.currentTeam.slug, props.workflow.id]).url
                : '/',
        },
    ],
});
