import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <span className="pill pill-success">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </span>
                </div>
            )}

            <Form {...send.form()}>
                {({ processing }) => (
                    <>
                        <button className="btn btn-ghost" disabled={processing} style={{ width: '100%' }}>
                            {processing && <Spinner />}
                            Resend verification email
                        </button>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <TextLink
                                href={logout()}
                            >
                                Log out
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify email',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
