import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/documentos';
import type { Document } from '@/types';

type Props = { documento: Document & { owner?: { id: number; name: string } | null } };

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    aprovado: 'default',
    pendente: 'secondary',
    rejeitado: 'destructive',
};

export default function DocumentosShow({ documento }: Props) {
    const { props } = usePage<{ currentTeam: { slug: string } }>();
    const team = props.currentTeam.slug;

    return (
        <>
            <Head title={documento.name} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index(team).url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={documento.name} description={documento.category} />
                    <Badge variant={statusVariant[documento.status] ?? 'secondary'} className="ml-auto">
                        {documento.status}
                    </Badge>
                </div>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Categoria</span>
                            <span>{documento.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Estado</span>
                            <Badge variant={statusVariant[documento.status] ?? 'secondary'}>{documento.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Proprietário</span>
                            <span>{documento.owner?.name ?? `${documento.owner_type.split('\\').pop()} #${documento.owner_id}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Data</span>
                            <span>{new Date(documento.created_at).toLocaleDateString('pt-PT')}</span>
                        </div>
                        {documento.storage_path && (
                            <div className="pt-2">
                                <Button size="sm" variant="outline" asChild>
                                    <a href={documento.storage_path} target="_blank" rel="noreferrer">
                                        <Download className="mr-1 h-4 w-4" /> Descarregar
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DocumentosShow.layout = (props: { currentTeam?: { slug: string } | null; documento?: Document }) => ({
    breadcrumbs: [
        { title: 'Documentos', href: props.currentTeam ? index(props.currentTeam.slug).url : '/' },
        {
            title: props.documento?.name ?? 'Detalhe',
            href: props.currentTeam && props.documento
                ? show([props.currentTeam.slug, props.documento.id]).url
                : '/',
        },
    ],
});
