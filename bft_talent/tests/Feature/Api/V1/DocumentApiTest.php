<?php

use App\Enums\DocumentStatus;
use App\Models\Document;
use App\Models\Talent;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('s3');
    $this->rh = User::factory()->asRh()->create();
    $this->mentor = User::factory()->asMentor()->create();
});

describe('index', function () {
    it('rh lista documentos', function () {
        Document::factory()->count(3)->create();

        $this->actingAs($this->rh)
            ->getJson('/api/v1/documentos')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('filtra por status', function () {
        Document::factory()->count(2)->aprovado()->create();
        Document::factory()->count(1)->create(['status' => DocumentStatus::Pendente]);

        $this->actingAs($this->rh)
            ->getJson('/api/v1/documentos?filter[status]=aprovado')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    });
});

describe('store', function () {
    it('rh faz upload de documento', function () {
        $talent = Talent::factory()->create();
        $file = UploadedFile::fake()->create('contrato.pdf', 100, 'application/pdf');

        $this->actingAs($this->rh)
            ->postJson('/api/v1/documentos', [
                'owner_type' => 'talent',
                'owner_id' => $talent->id,
                'name' => 'Contrato de Bolsa',
                'category' => 'contrato',
                'file' => $file,
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', DocumentStatus::Pendente->value);

        Storage::disk('s3')->assertExists('documents/talent/'.$talent->id.'/'.$file->hashName());
    });
});

describe('revisar', function () {
    it('rh aprova documento', function () {
        $doc = Document::factory()->create(['status' => DocumentStatus::Pendente]);

        $this->actingAs($this->rh)
            ->postJson("/api/v1/documentos/{$doc->id}/revisar", [
                'status' => 'aprovado',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', DocumentStatus::Aprovado->value);
    });

    it('mentor não pode revisar documento', function () {
        $doc = Document::factory()->create();

        $this->actingAs($this->mentor)
            ->postJson("/api/v1/documentos/{$doc->id}/revisar", ['status' => 'aprovado'])
            ->assertForbidden();
    });
});

describe('destroy', function () {
    it('rh apaga documento e remove do S3', function () {
        $doc = Document::factory()->create();

        $this->actingAs($this->rh)
            ->deleteJson("/api/v1/documentos/{$doc->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('documents', ['id' => $doc->id]);
    });
});
