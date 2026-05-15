<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class EventoSeeder extends Seeder
{
    public function run(): void
    {
        // EventoTipo enum: formacao | palestra | workshop | networking | outro
        // EventoFormato enum: presencial | online | hibrido
        // EventoStatus enum: planeado | confirmado | concluido | cancelado
        $tipoMap = [
            'formacao' => 'formacao',
            'workshop' => 'workshop',
            'mentoria' => 'outro',
            'convocatoria' => 'outro',
            'evento' => 'outro',
            'avaliacao' => 'outro',
        ];

        $eventos = [
            [
                'code' => 'EV-001',
                'titulo' => 'Workshop: Análise de Crédito Avançada',
                'tipo' => 'workshop',
                'data_inicio' => '2026-05-09 09:00:00',
                'data_fim' => '2026-05-09 13:00:00',
                'local' => 'Sala de Formação A — Sede BFA, Luanda',
                'formato' => 'presencial',
                'vagas' => 20,
                'status' => 'confirmado',
                'descricao' => 'Workshop prático sobre metodologias de análise de crédito corporativo com casos reais do BFA.',
            ],
            [
                'code' => 'EV-002',
                'titulo' => 'Sessão de Mentoria — Grupo Futuro BFA',
                'tipo' => 'mentoria',
                'data_inicio' => '2026-05-12 15:00:00',
                'data_fim' => '2026-05-12 16:30:00',
                'local' => 'Sala de Reuniões 3 — Sede BFA',
                'formato' => 'presencial',
                'vagas' => null,
                'status' => 'confirmado',
                'descricao' => 'Sessão colectiva de mentoria para todos os estagiários Futuro BFA.',
            ],
            [
                'code' => 'EV-003',
                'titulo' => 'Formação: Compliance e Regulação Bancária 2026',
                'tipo' => 'formacao',
                'data_inicio' => '2026-05-14 08:30:00',
                'data_fim' => '2026-05-14 17:30:00',
                'local' => 'Auditório BFA — Sede, Luanda',
                'formato' => 'presencial',
                'vagas' => 60,
                'status' => 'confirmado',
                'descricao' => 'Actualização anual obrigatória sobre normas de compliance, FATF, BNA e prevenção de branqueamento de capitais.',
            ],
            [
                'code' => 'EV-004',
                'titulo' => 'Convocatória — Avaliação Intercalar Q2 2026',
                'tipo' => 'convocatoria',
                'data_inicio' => '2026-05-19 09:00:00',
                'data_fim' => '2026-05-19 17:00:00',
                'local' => 'Sala de Avaliações — RH, Piso 4',
                'formato' => 'presencial',
                'vagas' => null,
                'status' => 'planeado',
                'descricao' => 'Avaliação de desempenho intercalar do 2º trimestre. Presença obrigatória.',
            ],
            [
                'code' => 'EV-005',
                'titulo' => 'Workshop: Liderança e Comunicação Executiva',
                'tipo' => 'workshop',
                'data_inicio' => '2026-05-21 09:00:00',
                'data_fim' => '2026-05-21 17:00:00',
                'local' => 'Centro de Formação BFA — Miramar',
                'formato' => 'presencial',
                'vagas' => 15,
                'status' => 'planeado',
                'descricao' => 'Desenvolvimento de soft skills de liderança, apresentações executivas e comunicação de impacto.',
            ],
            [
                'code' => 'EV-006',
                'titulo' => 'Actividade de Voluntariado — Escola Primária Sambizanga',
                'tipo' => 'evento',
                'data_inicio' => '2026-05-24 08:00:00',
                'data_fim' => '2026-05-24 14:00:00',
                'local' => 'Escola Primária nº 47 — Sambizanga, Luanda',
                'formato' => 'presencial',
                'vagas' => 30,
                'status' => 'planeado',
                'descricao' => 'Reabilitação de sala de aula e doação de material escolar.',
            ],
            [
                'code' => 'EV-007',
                'titulo' => 'Webinar: Inteligência Artificial na Banca',
                'tipo' => 'formacao',
                'data_inicio' => '2026-05-27 14:00:00',
                'data_fim' => '2026-05-27 16:00:00',
                'local' => 'Online — MS Teams',
                'formato' => 'online',
                'vagas' => 100,
                'status' => 'planeado',
                'descricao' => 'Sessão online sobre aplicações de IA em banca — análise de risco, chatbots, automação de processos.',
            ],
            [
                'code' => 'EV-008',
                'titulo' => 'Avaliação Final — Programa Futuro BFA Y1',
                'tipo' => 'avaliacao',
                'data_inicio' => '2026-06-05 09:00:00',
                'data_fim' => '2026-06-05 17:00:00',
                'local' => 'Sala de Conferências — Sede BFA',
                'formato' => 'presencial',
                'vagas' => null,
                'status' => 'planeado',
                'descricao' => 'Avaliação final do primeiro ano do programa Futuro BFA. Inclui apresentação de projecto e entrevista com painel.',
            ],
            [
                'code' => 'EV-009',
                'titulo' => 'Workshop: Gestão de Carteira e Risco de Mercado',
                'tipo' => 'workshop',
                'data_inicio' => '2026-06-10 09:00:00',
                'data_fim' => '2026-06-10 13:00:00',
                'local' => 'Sala de Formação B — Sede BFA',
                'formato' => 'presencial',
                'vagas' => 15,
                'status' => 'planeado',
                'descricao' => 'Aplicação prática de modelos de Value at Risk (VaR) e gestão de carteiras de activos bancários.',
            ],
            [
                'code' => 'EV-010',
                'titulo' => 'Sessão de Networking — Alumni BFA',
                'tipo' => 'evento',
                'data_inicio' => '2026-06-20 19:00:00',
                'data_fim' => '2026-06-20 22:00:00',
                'local' => 'Restaurante Panorama — Hotel Intercontinental, Luanda',
                'formato' => 'presencial',
                'vagas' => 40,
                'status' => 'planeado',
                'descricao' => 'Jantar de networking com ex-participantes do programa agora funcionários do BFA.',
            ],
        ];

        foreach ($eventos as $e) {
            Evento::firstOrCreate(
                ['event_code' => $e['code']],
                [
                    'titulo' => $e['titulo'],
                    'tipo' => $tipoMap[$e['tipo']],
                    'data_inicio' => $e['data_inicio'],
                    'data_fim' => $e['data_fim'],
                    'local' => $e['local'],
                    'formato' => $e['formato'],
                    'vagas' => $e['vagas'],
                    'status' => $e['status'],
                    'descricao' => $e['descricao'],
                ],
            );
        }
    }
}
