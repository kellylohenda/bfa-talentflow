<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreDocumentRequest;
use App\Http\Resources\Api\V1\DocumentResource;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $documents = Document::query()
            ->with(['uploadedBy', 'reviewedBy'])
            ->when($request->input('filter.owner_type'), fn ($q, $v) => $q->where('owner_type', $v))
            ->when($request->input('filter.owner_id'), fn ($q, $v) => $q->where('owner_id', $v))
            ->when($request->input('filter.status'), fn ($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return DocumentResource::collection($documents);
    }

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $year = now()->format('Y');
        $seq = str_pad(Document::whereYear('created_at', $year)->count() + 1, 5, '0', STR_PAD_LEFT);

        $path = Storage::disk('s3')->put(
            "documents/{$request->validated('owner_type')}/{$request->validated('owner_id')}",
            $file
        );

        $document = Document::create([
            'document_code' => "DOC-{$year}-{$seq}",
            'owner_type' => $request->validated('owner_type'),
            'owner_id' => $request->validated('owner_id'),
            'name' => $request->validated('name'),
            'category' => $request->validated('category'),
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
            'storage_path' => $path,
            'uploaded_by_user_id' => $request->user()->id,
            'status' => 'pendente',
        ]);

        return DocumentResource::make($document->load('uploadedBy'))->response()->setStatusCode(201);
    }

    public function show(Document $document): DocumentResource
    {
        return DocumentResource::make($document->load(['uploadedBy', 'reviewedBy']));
    }

    public function revisar(Request $request, Document $document): DocumentResource|JsonResponse
    {
        abort_unless($request->user()->isRh(), 403, 'Acesso negado.');

        $request->validate([
            'status' => ['required', 'in:aprovado,rejeitado'],
            'observacoes' => ['nullable', 'string', 'max:500'],
        ]);

        $document->update([
            'status' => $request->input('status'),
            'reviewed_by_user_id' => $request->user()->id,
            'observacoes' => $request->input('observacoes'),
        ]);

        return DocumentResource::make($document->fresh(['uploadedBy', 'reviewedBy']));
    }

    public function destroy(Document $document): JsonResponse
    {
        abort_unless(request()->user()->isRh(), 403, 'Acesso negado.');
        Storage::disk('s3')->delete($document->storage_path);
        $document->delete();

        return response()->json(null, 204);
    }
}
