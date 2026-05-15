<?php

namespace App\Http\Controllers;

use App\Enums\DocumentCategory;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComplianceController extends Controller
{
    public function index(Request $request): Response
    {
        $pendentes = Document::where('status', 'pendente')->count();
        $aprovados = Document::where('status', 'aprovado')->count();
        $rejeitados = Document::where('status', 'rejeitado')->count();
        $total = Document::count();
        $conformidadeGeral = $total > 0 ? round(($aprovados / $total) * 100, 1) : 0;

        $contratosActivos = Document::where('category', 'contrato')->where('status', 'aprovado')->count();
        $contratosExpirados = Document::where('category', 'contrato')->where('status', 'rejeitado')->count();

        $categorias = collect(DocumentCategory::cases())->map(fn ($cat) => [
            'nome' => $cat->label(),
            'conformidade' => Document::where('category', $cat->value)->where('status', 'aprovado')->count(),
            'total' => Document::where('category', $cat->value)->count(),
        ])->toArray();

        return Inertia::render('compliance/index', [
            'data' => [
                'conformidadeGeral' => $conformidadeGeral,
                'documentosPendentes' => $pendentes,
                'documentosAprovados' => $aprovados,
                'documentosRejeitados' => $rejeitados,
                'contratosActivos' => $contratosActivos,
                'contratosExpirados' => $contratosExpirados,
                'emConformidade' => $aprovados,
                'naoConformidade' => $rejeitados + $pendentes,
            ],
            'categorias' => $categorias,
        ]);
    }
}
