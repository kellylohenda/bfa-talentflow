<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            'Banca de Empresas',
            'Banca de Retalho',
            'Tesouraria',
            'Risco de Crédito',
            'Compliance',
            'TI / Sistemas',
            'Marketing',
            'Recursos Humanos',
            'Auditoria Interna',
            'Operações',
            'Banca Privada',
        ];

        foreach ($departments as $name) {
            Department::firstOrCreate(['name' => $name]);
        }
    }
}
