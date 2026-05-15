<?php

use App\Enums\WorkflowStatus;
use App\Models\Talent;
use App\Models\User;
use App\Models\Workflow;

beforeEach(function () {
    $this->rh = User::factory()->asRh()->create();
    $this->direcao = User::factory()->asDirecao()->create();
    $this->mentor = User::factory()->asMentor()->create();
});

describe('index', function () {
    it('rh lista workflows', function () {
        Workflow::factory()->count(3)->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/workflows')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('mentor não acede a workflows', function () {
        $this->actingAs($this->mentor)
            ->getJson('/api/v1/workflows')
            ->assertForbidden();
    });
});

describe('store', function () {
    it('rh cria workflow', function () {
        $talent = Talent::factory()->create();

        $this->actingAs($this->rh)
            ->postJson('/api/v1/workflows', [
                'talent_id' => $talent->id,
                'type' => 'pagamento',
                'descricao' => 'Workflow de pagamento de bolsa.',
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', WorkflowStatus::Pendente->value);
    });
});

describe('aprovar', function () {
    it('rh aprova workflow pendente', function () {
        $workflow = Workflow::factory()->create(['status' => WorkflowStatus::Pendente]);

        $this->actingAs($this->rh)
            ->postJson("/api/v1/workflows/{$workflow->id}/aprovar", [
                'comentarios' => 'Aprovado conforme análise.',
            ])
            ->assertOk();

        expect($workflow->fresh()->status)->toBe(WorkflowStatus::Aprovado);
    });

    it('direcao pode aprovar workflow', function () {
        $workflow = Workflow::factory()->create(['status' => WorkflowStatus::Pendente]);

        $this->actingAs($this->direcao)
            ->postJson("/api/v1/workflows/{$workflow->id}/aprovar", [
                'comentarios' => 'Conforme.',
            ])
            ->assertOk();
    });

    it('não aprova workflow já aprovado', function () {
        $workflow = Workflow::factory()->aprovado()->create();

        $this->actingAs($this->rh)
            ->postJson("/api/v1/workflows/{$workflow->id}/aprovar", ['comentarios' => 'x'])
            ->assertUnprocessable();
    });
});

describe('rejeitar', function () {
    it('rh rejeita workflow', function () {
        $workflow = Workflow::factory()->create(['status' => WorkflowStatus::Pendente]);

        $this->actingAs($this->rh)
            ->postJson("/api/v1/workflows/{$workflow->id}/rejeitar", [
                'motivo' => 'Documentação incompleta.',
            ])
            ->assertOk();

        expect($workflow->fresh()->status)->toBe(WorkflowStatus::Rejeitado);
    });
});
