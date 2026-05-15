<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DepartmentResource;
use App\Http\Resources\Api\V1\ProgramResource;
use App\Http\Resources\Api\V1\UniversityResource;
use App\Models\Department;
use App\Models\Program;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CatalogController extends Controller
{
    // Programas
    public function programs(): AnonymousResourceCollection
    {
        return ProgramResource::collection(Program::where('activo', true)->orderBy('name')->get());
    }

    public function storeProgram(Request $request): JsonResponse
    {
        abort_unless($request->user()->isRh(), 403, 'Acesso negado.');

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:10', 'unique:programs,code'],
            'name' => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string'],
        ]);

        $program = Program::create($validated);

        return ProgramResource::make($program)->response()->setStatusCode(201);
    }

    // Universidades
    public function universities(Request $request): AnonymousResourceCollection
    {
        $universities = University::query()
            ->when($request->input('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->where('activa', true)
            ->orderBy('name')
            ->get();

        return UniversityResource::collection($universities);
    }

    public function storeUniversity(Request $request): JsonResponse
    {
        abort_unless($request->user()->isRh(), 403, 'Acesso negado.');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:universities,name'],
            'city' => ['required', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'size:2'],
        ]);

        $university = University::create($validated);

        return UniversityResource::make($university)->response()->setStatusCode(201);
    }

    // Departamentos
    public function departments(): AnonymousResourceCollection
    {
        return DepartmentResource::collection(Department::where('activo', true)->orderBy('name')->get());
    }

    public function storeDepartment(Request $request): JsonResponse
    {
        abort_unless($request->user()->isRh(), 403, 'Acesso negado.');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
            'codigo' => ['nullable', 'string', 'max:20', 'unique:departments,codigo'],
        ]);

        $department = Department::create($validated);

        return DepartmentResource::make($department)->response()->setStatusCode(201);
    }
}
