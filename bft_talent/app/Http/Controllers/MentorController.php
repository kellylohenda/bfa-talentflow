<?php

namespace App\Http\Controllers;

use App\Models\MentorSession;
use App\Models\Talent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $mentees = Talent::query()
            ->where('mentor_user_id', $user->id)
            ->with(['program', 'department'])
            ->latest()
            ->paginate(25)
            ->withQueryString();

        $sessions = MentorSession::query()
            ->where('mentor_user_id', $user->id)
            ->with(['talent'])
            ->latest()
            ->get();

        $evaluations = Talent::query()
            ->where('mentor_user_id', $user->id)
            ->whereNotNull('perf')
            ->get(['id', 'name', 'perf', 'risk_score']);

        return Inertia::render('mentor/index', [
            'mentees' => $mentees,
            'sessions' => $sessions,
            'evaluations' => $evaluations,
        ]);
    }
}
