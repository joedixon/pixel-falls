import Phaser from 'phaser';
import { GameScene } from './scenes/game-scene';

// Game dimensions - 320x180 is a nice 16:9 pixel art resolution
export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    pixelArt: true, // Prevents anti-aliasing for crisp pixel art
    roundPixels: true, // Rounds pixel positions for sharp rendering
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        // Let Phaser scale to fill the container while maintaining aspect ratio
        min: {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
        },
        max: {
            width: GAME_WIDTH * 8,
            height: GAME_HEIGHT * 8,
        },
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 800 },
            debug: false,
        },
    },
    scene: [GameScene],
};
