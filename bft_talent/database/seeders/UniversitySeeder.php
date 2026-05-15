<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Seeder;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            ['name' => 'Universidade Agostinho Neto',    'city' => 'Luanda',    'country' => 'AO'],
            ['name' => 'Universidade Católica de Angola', 'city' => 'Luanda',   'country' => 'AO'],
            ['name' => 'Universidade Lusíada de Angola', 'city' => 'Luanda',    'country' => 'AO'],
            ['name' => 'ISCTE-IUL',                      'city' => 'Lisboa',    'country' => 'PT'],
            ['name' => 'Universidade de Coimbra',        'city' => 'Coimbra',   'country' => 'PT'],
            ['name' => 'Universidade do Porto',          'city' => 'Porto',     'country' => 'PT'],
            ['name' => 'Nova SBE',                       'city' => 'Lisboa',    'country' => 'PT'],
            ['name' => 'HEC Paris',                      'city' => 'Paris',     'country' => 'FR'],
            ['name' => 'LSE',                            'city' => 'Londres',   'country' => 'GB'],
            ['name' => 'Universidade de São Paulo',      'city' => 'São Paulo', 'country' => 'BR'],
        ];

        foreach ($universities as $u) {
            University::firstOrCreate(['name' => $u['name']], $u);
        }
    }
}
