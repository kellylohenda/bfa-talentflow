import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Definições do perfil" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Informações do Perfil</h1>
                        <p className="page-subtitle">Actualizar o seu nome e email</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-pad">
                        <Form
                            {...ProfileController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="name">Nome</label>
                                        <input
                                            className="input"
                                            id="name"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email">Endereço de email</label>
                                        <input
                                            className="input"
                                            id="email"
                                            type="email"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at === null && (
                                            <div>
                                                <p className="muted">
                                                    O seu email não foi verificado.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        Clique aqui para reenviar o
                                                        email de verificação.
                                                    </Link>
                                                </p>

                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div style={{ marginTop: 4 }}>
                                                        <span className="pill pill-success">
                                                            Foi enviado um novo link de verificação
                                                            para o seu email.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={processing}
                                            data-test="update-profile-button"
                                        >
                                            {processing && <Spinner />}
                                            Guardar
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Definições do perfil',
            href: edit(),
        },
    ],
};
