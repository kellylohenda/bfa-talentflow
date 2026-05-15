<?php

namespace Database\Factories;

use App\Enums\DocumentCategory;
use App\Enums\DocumentStatus;
use App\Models\Document;
use App\Models\Talent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    public function definition(): array
    {
        static $seq = 1;
        $year = now()->format('Y');
        $talent = Talent::factory()->create();

        return [
            'document_code' => "DOC-{$year}-".str_pad($seq++, 5, '0', STR_PAD_LEFT),
            'owner_type' => 'App\Models\Talent',
            'owner_id' => $talent->id,
            'uploaded_by_user_id' => User::factory()->asRh(),
            'reviewed_by_user_id' => null,
            'name' => fake()->word().'.pdf',
            'category' => fake()->randomElement(DocumentCategory::cases()),
            'version' => '1',
            'mime_type' => 'application/pdf',
            'size_bytes' => fake()->numberBetween(10000, 5000000),
            'storage_path' => 'documents/talent/'.$talent->id.'/'.fake()->uuid().'.pdf',
            'status' => DocumentStatus::Pendente,
            'observacoes' => null,
        ];
    }

    public function aprovado(): static
    {
        return $this->state(['status' => DocumentStatus::Aprovado]);
    }
}
