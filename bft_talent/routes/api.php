<?php

use App\Http\Controllers\Api\V1\AbsenceController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\EvaluationController;
use App\Http\Controllers\Api\V1\EventoController;
use App\Http\Controllers\Api\V1\HoursEntryController;
use App\Http\Controllers\Api\V1\MeController;
use App\Http\Controllers\Api\V1\MentorSessionController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\RotationController;
use App\Http\Controllers\Api\V1\TalentController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\VolunteerActivityController;
use App\Http\Controllers\Api\V1\VolunteerController;
use App\Http\Controllers\Api\V1\WorkflowController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| BFA TalentFlow API v1
|--------------------------------------------------------------------------
| Autenticação via sessão Fortify (cookie) ou Bearer token Sanctum.
| Todos os endpoints requerem autenticação.
*/

Route::middleware('auth')->prefix('v1')->name('api.v1.')->group(function () {

    // Perfil do utilizador autenticado
    Route::prefix('me')->name('me.')->group(function () {
        Route::get('/', [MeController::class, 'show'])->name('show');
        Route::get('bolseiro', [MeController::class, 'bolseiro'])->name('bolseiro');
        Route::get('voluntario', [MeController::class, 'voluntario'])->name('voluntario');
    });

    // Candidaturas
    Route::apiResource('candidaturas', ApplicationController::class);
    Route::post('candidaturas/{application}/avancar', [ApplicationController::class, 'avancar'])
        ->name('candidaturas.avancar');
    Route::post('candidaturas/{application}/rejeitar', [ApplicationController::class, 'rejeitar'])
        ->name('candidaturas.rejeitar');

    // Talentos (bolseiros + estagiários)
    Route::apiResource('talentos', TalentController::class);

    // Atalhos por tipo de talento
    Route::get('bolseiros', [TalentController::class, 'index'])->name('bolseiros.index')
        ->defaults('filter.kind', 'bolseiro');
    Route::get('estagiarios', [TalentController::class, 'index'])->name('estagiarios.index')
        ->defaults('filter.kind', 'estagiario');

    // Pagamentos
    Route::apiResource('pagamentos', PaymentController::class);
    Route::post('pagamentos/{payment}/marcar-pago', [PaymentController::class, 'marcarPago'])
        ->name('pagamentos.marcar-pago');

    // Workflows de aprovação
    Route::apiResource('workflows', WorkflowController::class)->only(['index', 'store', 'show']);
    Route::post('workflows/{workflow}/aprovar', [WorkflowController::class, 'approve'])
        ->name('workflows.aprovar');
    Route::post('workflows/{workflow}/rejeitar', [WorkflowController::class, 'reject'])
        ->name('workflows.rejeitar');

    // Voluntários
    Route::apiResource('voluntarios', VolunteerController::class);

    // Catálogos (programas, universidades, departamentos)
    Route::prefix('catalogos')->name('catalogos.')->group(function () {
        Route::get('programas', [CatalogController::class, 'programs'])->name('programas.index');
        Route::post('programas', [CatalogController::class, 'storeProgram'])->name('programas.store');
        Route::get('universidades', [CatalogController::class, 'universities'])->name('universidades.index');
        Route::post('universidades', [CatalogController::class, 'storeUniversity'])->name('universidades.store');
        Route::get('departamentos', [CatalogController::class, 'departments'])->name('departamentos.index');
        Route::post('departamentos', [CatalogController::class, 'storeDepartment'])->name('departamentos.store');
    });

    // Rotações
    Route::apiResource('rotacoes', RotationController::class);

    // Tarefas
    Route::apiResource('tarefas', TaskController::class);

    // Faltas / Ausências
    Route::apiResource('faltas', AbsenceController::class);

    // Sessões de mentoria
    Route::apiResource('mentoria/sessoes', MentorSessionController::class)
        ->only(['index', 'store', 'show'])
        ->names([
            'index' => 'mentoria.sessoes.index',
            'store' => 'mentoria.sessoes.store',
            'show' => 'mentoria.sessoes.show',
        ]);
    Route::post('mentoria/sessoes/{mentorSession}/realizou', [MentorSessionController::class, 'realizou'])
        ->name('mentoria.sessoes.realizou');
    Route::post('mentoria/sessoes/{mentorSession}/cancelar', [MentorSessionController::class, 'cancelar'])
        ->name('mentoria.sessoes.cancelar');

    // Avaliações
    Route::apiResource('avaliacoes', EvaluationController::class)->only(['index', 'store', 'show']);

    // Eventos
    Route::apiResource('eventos', EventoController::class)->only(['index', 'store', 'show']);
    Route::post('eventos/{evento}/inscrever', [EventoController::class, 'inscrever'])
        ->name('eventos.inscrever');

    // Horas de voluntariado
    Route::apiResource('horas', HoursEntryController::class)->only(['index', 'store', 'show']);
    Route::post('horas/{hoursEntry}/validar', [HoursEntryController::class, 'validar'])
        ->name('horas.validar');

    // Actividades de voluntariado
    Route::apiResource('actividades', VolunteerActivityController::class)->only(['index', 'store', 'show']);
    Route::post('actividades/{volunteerActivity}/inscrever', [VolunteerActivityController::class, 'inscrever'])
        ->name('actividades.inscrever');

    // Documentos
    Route::apiResource('documentos', DocumentController::class);
    Route::post('documentos/{document}/revisar', [DocumentController::class, 'revisar'])
        ->name('documentos.revisar');

    // Mensagens (caixa de entrada + enviadas)
    Route::get('mensagens/enviadas', [MessageController::class, 'sent'])->name('mensagens.enviadas');
    Route::apiResource('mensagens', MessageController::class)->only(['index', 'store', 'show', 'destroy']);

    // Analytics (RH + Direcção)
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('overview', [AnalyticsController::class, 'overview'])->name('overview');
        Route::get('geografia', [AnalyticsController::class, 'geografia'])->name('geografia');
        Route::get('sucessao', [AnalyticsController::class, 'sucessao'])->name('sucessao');
    });

    // Health check
    Route::get('health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]))->name('health');
});
