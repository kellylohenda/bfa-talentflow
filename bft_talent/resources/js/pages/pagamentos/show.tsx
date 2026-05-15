import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index, show } from '@/routes/pagamentos';
import type { Payment } from '@/types';

type Props = { pagamento: Payment };

export default function PagamentosShow({ pagamento }: Props) {
    return (
        <>
            <Head title={pagamento.payment_ref} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={index().url}><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title={pagamento.payment_ref} description={pagamento.period} />
                    <Badge className="ml-auto">{pagamento.status}</Badge>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Detalhe do Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Talento</span>
                            <span className="font-medium">{pagamento.talent?.name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Programa</span>
                            <span>{pagamento.talent?.program?.name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tipo</span>
                            <span><Badge variant="outline">{pagamento.type}</Badge></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor</span>
                            <span className="font-medium">
                                {parseFloat(pagamento.amount).toLocaleString('pt-PT')} {pagamento.currency}
                            </span>
                        </div>
                        {pagamento.paid_at && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pago em</span>
                                <span>{new Date(pagamento.paid_at).toLocaleDateString('pt-PT')}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PagamentosShow.layout = (props: { currentTeam?: { slug: string } | null; pagamento?: Payment }) => ({
    breadcrumbs: [
        { title: 'Pagamentos', href: index().url },
        { title: props.pagamento?.payment_ref ?? 'Detalhe', href: show(props.pagamento.id).url },
    ],
});
