<?php

use App\Http\Controllers\ActividadesController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\AvaliacoesController;
use App\Http\Controllers\BolseiroController;
use App\Http\Controllers\Candidaturas\CandidaturasController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Documentos\DocumentosController;
use App\Http\Controllers\EstagiariosController;
use App\Http\Controllers\Eventos\EventosController;
use App\Http\Controllers\FaltasController;
use App\Http\Controllers\GeografiaController;
use App\Http\Controllers\HorasController;
use App\Http\Controllers\Mensagens\MensagensController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\NotificacoesController;
use App\Http\Controllers\Pagamentos\PagamentosController;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Relatorios\RelatoriosController;
use App\Http\Controllers\RelatoriosVoluntariadoController;
use App\Http\Controllers\RetencaoController;
use App\Http\Controllers\RoiController;
use App\Http\Controllers\SucessaoController;
use App\Http\Controllers\Talentos\TalentosController;
use App\Http\Controllers\TarefasController;
use App\Http\Controllers\Voluntarios\VoluntariosController;
use App\Http\Controllers\Workflows\WorkflowsController;
use Illuminate\Support\Facades\Route;

// ─── Public pages (no auth) ────────────────────────
Route::get('/', [PublicController::class, 'programa'])->name('home');
Route::get('/candidatura', [PublicController::class, 'candidatura'])->name('candidatura');
Route::post('/candidatura', [PublicController::class, 'candidaturaStore'])->name('candidatura.store');
Route::get('/portal', [PublicController::class, 'portal'])->name('portal');
Route::post('/portal', [PublicController::class, 'portalCheck'])->name('portal.check');
Route::get('/portal/{ref}', [PublicController::class, 'portalStatus'])->name('portal.status');

// ─── Auth'd pages (Inertia dashboard) ──────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

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

    // ── Novos módulos (Inertia pages) ──
    Route::get('bolseiro', [BolseiroController::class, 'index'])->name('bolseiro.index');
    Route::get('mentor', [MentorController::class, 'index'])->name('mentor.index');
    Route::resource('tarefas', TarefasController::class);
    Route::resource('faltas', FaltasController::class)->except(['edit']);
    Route::get('estagiarios', [EstagiariosController::class, 'index'])->name('estagiarios.index');
    Route::resource('avaliacoes', AvaliacoesController::class)->only(['index', 'store']);
    Route::get('agenda', [AgendaController::class, 'index'])->name('agenda.index');
    Route::get('actividades', [ActividadesController::class, 'index'])->name('actividades.index');
    Route::get('horas', [HorasController::class, 'index'])->name('horas.index');
    Route::get('chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('notificacoes', [NotificacoesController::class, 'index'])->name('notificacoes.index');
    Route::patch('notificacoes/{id}', [NotificacoesController::class, 'markAsRead'])->name('notificacoes.mark-as-read');
    Route::post('notificacoes/read-all', [NotificacoesController::class, 'markAllAsRead'])->name('notificacoes.read-all');
    Route::get('geografia', [GeografiaController::class, 'index'])->name('geografia.index');
    Route::get('roi', [RoiController::class, 'index'])->name('roi.index');
    Route::get('compliance', [ComplianceController::class, 'index'])->name('compliance.index');
    Route::get('retencao', [RetencaoController::class, 'index'])->name('retencao.index');
    Route::get('sucessao', [SucessaoController::class, 'index'])->name('sucessao.index');
    Route::get('relatorios-voluntariado', [RelatoriosVoluntariadoController::class, 'index'])->name('relatorios-voluntariado.index');
});

require __DIR__.'/settings.php';
