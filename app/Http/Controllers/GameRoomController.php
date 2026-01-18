<?php

namespace App\Http\Controllers;

use App\Events\PlayerMoved;
use App\Models\GameRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameRoomController extends Controller
{
    public function index(): Response
    {
        $rooms = GameRoom::where('status', 'waiting')
            ->with('host:id,name')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('lobby', [
            'rooms' => $rooms,
            'currentCostume' => auth()->user()->costume ?? 0,
        ]);
    }

    public function updateCostume(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'costume' => ['required', 'integer', 'min:0', 'max:17'],
        ]);

        $request->user()->update(['costume' => $validated['costume']]);

        return response()->json(['status' => 'ok', 'costume' => $validated['costume']]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
        ]);

        $room = GameRoom::create([
            'name' => $validated['name'],
            'host_id' => $request->user()->id,
        ]);

        return redirect()->route('game.show', $room->code);
    }

    public function show(Request $request, string $code): Response|RedirectResponse
    {
        $room = GameRoom::where('code', $code)->first();

        if (! $room) {
            return redirect()->route('lobby')->with('error', 'Room not found');
        }

        // Get starting level from query param (default 0)
        $startLevel = (int) $request->query('level', 0);

        return Inertia::render('game', [
            'room' => $room->only(['id', 'code', 'name', 'status', 'max_players']),
            'isHost' => $room->host_id === auth()->id(),
            'playerCostume' => auth()->user()->costume ?? 0,
            'startLevel' => $startLevel,
        ]);
    }

    public function join(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $room = GameRoom::where('code', strtoupper($validated['code']))->first();

        if (! $room) {
            return back()->withErrors(['code' => 'Room not found']);
        }

        if (! $room->isWaiting()) {
            return back()->withErrors(['code' => 'Game already in progress']);
        }

        return redirect()->route('game.show', $room->code);
    }

    public function practice(int $level): Response
    {
        return Inertia::render('practice', [
            'playerCostume' => auth()->user()->costume ?? 0,
            'startLevel' => $level,
        ]);
    }

    public function move(Request $request, GameRoom $room): JsonResponse
    {
        $validated = $request->validate([
            'x' => ['required', 'numeric'],
            'y' => ['required', 'numeric'],
            'velocityX' => ['required', 'numeric'],
            'velocityY' => ['required', 'numeric'],
            'animation' => ['required', 'string'],
            'flipX' => ['required', 'boolean'],
        ]);

        broadcast(new PlayerMoved(
            $room,
            $request->user(),
            $validated['x'],
            $validated['y'],
            $validated['velocityX'],
            $validated['velocityY'],
            $validated['animation'],
            $validated['flipX'],
        ))->toOthers();

        return response()->json(['status' => 'ok']);
    }
}
