<?php

use App\Enums\ApplicationStage;
use App\Models\Application;
use App\Models\Program;
use App\Models\University;
use App\Models\User;

beforeEach(function () {
    $this->rh = User::factory()->asRh()->create();
    $this->direcao = User::factory()->asDirecao()->create();
    $this->mentor = User::factory()->asMentor()->create();
});

describe('index', function () {
    it('rh pode listar candidaturas', function () {
        Application::factory()->count(3)->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/candidaturas')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('mentor não pode listar candidaturas', function () {
        $this->actingAs($this->mentor)
            ->getJson('/api/v1/candidaturas')
            ->assertForbidden();
    });

    it('requer autenticação', function () {
        $this->getJson('/api/v1/candidaturas')
            ->assertUnauthorized();
    });
});

describe('store', function () {
    it('rh pode criar candidatura', function () {
        $program = Program::factory()->create();
        $university = University::factory()->create();

        $this->actingAs($this->rh)
            ->postJson('/api/v1/candidaturas', [
                'name' => 'João Silva',
                'email' => 'joao@test.com',
                'phone' => '+244923000000',
                'program_id' => $program->id,
                'university_id' => $university->id,
                'tipo' => 'bolseiro',
            ])
            ->assertCreated()
            ->assertJsonPath('data.stage', ApplicationStage::Analise->value);
    });

    it('valida campos obrigatórios', function () {
        $this->actingAs($this->rh)
            ->postJson('/api/v1/candidaturas', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'program_id']);
    });

    it('valida email único', function () {
        $app = Application::factory()->create(['email' => 'duplicate@test.com']);

        $program = Program::factory()->create();
        $university = University::factory()->create();

        $this->actingAs($this->rh)
            ->postJson('/api/v1/candidaturas', [
                'name' => 'Outro Nome',
                'email' => 'duplicate@test.com',
                'program_id' => $program->id,
                'university_id' => $university->id,
                'tipo' => 'bolseiro',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    });
});

describe('show', function () {
    it('rh pode ver candidatura', function () {
        $app = Application::factory()->create();

        $this->actingAs($this->rh)
            ->getJson("/api/v1/candidaturas/{$app->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $app->id);
    });
});

describe('avancar', function () {
    it('rh avança stage da candidatura', function () {
        $app = Application::factory()->create(['stage' => ApplicationStage::Analise]);

        $this->actingAs($this->rh)
            ->postJson("/api/v1/candidaturas/{$app->id}/avancar")
            ->assertOk();

        expect($app->fresh()->stage)->toBe(ApplicationStage::Entrevista);
    });

    it('não avança candidatura já terminal', function () {
        $app = Application::factory()->rejeitada()->create();

        $this->actingAs($this->rh)
            ->postJson("/api/v1/candidaturas/{$app->id}/avancar")
            ->assertUnprocessable();
    });
});

describe('rejeitar', function () {
    it('rh rejeita candidatura', function () {
        $app = Application::factory()->create(['stage' => ApplicationStage::Entrevista]);

        $this->actingAs($this->rh)
            ->postJson("/api/v1/candidaturas/{$app->id}/rejeitar", [
                'motivo' => 'Perfil não adequado.',
            ])
            ->assertOk();

        expect($app->fresh()->stage)->toBe(ApplicationStage::Rejeitado);
    });
});

describe('destroy', function () {
    it('rh pode apagar candidatura', function () {
        $app = Application::factory()->create();

        $this->actingAs($this->rh)
            ->deleteJson("/api/v1/candidaturas/{$app->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('applications', ['id' => $app->id]);
    });

    it('mentor não pode apagar candidatura', function () {
        $app = Application::factory()->create();

        $this->actingAs($this->mentor)
            ->deleteJson("/api/v1/candidaturas/{$app->id}")
            ->assertForbidden();
    });
});
