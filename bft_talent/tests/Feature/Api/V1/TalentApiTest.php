<?php

use App\Enums\TalentKind;
use App\Enums\TalentStatus;
use App\Models\Department;
use App\Models\Program;
use App\Models\Talent;
use App\Models\University;
use App\Models\User;

beforeEach(function () {
    $this->rh = User::factory()->asRh()->create();
    $this->mentor = User::factory()->asMentor()->create();
    $this->bolseiro = User::factory()->asBolseiro()->create();
});

describe('index', function () {
    it('rh lista todos os talentos', function () {
        Talent::factory()->count(5)->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/talentos')
            ->assertOk()
            ->assertJsonCount(5, 'data');
    });

    it('mentor lista apenas os seus talentos', function () {
        Talent::factory()->count(2)->create(['mentor_user_id' => $this->mentor->id]);
        Talent::factory()->count(3)->create();

        $this->actingAs($this->mentor)
            ->getJson('/api/v1/talentos')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    });

    it('bolseiro não pode listar talentos', function () {
        $this->actingAs($this->bolseiro)
            ->getJson('/api/v1/talentos')
            ->assertForbidden();
    });

    it('filtra por kind', function () {
        Talent::factory()->count(3)->create(['kind' => TalentKind::Bolseiro]);
        Talent::factory()->count(2)->estagiario()->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/talentos?filter[kind]=bolseiro')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });
});

describe('show', function () {
    it('rh vê qualquer talento', function () {
        $talent = Talent::factory()->create();

        $this->actingAs($this->rh)
            ->getJson("/api/v1/talentos/{$talent->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $talent->id);
    });

    it('talento vê o próprio perfil', function () {
        $talent = Talent::factory()->create();
        $user = User::factory()->asBolseiro()->create(['talent_id' => $talent->id]);

        $this->actingAs($user)
            ->getJson("/api/v1/talentos/{$talent->id}")
            ->assertOk();
    });

    it('talento não vê outro talento', function () {
        $talentA = Talent::factory()->create();
        $talentB = Talent::factory()->create();
        $user = User::factory()->asBolseiro()->create(['talent_id' => $talentA->id]);

        $this->actingAs($user)
            ->getJson("/api/v1/talentos/{$talentB->id}")
            ->assertForbidden();
    });
});

describe('store', function () {
    it('rh cria talento', function () {
        $program = Program::factory()->create();
        $university = University::factory()->create();
        $department = Department::factory()->create();

        $this->actingAs($this->rh)
            ->postJson('/api/v1/talentos', [
                'name' => 'Maria Santos',
                'email' => 'maria@test.com',
                'kind' => 'bolseiro',
                'program_id' => $program->id,
                'university_id' => $university->id,
                'department_id' => $department->id,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addYear()->toDateString(),
                'stipend' => 1500.00,
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', TalentStatus::Activo->value);
    });

    it('mentor não pode criar talento', function () {
        $this->actingAs($this->mentor)
            ->postJson('/api/v1/talentos', [])
            ->assertForbidden();
    });
});

describe('update', function () {
    it('rh actualiza talento', function () {
        $talent = Talent::factory()->create();

        $this->actingAs($this->rh)
            ->patchJson("/api/v1/talentos/{$talent->id}", ['observacoes' => 'Excelente desempenho.'])
            ->assertOk()
            ->assertJsonPath('data.observacoes', 'Excelente desempenho.');
    });
});

describe('destroy', function () {
    it('rh apaga talento (soft delete)', function () {
        $talent = Talent::factory()->create();

        $this->actingAs($this->rh)
            ->deleteJson("/api/v1/talentos/{$talent->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('talents', ['id' => $talent->id]);
    });
});
