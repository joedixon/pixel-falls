<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Game room presence channel - returns user info for presence tracking
Broadcast::channel('game.{roomId}', function (User $user, int $roomId) {
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});
