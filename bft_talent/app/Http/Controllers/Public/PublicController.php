<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function programa(): Response
    {
        return Inertia::render('welcome', [
            'programs' => Program::where('activo', true)->orderBy('id')->get(['id', 'code', 'name', 'descricao']),
        ]);
    }

    public function candidatura(): Response
    {
        return Inertia::render('candidatura/index', [
            'programs' => Program::where('activo', true)->orderBy('id')->get(['id', 'code', 'name', 'descricao']),
        ]);
    }

    public function candidaturaStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'program_code' => ['required', 'string', 'exists:programs,code'],
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:applications,email'],
            'tel' => ['nullable', 'string', 'max:30'],
            'uni' => ['nullable', 'string', 'max:255'],
            'curso' => ['nullable', 'string', 'max:255'],
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
            $validated['uni'] ? 'Universidade: '.$validated['uni'] : null,
            $validated['curso'] ? 'Curso: '.$validated['curso'] : null,
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

        return response()->json(['ref' => $ref]);
    }

    public function portal(): Response
    {
        return Inertia::render('portal/index');
    }

    public function portalCheck(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'ref' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $application = Application::where('application_ref', strtoupper(trim($request->ref)))
            ->where('email', strtolower(trim($request->email)))
            ->first();

        if (! $application) {
            return response()->json(['message' => 'Referência ou email inválidos.'], 422);
        }

        $request->session()->put('portal_ref', $application->application_ref);

        return response()->json(['ref' => $application->application_ref]);
    }

    public function portalStatus(Request $request, string $ref): Response|RedirectResponse
    {
        if ($request->session()->get('portal_ref') !== strtoupper($ref)) {
            return redirect()->route('portal');
        }

        $application = Application::with('program')
            ->where('application_ref', strtoupper($ref))
            ->firstOrFail();

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
        ]);
    }
}
