import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, Shield, XCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { index } from '@/routes/compliance';

type Props = {
    data: {
        conformidadeGeral: number;
        documentosPendentes: number;
        documentosAprovados: number;
        documentosRejeitados: number;
        contratosActivos: number;
        contratosExpirados: number;
        emConformidade: number;
        naoConformidade: number;
    };
    categorias: { nome: string; conformidade: number; total: number }[];
};

export default function ComplianceIndex({ data, categorias }: Props) {
    return (
        <>
            <Head title="Compliance" />
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Dashboard de Compliance" description="Monitorização de conformidade regulatória" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Shield className={`h-8 w-8 ${data.conformidadeGeral >= 80 ? 'text-green-600' : 'text-yellow-500'}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">Conformidade Geral</p>
                                <p className="text-2xl font-bold">{data.conformidadeGeral}%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Documentos</p>
                                <p className="text-2xl font-bold">{data.documentosAprovados}/{data.documentosAprovados + data.documentosPendentes + data.documentosRejeitados}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Em Conformidade</p>
                                <p className="text-2xl font-bold">{data.emConformidade}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <XCircle className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-sm text-muted-foreground">Não Conformidade</p>
                                <p className="text-2xl font-bold">{data.naoConformidade}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Conformidade por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {categorias.map((c) => (
                            <div key={c.nome} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{c.nome}</span>
                                    <span className="text-muted-foreground">{c.conformidade}/{c.total} ({c.total > 0 ? Math.round((c.conformidade / c.total) * 100) : 0}%)</span>
                                </div>
                                <Progress value={c.total > 0 ? (c.conformidade / c.total) * 100 : 0} className="h-2" />
                            </div>
                        ))}
                        {categorias.length === 0 && (
                            <p className="py-6 text-center text-sm text-muted-foreground">Sem dados disponíveis.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Estado dos Contratos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-around py-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{data.contratosActivos}</p>
                                <p className="text-xs text-muted-foreground">Activos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-destructive">{data.contratosExpirados}</p>
                                <p className="text-xs text-muted-foreground">Expirados</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Documentos por Estado</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-around py-4">
                            <div className="text-center">
                                <Badge variant="outline" className="text-sm">{data.documentosPendentes}</Badge>
                                <p className="mt-1 text-xs text-muted-foreground">Pendentes</p>
                            </div>
                            <div className="text-center">
                                <Badge variant="default" className="text-sm">{data.documentosAprovados}</Badge>
                                <p className="mt-1 text-xs text-muted-foreground">Aprovados</p>
                            </div>
                            <div className="text-center">
                                <Badge variant="destructive" className="text-sm">{data.documentosRejeitados}</Badge>
                                <p className="mt-1 text-xs text-muted-foreground">Rejeitados</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ComplianceIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'Compliance', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' }],
});
