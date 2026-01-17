import Phaser from 'phaser';

import { GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, WORLD_HEIGHT } from '../config';

// Costume palettes (must match costumes.ts)
// type: 'ears' = animal with ears, 'frog' = big eyes on top, 'bird' = no ears, 'bunny' = tall ears, 'bean' = jellybean
const COSTUMES_DATA = [
    { // Cat
        body: 0xf59e0b, bodyDark: 0xd97706, belly: 0xfef3c7,
        ears: 0xf59e0b, earInner: 0xfecaca, nose: 0xec4899, eyes: 0x22c55e, type: 'ears',
    },
    { // Dog
        body: 0x92400e, bodyDark: 0x78350f, belly: 0xfef3c7,
        ears: 0x78350f, earInner: 0xfecaca, nose: 0x1f2937, eyes: 0x1f2937, type: 'ears',
    },
    { // Bunny
        body: 0xfafafa, bodyDark: 0xe5e5e5, belly: 0xfafafa,
        ears: 0xfafafa, earInner: 0xfecaca, nose: 0xec4899, eyes: 0xef4444, type: 'bunny',
    },
    { // Fox
        body: 0xea580c, bodyDark: 0xc2410c, belly: 0xfef3c7,
        ears: 0xea580c, earInner: 0x1f2937, nose: 0x1f2937, eyes: 0xf59e0b, type: 'ears',
    },
    { // Panda
        body: 0xfafafa, bodyDark: 0xe5e5e5, belly: 0xfafafa,
        ears: 0x1f2937, earInner: 0x1f2937, nose: 0x1f2937, eyes: 0x1f2937, type: 'ears',
    },
    { // Frog
        body: 0x22c55e, bodyDark: 0x16a34a, belly: 0xbbf7d0,
        ears: 0x22c55e, earInner: 0x22c55e, nose: 0x16a34a, eyes: 0xfef08a, type: 'frog',
    },
    { // Bear
        body: 0x78350f, bodyDark: 0x451a03, belly: 0xa16207,
        ears: 0x78350f, earInner: 0xa16207, nose: 0x1f2937, eyes: 0x1f2937, type: 'ears',
    },
    { // Penguin
        body: 0x1f2937, bodyDark: 0x111827, belly: 0xfafafa,
        ears: 0x1f2937, earInner: 0x1f2937, nose: 0xf97316, eyes: 0xfafafa, type: 'bird',
    },
    { // Pink Bean
        body: 0xf472b6, bodyDark: 0xec4899, belly: 0xfafafa,
        ears: 0xf472b6, earInner: 0xf472b6, nose: 0xf472b6, eyes: 0x1f2937, type: 'bean',
    },
    { // Blue Bean
        body: 0x60a5fa, bodyDark: 0x3b82f6, belly: 0xfafafa,
        ears: 0x60a5fa, earInner: 0x60a5fa, nose: 0x60a5fa, eyes: 0x1f2937, type: 'bean',
    },
    { // Yellow Bean
        body: 0xfbbf24, bodyDark: 0xf59e0b, belly: 0xfafafa,
        ears: 0xfbbf24, earInner: 0xfbbf24, nose: 0xfbbf24, eyes: 0x1f2937, type: 'bean',
    },
    { // Green Bean
        body: 0x4ade80, bodyDark: 0x22c55e, belly: 0xfafafa,
        ears: 0x4ade80, earInner: 0x4ade80, nose: 0x4ade80, eyes: 0x1f2937, type: 'bean',
    },
    { // Mario
        body: 0xdc2626, bodyDark: 0xb91c1c, belly: 0x3b82f6,
        ears: 0xdc2626, earInner: 0xdc2626, nose: 0xfcd34d, eyes: 0x1f2937, type: 'mario',
    },
    { // Luigi
        body: 0x22c55e, bodyDark: 0x16a34a, belly: 0x3b82f6,
        ears: 0x22c55e, earInner: 0x22c55e, nose: 0xfcd34d, eyes: 0x1f2937, type: 'luigi',
    },
    { // Yoshi
        body: 0x22c55e, bodyDark: 0x16a34a, belly: 0xfafafa,
        ears: 0x22c55e, earInner: 0xef4444, nose: 0x22c55e, eyes: 0x1f2937, type: 'yoshi',
    },
    { // DK
        body: 0x92400e, bodyDark: 0x78350f, belly: 0xd4a574,
        ears: 0x92400e, earInner: 0xd4a574, nose: 0x78350f, eyes: 0x1f2937, type: 'dk',
    },
] as const;

const GROUND_COLORS = {
    grass: 0x4ade80,
    grassDark: 0x22c55e,
    dirt: 0x92400e,
    dirtDark: 0x78350f,
};

interface RemotePlayer {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    nameText: Phaser.GameObjects.Text;
    targetX: number;
    targetY: number;
}

interface PlayerMovedData {
    playerId: number;
    playerName: string;
    costume: number;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    animation: string;
    flipX: boolean;
}

export class MultiplayerGameScene extends Phaser.Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private playerNameText!: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
        SPACE: Phaser.Input.Keyboard.Key;
    };
    private ground!: Phaser.Physics.Arcade.StaticGroup;
    private lava!: Phaser.Physics.Arcade.StaticGroup;
    private finishLine!: Phaser.Physics.Arcade.Sprite;
    private hasFinished = false;
    private spawnX = 64;
    private spawnY = WORLD_HEIGHT - 40;
    private victoryText?: Phaser.GameObjects.Text;
    private remotePlayers: Map<string, RemotePlayer> = new Map();
    private lastSentPosition = { x: 0, y: 0 };
    private sendInterval = 50; // Send position every 50ms
    private lastSendTime = 0;
    private lastHeartbeatTime = 0;
    private heartbeatInterval = 2000; // Send heartbeat every 2 seconds

    constructor(
        private roomId: number,
        private playerId: number,
        private playerName: string,
        private playerCostume: number = 0,
    ) {
        super({ key: 'MultiplayerGameScene' });
    }

    preload(): void {
        // Create animal sprites for all costumes
        for (let i = 0; i < COSTUMES_DATA.length; i++) {
            this.createAnimalSprites(i);
        }
        this.createGroundTile();
        this.createLavaSprite();
        this.createFinishLineSprite();
    }

    private createAnimalSprites(costumeIndex: number): void {
        const frameWidth = 16;
        const frameHeight = 16;
        const frameCount = 5;
        const costume = COSTUMES_DATA[costumeIndex];

        const canvas = document.createElement('canvas');
        canvas.width = frameWidth * frameCount;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d')!;

        for (let frame = 0; frame < frameCount; frame++) {
            const offsetX = frame * frameWidth;
            this.drawAnimalFrame(ctx, offsetX, frame, costume);
        }

        this.textures.addSpriteSheet(`player_${costumeIndex}`, canvas, {
            frameWidth,
            frameHeight,
        });
    }

    private drawAnimalFrame(
        ctx: CanvasRenderingContext2D,
        offsetX: number,
        frame: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const walkOffset = frame === 0 ? 0 : Math.sin((frame / 4) * Math.PI * 2);
        const bobY = frame === 0 ? 0 : Math.abs(walkOffset) * 1;

        const pixel = (x: number, y: number, color: number) => {
            ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
            ctx.fillRect(offsetX + x, y - bobY, 1, 1);
        };

        switch (c.type) {
            case 'bean':
                this.drawBeanFrame(pixel, frame, walkOffset, c);
                break;
            case 'frog':
                this.drawFrogFrame(pixel, frame, walkOffset, c);
                break;
            case 'bird':
                this.drawBirdFrame(pixel, frame, walkOffset, c);
                break;
            case 'bunny':
                this.drawBunnyFrame(pixel, frame, walkOffset, c);
                break;
            case 'mario':
            case 'luigi':
                this.drawMarioBroFrame(pixel, frame, walkOffset, c);
                break;
            case 'yoshi':
                this.drawYoshiFrame(pixel, frame, walkOffset, c);
                break;
            case 'dk':
                this.drawDKFrame(pixel, frame, walkOffset, c);
                break;
            default:
                this.drawAnimalWithEarsFrame(pixel, frame, walkOffset, c);
        }
    }

    private drawBeanFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const WHITE = 0xfafafa;
        
        // Top of head - NO EARS, smooth round top
        pixel(6, 1, c.body);
        pixel(7, 1, c.body);
        pixel(8, 1, c.body);
        pixel(9, 1, c.body);
        
        // Upper head
        pixel(5, 2, c.body);
        pixel(6, 2, c.body);
        pixel(7, 2, c.body);
        pixel(8, 2, c.body);
        pixel(9, 2, c.body);
        pixel(10, 2, c.body);
        
        // Eye level - big cute eyes (white with dark pupil)
        pixel(5, 3, c.body);
        pixel(6, 3, WHITE);
        pixel(7, 3, c.eyes);
        pixel(8, 3, WHITE);
        pixel(9, 3, c.eyes);
        pixel(10, 3, c.body);
        
        // Below eyes
        pixel(5, 4, c.body);
        pixel(6, 4, c.body);
        pixel(7, 4, c.body);
        pixel(8, 4, c.body);
        pixel(9, 4, c.body);
        pixel(10, 4, c.body);
        
        // Body - SOLID COLOR (no belly), jellybean shape
        pixel(4, 5, c.body);
        pixel(5, 5, c.body);
        pixel(6, 5, c.body);
        pixel(7, 5, c.body);
        pixel(8, 5, c.body);
        pixel(9, 5, c.body);
        pixel(10, 5, c.body);
        pixel(11, 5, c.body);
        
        pixel(4, 6, c.body);
        pixel(5, 6, c.body);
        pixel(6, 6, c.body);
        pixel(7, 6, c.body);
        pixel(8, 6, c.body);
        pixel(9, 6, c.body);
        pixel(10, 6, c.body);
        pixel(11, 6, c.body);
        
        pixel(4, 7, c.body);
        pixel(5, 7, c.body);
        pixel(6, 7, c.body);
        pixel(7, 7, c.body);
        pixel(8, 7, c.body);
        pixel(9, 7, c.body);
        pixel(10, 7, c.body);
        pixel(11, 7, c.body);
        
        // Lower body
        pixel(5, 8, c.body);
        pixel(6, 8, c.body);
        pixel(7, 8, c.body);
        pixel(8, 8, c.body);
        pixel(9, 8, c.body);
        pixel(10, 8, c.body);
        
        // Stubby arms with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(3, 5 + armSwing, c.body);
        pixel(3, 6 + armSwing, c.body);
        pixel(12, 5 - armSwing, c.body);
        pixel(12, 6 - armSwing, c.body);
        
        // Stubby legs with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(5, 9, c.bodyDark);
        pixel(6, 9 + legOffset, c.bodyDark);
        pixel(9, 9 - legOffset, c.bodyDark);
        pixel(10, 9, c.bodyDark);
        pixel(5, 10, c.bodyDark);
        pixel(6, 10 + legOffset, c.bodyDark);
        pixel(9, 10 - legOffset, c.bodyDark);
        pixel(10, 10, c.bodyDark);
        // Bottom of feet
        pixel(5, 11, c.bodyDark);
        pixel(6, 11 + legOffset, c.bodyDark);
        pixel(9, 11 - legOffset, c.bodyDark);
        pixel(10, 11, c.bodyDark);
    }

    private drawFrogFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        // Big bulging eyes on TOP (frog style)
        pixel(5, 1, c.eyes);
        pixel(6, 1, c.eyes);
        pixel(9, 1, c.eyes);
        pixel(10, 1, c.eyes);
        pixel(5, 2, c.body);
        pixel(6, 2, 0x1f2937); // Pupil
        pixel(9, 2, 0x1f2937);
        pixel(10, 2, c.body);

        // Wide flat head
        pixel(5, 3, c.body);
        pixel(6, 3, c.body);
        pixel(7, 3, c.body);
        pixel(8, 3, c.body);
        pixel(9, 3, c.body);
        pixel(10, 3, c.body);
        
        // Mouth line
        pixel(5, 4, c.body);
        pixel(6, 4, c.body);
        pixel(7, 4, c.bodyDark);
        pixel(8, 4, c.bodyDark);
        pixel(9, 4, c.body);
        pixel(10, 4, c.body);

        // Body
        pixel(5, 5, c.body);
        pixel(6, 5, c.belly);
        pixel(7, 5, c.belly);
        pixel(8, 5, c.belly);
        pixel(9, 5, c.belly);
        pixel(10, 5, c.body);
        
        pixel(5, 6, c.body);
        pixel(6, 6, c.belly);
        pixel(7, 6, c.belly);
        pixel(8, 6, c.belly);
        pixel(9, 6, c.belly);
        pixel(10, 6, c.body);
        
        pixel(5, 7, c.body);
        pixel(6, 7, c.belly);
        pixel(7, 7, c.belly);
        pixel(8, 7, c.belly);
        pixel(9, 7, c.belly);
        pixel(10, 7, c.body);

        // Arms with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 5 + armSwing, c.body);
        pixel(4, 6 + armSwing, c.body);
        pixel(11, 5 - armSwing, c.body);
        pixel(11, 6 - armSwing, c.body);

        // Froggy legs with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 8, c.bodyDark);
        pixel(5, 8 + legOffset, c.bodyDark);
        pixel(6, 8 + legOffset, c.bodyDark);
        pixel(9, 8 - legOffset, c.bodyDark);
        pixel(10, 8 - legOffset, c.bodyDark);
        pixel(11, 8, c.bodyDark);
        // Extended legs to match ground
        pixel(4, 9, c.bodyDark);
        pixel(5, 9 + legOffset, c.bodyDark);
        pixel(6, 9 + legOffset, c.bodyDark);
        pixel(9, 9 - legOffset, c.bodyDark);
        pixel(10, 9 - legOffset, c.bodyDark);
        pixel(11, 9, c.bodyDark);
        pixel(5, 10, c.bodyDark);
        pixel(6, 10 + legOffset, c.bodyDark);
        pixel(9, 10 - legOffset, c.bodyDark);
        pixel(10, 10, c.bodyDark);
        pixel(5, 11, c.bodyDark);
        pixel(6, 11 + legOffset, c.bodyDark);
        pixel(9, 11 - legOffset, c.bodyDark);
        pixel(10, 11, c.bodyDark);
    }

    private drawBirdFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        // Round head, no ears
        pixel(6, 2, c.body);
        pixel(7, 2, c.body);
        pixel(8, 2, c.body);
        pixel(9, 2, c.body);
        
        pixel(5, 3, c.body);
        pixel(6, 3, c.body);
        pixel(7, 3, c.body);
        pixel(8, 3, c.body);
        pixel(9, 3, c.body);
        pixel(10, 3, c.body);
        
        // Eyes
        pixel(5, 4, c.body);
        pixel(6, 4, c.eyes);
        pixel(7, 4, c.body);
        pixel(8, 4, c.body);
        pixel(9, 4, c.eyes);
        pixel(10, 4, c.body);
        
        // Beak
        pixel(5, 5, c.body);
        pixel(6, 5, c.body);
        pixel(7, 5, c.nose);
        pixel(8, 5, c.nose);
        pixel(9, 5, c.body);
        pixel(10, 5, c.body);
        pixel(7, 6, c.nose);

        // Body with white belly
        pixel(5, 6, c.body);
        pixel(6, 6, c.belly);
        pixel(7, 6, c.belly);
        pixel(8, 6, c.belly);
        pixel(9, 6, c.body);
        pixel(10, 6, c.body);
        
        pixel(5, 7, c.body);
        pixel(6, 7, c.belly);
        pixel(7, 7, c.belly);
        pixel(8, 7, c.belly);
        pixel(9, 7, c.body);
        pixel(10, 7, c.body);
        
        pixel(5, 8, c.body);
        pixel(6, 8, c.belly);
        pixel(7, 8, c.belly);
        pixel(8, 8, c.belly);
        pixel(9, 8, c.body);
        pixel(10, 8, c.body);

        // Flippers/wings with waddle
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 6 + armSwing, c.body);
        pixel(4, 7 + armSwing, c.body);
        pixel(11, 6 - armSwing, c.body);
        pixel(11, 7 - armSwing, c.body);

        // Orange feet with waddle
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(6, 9 + legOffset, c.nose);
        pixel(7, 9 + legOffset, c.nose);
        pixel(8, 9 - legOffset, c.nose);
        pixel(9, 9 - legOffset, c.nose);
        pixel(6, 10 + legOffset, c.nose);
        pixel(7, 10 + legOffset, c.nose);
        pixel(8, 10 - legOffset, c.nose);
        pixel(9, 10 - legOffset, c.nose);
        pixel(6, 11 + legOffset, c.nose);
        pixel(7, 11 + legOffset, c.nose);
        pixel(8, 11 - legOffset, c.nose);
        pixel(9, 11 - legOffset, c.nose);
    }

    private drawBunnyFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        // Tall bunny ears!
        pixel(5, 0, c.ears);
        pixel(10, 0, c.ears);
        pixel(5, 1, c.ears);
        pixel(6, 1, c.earInner);
        pixel(9, 1, c.earInner);
        pixel(10, 1, c.ears);
        pixel(5, 2, c.ears);
        pixel(6, 2, c.earInner);
        pixel(9, 2, c.earInner);
        pixel(10, 2, c.ears);

        // Head
        pixel(6, 3, c.body);
        pixel(7, 3, c.body);
        pixel(8, 3, c.body);
        pixel(9, 3, c.body);
        
        pixel(5, 4, c.body);
        pixel(6, 4, c.eyes);
        pixel(7, 4, c.body);
        pixel(8, 4, c.body);
        pixel(9, 4, c.eyes);
        pixel(10, 4, c.body);
        
        // Nose
        pixel(5, 5, c.body);
        pixel(6, 5, c.body);
        pixel(7, 5, c.nose);
        pixel(8, 5, c.nose);
        pixel(9, 5, c.body);
        pixel(10, 5, c.body);

        // Body
        pixel(6, 6, c.body);
        pixel(7, 6, c.belly);
        pixel(8, 6, c.belly);
        pixel(9, 6, c.body);
        pixel(5, 7, c.body);
        pixel(6, 7, c.body);
        pixel(7, 7, c.belly);
        pixel(8, 7, c.belly);
        pixel(9, 7, c.body);
        pixel(10, 7, c.body);
        pixel(5, 8, c.body);
        pixel(6, 8, c.body);
        pixel(7, 8, c.belly);
        pixel(8, 8, c.belly);
        pixel(9, 8, c.body);
        pixel(10, 8, c.body);

        // Arms with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 7 + armSwing, c.body);
        pixel(4, 8 + armSwing, c.body);
        pixel(11, 7 - armSwing, c.body);
        pixel(11, 8 - armSwing, c.body);

        // Feet with hop animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(5, 9, c.bodyDark);
        pixel(6, 9 + legOffset, c.bodyDark);
        pixel(9, 9 - legOffset, c.bodyDark);
        pixel(10, 9, c.bodyDark);
        pixel(5, 10, c.bodyDark);
        pixel(6, 10 + legOffset, c.bodyDark);
        pixel(9, 10 - legOffset, c.bodyDark);
        pixel(10, 10, c.bodyDark);
        pixel(5, 11, c.bodyDark);
        pixel(6, 11 + legOffset, c.bodyDark);
        pixel(9, 11 - legOffset, c.bodyDark);
        pixel(10, 11, c.bodyDark);
    }

    private drawAnimalWithEarsFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        // Ears (top)
        pixel(4, 1, c.ears);
        pixel(5, 1, c.ears);
        pixel(10, 1, c.ears);
        pixel(11, 1, c.ears);
        pixel(4, 2, c.earInner);
        pixel(5, 2, c.ears);
        pixel(10, 2, c.ears);
        pixel(11, 2, c.earInner);

        // Head
        pixel(6, 2, c.body);
        pixel(7, 2, c.body);
        pixel(8, 2, c.body);
        pixel(9, 2, c.body);
        pixel(5, 3, c.body);
        pixel(6, 3, c.body);
        pixel(7, 3, c.body);
        pixel(8, 3, c.body);
        pixel(9, 3, c.body);
        pixel(10, 3, c.body);

        // Face row with eyes
        pixel(5, 4, c.body);
        pixel(6, 4, c.eyes);
        pixel(7, 4, c.body);
        pixel(8, 4, c.body);
        pixel(9, 4, c.eyes);
        pixel(10, 4, c.body);

        // Snout/nose row
        pixel(5, 5, c.body);
        pixel(6, 5, c.body);
        pixel(7, 5, c.nose);
        pixel(8, 5, c.nose);
        pixel(9, 5, c.body);
        pixel(10, 5, c.body);

        // Body
        pixel(6, 6, c.body);
        pixel(7, 6, c.belly);
        pixel(8, 6, c.belly);
        pixel(9, 6, c.body);
        pixel(5, 7, c.body);
        pixel(6, 7, c.body);
        pixel(7, 7, c.belly);
        pixel(8, 7, c.belly);
        pixel(9, 7, c.body);
        pixel(10, 7, c.body);
        pixel(5, 8, c.body);
        pixel(6, 8, c.body);
        pixel(7, 8, c.belly);
        pixel(8, 8, c.belly);
        pixel(9, 8, c.body);
        pixel(10, 8, c.body);
        pixel(6, 9, c.body);
        pixel(7, 9, c.belly);
        pixel(8, 9, c.belly);
        pixel(9, 9, c.body);

        // Arms with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 7 + armSwing, c.body);
        pixel(4, 8 + armSwing, c.body);
        pixel(11, 7 - armSwing, c.body);
        pixel(11, 8 - armSwing, c.body);

        // Legs/feet with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(6, 10, c.bodyDark);
        pixel(7, 10 + legOffset, c.bodyDark);
        pixel(8, 10 - legOffset, c.bodyDark);
        pixel(9, 10, c.bodyDark);
        pixel(5, 11, c.bodyDark);
        pixel(6, 11 + legOffset, c.bodyDark);
        pixel(9, 11 - legOffset, c.bodyDark);
        pixel(10, 11, c.bodyDark);
    }

    private drawMarioBroFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const SKIN = c.nose; // Skin tone stored in nose field
        const CAP = c.body;
        const OVERALLS = c.belly;
        const BROWN = 0x78350f;
        const GOLD = 0xfbbf24;
        
        // Cap top
        pixel(6, 0, CAP);
        pixel(7, 0, CAP);
        pixel(8, 0, CAP);
        pixel(9, 0, CAP);
        
        // Cap brim and face
        pixel(5, 1, CAP);
        pixel(6, 1, CAP);
        pixel(7, 1, CAP);
        pixel(8, 1, CAP);
        pixel(9, 1, CAP);
        pixel(10, 1, CAP);
        
        // Hair and forehead
        pixel(4, 2, BROWN);
        pixel(5, 2, BROWN);
        pixel(6, 2, SKIN);
        pixel(7, 2, SKIN);
        pixel(8, 2, SKIN);
        pixel(9, 2, SKIN);
        pixel(10, 2, BROWN);
        
        // Eyes level
        pixel(4, 3, BROWN);
        pixel(5, 3, SKIN);
        pixel(6, 3, c.eyes);
        pixel(7, 3, SKIN);
        pixel(8, 3, SKIN);
        pixel(9, 3, c.eyes);
        pixel(10, 3, SKIN);
        
        // Nose and cheeks
        pixel(5, 4, SKIN);
        pixel(6, 4, SKIN);
        pixel(7, 4, SKIN);
        pixel(8, 4, SKIN);
        pixel(9, 4, SKIN);
        pixel(10, 4, SKIN);
        
        // Mustache
        pixel(4, 5, BROWN);
        pixel(5, 5, BROWN);
        pixel(6, 5, BROWN);
        pixel(7, 5, SKIN);
        pixel(8, 5, SKIN);
        pixel(9, 5, BROWN);
        pixel(10, 5, BROWN);
        pixel(11, 5, BROWN);
        
        // Shirt (matches cap color)
        pixel(5, 6, CAP);
        pixel(6, 6, CAP);
        pixel(7, 6, CAP);
        pixel(8, 6, CAP);
        pixel(9, 6, CAP);
        pixel(10, 6, CAP);
        
        // Arms and overalls with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 7 + armSwing, SKIN);
        pixel(5, 7, OVERALLS);
        pixel(6, 7, OVERALLS);
        pixel(7, 7, GOLD); // Buttons
        pixel(8, 7, GOLD);
        pixel(9, 7, OVERALLS);
        pixel(10, 7, OVERALLS);
        pixel(11, 7 - armSwing, SKIN);
        
        pixel(5, 8, OVERALLS);
        pixel(6, 8, OVERALLS);
        pixel(7, 8, OVERALLS);
        pixel(8, 8, OVERALLS);
        pixel(9, 8, OVERALLS);
        pixel(10, 8, OVERALLS);
        
        pixel(5, 9, OVERALLS);
        pixel(6, 9, OVERALLS);
        pixel(7, 9, OVERALLS);
        pixel(8, 9, OVERALLS);
        pixel(9, 9, OVERALLS);
        pixel(10, 9, OVERALLS);
        
        // Shoes with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 10 + legOffset, BROWN);
        pixel(5, 10 + legOffset, BROWN);
        pixel(6, 10 + legOffset, BROWN);
        pixel(9, 10 - legOffset, BROWN);
        pixel(10, 10 - legOffset, BROWN);
        pixel(11, 10 - legOffset, BROWN);
        // Bottom of shoes
        pixel(4, 11 + legOffset, BROWN);
        pixel(5, 11 + legOffset, BROWN);
        pixel(6, 11 + legOffset, BROWN);
        pixel(9, 11 - legOffset, BROWN);
        pixel(10, 11 - legOffset, BROWN);
        pixel(11, 11 - legOffset, BROWN);
    }

    private drawYoshiFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const GREEN = c.body;
        const WHITE = c.belly;
        const RED = c.earInner; // Shell/saddle color
        const ORANGE = 0xf97316;
        const WHITE_PURE = 0xfafafa;
        
        // Dome eyes sticking up (iconic Yoshi feature)
        pixel(5, 0, WHITE_PURE);
        pixel(6, 0, WHITE_PURE);
        pixel(9, 0, WHITE_PURE);
        pixel(10, 0, WHITE_PURE);
        
        // Eyes with pupils
        pixel(5, 1, WHITE_PURE);
        pixel(6, 1, c.eyes);
        pixel(9, 1, c.eyes);
        pixel(10, 1, WHITE_PURE);
        
        // Head connecting eyes
        pixel(7, 1, GREEN);
        pixel(8, 1, GREEN);
        
        // Face/snout
        pixel(5, 2, GREEN);
        pixel(6, 2, GREEN);
        pixel(7, 2, GREEN);
        pixel(8, 2, GREEN);
        pixel(9, 2, GREEN);
        pixel(10, 2, GREEN);
        
        // Snout extends forward with big nose
        pixel(6, 3, GREEN);
        pixel(7, 3, GREEN);
        pixel(8, 3, GREEN);
        pixel(9, 3, GREEN);
        pixel(10, 3, ORANGE); // Nose
        pixel(11, 3, ORANGE);
        
        // Red shell on back + body
        pixel(4, 4, RED);
        pixel(5, 4, RED);
        pixel(6, 4, GREEN);
        pixel(7, 4, GREEN);
        pixel(8, 4, GREEN);
        
        // Body with white belly
        pixel(4, 5, RED);
        pixel(5, 5, GREEN);
        pixel(6, 5, WHITE);
        pixel(7, 5, WHITE);
        pixel(8, 5, WHITE);
        pixel(9, 5, GREEN);
        
        // Arms with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(3, 5 + armSwing, GREEN);
        pixel(10, 5 - armSwing, GREEN);
        
        pixel(5, 6, GREEN);
        pixel(6, 6, WHITE);
        pixel(7, 6, WHITE);
        pixel(8, 6, WHITE);
        pixel(9, 6, GREEN);
        
        // Tail
        pixel(3, 6, GREEN);
        pixel(2, 7, GREEN);
        
        // Lower body
        pixel(5, 7, GREEN);
        pixel(6, 7, WHITE);
        pixel(7, 7, WHITE);
        pixel(8, 7, GREEN);
        pixel(9, 7, GREEN);
        
        pixel(6, 8, GREEN);
        pixel(7, 8, GREEN);
        pixel(8, 8, GREEN);
        
        // Orange boots with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(5, 9 + legOffset, ORANGE);
        pixel(6, 9 + legOffset, ORANGE);
        pixel(8, 9 - legOffset, ORANGE);
        pixel(9, 9 - legOffset, ORANGE);
        
        pixel(5, 10 + legOffset, ORANGE);
        pixel(6, 10 + legOffset, ORANGE);
        pixel(8, 10 - legOffset, ORANGE);
        pixel(9, 10 - legOffset, ORANGE);
        
        pixel(5, 11 + legOffset, ORANGE);
        pixel(6, 11 + legOffset, ORANGE);
        pixel(8, 11 - legOffset, ORANGE);
        pixel(9, 11 - legOffset, ORANGE);
    }

    private drawDKFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const FUR = c.body;
        const FACE = c.belly;
        const DARK = c.bodyDark;
        const RED = 0xdc2626;
        const WHITE = 0xfafafa;
        
        // Head top (big round head)
        pixel(5, 0, FUR);
        pixel(6, 0, FUR);
        pixel(7, 0, FUR);
        pixel(8, 0, FUR);
        pixel(9, 0, FUR);
        pixel(10, 0, FUR);
        
        // Head sides
        pixel(4, 1, FUR);
        pixel(5, 1, FUR);
        pixel(6, 1, FUR);
        pixel(7, 1, FUR);
        pixel(8, 1, FUR);
        pixel(9, 1, FUR);
        pixel(10, 1, FUR);
        pixel(11, 1, FUR);
        
        // Face with brow
        pixel(3, 2, FUR);
        pixel(4, 2, FUR);
        pixel(5, 2, FACE);
        pixel(6, 2, FACE);
        pixel(7, 2, FACE);
        pixel(8, 2, FACE);
        pixel(9, 2, FACE);
        pixel(10, 2, FACE);
        pixel(11, 2, FUR);
        pixel(12, 2, FUR);
        
        // Eyes
        pixel(4, 3, FACE);
        pixel(5, 3, WHITE);
        pixel(6, 3, c.eyes);
        pixel(7, 3, FACE);
        pixel(8, 3, FACE);
        pixel(9, 3, WHITE);
        pixel(10, 3, c.eyes);
        pixel(11, 3, FACE);
        
        // Snout
        pixel(5, 4, FACE);
        pixel(6, 4, FACE);
        pixel(7, 4, DARK);
        pixel(8, 4, DARK);
        pixel(9, 4, FACE);
        pixel(10, 4, FACE);
        
        // Mouth area
        pixel(5, 5, FACE);
        pixel(6, 5, FACE);
        pixel(7, 5, FACE);
        pixel(8, 5, FACE);
        pixel(9, 5, FACE);
        pixel(10, 5, FACE);
        
        // Red tie
        pixel(7, 6, RED);
        pixel(8, 6, RED);
        pixel(6, 7, RED);
        pixel(7, 7, RED);
        pixel(8, 7, RED);
        pixel(9, 7, RED);
        
        // Big arms with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(3, 6 + armSwing, FUR);
        pixel(4, 6 + armSwing, FUR);
        pixel(5, 6, FUR);
        pixel(10, 6, FUR);
        pixel(11, 6 - armSwing, FUR);
        pixel(12, 6 - armSwing, FUR);
        
        pixel(2, 7 + armSwing, FUR);
        pixel(3, 7 + armSwing, FUR);
        pixel(4, 7, FUR);
        pixel(11, 7, FUR);
        pixel(12, 7 - armSwing, FUR);
        pixel(13, 7 - armSwing, FUR);
        
        pixel(2, 8 + armSwing, FACE); // Hands
        pixel(3, 8 + armSwing, FACE);
        pixel(12, 8 - armSwing, FACE);
        pixel(13, 8 - armSwing, FACE);
        
        // Body
        pixel(5, 8, FUR);
        pixel(6, 8, FUR);
        pixel(7, 8, FUR);
        pixel(8, 8, FUR);
        pixel(9, 8, FUR);
        pixel(10, 8, FUR);
        
        // Legs with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(5, 9 + legOffset, FUR);
        pixel(6, 9 + legOffset, FUR);
        pixel(9, 9 - legOffset, FUR);
        pixel(10, 9 - legOffset, FUR);
        
        // Feet
        pixel(4, 10 + legOffset, DARK);
        pixel(5, 10 + legOffset, DARK);
        pixel(6, 10 + legOffset, DARK);
        pixel(9, 10 - legOffset, DARK);
        pixel(10, 10 - legOffset, DARK);
        pixel(11, 10 - legOffset, DARK);
        // Bottom of feet
        pixel(4, 11 + legOffset, DARK);
        pixel(5, 11 + legOffset, DARK);
        pixel(6, 11 + legOffset, DARK);
        pixel(9, 11 - legOffset, DARK);
        pixel(10, 11 - legOffset, DARK);
        pixel(11, 11 - legOffset, DARK);
    }

    private createGroundTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#' + GROUND_COLORS.grass.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, size, 4);

        ctx.fillStyle = '#' + GROUND_COLORS.grassDark.toString(16).padStart(6, '0');
        for (let x = 0; x < size; x += 3) {
            ctx.fillRect(x, 0, 1, 2);
        }

        ctx.fillStyle = '#' + GROUND_COLORS.dirt.toString(16).padStart(6, '0');
        ctx.fillRect(0, 4, size, 12);

        ctx.fillStyle = '#' + GROUND_COLORS.dirtDark.toString(16).padStart(6, '0');
        for (let y = 5; y < size; y += 3) {
            for (let x = y % 6 === 5 ? 2 : 0; x < size; x += 4) {
                ctx.fillRect(x, y, 2, 2);
            }
        }

        this.textures.addImage('ground', canvas);
    }

    private createLavaSprite(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Lava base - orange/red gradient
        ctx.fillStyle = '#dc2626'; // Red
        ctx.fillRect(0, 0, size, size);

        // Add orange highlights for molten effect
        ctx.fillStyle = '#f97316'; // Orange
        ctx.fillRect(2, 2, 4, 3);
        ctx.fillRect(10, 4, 4, 3);
        ctx.fillRect(5, 8, 5, 3);
        ctx.fillRect(12, 10, 3, 2);

        // Add bright yellow hot spots
        ctx.fillStyle = '#fbbf24'; // Yellow
        ctx.fillRect(3, 3, 2, 1);
        ctx.fillRect(11, 5, 2, 1);
        ctx.fillRect(6, 9, 2, 1);

        // Top surface - brighter wavy line
        ctx.fillStyle = '#fb923c';
        for (let x = 0; x < size; x += 4) {
            ctx.fillRect(x, 0, 2, 2);
            ctx.fillRect(x + 2, 1, 2, 2);
        }

        this.textures.addImage('lava', canvas);
    }

    private createFinishLineSprite(): void {
        const width = 16;
        const height = 48; // Taller flag pole
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        // Pole
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(1, 0, 3, height);

        // Checkered flag (8x12 pixels at top)
        const flagX = 4;
        const flagY = 2;
        const flagWidth = 12;
        const flagHeight = 10;
        const squareSize = 2;

        for (let y = 0; y < flagHeight; y += squareSize) {
            for (let x = 0; x < flagWidth; x += squareSize) {
                const isWhite = ((x / squareSize) + (y / squareSize)) % 2 === 0;
                ctx.fillStyle = isWhite ? '#fafafa' : '#1f2937';
                ctx.fillRect(flagX + x, flagY + y, squareSize, squareSize);
            }
        }

        // Flag border
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.strokeRect(flagX, flagY, flagWidth, flagHeight);

        // Gold ball on top
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 0, 5, 3);

        this.textures.addImage('finishLine', canvas);
    }
    
    private createPlatformTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Stone/brick platform
        ctx.fillStyle = '#6b7280'; // Gray
        ctx.fillRect(0, 0, size, size);
        
        // Top highlight
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(0, 0, size, 2);
        
        // Brick lines
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(0, 4, size, 1);
        ctx.fillRect(0, 10, size, 1);
        ctx.fillRect(8, 0, 1, 4);
        ctx.fillRect(4, 5, 1, 5);
        ctx.fillRect(12, 5, 1, 5);
        ctx.fillRect(8, 11, 1, 5);

        this.textures.addImage('platform', canvas);
    }
    
    private createBackground(): void {
        // Draw pixel art mountains in the background
        const bgWidth = WORLD_WIDTH;
        const bgHeight = WORLD_HEIGHT;
        
        // Far mountains (slowest scroll)
        const farMountains = this.add.graphics();
        farMountains.fillStyle(0x2d3748); // Dark blue-gray
        // Mountain 1
        farMountains.fillTriangle(0, bgHeight - 16, 80, 40, 160, bgHeight - 16);
        // Mountain 2
        farMountains.fillTriangle(120, bgHeight - 16, 200, 30, 280, bgHeight - 16);
        // Mountain 3
        farMountains.fillTriangle(240, bgHeight - 16, 350, 45, 460, bgHeight - 16);
        // Mountain 4
        farMountains.fillTriangle(400, bgHeight - 16, 520, 35, 640, bgHeight - 16);
        // Mountain 5
        farMountains.fillTriangle(580, bgHeight - 16, 700, 50, 820, bgHeight - 16);
        // Mountain 6
        farMountains.fillTriangle(760, bgHeight - 16, 880, 40, 1000, bgHeight - 16);
        farMountains.setScrollFactor(0.2, 1); // Slow parallax
        
        // Near hills (medium scroll)
        const nearHills = this.add.graphics();
        nearHills.fillStyle(0x4a5568); // Lighter gray
        // Hill 1
        nearHills.fillTriangle(-20, bgHeight - 16, 60, 80, 140, bgHeight - 16);
        // Hill 2
        nearHills.fillTriangle(100, bgHeight - 16, 180, 70, 260, bgHeight - 16);
        // Hill 3
        nearHills.fillTriangle(220, bgHeight - 16, 320, 85, 420, bgHeight - 16);
        // Hill 4
        nearHills.fillTriangle(380, bgHeight - 16, 480, 75, 580, bgHeight - 16);
        // Hill 5
        nearHills.fillTriangle(540, bgHeight - 16, 650, 80, 760, bgHeight - 16);
        // Hill 6
        nearHills.fillTriangle(700, bgHeight - 16, 820, 70, 940, bgHeight - 16);
        // Hill 7
        nearHills.fillTriangle(880, bgHeight - 16, 960, 85, 1040, bgHeight - 16);
        nearHills.setScrollFactor(0.5, 1); // Medium parallax
        
        // Add some stars/clouds in the sky
        const skyDecor = this.add.graphics();
        skyDecor.fillStyle(0x6366f1, 0.3); // Faint purple
        // Scattered dots for stars
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * bgWidth;
            const y = Math.random() * 60 + 10;
            skyDecor.fillRect(x, y, 2, 2);
        }
        skyDecor.setScrollFactor(0.1, 1); // Very slow parallax
    }
    
    private createPlatforms(): void {
        // Create platform texture
        this.createPlatformTile();
        
        // Define platform positions: [x, y, width in tiles]
        const platformData = [
            // Section 1 - Stepping stones
            [120, 140, 3],
            [200, 120, 2],
            [280, 100, 3],
            
            // Section 2 - Staircase up
            [380, 140, 2],
            [420, 120, 2],
            [460, 100, 2],
            
            // Section 3 - High platforms
            [540, 80, 4],
            [620, 100, 2],
            [680, 120, 3],
            
            // Section 4 - Final stretch
            [780, 100, 3],
            [860, 80, 4],
        ];
        
        for (const [x, y, widthTiles] of platformData) {
            for (let i = 0; i < widthTiles; i++) {
                this.ground.create(x + i * 16, y, 'platform');
            }
        }
    }

    private createFinishLine(): void {
        // Place finish line near the end of the level
        const finishX = WORLD_WIDTH - 40;
        const finishY = WORLD_HEIGHT - 16 - 24; // Position above ground (48px sprite, anchored at center)

        this.finishLine = this.physics.add.sprite(finishX, finishY, 'finishLine');
        this.finishLine.setImmovable(true);
        this.finishLine.body.setAllowGravity(false);

        // Set up overlap detection with player (will be called after player is created)
    }

    private handleFinishLine(): void {
        if (this.hasFinished) return;

        this.hasFinished = true;

        // Celebration effect - flash the screen
        this.cameras.main.flash(500, 255, 215, 0); // Gold flash

        // Show victory text - position relative to viewport (scrollFactor 0)
        this.victoryText = this.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 - 20,
            'FINISH!',
            {
                fontSize: '24px',
                color: '#fbbf24',
                backgroundColor: '#1f2937',
                padding: { x: 12, y: 6 },
                fontStyle: 'bold',
            },
        );
        this.victoryText.setOrigin(0.5);
        this.victoryText.setScrollFactor(0); // Fixed to camera
        this.victoryText.setDepth(100);

        // Add a pulsing scale animation
        this.tweens.add({
            targets: this.victoryText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 300,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        // Create confetti particles
        this.createConfetti();
    }

    private handleLavaDeath(): void {
        // Flash screen red
        this.cameras.main.flash(300, 255, 50, 50);
        
        // Reset player to spawn point
        this.player.setPosition(this.spawnX, this.spawnY);
        this.player.setVelocity(0, 0);
        
        // Brief invulnerability visual feedback
        this.tweens.add({
            targets: this.player,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3,
        });
    }

    private createConfetti(): void {
        const colors = [0xfbbf24, 0xef4444, 0x22c55e, 0x3b82f6, 0xec4899];
        
        for (let i = 0; i < 30; i++) {
            const startX = Math.random() * GAME_WIDTH;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Position relative to viewport (scrollFactor 0)
            const confetti = this.add.rectangle(startX, -10, 4, 4, color);
            confetti.setScrollFactor(0);
            confetti.setDepth(99);
            
            this.tweens.add({
                targets: confetti,
                y: GAME_HEIGHT + 10,
                x: startX + (Math.random() - 0.5) * 100,
                rotation: Math.random() * 10,
                duration: 2000 + Math.random() * 1000,
                ease: 'Cubic.easeIn',
                delay: Math.random() * 500,
                onComplete: () => confetti.destroy(),
            });
        }
    }

    create(): void {
        // Set up larger world bounds for scrolling
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        
        // Create parallax background layers
        this.createBackground();
        
        // Create ground and lava
        this.ground = this.physics.add.staticGroup();
        this.lava = this.physics.add.staticGroup();
        const tileSize = 16;
        const groundY = WORLD_HEIGHT - tileSize / 2;

        // Define lava pit ranges [startX, endX] - player must use platforms to cross
        const lavaPits = [
            [160, 320],   // After first safe section, before section 1 platforms
            [400, 520],   // Section 2 area - staircase challenge
            [600, 720],   // Section 3 area - high platform challenge
            [820, 900],   // Final challenge before finish
        ];

        // Helper to check if position is in a lava pit
        const isLavaPit = (x: number) => {
            return lavaPits.some(([start, end]) => x >= start && x <= end);
        };

        // Create ground or lava based on position
        for (let x = tileSize / 2; x < WORLD_WIDTH; x += tileSize) {
            if (isLavaPit(x)) {
                this.lava.create(x, groundY, 'lava');
            } else {
                this.ground.create(x, groundY, 'ground');
            }
        }
        
        // Add floating platforms throughout the level
        this.createPlatforms();

        // Create finish line at the end of the level
        this.createFinishLine();

        // Create local player with selected costume (spawn near start)
        this.player = this.physics.add.sprite(
            this.spawnX,
            this.spawnY,
            `player_${this.playerCostume}`,
        );
        // Feet at sprite y=11. Body height 11 + offset 1 = body spans y=1 to y=12
        // When body bottom sits on ground, sprite y=11 aligns with ground
        this.player.body.setSize(8, 11);
        this.player.body.setOffset(4, 1);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.1);
        this.physics.add.collider(this.player, this.ground);

        // Add overlap detection with finish line
        this.physics.add.overlap(this.player, this.finishLine, () => {
            this.handleFinishLine();
        });

        // Add overlap detection with lava - reset to start
        this.physics.add.overlap(this.player, this.lava, () => {
            this.handleLavaDeath();
        });

        // Add name label above player
        this.playerNameText = this.add.text(
            this.player.x,
            this.player.y - 16,
            this.playerName,
            {
                fontSize: '8px',
                color: '#ffffff',
                backgroundColor: '#00000080',
                padding: { x: 2, y: 1 },
            },
        );
        this.playerNameText.setOrigin(0.5, 1);

        // Create animations for all player palettes
        for (let i = 0; i < COSTUMES_DATA.length; i++) {
            this.anims.create({
                key: `idle_${i}`,
                frames: this.anims.generateFrameNumbers(`player_${i}`, { start: 0, end: 0 }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk_${i}`,
                frames: this.anims.generateFrameNumbers(`player_${i}`, { start: 1, end: 4 }),
                frameRate: 10,
                repeat: -1,
            });
        }

        // Set up keyboard input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.wasd = {
                W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            };
        }

        this.player.anims.play(`idle_${this.playerCostume}`);
        
        // Set up camera to follow player smoothly
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(50, 30); // Small deadzone for smoother feel

        // Listen for other players' movements
        this.setupWebSocketListeners();

        // Send initial position so other players can see us
        this.time.delayedCall(500, () => {
            this.sendPosition('idle');
        });
    }


    private setupWebSocketListeners(): void {
        const channel = window.Echo.join(`game.${this.roomId}`);

        channel.listen('.player.moved', (data: PlayerMovedData) => {
            if (data.playerId === this.playerId) return;
            this.handleRemotePlayerMove(data);
        });
    }

    private handleRemotePlayerMove(data: PlayerMovedData): void {
        // Make sure the scene is ready
        if (!this.ground || !this.physics) {
            return;
        }

        // Use string key for consistency (JSON might send number or string)
        const playerId = String(data.playerId);
        let remote = this.remotePlayers.get(playerId);
        const costumeIndex = data.costume % COSTUMES_DATA.length;

        if (!remote) {
            // Create new remote player with their chosen costume
            try {
                const sprite = this.physics.add.sprite(data.x, data.y, `player_${costumeIndex}`);
                // Match physics body to visible character
                sprite.body.setSize(8, 11);
                sprite.body.setOffset(4, 1);
                sprite.setCollideWorldBounds(true);
                this.physics.add.collider(sprite, this.ground);

                const nameText = this.add.text(data.x, data.y - 16, data.playerName, {
                    fontSize: '8px',
                    color: '#ffffff',
                    backgroundColor: '#00000080',
                    padding: { x: 2, y: 1 },
                });
                nameText.setOrigin(0.5, 1);

                // Store costume index on sprite for animation
                sprite.setData('costumeIndex', costumeIndex);

                remote = {
                    sprite,
                    nameText,
                    targetX: data.x,
                    targetY: data.y,
                };
                this.remotePlayers.set(playerId, remote);
            } catch {
                return;
            }
        }

        // Update target position for interpolation
        remote.targetX = data.x;
        remote.targetY = data.y;

        // Update animation and flip
        if (remote.sprite?.active) {
            const costume = remote.sprite.getData('costumeIndex') as number;
            remote.sprite.setFlipX(data.flipX);

            if (data.animation === 'walk') {
                remote.sprite.anims.play(`walk_${costume}`, true);
            } else {
                remote.sprite.anims.play(`idle_${costume}`, true);
            }
        }
    }

    update(time: number): void {
        const speed = 100;

        // Handle local player movement (keyboard + touch)
        const leftPressed = this.cursors?.left.isDown || this.wasd?.A.isDown || window.touchControls?.left;
        const rightPressed = this.cursors?.right.isDown || this.wasd?.D.isDown || window.touchControls?.right;
        const jumpPressed = this.cursors?.up.isDown || this.wasd?.SPACE.isDown || this.wasd?.W.isDown || window.touchControls?.jump;

        let animation = 'idle';

        if (leftPressed) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            if (this.player.body.touching.down) {
                this.player.anims.play(`walk_${this.playerCostume}`, true);
                animation = 'walk';
            }
        } else if (rightPressed) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            if (this.player.body.touching.down) {
                this.player.anims.play(`walk_${this.playerCostume}`, true);
                animation = 'walk';
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.anims.play(`idle_${this.playerCostume}`, true);
            }
        }

        // Handle jump
        if (jumpPressed && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
        }

        // Update name label position
        this.playerNameText.setPosition(this.player.x, this.player.y - 12);

        // Send position to server at intervals
        if (time - this.lastSendTime > this.sendInterval) {
            const posChanged =
                Math.abs(this.player.x - this.lastSentPosition.x) > 1 ||
                Math.abs(this.player.y - this.lastSentPosition.y) > 1;

            // Send if position changed OR if it's time for a heartbeat
            const heartbeatDue = time - this.lastHeartbeatTime > this.heartbeatInterval;
            
            if (posChanged || heartbeatDue) {
                this.sendPosition(animation);
                this.lastSentPosition = { x: this.player.x, y: this.player.y };
                if (heartbeatDue) {
                    this.lastHeartbeatTime = time;
                }
            }
            this.lastSendTime = time;
        }

        // Interpolate remote players toward their target positions
        this.remotePlayers.forEach((remote) => {
            if (!remote?.sprite?.active) return;
            
            const lerpFactor = 0.3;
            remote.sprite.x += (remote.targetX - remote.sprite.x) * lerpFactor;
            remote.sprite.y += (remote.targetY - remote.sprite.y) * lerpFactor;
            
            if (remote.nameText?.active) {
                remote.nameText.setPosition(remote.sprite.x, remote.sprite.y - 12);
            }
        });
    }

    private sendPosition(animation: string): void {
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        
        if (!csrfToken) {
            console.error('CSRF token not found!');
            return;
        }

        fetch(`/game/${this.roomId}/move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                x: this.player.x,
                y: this.player.y,
                velocityX: this.player.body.velocity.x,
                velocityY: this.player.body.velocity.y,
                animation,
                flipX: this.player.flipX,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        console.error('Move request failed:', response.status, text);
                    });
                }
            })
            .catch((err) => console.error('Failed to send position:', err));
    }
}
