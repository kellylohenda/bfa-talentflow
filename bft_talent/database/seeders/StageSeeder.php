<?php

namespace Database\Seeders;

use App\Models\Stage;
use Illuminate\Database\Seeder;

class StageSeeder extends Seeder
{
    public function run(): void
    {
        $stages = [
            ['code' => 'analise', 'label' => 'Em Análise', 'sort' => 1, 'is_terminal' => false],
            ['code' => 'entrevista', 'label' => 'Entrevista', 'sort' => 2, 'is_terminal' => false],
            ['code' => 'avaliacao', 'label' => 'Avaliação', 'sort' => 3, 'is_terminal' => false],
            ['code' => 'oferta', 'label' => 'Oferta', 'sort' => 4, 'is_terminal' => false],
            ['code' => 'convertido', 'label' => 'Convertido', 'sort' => 5, 'is_terminal' => true],
            ['code' => 'rejeitado', 'label' => 'Rejeitado', 'sort' => 6, 'is_terminal' => true],
        ];

        foreach ($stages as $stage) {
            Stage::firstOrCreate(['code' => $stage['code']], $stage);
        }
    }
}
