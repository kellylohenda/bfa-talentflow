<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Talent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $talents = Talent::pluck('id', 'talent_code');

        // Map data.ts payment status → PaymentStatus enum
        $statusMap = [
            'paid' => 'pago',
            'pending' => 'pendente',
            'hold' => 'pendente',
            'failed' => 'cancelado',
        ];

        // Map data.ts payment type → PaymentType enum
        $typeMap = [
            'Subsídio mensal' => 'bolsa',
            'Propina' => 'bolsa',
            'Subsídio subsistência' => 'subsidio_alimentacao',
            'Subsídio de estágio' => 'bolsa',
            'Subsídio instalação' => 'ajuda_custo',
            'Material de trabalho' => 'ajuda_custo',
            'Alojamento' => 'ajuda_custo',
        ];

        $payments = [
            ['ref' => 'P-9821', 'talent' => 'T-1042', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 380000,  'status' => 'paid',    'paid_at' => '2026-04-28'],
            ['ref' => 'P-9822', 'talent' => 'T-1043', 'type' => 'Propina',           'period' => '2026-Q2', 'amount' => 1850000, 'status' => 'paid',    'paid_at' => '2026-04-15'],
            ['ref' => 'P-9823', 'talent' => 'T-1044', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 220000,  'status' => 'pending', 'paid_at' => null],
            ['ref' => 'P-9824', 'talent' => 'T-1045', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 420000,  'status' => 'paid',    'paid_at' => '2026-04-28'],
            ['ref' => 'P-9825', 'talent' => 'T-1046', 'type' => 'Alojamento',        'period' => '2026-04', 'amount' => 480000,  'status' => 'paid',    'paid_at' => '2026-04-20'],
            ['ref' => 'P-9826', 'talent' => 'T-1047', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 240000,  'status' => 'hold',    'paid_at' => null],
            ['ref' => 'P-9827', 'talent' => 'T-1048', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 540000,  'status' => 'paid',    'paid_at' => '2026-04-28'],
            ['ref' => 'P-9828', 'talent' => 'T-1049', 'type' => 'Propina',           'period' => '2026-Q2', 'amount' => 1780000, 'status' => 'failed',  'paid_at' => null],
            ['ref' => 'P-9829', 'talent' => 'T-1051', 'type' => 'Propina',           'period' => '2026-Q2', 'amount' => 2640000, 'status' => 'paid',    'paid_at' => '2026-04-12'],
            ['ref' => 'P-9830', 'talent' => 'T-1052', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 200000,  'status' => 'pending', 'paid_at' => null],
            ['ref' => 'P-9831', 'talent' => 'T-1053', 'type' => 'Subsídio mensal',   'period' => '2026-04', 'amount' => 420000,  'status' => 'paid',    'paid_at' => '2026-04-28'],
            ['ref' => 'P-9832', 'talent' => 'T-1054', 'type' => 'Propina',           'period' => '2026-Q2', 'amount' => 3120000, 'status' => 'paid',    'paid_at' => '2026-04-08'],
        ];

        foreach ($payments as $p) {
            Payment::firstOrCreate(
                ['payment_ref' => $p['ref']],
                [
                    'idempotency_key' => Str::uuid()->toString(),
                    'talent_id' => $talents[$p['talent']] ?? null,
                    'type' => $typeMap[$p['type']] ?? 'outro',
                    'period' => $p['period'],
                    'amount' => $p['amount'],
                    'currency' => 'AOA',
                    'status' => $statusMap[$p['status']],
                    'paid_at' => $p['paid_at'],
                ],
            );
        }
    }
}
