<?php

namespace App\Http\Controllers\Mensagens;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MensagensController extends Controller
{
    public function index(Request $request): Response
    {
        $mensagens = Message::query()
            ->with(['from'])
            ->where('to_user_id', $request->user()->id)
            ->when($request->boolean('nao_lidas'), fn ($q) => $q->whereNull('read_at'))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('mensagens/index', [
            'mensagens' => $mensagens,
            'naoLidasCount' => Message::where('to_user_id', $request->user()->id)->whereNull('read_at')->count(),
            'filters' => $request->only(['nao_lidas']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('mensagens/create', [
            'utilizadores' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'to_user_id' => ['required', 'integer', 'exists:users,id'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'tipo' => ['nullable', 'string', 'in:geral,notificacao,alerta'],
        ]);

        Message::create([
            ...$validated,
            'from_user_id' => $request->user()->id,
            'tipo' => $validated['tipo'] ?? 'geral',
        ]);

        return redirect()->route('mensagens.index', $request->route('current_team'))
            ->with('success', 'Mensagem enviada com sucesso.');
    }

    public function show(Request $request, Message $mensagem): Response
    {
        abort_unless(
            $mensagem->to_user_id === $request->user()->id || $mensagem->from_user_id === $request->user()->id,
            403,
        );

        if ($mensagem->to_user_id === $request->user()->id && ! $mensagem->read_at) {
            $mensagem->update(['read_at' => now()]);
        }

        return Inertia::render('mensagens/show', [
            'mensagem' => $mensagem->load(['from', 'to']),
        ]);
    }

    public function destroy(Request $request, Message $mensagem): RedirectResponse
    {
        abort_unless($mensagem->from_user_id === $request->user()->id, 403);
        $mensagem->delete();

        return redirect()->route('mensagens.index', $request->route('current_team'))
            ->with('success', 'Mensagem apagada.');
    }
}
