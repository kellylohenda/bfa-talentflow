<?php

use App\Http\Controllers\Candidaturas\CandidaturasController;
use App\Http\Controllers\Documentos\DocumentosController;
use App\Http\Controllers\Eventos\EventosController;
use App\Http\Controllers\Mensagens\MensagensController;
use App\Http\Controllers\Pagamentos\PagamentosController;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Relatorios\RelatoriosController;
use App\Http\Controllers\Talentos\TalentosController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\Voluntarios\VoluntariosController;
use App\Http\Controllers\Workflows\WorkflowsController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

// ─── Public pages (no auth) ────────────────────────
Route::get('/', [PublicController::class, 'programa'])->name('home');
Route::get('/candidatura', [PublicController::class, 'candidatura'])->name('candidatura');
Route::post('/candidatura', [PublicController::class, 'candidaturaStore'])->name('candidatura.store');
Route::get('/portal', [PublicController::class, 'portal'])->name('portal');
Route::post('/portal', [PublicController::class, 'portalCheck'])->name('portal.check');
Route::get('/portal/{ref}', [PublicController::class, 'portalStatus'])->name('portal.status');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');

        // Talentos
        Route::resource('talentos', TalentosController::class);

        // Candidaturas
        Route::resource('candidaturas', CandidaturasController::class)->except(['edit', 'update']);

        // Pagamentos
        Route::resource('pagamentos', PagamentosController::class)->only(['index', 'show', 'create', 'store']);

        // Workflows
        Route::resource('workflows', WorkflowsController::class)->only(['index', 'show', 'create', 'store']);

        // Voluntários
        Route::resource('voluntarios', VoluntariosController::class)->except(['edit', 'update']);

        // Mensagens
        Route::resource('mensagens', MensagensController::class)->except(['edit', 'update']);

        // Documentos
        Route::resource('documentos', DocumentosController::class)->only(['index', 'show', 'destroy']);

        // Eventos
        Route::resource('eventos', EventosController::class)->only(['index', 'show', 'create', 'store']);

        // Relatórios
        Route::get('relatorios', [RelatoriosController::class, 'index'])->name('relatorios.index');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
