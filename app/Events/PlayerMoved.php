<?php

namespace App\Events;

use App\Models\GameRoom;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerMoved implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public GameRoom $room,
        public User $user,
        public float $x,
        public float $y,
        public float $velocityX,
        public float $velocityY,
        public string $animation,
        public bool $flipX,
    ) {}

    /**
     * @return array<int, PresenceChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('game.'.$this->room->id),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'playerId' => $this->user->id,
            'playerName' => $this->user->name,
            'x' => $this->x,
            'y' => $this->y,
            'velocityX' => $this->velocityX,
            'velocityY' => $this->velocityY,
            'animation' => $this->animation,
            'flipX' => $this->flipX,
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'player.moved';
    }
}
