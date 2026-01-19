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
        $user = auth()->user();

        // Public rooms (waiting, not owned by current user)
        $rooms = GameRoom::where('status', 'waiting')
            ->where('host_id', '!=', $user->id)
            ->with('host:id,name')
            ->latest()
            ->take(10)
            ->get();

        // Rooms the user has joined (including ones they own)
        $myRooms = $user->joinedRooms()
            ->where('status', 'waiting')
            ->with('host:id,name')
            ->latest()
            ->get();

        return Inertia::render('lobby', [
            'rooms' => $rooms,
            'myRooms' => $myRooms,
            'currentCostume' => $user->costume ?? 0,
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

        $user = $request->user();

        $room = GameRoom::create([
            'name' => $validated['name'],
            'host_id' => $user->id,
        ]);

        // Add host as a player in the room
        $room->players()->attach($user->id);

        return redirect()->route('game.show', $room->code);
    }

    public function show(Request $request, string $code): Response|RedirectResponse
    {
        $room = GameRoom::where('code', $code)->first();

        if (! $room) {
            return redirect()->route('lobby')->with('error', 'Room not found');
        }

        // Add user to this room if not already a member
        $user = auth()->user();
        if (! $room->players()->where('user_id', $user->id)->exists()) {
            $room->players()->attach($user->id);
        }

        // Get starting level from query param (default 0)
        $startLevel = (int) $request->query('level', 0);

        return Inertia::render('game', [
            'room' => $room->only(['id', 'code', 'name', 'status', 'max_players']),
            'isHost' => $room->host_id === auth()->id(),
            'playerCostume' => $user->costume ?? 0,
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

    public function leave(GameRoom $room): RedirectResponse
    {
        // Simply redirect to lobby - the WebSocket will handle the leaving event
        // This doesn't remove the user from the room permanently
        return redirect()->route('lobby');
    }

    public function leaveRoom(GameRoom $room): RedirectResponse
    {
        $user = auth()->user();

        // Can't leave a room you own - you must delete it
        if ($room->host_id === $user->id) {
            return redirect()->route('lobby')->with('error', 'You own this room. Delete it instead.');
        }

        // Remove user from the room
        $room->players()->detach($user->id);

        return redirect()->route('lobby');
    }

    public function destroy(GameRoom $room): RedirectResponse
    {
        // Only the host can delete the room
        if ($room->host_id !== auth()->id()) {
            return redirect()->route('lobby')->with('error', 'Only the host can delete this room');
        }

        $room->delete();

        return redirect()->route('lobby');
    }
}
