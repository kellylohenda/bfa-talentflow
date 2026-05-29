<?php

namespace App\Http\Controllers\Documentos;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentosController extends Controller
{
    public function index(Request $request): Response
    {
        $isStaff = $request->user()->bfa_role?->isStaff() ?? false;

        $documentos = Document::query()
            ->with(['owner'])
            ->when(! $isStaff, fn ($q) => $q->where('user_id', $request->user()->id))
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('category'), fn ($q, $v) => $q->where('category', $v))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('documentos/index', [
            'documentos' => $documentos,
            'filters' => $request->only(['status', 'category']),
        ]);
    }

    public function show(Request $request, Document $documento): Response
    {
        $isStaff = $request->user()->bfa_role?->isStaff() ?? false;
        abort_unless($isStaff || $documento->user_id === $request->user()->id, 403);

        return Inertia::render('documentos/show', [
            'documento' => $documento->load('owner'),
        ]);
    }

    public function destroy(Request $request, Document $documento): RedirectResponse
    {
        $this->authorize('gerir-talentos');

        if ($documento->storage_path) {
            Storage::disk('s3')->delete($documento->storage_path);
        }

        $documento->delete();

        return redirect()->route('documentos.index', $request->route('current_team'))
            ->with('success', 'Documento removido.');
    }
}
