<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load(['talent.program', 'volunteer']);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'bfa_role' => $user->bfa_role,
            'phone' => $user->phone,
            'talent' => $user->talent,
            'volunteer' => $user->volunteer,
        ]);
    }

    public function bolseiro(Request $request): JsonResponse
    {
        $user = $request->user();
        $talent = $user->talent?->load([
            'program', 'university', 'department', 'mentor',
            'payments', 'tasks', 'absences', 'sessoesBolseiro',
        ]);

        if (! $talent) {
            return response()->json(['message' => 'Perfil de bolseiro não encontrado.'], 404);
        }

        return response()->json($talent);
    }

    public function voluntario(Request $request): JsonResponse
    {
        $user = $request->user();
        $volunteer = $user->volunteer?->load([
            'mentor', 'hoursEntries', 'activityInscricoes.activity',
        ]);

        if (! $volunteer) {
            return response()->json(['message' => 'Perfil de voluntário não encontrado.'], 404);
        }

        return response()->json($volunteer);
    }
}
