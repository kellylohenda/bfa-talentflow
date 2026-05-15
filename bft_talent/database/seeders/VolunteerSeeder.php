<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;

class VolunteerSeeder extends Seeder
{
    public function run(): void
    {
        $mentors = User::whereIn('email', [
            'edmilson@bfa.ao', 'sofia@bfa.ao', 'patricia@bfa.ao',
            'jose@bfa.ao', 'domingos@bfa.ao', 'lina@bfa.ao',
        ])->pluck('id', 'name');

        // VolunteerStatus enum: activo | inactivo | suspenso
        $statusMap = [
            'activo' => 'activo',
            'inactivo' => 'inactivo',
            'desistente' => 'suspenso',
        ];

        $volunteers = [
            ['code' => 'V-001', 'nome' => 'Ana Paula Kiala',   'email' => 'apkiala@bfa.ao',       'phone' => '+244 912 100 001', 'status' => 'activo',    'area' => 'educacao', 'horas' => 48,  'mentor' => 'Edmilson Cardoso', 'inicio' => '2024-02-10'],
            ['code' => 'V-002', 'nome' => 'Carlos Ndombe',     'email' => 'cndombe@bfa.ao',       'phone' => '+244 912 100 002', 'status' => 'activo',    'area' => 'saude',    'horas' => 36,  'mentor' => 'Patrícia Lopes',   'inicio' => '2024-03-05'],
            ['code' => 'V-003', 'nome' => 'Felícia Bumba',     'email' => 'fbumba@gmail.com',     'phone' => '+244 912 100 003', 'status' => 'activo',    'area' => 'saude',    'horas' => 64,  'mentor' => 'Sofia Mendes',     'inicio' => '2024-01-20'],
            ['code' => 'V-004', 'nome' => 'Isac Tchilemba',    'email' => 'itchilemba@gmail.com', 'phone' => '+244 912 100 004', 'status' => 'activo',    'area' => 'educacao', 'horas' => 52,  'mentor' => 'Edmilson Cardoso', 'inicio' => '2024-04-12'],
            ['code' => 'V-005', 'nome' => 'Lurdes Cassinda',   'email' => 'lcassinda@bfa.ao',     'phone' => '+244 912 100 005', 'status' => 'activo',    'area' => 'cultura',  'horas' => 88,  'mentor' => 'José Almeida',     'inicio' => '2023-11-08'],
            ['code' => 'V-006', 'nome' => 'Manuel Songo',      'email' => 'msongo@ucan.edu.ao',   'phone' => '+244 912 100 006', 'status' => 'activo',    'area' => 'ambiente', 'horas' => 40,  'mentor' => 'Domingos Vieira',  'inicio' => '2024-02-28'],
            ['code' => 'V-007', 'nome' => 'Palmira Dala',      'email' => 'pdala@gmail.com',      'phone' => '+244 912 100 007', 'status' => 'activo',    'area' => 'social',   'horas' => 24,  'mentor' => 'Edmilson Cardoso', 'inicio' => '2024-05-15'],
            ['code' => 'V-008', 'nome' => 'Ricardo Catata',    'email' => 'rcatata@bfa.ao',       'phone' => '+244 912 100 008', 'status' => 'activo',    'area' => 'educacao', 'horas' => 20,  'mentor' => 'Patrícia Lopes',   'inicio' => '2024-06-01'],
            ['code' => 'V-009', 'nome' => 'Sofia Mavungo',     'email' => 'smavungo@gmail.com',   'phone' => '+244 912 100 009', 'status' => 'inactivo',  'area' => 'saude',    'horas' => 16,  'mentor' => 'Lina Cazimba',     'inicio' => '2024-03-18'],
            ['code' => 'V-010', 'nome' => 'Tomé Quissama',     'email' => 'tquissama@uan.ao',     'phone' => '+244 912 100 010', 'status' => 'activo',    'area' => 'social',   'horas' => 32,  'mentor' => 'Sofia Mendes',     'inicio' => '2024-07-20'],
            ['code' => 'V-011', 'nome' => 'Verônica Lopes',    'email' => 'vlopes@bfa.ao',        'phone' => '+244 912 100 011', 'status' => 'desistente', 'area' => 'educacao', 'horas' => 12, 'mentor' => 'Domingos Vieira',  'inicio' => '2023-09-14'],
            ['code' => 'V-012', 'nome' => 'Xavier Ngola',      'email' => 'xngola@gmail.com',     'phone' => '+244 912 100 012', 'status' => 'activo',    'area' => 'cultura',  'horas' => 28,  'mentor' => 'José Almeida',     'inicio' => '2024-08-05'],
            ['code' => 'V-013', 'nome' => 'Yara Domingos',     'email' => 'ydomingos@bfa.ao',     'phone' => '+244 912 100 013', 'status' => 'activo',    'area' => 'social',   'horas' => 44,  'mentor' => 'Lina Cazimba',     'inicio' => '2024-01-30'],
            ['code' => 'V-014', 'nome' => 'Zacarias Bula',     'email' => 'zbula@gmail.com',      'phone' => '+244 912 100 014', 'status' => 'activo',    'area' => 'ambiente', 'horas' => 56,  'mentor' => 'Patrícia Lopes',   'inicio' => '2024-04-25'],
            ['code' => 'V-015', 'nome' => 'Adelina Weba',      'email' => 'aweba@gmail.com',      'phone' => '+244 912 100 015', 'status' => 'desistente', 'area' => 'cultura',  'horas' => 8,  'mentor' => 'Sofia Mendes',     'inicio' => '2024-09-10'],
        ];

        foreach ($volunteers as $v) {
            Volunteer::firstOrCreate(
                ['volunteer_code' => $v['code']],
                [
                    'nome' => $v['nome'],
                    'email' => $v['email'],
                    'phone' => $v['phone'],
                    'status' => $statusMap[$v['status']],
                    'area_actuacao' => $v['area'],
                    'total_horas' => $v['horas'],
                    'mentor_user_id' => $mentors[$v['mentor']] ?? null,
                    'data_inicio' => $v['inicio'],
                ],
            );
        }
    }
}
