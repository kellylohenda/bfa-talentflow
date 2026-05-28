import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Spinner } from '@/components/ui/spinner';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Security settings" />

            <div className="section">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Update password</h1>
                        <p className="page-subtitle">Ensure your account is using a long, random password to stay secure</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-pad">
                        <Form
                            {...SecurityController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="current_password">
                                            Current password
                                        </label>
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />
                                        <InputError message={errors.current_password} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="password">New password</label>
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            autoComplete="new-password"
                                            placeholder="New password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="password_confirmation">
                                            Confirm password
                                        </label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={processing}
                                            data-test="update-password-button"
                                        >
                                            {processing && <Spinner />}
                                            Save password
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>

            {canManageTwoFactor && (
                <div className="section">
                    <div className="page-head">
                        <div>
                            <h1 className="page-title">Two-factor authentication</h1>
                            <p className="page-subtitle">Manage your two-factor authentication settings</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-pad">
                            {twoFactorEnabled ? (
                                <>
                                    <p className="muted" style={{ marginBottom: 16 }}>
                                        You will be prompted for a secure, random pin
                                        during login, which you can retrieve from the
                                        TOTP-supported application on your phone.
                                    </p>

                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                                disabled={processing}
                                            >
                                                Disable 2FA
                                            </button>
                                        )}
                                    </Form>

                                    <div style={{ marginTop: 16 }}>
                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={errors}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="muted" style={{ marginBottom: 16 }}>
                                        When you enable two-factor authentication, you
                                        will be prompted for a secure pin during login.
                                        This pin can be retrieved from a TOTP-supported
                                        application on your phone.
                                    </p>

                                    {hasSetupData ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowSetupModal(true)}
                                        >
                                            <ShieldCheck size={14} />
                                            Continue setup
                                        </button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={processing}
                                                >
                                                    {processing && <Spinner />}
                                                    Enable 2FA
                                                </button>
                                            )}
                                        </Form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            )}
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
