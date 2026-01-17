<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class GameRoom extends Model
{
    /** @use HasFactory<\Database\Factories\GameRoomFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'host_id',
        'status',
        'max_players',
    ];

    protected static function booted(): void
    {
        static::creating(function (GameRoom $room) {
            if (empty($room->code)) {
                $room->code = self::generateUniqueCode();
            }
        });
    }

    public static function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (self::where('code', $code)->exists());

        return $code;
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function isWaiting(): bool
    {
        return $this->status === 'waiting';
    }

    public function isPlaying(): bool
    {
        return $this->status === 'playing';
    }
}
