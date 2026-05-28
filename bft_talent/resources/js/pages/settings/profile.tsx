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
            <Head title="Profile settings" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Profile information</h1>
                        <p className="page-subtitle">Update your name and email address</p>
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
                                        <label className="form-label" htmlFor="name">Name</label>
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
                                        <label className="form-label" htmlFor="email">Email address</label>
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
                                                    Your email address is unverified.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        Click here to resend the
                                                        verification email.
                                                    </Link>
                                                </p>

                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div style={{ marginTop: 4 }}>
                                                        <span className="pill pill-success">
                                                            A new verification link has been
                                                            sent to your email address.
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
                                            Save
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
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
