<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Faq;
use App\Models\ProcessStep;
use App\Models\Program;
use App\Models\Stage;
use App\Models\Talent;
use App\Models\University;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function programa(): Response
    {
        $programs = Program::where('activo', true)
            ->with('benefits')
            ->orderBy('id')
            ->get(['id', 'code', 'name', 'descricao', 'tag']);

        $totalTalentos = Talent::count();
        $admitidos = Talent::whereIn('status', ['activo', 'concluido'])->count();
        $taxaContratacao = $totalTalentos > 0 ? round(($admitidos / $totalTalentos) * 100) : 87;
        $universidades = University::count();

        return Inertia::render('welcome', [
            'programs' => $programs,
            'stats' => [
                ['n' => $taxaContratacao.'%', 'label' => 'taxa de contratação Futuro BFA'],
                ['n' => $totalTalentos.'+', 'label' => 'talentos formados desde 2018'],
                ['n' => strval($universidades), 'label' => 'universidades parceiras'],
                ['n' => strval($programs->count()), 'label' => 'programas activos em 2026'],
            ],
            'faqs' => Faq::where('active', true)->orderBy('sort_order')->get(['question', 'answer']),
            'processSteps' => ProcessStep::where('active', true)->orderBy('sort_order')->get(['period', 'title', 'description']),
        ]);
    }

    public function candidatura(): Response
    {
        return Inertia::render('candidatura/index', [
            'programs' => Program::where('activo', true)->orderBy('id')->get(['id', 'code', 'name', 'descricao']),
        ]);
    }

    public function candidaturaStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'program_code' => ['required', 'string', 'exists:programs,code'],
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:applications,email'],
            'tel' => ['nullable', 'string', 'max:30'],
            'grau' => ['required', 'string', 'max:50'],
            'uni' => ['required', 'string', 'max:255'],
            'curso' => ['required', 'string', 'max:255'],
            'motivacao' => ['nullable', 'string', 'max:3000'],
            'rgpd' => ['accepted'],
        ]);

        $program = Program::where('code', $validated['program_code'])->firstOrFail();

        $tipo = match ($validated['program_code']) {
            'bif', 'mest' => 'internacional',
            'lid' => 'estagiario',
            'bnac' => 'bolseiro',
            default => 'estagiario',
        };

        $obs = collect([
            'Grau: '.$validated['grau'],
            'Universidade: '.$validated['uni'],
            'Curso: '.$validated['curso'],
            $validated['motivacao'] ?: null,
        ])->filter()->implode("\n");

        $year = date('Y');
        $seq = str_pad(Application::withTrashed()->count() + 1, 4, '0', STR_PAD_LEFT);
        $ref = "BFA-{$year}-{$seq}";

        Application::create([
            'application_ref' => $ref,
            'name' => $validated['nome'],
            'email' => $validated['email'],
            'phone' => $validated['tel'] ?? null,
            'program_id' => $program->id,
            'tipo' => $tipo,
            'stage' => 'analise',
            'observacoes' => $obs ?: null,
        ]);

        return to_route('candidatura')->with('ref', $ref);
    }

    public function portal(): Response
    {
        return Inertia::render('portal/index');
    }

    public function portalCheck(Request $request): RedirectResponse
    {
        $request->validate([
            'ref' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $application = Application::where('application_ref', strtoupper(trim($request->ref)))
            ->where('email', strtolower(trim($request->email)))
            ->first();

        if (! $application) {
            return back()->withErrors(['ref' => 'Referência ou email inválidos.']);
        }

        $request->session()->put('portal_ref', $application->application_ref);

        return to_route('portal.status', $application->application_ref);
    }

    public function portalStatus(Request $request, string $ref): Response|RedirectResponse
    {
        if ($request->session()->get('portal_ref') !== strtoupper($ref)) {
            return redirect()->route('portal');
        }

        $application = Application::with('program')
            ->where('application_ref', strtoupper($ref))
            ->firstOrFail();

        $stages = Stage::orderBy('sort')->get(['code', 'label', 'is_terminal']);

        return Inertia::render('portal/show', [
            'application' => [
                'ref' => $application->application_ref,
                'nome' => $application->name,
                'email' => $application->email,
                'program' => $application->program?->name,
                'stage' => $application->stage->value,
                'stage_label' => $application->stage->label(),
                'submitted_at' => $application->created_at->toIso8601String(),
            ],
            'stages' => $stages->mapWithKeys(fn ($s) => [$s->code => ['label' => $s->label, 'is_terminal' => $s->is_terminal]]),
        ]);
    }
}
