import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Iniciar Sessão" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                className="input"
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="seu@email.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label className="form-label" htmlFor="password">Palavra-passe</label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request().url}
                                        className="muted"
                                        tabIndex={5}
                                    >
                                        Esqueceu-se da palavra-passe?
                                    </TextLink>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Palavra-passe"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <label className="form-label" htmlFor="remember" style={{ margin: 0 }}>Lembrar-me</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 8 }}
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            Entrar
                        </button>

                        {canRegister && (
                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <span className="muted">Ainda não tem conta? </span>
                                <TextLink href={register().url} tabIndex={5}>
                                    Criar conta
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <span className="pill pill-success">{status}</span>
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Iniciar sessão',
    description: 'Introduza o seu email e palavra-passe para aceder ao painel',
};
