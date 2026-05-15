<?php

use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\Talent;
use App\Models\User;

beforeEach(function () {
    $this->rh = User::factory()->asRh()->create();
    $this->direcao = User::factory()->asDirecao()->create();
    $this->mentor = User::factory()->asMentor()->create();
});

describe('index', function () {
    it('rh lista pagamentos', function () {
        Payment::factory()->count(4)->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/pagamentos')
            ->assertOk()
            ->assertJsonCount(4, 'data');
    });

    it('talent vê apenas os próprios pagamentos', function () {
        $talent = Talent::factory()->create();
        $user = User::factory()->asBolseiro()->create(['talent_id' => $talent->id]);

        Payment::factory()->count(2)->create(['talent_id' => $talent->id]);
        Payment::factory()->count(3)->create();

        $this->actingAs($user)
            ->getJson('/api/v1/pagamentos')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    });

    it('mentor não acede a pagamentos', function () {
        $this->actingAs($this->mentor)
            ->getJson('/api/v1/pagamentos')
            ->assertForbidden();
    });
});

describe('store', function () {
    it('rh cria pagamento', function () {
        $talent = Talent::factory()->create();

        $this->actingAs($this->rh)
            ->postJson('/api/v1/pagamentos', [
                'talent_id' => $talent->id,
                'type' => 'bolsa',
                'period' => now()->format('Y-m'),
                'amount' => 1500.00,
                'currency' => 'AOA',
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', PaymentStatus::Pendente->value);
    });

    it('não cria duplicado (idempotência)', function () {
        $talent = Talent::factory()->create();
        $period = now()->format('Y-m');

        $payload = [
            'talent_id' => $talent->id,
            'type' => 'bolsa',
            'period' => $period,
            'amount' => 1500.00,
            'currency' => 'AOA',
        ];

        $this->actingAs($this->rh)->postJson('/api/v1/pagamentos', $payload)->assertCreated();
        $this->actingAs($this->rh)->postJson('/api/v1/pagamentos', $payload)->assertUnprocessable();
    });
});

describe('marcar-pago', function () {
    it('rh marca pagamento como pago', function () {
        $payment = Payment::factory()->create(['status' => PaymentStatus::Pendente]);

        $this->actingAs($this->rh)
            ->postJson("/api/v1/pagamentos/{$payment->id}/marcar-pago")
            ->assertOk()
            ->assertJsonPath('data.status', PaymentStatus::Pago->value);

        expect($payment->fresh()->paid_at)->not->toBeNull();
    });

    it('não marca pagamento já pago', function () {
        $payment = Payment::factory()->pago()->create();

        $this->actingAs($this->rh)
            ->postJson("/api/v1/pagamentos/{$payment->id}/marcar-pago")
            ->assertUnprocessable();
    });
});

describe('destroy', function () {
    it('rh apaga pagamento pendente', function () {
        $payment = Payment::factory()->create(['status' => PaymentStatus::Pendente]);

        $this->actingAs($this->rh)
            ->deleteJson("/api/v1/pagamentos/{$payment->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('payments', ['id' => $payment->id]);
    });
});
