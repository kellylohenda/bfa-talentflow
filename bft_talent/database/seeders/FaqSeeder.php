<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['question' => 'Quem pode candidatar-se?', 'answer' => 'Cidadãos angolanos com licenciatura concluída ou em fase final, idade até 28 anos para o Futuro BFA, e até 32 anos para a Bolsa Internacional.', 'sort_order' => 1],
            ['question' => 'A candidatura tem custo?', 'answer' => 'Não. Todo o processo de candidatura é gratuito, incluindo as provas online e o Assessment Day presencial.', 'sort_order' => 2],
            ['question' => 'Posso candidatar-me a mais que um programa?', 'answer' => 'Sim, podes indicar até dois programas por ordem de preferência no mesmo formulário.', 'sort_order' => 3],
            ['question' => 'O que cobre a Bolsa Internacional?', 'answer' => 'Propinas integrais, subsídio mensal de subsistência, alojamento, viagens anuais a Luanda e seguro de saúde internacional.', 'sort_order' => 4],
            ['question' => 'Há vagas para estudantes das províncias?', 'answer' => 'Sim. A Bolsa Nacional reserva 30% das vagas para estudantes em universidades fora de Luanda.', 'sort_order' => 5],
            ['question' => 'Como são protegidos os meus dados pessoais?', 'answer' => 'Cumprimos integralmente a Lei 22/11 da APD. Tens direito a aceder, corrigir ou solicitar a eliminação dos teus dados.', 'sort_order' => 6],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}
