<?php

namespace App\Providers;

use App\Enums\BfaRole;
use App\Models\Application;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\User;
use App\Models\Workflow;
use App\Policies\ApplicationPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\TalentPolicy;
use App\Policies\WorkflowPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    protected $policies = [
        Application::class => ApplicationPolicy::class,
        Payment::class => PaymentPolicy::class,
        Talent::class => TalentPolicy::class,
        Workflow::class => WorkflowPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerBfaGates();
    }

    protected function registerBfaGates(): void
    {
        Gate::define('ver-candidaturas', fn (User $u) => $u->hasAnyRole(BfaRole::Rh, BfaRole::Direcao));
        Gate::define('gerir-talentos', fn (User $u) => $u->isRh());
        Gate::define('aprovar-workflow', fn (User $u) => $u->canApproveWorkflow());
        Gate::define('ver-pagamentos', fn (User $u) => $u->hasAnyRole(BfaRole::Rh, BfaRole::Direcao));
        Gate::define('ver-analytics', fn (User $u) => $u->canViewAnalytics());
        Gate::define('gerir-voluntarios', fn (User $u) => $u->isRh());
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
