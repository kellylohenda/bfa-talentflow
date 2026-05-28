import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <span className="pill pill-success">{status}</span>
                </div>
            )}

            <Form {...email.form()}>
                {({ processing, errors }) => (
                    <>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email address</label>
                            <input
                                className="input"
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                autoFocus
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 16 }}
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                        >
                            {processing && <Spinner />}
                            Email password reset link
                        </button>
                    </>
                )}
            </Form>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span className="muted">Or, return to </span>
                <TextLink href={login()}>log in</TextLink>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
