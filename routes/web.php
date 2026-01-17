<?php

use App\Http\Controllers\GameRoomController;
use App\Http\Controllers\PlayController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/play', PlayController::class)->name('play');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Game lobby and rooms
    Route::get('/lobby', [GameRoomController::class, 'index'])->name('lobby');
    Route::post('/lobby', [GameRoomController::class, 'store'])->name('lobby.store');
    Route::post('/lobby/join', [GameRoomController::class, 'join'])->name('lobby.join');
    Route::post('/lobby/costume', [GameRoomController::class, 'updateCostume'])->name('lobby.costume');
    Route::get('/game/{code}', [GameRoomController::class, 'show'])->name('game.show');
    Route::post('/game/{room}/move', [GameRoomController::class, 'move'])->name('game.move');
});

require __DIR__.'/settings.php';
