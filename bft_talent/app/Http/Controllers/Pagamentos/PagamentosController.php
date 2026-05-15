<?php

namespace App\Http\Controllers\Pagamentos;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Talent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PagamentosController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('ver-pagamentos');

        $pagamentos = Payment::query()
            ->with(['talent.program'])
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('period'), fn ($q, $v) => $q->where('period', $v))
            ->when($request->input('talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('pagamentos/index', [
            'pagamentos' => $pagamentos,
            'filters' => $request->only(['status', 'period', 'talent_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('ver-pagamentos');

        return Inertia::render('pagamentos/create', [
            'talents' => Talent::orderBy('name')->get(['id', 'name', 'talent_code']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('ver-pagamentos');

        $validated = $request->validate([
            'talent_id' => ['required', 'integer', 'exists:talents,id'],
            'type' => ['required', 'string', 'in:bolsa,subsidio_alimentacao,ajuda_custo,outro'],
            'period' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
        ]);

        $year = now()->format('Y');
        $seq = str_pad(Payment::whereYear('created_at', $year)->count() + 1, 5, '0', STR_PAD_LEFT);
        $period = str_replace('-', '', $validated['period']);

        Payment::create([
            ...$validated,
            'payment_ref' => "PAG-{$year}-{$seq}",
            'idempotency_key' => hash('sha256', "payment-{$validated['talent_id']}-{$period}-{$validated['type']}"),
            'currency' => $validated['currency'] ?? 'AOA',
            'status' => 'pendente',
        ]);

        return redirect()->route('pagamentos.index', $request->route('current_team'))
            ->with('success', 'Pagamento criado com sucesso.');
    }

    public function show(Request $request, Payment $pagamento): Response
    {
        $this->authorize('ver-pagamentos');

        return Inertia::render('pagamentos/show', [
            'pagamento' => $pagamento->load(['talent.program', 'workflow']),
        ]);
    }
}
