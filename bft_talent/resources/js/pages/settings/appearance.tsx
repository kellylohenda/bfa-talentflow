import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Definições de aparência" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Definições de aparência</h1>
                        <p className="page-subtitle">Actualizar as definições de aparência da sua conta</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-pad">
                        <AppearanceTabs />
                    </div>
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Definições de aparência',
            href: editAppearance(),
        },
    ],
};
