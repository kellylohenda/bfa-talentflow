import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Appearance settings</h1>
                        <p className="page-subtitle">Update your account's appearance settings</p>
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
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
