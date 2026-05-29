<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\MarcarPagoRequest;
use App\Http\Requests\Api\V1\StorePaymentRequest;
use App\Http\Requests\Api\V1\UpdatePaymentRequest;
use App\Http\Resources\Api\V1\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Payment::class);

        $payments = Payment::query()
            ->with(['talent.program'])
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('filter.talent_id'), fn ($q, $v) => $q->where('talent_id', $v))
            ->when($request->input('filter.period'), fn ($q, $v) => $q->where('period', $v))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return PaymentResource::collection($payments);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $year = now()->format('Y');
        $seq = str_pad(Payment::whereYear('created_at', $year)->count() + 1, 5, '0', STR_PAD_LEFT);
        $period = str_replace('-', '', $data['period']);

        $payment = Payment::create([
            ...$data,
            'payment_ref' => "PAG-{$year}-{$seq}",
            'idempotency_key' => hash('sha256', "payment-{$data['talent_id']}-{$period}-{$data['type']}"),
            'currency' => $data['currency'] ?? 'AOA',
            'status' => 'pendente',
        ]);

        return PaymentResource::make($payment->load('talent'))->response()->setStatusCode(201);
    }

    public function show(Payment $pagamento): PaymentResource
    {
        $this->authorize('view', $pagamento);

        return PaymentResource::make($pagamento->load(['talent', 'workflow']));
    }

    public function update(UpdatePaymentRequest $request, Payment $pagamento): PaymentResource|JsonResponse
    {
        $this->authorize('update', $pagamento);
        $pagamento->update($request->validated());

        return PaymentResource::make($pagamento->fresh());
    }

    public function marcarPago(MarcarPagoRequest $request, Payment $payment): PaymentResource|JsonResponse
    {
        $this->authorize('update', $payment);

        if ($payment->workflow && $payment->workflow->status !== \App\Enums\WorkflowStatus::Aprovado) {
            return response()->json(['message' => 'O workflow associado ainda não está aprovado.'], 422);
        }

        $payment->update(['status' => 'pago', 'paid_at' => now(), 'method' => $request->validated('method')]);

        return PaymentResource::make($payment->fresh());
    }

    public function destroy(Payment $pagamento): JsonResponse
    {
        $this->authorize('delete', $pagamento);
        $pagamento->delete();

        return response()->json(null, 204);
    }
}
