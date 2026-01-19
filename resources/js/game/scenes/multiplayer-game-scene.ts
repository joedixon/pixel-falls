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
    { // Galinda
        body: 0xfce7f3, bodyDark: 0xfbcfe8, belly: 0xf9a8d4,
        ears: 0xfde68a, earInner: 0xfbbf24, nose: 0xfce7f3, eyes: 0x60a5fa, type: 'galinda',
    },
    { // Elphaba
        body: 0x22c55e, bodyDark: 0x16a34a, belly: 0x1f2937,
        ears: 0x1f2937, earInner: 0x1f2937, nose: 0x22c55e, eyes: 0x1f2937, type: 'elphaba',
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

// Level configuration interface
interface LevelConfig {
    name: string;
    // Platforms: [x, y, widthInTiles, tileType?] - tileType defaults to 'platform'
    platforms: [number, number, number, string?][];
    // Hazard zones: [startX, endX, hazardType] - hazardType: 'lava', 'void', 'spikes'
    hazards: [number, number, string][];
    // Ground sections: [startX, endX, groundType] - for themed ground
    groundSections?: [number, number, string][];
    // Spawn position
    spawnX: number;
    spawnY: number;
    // Finish line X position
    finishX: number;
    // Theme (affects background color)
    theme?: 'default' | 'wicked';
}

// Level definitions
const LEVELS: LevelConfig[] = [
    {
        name: 'Level 1',
        platforms: [
            // Section 1 - Easy intro platforms
            [150, 140, 3],
            [250, 120, 3],
            [350, 100, 3],
            // Section 2 - Help over first lava
            [420, 120, 3],  // Platform over lava
            [550, 130, 3],
            // Section 3 - Stepping stones
            [700, 130, 2],
            [780, 110, 3],
            [880, 100, 3],
            // Section 4 - Help over second lava
            [970, 110, 3],  // Platform over lava
            [1100, 130, 3],
            // Section 5 - Final stretch
            [1220, 120, 3],
            [1350, 100, 4],
            [1480, 130, 3],
        ],
        hazards: [
            // Narrower lava pits - all 50 pixels (easily jumpable)
            [400, 450, 'lava'],   // 50 wide
            [620, 670, 'lava'],   // 50 wide
            [940, 990, 'lava'],   // 50 wide
            [1180, 1230, 'lava'], // 50 wide
            [1440, 1490, 'lava'], // 50 wide
        ],
        spawnX: 64,
        spawnY: WORLD_HEIGHT - 40,
        finishX: WORLD_WIDTH - 40,
        theme: 'default',
    },
    {
        name: 'Level 2: Wicked',
        theme: 'wicked',
        groundSections: [
            // The Grand Library of Shiz University - long intro area
            [0, 400, 'library'],
            // Yellow brick road to dormitory - jumpable gaps
            [400, 480, 'yellowBrick'],
            [520, 620, 'yellowBrick'],
            // Galinda & Elphaba's Dormitory
            [620, 950, 'dormitory'],
            // Yellow brick road to classroom - slightly harder gaps
            [950, 1040, 'yellowBrick'],
            [1080, 1180, 'yellowBrick'],
            // Dr. Dillamond's Classroom - victory stretch
            [1180, 1600, 'classroom'],
        ],
        platforms: [
            // Library - spinning bookshelf obstacles (optional height bonuses)
            [100, 130, 2, 'carousel'],
            [200, 100, 2, 'carousel'],
            [300, 130, 2, 'carousel'],
            
            // Yellow brick road 1 - helpful stepping stones (gaps are jumpable without)
            [490, 130, 2, 'emerald'],  // Helpful midpoint
            
            // Dormitory - Galinda's luggage creates fun obstacle course
            [680, 130, 2, 'luggage'],
            [760, 100, 2, 'luggage'],
            [840, 130, 2, 'luggage'],
            [900, 100, 2, 'luggage'],
            
            // Yellow brick road 2 - emerald stepping stone
            [1050, 120, 2, 'emerald'],
            
            // Dr. Dillamond's Classroom - celebratory desk jumps
            [1250, 130, 3, 'desk'],
            [1350, 100, 3, 'desk'],
            [1450, 130, 3, 'desk'],
        ],
        hazards: [
            // Void gaps - all jumpable with running start (40 pixels max)
            [480, 520, 'void'],  // Gap 1 - 40 wide
            [1040, 1080, 'void'], // Gap 2 - 40 wide
            // Decorative spikes - avoidable by jumping
            [150, 165, 'spikes'],
            [250, 265, 'spikes'],
            [720, 740, 'spikes'],
            [1300, 1320, 'spikes'],
        ],
        spawnX: 32,
        spawnY: WORLD_HEIGHT - 40,
        finishX: WORLD_WIDTH - 30,
    },
];

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
    private finishLineX = WORLD_WIDTH - 40;
    private hasFinished = false;
    private spawnX = 64;
    private spawnY = WORLD_HEIGHT - 40;
    private victoryText?: Phaser.GameObjects.Text;
    private levelText?: Phaser.GameObjects.Text;
    private currentLevel = 0;
    private backgroundElements: Phaser.GameObjects.GameObject[] = [];
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
        startLevel: number = 0,
        private isPractice: boolean = false,
    ) {
        super({ key: 'MultiplayerGameScene' });
        this.currentLevel = startLevel;
    }

    preload(): void {
        // Create animal sprites for all costumes
        for (let i = 0; i < COSTUMES_DATA.length; i++) {
            this.createAnimalSprites(i);
        }
        this.createGroundTile();
        this.createLavaSprite();
        this.createPlatformTile();
        this.createFinishLineSprite();
        // Wicked themed sprites
        this.createYellowBrickTile();
        this.createLibraryTile();
        this.createDormitoryTile();
        this.createClassroomTile();
        this.createBookshelfPlatform();
        this.createCarouselPlatform();
        this.createEmeraldPlatform();
        this.createFurniturePlatform();
        this.createLuggagePlatform();
        this.createDeskPlatform();
        this.createVoidTile();
        this.createSpikesTile();
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
            case 'galinda':
                this.drawGalindaFrame(pixel, frame, walkOffset, c);
                break;
            case 'elphaba':
                this.drawElphabaFrame(pixel, frame, walkOffset, c);
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

    private drawGalindaFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const SKIN = 0xfcd9bd; // Warm skin tone
        const DRESS = c.belly; // Pink dress
        const HAIR = c.ears; // Blonde
        const TIARA = c.earInner; // Gold
        const EYES = c.eyes;
        const PINK_DARK = 0xec4899;
        
        // Blonde hair top (poofy curls)
        pixel(6, 0, HAIR);
        pixel(7, 0, HAIR);
        pixel(8, 0, HAIR);
        pixel(9, 0, HAIR);
        
        // Hair with tiara
        pixel(5, 1, HAIR);
        pixel(6, 1, HAIR);
        pixel(7, 1, TIARA); // Tiara sparkle
        pixel(8, 1, TIARA);
        pixel(9, 1, HAIR);
        pixel(10, 1, HAIR);
        
        // Forehead and hair sides
        pixel(5, 2, HAIR);
        pixel(6, 2, SKIN);
        pixel(7, 2, SKIN);
        pixel(8, 2, SKIN);
        pixel(9, 2, SKIN);
        pixel(10, 2, HAIR);
        
        // Eyes
        pixel(5, 3, SKIN);
        pixel(6, 3, EYES);
        pixel(7, 3, SKIN);
        pixel(8, 3, SKIN);
        pixel(9, 3, EYES);
        pixel(10, 3, SKIN);
        
        // Nose and rosy cheeks
        pixel(5, 4, 0xfda4af); // Blush
        pixel(6, 4, SKIN);
        pixel(7, 4, SKIN);
        pixel(8, 4, SKIN);
        pixel(9, 4, SKIN);
        pixel(10, 4, 0xfda4af); // Blush
        
        // Smile
        pixel(6, 5, SKIN);
        pixel(7, 5, PINK_DARK);
        pixel(8, 5, PINK_DARK);
        pixel(9, 5, SKIN);
        
        // Pink dress top
        pixel(5, 6, DRESS);
        pixel(6, 6, DRESS);
        pixel(7, 6, DRESS);
        pixel(8, 6, DRESS);
        pixel(9, 6, DRESS);
        pixel(10, 6, DRESS);
        
        // Arms and dress with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 7 + armSwing, SKIN);
        pixel(5, 7, DRESS);
        pixel(6, 7, DRESS);
        pixel(7, 7, 0xfafafa); // White trim
        pixel(8, 7, 0xfafafa);
        pixel(9, 7, DRESS);
        pixel(10, 7, DRESS);
        pixel(11, 7 - armSwing, SKIN);
        
        // Ballgown dress
        pixel(4, 8, DRESS);
        pixel(5, 8, DRESS);
        pixel(6, 8, DRESS);
        pixel(7, 8, DRESS);
        pixel(8, 8, DRESS);
        pixel(9, 8, DRESS);
        pixel(10, 8, DRESS);
        pixel(11, 8, DRESS);
        
        // Wide skirt
        pixel(3, 9, DRESS);
        pixel(4, 9, DRESS);
        pixel(5, 9, DRESS);
        pixel(6, 9, DRESS);
        pixel(7, 9, DRESS);
        pixel(8, 9, DRESS);
        pixel(9, 9, DRESS);
        pixel(10, 9, DRESS);
        pixel(11, 9, DRESS);
        pixel(12, 9, DRESS);
        
        // Shoes with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(5, 10 + legOffset, PINK_DARK);
        pixel(6, 10 + legOffset, PINK_DARK);
        pixel(9, 10 - legOffset, PINK_DARK);
        pixel(10, 10 - legOffset, PINK_DARK);
    }

    private drawElphabaFrame(
        pixel: (x: number, y: number, color: number) => void,
        frame: number,
        walkOffset: number,
        c: typeof COSTUMES_DATA[number],
    ): void {
        const SKIN = c.body; // Green!
        const DRESS = c.belly; // Black
        const HAIR = c.ears; // Black hair
        const HAT = c.earInner; // Black hat
        const EYES = c.eyes;
        const WHITE = 0xfafafa;
        
        // Witch hat point
        pixel(7, 0, HAT);
        pixel(8, 0, HAT);
        
        // Hat middle
        pixel(6, 1, HAT);
        pixel(7, 1, HAT);
        pixel(8, 1, HAT);
        pixel(9, 1, HAT);
        
        // Hat brim
        pixel(4, 2, HAT);
        pixel(5, 2, HAT);
        pixel(6, 2, HAT);
        pixel(7, 2, HAT);
        pixel(8, 2, HAT);
        pixel(9, 2, HAT);
        pixel(10, 2, HAT);
        pixel(11, 2, HAT);
        
        // Hair and forehead
        pixel(5, 3, HAIR);
        pixel(6, 3, SKIN);
        pixel(7, 3, SKIN);
        pixel(8, 3, SKIN);
        pixel(9, 3, SKIN);
        pixel(10, 3, HAIR);
        
        // Eyes - green skin visible
        pixel(5, 4, SKIN);
        pixel(6, 4, WHITE);
        pixel(7, 4, EYES);
        pixel(8, 4, WHITE);
        pixel(9, 4, EYES);
        pixel(10, 4, SKIN);
        
        // Nose
        pixel(6, 5, SKIN);
        pixel(7, 5, SKIN);
        pixel(8, 5, SKIN);
        pixel(9, 5, SKIN);
        
        // Black dress collar
        pixel(5, 6, DRESS);
        pixel(6, 6, DRESS);
        pixel(7, 6, DRESS);
        pixel(8, 6, DRESS);
        pixel(9, 6, DRESS);
        pixel(10, 6, DRESS);
        
        // Arms and dress with animation
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(4, 7 + armSwing, SKIN);
        pixel(5, 7, DRESS);
        pixel(6, 7, DRESS);
        pixel(7, 7, DRESS);
        pixel(8, 7, DRESS);
        pixel(9, 7, DRESS);
        pixel(10, 7, DRESS);
        pixel(11, 7 - armSwing, SKIN);
        
        // Dress body
        pixel(5, 8, DRESS);
        pixel(6, 8, DRESS);
        pixel(7, 8, DRESS);
        pixel(8, 8, DRESS);
        pixel(9, 8, DRESS);
        pixel(10, 8, DRESS);
        
        // Dress skirt
        pixel(5, 9, DRESS);
        pixel(6, 9, DRESS);
        pixel(7, 9, DRESS);
        pixel(8, 9, DRESS);
        pixel(9, 9, DRESS);
        pixel(10, 9, DRESS);
        
        // Boots with animation
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(5, 10 + legOffset, HAT);
        pixel(6, 10 + legOffset, HAT);
        pixel(9, 10 - legOffset, HAT);
        pixel(10, 10 - legOffset, HAT);
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

    // === WICKED THEMED SPRITES ===
    
    private createYellowBrickTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Yellow brick base
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 0, size, size);

        // Brick pattern - darker lines
        ctx.fillStyle = '#d97706';
        // Horizontal mortar lines
        ctx.fillRect(0, 4, size, 1);
        ctx.fillRect(0, 9, size, 1);
        ctx.fillRect(0, 14, size, 1);
        // Vertical mortar lines (offset per row)
        ctx.fillRect(8, 0, 1, 4);
        ctx.fillRect(4, 5, 1, 4);
        ctx.fillRect(12, 5, 1, 4);
        ctx.fillRect(8, 10, 1, 4);

        // Highlight on top
        ctx.fillStyle = '#fcd34d';
        ctx.fillRect(0, 0, size, 1);

        this.textures.addImage('yellowBrick', canvas);
    }

    private createLibraryTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Dark wood floor
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, size, size);

        // Wood grain pattern
        ctx.fillStyle = '#92400e';
        ctx.fillRect(0, 0, size, 3);
        ctx.fillRect(0, 8, size, 2);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(4, 0, 1, size);
        ctx.fillRect(12, 0, 1, size);

        this.textures.addImage('library', canvas);
    }

    private createDormitoryTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Carpet - Shiz University green
        ctx.fillStyle = '#166534';
        ctx.fillRect(0, 0, size, size);

        // Carpet pattern
        ctx.fillStyle = '#15803d';
        for (let y = 0; y < size; y += 4) {
            for (let x = (y % 8 === 0 ? 0 : 2); x < size; x += 4) {
                ctx.fillRect(x, y, 2, 2);
            }
        }

        this.textures.addImage('dormitory', canvas);
    }

    private createClassroomTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Stone floor
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, size, size);

        // Tile pattern
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 0, 8, 8);
        ctx.fillRect(8, 8, 8, 8);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 0, size, 1);
        ctx.fillRect(0, 8, size, 1);

        this.textures.addImage('classroom', canvas);
    }

    private createBookshelfPlatform(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Wood shelf
        ctx.fillStyle = '#92400e';
        ctx.fillRect(0, 0, size, size);

        // Books on shelf (colorful spines)
        const bookColors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ca8a04'];
        for (let x = 1; x < size - 1; x += 3) {
            ctx.fillStyle = bookColors[(x / 3) % bookColors.length];
            ctx.fillRect(x, 2, 2, 12);
        }

        // Shelf edge highlight
        ctx.fillStyle = '#a16207';
        ctx.fillRect(0, 0, size, 2);

        this.textures.addImage('bookshelf', canvas);
    }

    private createCarouselPlatform(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Circular bookshelf carousel - top-down view
        // Outer ring (dark wood)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(0, 0, size, size);

        // Inner circle (lighter wood)
        ctx.fillStyle = '#78350f';
        ctx.fillRect(2, 2, 12, 12);

        // Book compartments (colored books visible from top)
        ctx.fillStyle = '#7f1d1d'; // Red book
        ctx.fillRect(3, 3, 4, 4);
        ctx.fillStyle = '#1e3a5f'; // Blue book
        ctx.fillRect(9, 3, 4, 4);
        ctx.fillStyle = '#14532d'; // Green book
        ctx.fillRect(3, 9, 4, 4);
        ctx.fillStyle = '#4c1d95'; // Purple book
        ctx.fillRect(9, 9, 4, 4);

        // Central axis
        ctx.fillStyle = '#92400e';
        ctx.fillRect(6, 6, 4, 4);

        // Gold accents
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(7, 7, 2, 2);
        ctx.fillRect(0, 7, 1, 2);
        ctx.fillRect(15, 7, 1, 2);
        ctx.fillRect(7, 0, 2, 1);
        ctx.fillRect(7, 15, 2, 1);

        this.textures.addImage('carousel', canvas);
    }

    private createEmeraldPlatform(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Emerald green base
        ctx.fillStyle = '#059669';
        ctx.fillRect(0, 0, size, size);

        // Gem facets
        ctx.fillStyle = '#10b981';
        ctx.fillRect(2, 2, 6, 6);
        ctx.fillRect(8, 8, 6, 6);
        ctx.fillStyle = '#047857';
        ctx.fillRect(8, 2, 6, 6);
        ctx.fillRect(2, 8, 6, 6);

        // Sparkle
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(4, 4, 2, 2);
        ctx.fillRect(11, 3, 1, 1);

        // Top highlight
        ctx.fillStyle = '#34d399';
        ctx.fillRect(0, 0, size, 2);

        this.textures.addImage('emerald', canvas);
    }

    private createFurniturePlatform(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Bed frame - pink/rose (Galinda's side of the room!)
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(0, 0, size, size);

        // Quilted pattern
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(0, 4, size, 2);
        ctx.fillRect(0, 10, size, 2);
        ctx.fillRect(4, 0, 2, size);
        ctx.fillRect(10, 0, 2, size);

        // Pillow/headboard highlight
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(0, 0, size, 3);

        this.textures.addImage('furniture', canvas);
    }

    private createLuggagePlatform(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Pink luggage trunk (Galinda's style!)
        ctx.fillStyle = '#ec4899'; // Hot pink
        ctx.fillRect(0, 0, size, size);

        // Darker pink edges
        ctx.fillStyle = '#db2777';
        ctx.fillRect(0, 0, size, 2);
        ctx.fillRect(0, size - 2, size, 2);
        ctx.fillRect(0, 0, 2, size);
        ctx.fillRect(size - 2, 0, 2, size);

        // Gold clasp/buckle
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(5, 6, 6, 4);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(6, 7, 4, 2);

        // Decorative straps
        ctx.fillStyle = '#fce7f3';
        ctx.fillRect(0, 5, size, 1);
        ctx.fillRect(0, 10, size, 1);

        // Sparkle (Galinda loves sparkles!)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(12, 3, 2, 2);

        this.textures.addImage('luggage', canvas);
    }

    private createDeskPlatform(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Wooden desk
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, size, size);

        // Papers/books on desk
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(2, 4, 5, 7);
        ctx.fillStyle = '#22c55e'; // Green book (Animal history?)
        ctx.fillRect(9, 3, 4, 8);

        // Desk edge
        ctx.fillStyle = '#451a03';
        ctx.fillRect(0, 0, size, 2);
        ctx.fillRect(0, 14, size, 2);

        this.textures.addImage('desk', canvas);
    }

    private createVoidTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Dark void/pit
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, size, size);

        // Swirling darkness pattern
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillRect(10, 6, 4, 4);
        ctx.fillRect(4, 10, 5, 4);

        // Faint green magical glow at edges
        ctx.fillStyle = '#22c55e20';
        ctx.fillRect(0, 0, size, 2);

        this.textures.addImage('void', canvas);
    }

    private createSpikesTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Base
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, 12, size, 4);

        // Metal spikes
        ctx.fillStyle = '#6b7280';
        // Spike 1
        ctx.fillRect(1, 8, 2, 4);
        ctx.fillRect(2, 4, 1, 4);
        // Spike 2
        ctx.fillRect(5, 8, 2, 4);
        ctx.fillRect(6, 4, 1, 4);
        // Spike 3
        ctx.fillRect(9, 8, 2, 4);
        ctx.fillRect(10, 4, 1, 4);
        // Spike 4
        ctx.fillRect(13, 8, 2, 4);
        ctx.fillRect(14, 4, 1, 4);

        // Spike tips - sharp!
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(2, 2, 1, 2);
        ctx.fillRect(6, 2, 1, 2);
        ctx.fillRect(10, 2, 1, 2);
        ctx.fillRect(14, 2, 1, 2);

        this.textures.addImage('spikes', canvas);
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
    
    private createBackground(theme: string = 'default'): void {
        // Clear existing background elements
        this.backgroundElements.forEach(el => el.destroy());
        this.backgroundElements = [];

        if (theme === 'wicked') {
            this.createWickedBackground();
        } else {
            this.createDefaultBackground();
        }
    }

    private createDefaultBackground(): void {
        const bgHeight = WORLD_HEIGHT;
        
        // Far mountains (slowest scroll)
        const farMountains = this.add.graphics();
        farMountains.fillStyle(0x2d3748);
        farMountains.fillTriangle(0, bgHeight - 16, 80, 40, 160, bgHeight - 16);
        farMountains.fillTriangle(120, bgHeight - 16, 200, 30, 280, bgHeight - 16);
        farMountains.fillTriangle(240, bgHeight - 16, 350, 45, 460, bgHeight - 16);
        farMountains.fillTriangle(400, bgHeight - 16, 520, 35, 640, bgHeight - 16);
        farMountains.fillTriangle(580, bgHeight - 16, 700, 50, 820, bgHeight - 16);
        farMountains.fillTriangle(760, bgHeight - 16, 880, 40, 1000, bgHeight - 16);
        farMountains.setScrollFactor(0.2, 1);
        this.backgroundElements.push(farMountains);
        
        // Near hills
        const nearHills = this.add.graphics();
        nearHills.fillStyle(0x4a5568);
        nearHills.fillTriangle(-20, bgHeight - 16, 60, 80, 140, bgHeight - 16);
        nearHills.fillTriangle(100, bgHeight - 16, 180, 70, 260, bgHeight - 16);
        nearHills.fillTriangle(220, bgHeight - 16, 320, 85, 420, bgHeight - 16);
        nearHills.fillTriangle(380, bgHeight - 16, 480, 75, 580, bgHeight - 16);
        nearHills.fillTriangle(540, bgHeight - 16, 650, 80, 760, bgHeight - 16);
        nearHills.fillTriangle(700, bgHeight - 16, 820, 70, 940, bgHeight - 16);
        nearHills.fillTriangle(880, bgHeight - 16, 960, 85, 1040, bgHeight - 16);
        nearHills.setScrollFactor(0.5, 1);
        this.backgroundElements.push(nearHills);
        
        // Stars
        const skyDecor = this.add.graphics();
        skyDecor.fillStyle(0x6366f1, 0.3);
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * WORLD_WIDTH;
            const y = Math.random() * 60 + 10;
            skyDecor.fillRect(x, y, 2, 2);
        }
        skyDecor.setScrollFactor(0.1, 1);
        this.backgroundElements.push(skyDecor);
    }

    private createWickedBackground(): void {
        const bgHeight = WORLD_HEIGHT;
        
        // Define continuous background areas (aligned with 16px tile grid)
        // Ground tiles are centered at 8, 24, 40... so edges fall at 0, 16, 32...
        // Section boundaries need to match where tiles visually change
        const backgroundAreas: [number, number, string][] = [
            [0, 400, 'library'],          // Library tiles: centers 8-392, edges 0-400
            [400, 624, 'yellowBrick'],    // Yellow brick tiles: 408-472, 528-616 → edges 400-624
            [624, 944, 'dormitory'],      // Dorm tiles: centers 632-936 → edges 624-944
            [944, 1184, 'yellowBrick'],   // Yellow brick: 952-1176 → edges 944-1184
            [1184, 1600, 'classroom'],    // Classroom: 1192+ → edges 1184-1600
        ];
        
        // Draw section-specific backgrounds
        for (const [startX, endX, sectionType] of backgroundAreas) {
            const sectionWidth = endX - startX;
            const bg = this.add.graphics();
            
            if (sectionType === 'library') {
                // Shiz University Library - circular rotating bookshelves
                
                // Dark ornate walls with green tint
                bg.fillStyle(0x0f1f1a);
                bg.fillRect(startX, 0, sectionWidth, bgHeight - 16);
                
                // Vaulted ceiling with green magical glow
                bg.fillStyle(0x22c55e, 0.15);
                bg.fillRect(startX, 0, sectionWidth, 30);
                bg.fillStyle(0x166534, 0.1);
                bg.fillRect(startX, 30, sectionWidth, 20);
                
                // Ornate arched windows along back wall
                const windowSpacing = 100;
                for (let wx = startX + 50; wx < endX - 30; wx += windowSpacing) {
                    // Arched window frame
                    bg.fillStyle(0x451a03);
                    bg.fillRect(wx, 10, 36, 55);
                    // Window inner (green light from Emerald City)
                    bg.fillStyle(0x166534);
                    bg.fillRect(wx + 3, 13, 30, 49);
                    // Arch detail
                    bg.fillStyle(0x22c55e, 0.5);
                    bg.fillRect(wx + 6, 16, 24, 20);
                }
                
                // Circular rotating bookshelves in background (the iconic Shiz library look!)
                const carouselSpacing = 90;
                for (let cx = startX + 45; cx < endX - 40; cx += carouselSpacing) {
                    // Draw circular bookshelf carousel
                    const centerY = bgHeight - 55;
                    const radius = 35;
                    
                    // Central pillar/axis
                    bg.fillStyle(0x78350f);
                    bg.fillRect(cx - 4, centerY - radius - 10, 8, radius * 2 + 20);
                    
                    // Circular platform base
                    bg.fillStyle(0x451a03);
                    bg.fillRect(cx - radius - 5, centerY + radius - 5, radius * 2 + 10, 8);
                    
                    // Book compartments arranged in circle (8 segments)
                    const bookColors = [0x7f1d1d, 0x1e3a5f, 0x14532d, 0x4c1d95, 0x713f12, 0x831843, 0x0f766e, 0x9f1239];
                    for (let angle = 0; angle < 8; angle++) {
                        const rad = (angle * Math.PI * 2) / 8;
                        const bx = cx + Math.cos(rad) * (radius - 8);
                        const by = centerY + Math.sin(rad) * (radius - 8);
                        
                        // Book slot
                        bg.fillStyle(bookColors[angle]);
                        bg.fillRect(bx - 6, by - 10, 12, 20);
                        
                        // Gold spine detail
                        bg.fillStyle(0xfbbf24, 0.5);
                        bg.fillRect(bx - 1, by - 8, 2, 16);
                    }
                    
                    // Outer ring
                    bg.fillStyle(0x92400e, 0.6);
                    // Draw ring as segments
                    for (let a = 0; a < 16; a++) {
                        const rad = (a * Math.PI * 2) / 16;
                        const rx = cx + Math.cos(rad) * radius;
                        const ry = centerY + Math.sin(rad) * radius;
                        bg.fillRect(rx - 2, ry - 2, 4, 4);
                    }
                }
                
                // Floating magical green particles
                bg.fillStyle(0x4ade80, 0.5);
                for (let i = 0; i < 15; i++) {
                    const px = startX + 20 + Math.random() * (sectionWidth - 40);
                    const py = 15 + Math.random() * 50;
                    bg.fillRect(px, py, 2, 2);
                }
                
                // Floor detail - ornate tiles
                bg.fillStyle(0x1c1917);
                bg.fillRect(startX, bgHeight - 20, sectionWidth, 4);
                bg.fillStyle(0x22c55e, 0.2);
                for (let fx = startX; fx < endX; fx += 20) {
                    bg.fillRect(fx + 8, bgHeight - 19, 4, 2);
                }
                
            } else if (sectionType === 'yellowBrick') {
                // Yellow brick road - Emerald City skyline in distance, poppy fields
                
                // Gradient night sky (dark blue to purple)
                bg.fillStyle(0x0f172a); // Night sky base
                bg.fillRect(startX, 0, sectionWidth, bgHeight - 16);
                bg.fillStyle(0x1e1b4b, 0.4); // Purple tint at horizon
                bg.fillRect(startX, 60, sectionWidth, bgHeight - 76);
                
                // Rolling hills with poppies (red flowers in Oz!)
                bg.fillStyle(0x14532d); // Dark green hills
                for (let hx = startX; hx < endX; hx += 100) {
                    bg.fillRect(hx, bgHeight - 45, 120, 30);
                }
                
                // Emerald City in distance - repeating across section
                const citySpacing = 200;
                for (let cityX = startX + 50; cityX < endX - 50; cityX += citySpacing) {
                    bg.fillStyle(0x166534);
                    // Main palace tower
                    bg.fillRect(cityX + 30, 35, 25, 120);
                    // Spire
                    bg.fillStyle(0x22c55e);
                    bg.fillRect(cityX + 38, 20, 9, 20);
                    // Side towers
                    bg.fillStyle(0x166534);
                    bg.fillRect(cityX, 55, 15, 100);
                    bg.fillRect(cityX + 65, 50, 18, 105);
                    bg.fillRect(cityX + 90, 65, 12, 90);
                    
                    // Glowing windows
                    bg.fillStyle(0x4ade80, 0.7);
                    bg.fillRect(cityX + 35, 50, 8, 10);
                    bg.fillRect(cityX + 35, 70, 8, 10);
                    bg.fillRect(cityX + 35, 90, 8, 10);
                    bg.fillRect(cityX + 5, 75, 5, 6);
                    bg.fillRect(cityX + 70, 70, 6, 8);
                }
                
                // Scattered poppies (red flowers)
                bg.fillStyle(0xdc2626);
                for (let i = 0; i < Math.floor(sectionWidth / 20); i++) {
                    const fx = startX + 10 + Math.random() * (sectionWidth - 20);
                    const fy = bgHeight - 35 + Math.random() * 15;
                    bg.fillRect(fx, fy, 3, 3);
                }
                
                // Stars in sky
                bg.fillStyle(0xfbbf24, 0.6);
                for (let i = 0; i < Math.floor(sectionWidth / 15); i++) {
                    const sx = startX + Math.random() * sectionWidth;
                    const sy = 5 + Math.random() * 35;
                    bg.fillRect(sx, sy, 2, 2);
                }
                
                // Moon
                const moonX = startX + sectionWidth / 2;
                bg.fillStyle(0xfef3c7, 0.8);
                bg.fillCircle(moonX, 25, 12);
                bg.fillStyle(0x22c55e, 0.2); // Green tint on moon
                bg.fillCircle(moonX, 25, 10);
                
            } else if (sectionType === 'dormitory') {
                // Galinda & Elphaba's Dormitory - the iconic contrast!
                
                // Base wall - elegant wallpaper
                bg.fillStyle(0x1e293b);
                bg.fillRect(startX, 0, sectionWidth, bgHeight - 16);
                
                // Galinda's side - VERY pink (most of the room!)
                bg.fillStyle(0x9d174d, 0.3);
                bg.fillRect(startX, 0, sectionWidth * 0.7, bgHeight - 16);
                
                // Elphaba's tiny corner - dark green
                bg.fillStyle(0x14532d, 0.3);
                bg.fillRect(startX + sectionWidth * 0.7, 0, sectionWidth * 0.3, bgHeight - 16);
                
                // Invisible dividing line (tension!)
                bg.fillStyle(0x374151, 0.5);
                bg.fillRect(startX + sectionWidth * 0.7, 0, 2, bgHeight - 16);
                
                // GALINDA'S SIDE - Excessive luggage and clothes everywhere!
                
                // Pink canopy bed with frills
                bg.fillStyle(0xfda4af);
                bg.fillRect(startX + 20, bgHeight - 60, 70, 40);
                bg.fillStyle(0xfb7185);
                bg.fillRect(startX + 20, bgHeight - 75, 70, 8); // Canopy
                bg.fillRect(startX + 20, bgHeight - 75, 5, 55); // Left post
                bg.fillRect(startX + 85, bgHeight - 75, 5, 55); // Right post
                // Frilly details
                bg.fillStyle(0xfce7f3);
                for (let f = 0; f < 6; f++) {
                    bg.fillRect(startX + 25 + f * 10, bgHeight - 73, 8, 3);
                }
                
                // Stacks of pink luggage/trunks
                bg.fillStyle(0xec4899); // Hot pink trunk 1
                bg.fillRect(startX + 100, bgHeight - 50, 25, 30);
                bg.fillStyle(0xf472b6); // Lighter pink trunk 2
                bg.fillRect(startX + 100, bgHeight - 75, 22, 22);
                bg.fillStyle(0xfbbf24); // Gold clasps
                bg.fillRect(startX + 108, bgHeight - 45, 8, 3);
                bg.fillRect(startX + 108, bgHeight - 70, 6, 2);
                
                // More luggage scattered
                bg.fillStyle(0xdb2777);
                bg.fillRect(startX + 135, bgHeight - 40, 20, 20);
                bg.fillStyle(0xf9a8d4);
                bg.fillRect(startX + 160, bgHeight - 55, 30, 35);
                
                // Vanity with mirror
                bg.fillStyle(0xfbbf24);
                bg.fillRect(startX + 55, 35, 35, 50);
                bg.fillStyle(0xfef3c7, 0.6); // Mirror
                bg.fillRect(startX + 60, 40, 25, 35);
                
                // Clothes hanging/draped (dresses!)
                bg.fillStyle(0xf472b6);
                bg.fillRect(startX + 10, 50, 15, 40); // Dress 1
                bg.fillRect(startX + 30, 45, 12, 35); // Dress 2
                bg.fillStyle(0xfce7f3);
                bg.fillRect(startX + 95, 55, 10, 30); // White dress
                
                // Shoes scattered on floor
                bg.fillStyle(0xec4899);
                bg.fillRect(startX + 45, bgHeight - 25, 8, 5);
                bg.fillRect(startX + 130, bgHeight - 22, 6, 4);
                bg.fillRect(startX + 150, bgHeight - 24, 7, 5);
                
                // ELPHABA'S SIDE - Sparse and simple
                
                // Simple bed with green blanket
                const elphabaX = startX + sectionWidth * 0.7 + 10;
                bg.fillStyle(0x22c55e);
                bg.fillRect(elphabaX + 10, bgHeight - 50, 45, 30);
                bg.fillStyle(0x166534);
                bg.fillRect(elphabaX + 10, bgHeight - 58, 10, 38); // Headboard
                
                // Stack of books (her only possessions)
                bg.fillStyle(0x78350f);
                bg.fillRect(elphabaX + 60, bgHeight - 55, 15, 35);
                bg.fillStyle(0x14532d);
                bg.fillRect(elphabaX + 62, bgHeight - 50, 11, 6);
                bg.fillStyle(0x1e3a5f);
                bg.fillRect(elphabaX + 62, bgHeight - 42, 11, 6);
                bg.fillStyle(0x4c1d95);
                bg.fillRect(elphabaX + 62, bgHeight - 34, 11, 6);
                
                // Single window
                const windowY = 25;
                bg.fillStyle(0x0f172a);
                bg.fillRect(startX + sectionWidth / 2 - 20, windowY, 40, 50);
                bg.fillStyle(0x1e40af, 0.4); // Moonlight
                bg.fillRect(startX + sectionWidth / 2 - 16, windowY + 4, 32, 42);
                
                // Ceiling with pink chandelier (Galinda's touch)
                bg.fillStyle(0xfbbf24, 0.7);
                bg.fillRect(startX + sectionWidth / 3, 8, 25, 12);
                bg.fillStyle(0xec4899, 0.5);
                bg.fillRect(startX + sectionWidth / 3 + 3, 20, 19, 8);
                bg.fillRect(startX + sectionWidth / 2 - 15, 18, 30, 20);
                
            } else if (sectionType === 'classroom') {
                // Dr. Dillamond's Classroom - where animals learned before the ban
                
                // Dark wood-paneled walls
                bg.fillStyle(0x1c1917);
                bg.fillRect(startX, 0, sectionWidth, bgHeight - 16);
                
                // Wood paneling texture
                bg.fillStyle(0x292524, 0.5);
                for (let px = startX; px < endX; px += 30) {
                    bg.fillRect(px, 0, 2, bgHeight - 16);
                }
                
                // Grand chalkboard spanning most of the wall
                const chalkboardWidth = Math.min(sectionWidth - 60, 200);
                bg.fillStyle(0x451a03); // Wood frame
                bg.fillRect(startX + 20, 15, chalkboardWidth + 10, 70);
                bg.fillStyle(0x14532d); // Dark green chalkboard
                bg.fillRect(startX + 25, 20, chalkboardWidth, 60);
                
                // Chalk writing - "Animals Should Be Seen AND Heard"
                bg.fillStyle(0xfafafa, 0.8);
                // Line 1
                for (let i = 0; i < 6; i++) {
                    bg.fillRect(startX + 35 + i * 28, 30, 22, 3);
                }
                // Line 2
                for (let i = 0; i < 5; i++) {
                    bg.fillRect(startX + 40 + i * 30, 42, 25, 3);
                }
                // Dr. Dillamond's signature mark (goat hoof print)
                bg.fillRect(startX + chalkboardWidth - 10, 55, 8, 8);
                bg.fillRect(startX + chalkboardWidth - 5, 63, 4, 4);
                
                // Windows with iron bars (ominous foreshadowing)
                const numWindows = Math.floor(sectionWidth / 100);
                for (let w = 0; w < numWindows; w++) {
                    const wx = startX + 60 + w * 100 + chalkboardWidth / 2;
                    if (wx < endX - 40) {
                        bg.fillStyle(0x0f172a);
                        bg.fillRect(wx, 20, 30, 50);
                        bg.fillStyle(0x1e40af, 0.3);
                        bg.fillRect(wx + 2, 22, 26, 46);
                        // Iron bars
                        bg.fillStyle(0x374151);
                        bg.fillRect(wx + 10, 20, 2, 50);
                        bg.fillRect(wx + 20, 20, 2, 50);
                    }
                }
                
                // Rows of student desks
                bg.fillStyle(0x78350f);
                const deskRows = 2;
                const desksPerRow = Math.floor(sectionWidth / 60);
                for (let row = 0; row < deskRows; row++) {
                    for (let col = 0; col < desksPerRow; col++) {
                        const dx = startX + 25 + col * 60;
                        const dy = bgHeight - 60 + row * 25;
                        if (dx < endX - 50) {
                            bg.fillRect(dx, dy, 45, 18);
                            // Chair back
                            bg.fillStyle(0x5c3d1e);
                            bg.fillRect(dx + 15, dy - 8, 15, 8);
                            bg.fillStyle(0x78350f);
                        }
                    }
                }
                
                // Lectern for Dr. Dillamond
                bg.fillStyle(0x451a03);
                bg.fillRect(startX + 10, bgHeight - 70, 25, 50);
                bg.fillStyle(0x78350f);
                bg.fillRect(startX + 8, bgHeight - 75, 29, 8);
                
                // Candelabras for old-world atmosphere
                bg.fillStyle(0xfbbf24, 0.7);
                bg.fillRect(startX + 8, 10, 5, 10);
                bg.fillRect(startX + sectionWidth - 15, 10, 5, 10);
                // Candle flames
                bg.fillStyle(0xfef3c7, 0.5);
                bg.fillRect(startX + 9, 5, 3, 5);
                bg.fillRect(startX + sectionWidth - 14, 5, 3, 5);
            }
            
            bg.setScrollFactor(1, 1); // Fixed to world coordinates - no parallax so backgrounds align with floors
            this.backgroundElements.push(bg);
        }
        
        // Add overall sky gradient behind everything
        const sky = this.add.graphics();
        sky.fillStyle(0x0f172a); // Dark base
        sky.fillRect(0, 0, WORLD_WIDTH, bgHeight);
        sky.setScrollFactor(1, 1); // Also fixed to world
        sky.setDepth(-10);
        this.backgroundElements.push(sky);
    }
    
    private createFinishLine(): void {
        // Place finish line near the end of the level
        const finishY = WORLD_HEIGHT - 16 - 24; // Position above ground (48px sprite, anchored at center)

        this.finishLine = this.physics.add.sprite(this.finishLineX, finishY, 'finishLine');
        this.finishLine.setImmovable(true);
        this.finishLine.body.setAllowGravity(false);
    }

    private handleFinishLine(): void {
        if (this.hasFinished) return;

        this.hasFinished = true;

        // Celebration effect - flash the screen
        this.cameras.main.flash(500, 255, 215, 0); // Gold flash

        // In practice mode, always show "LEVEL COMPLETE!" and return to lobby
        // In multiplayer, progress through levels
        const isLastLevel = this.currentLevel >= LEVELS.length - 1;
        const message = this.isPractice ? 'LEVEL COMPLETE!' : (isLastLevel ? 'YOU WIN!' : 'LEVEL COMPLETE!');

        // Show victory text - position relative to viewport (scrollFactor 0)
        this.victoryText = this.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 - 20,
            message,
            {
                fontSize: '20px',
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

        // In practice mode: show celebration then return to lobby
        if (this.isPractice) {
            this.time.delayedCall(2500, () => {
                window.location.href = '/lobby';
            });
            return;
        }

        // In multiplayer: progress to next level after delay (if not last level)
        if (!isLastLevel) {
            this.time.delayedCall(2000, () => {
                this.nextLevel();
            });
        }
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

    private loadLevel(levelIndex: number): void {
        const level = LEVELS[levelIndex];
        if (!level) {
            console.error(`Level ${levelIndex} not found!`);
            return;
        }

        // Clear existing level elements
        this.ground.clear(true, true);
        this.lava.clear(true, true);
        if (this.finishLine) {
            this.finishLine.destroy();
        }

        // Update background for the level's theme
        this.createBackground(level.theme || 'default');

        // Update spawn and finish positions from level config
        this.spawnX = level.spawnX;
        this.spawnY = level.spawnY;
        this.finishLineX = level.finishX;

        const tileSize = 16;
        const groundY = WORLD_HEIGHT - tileSize / 2;

        // Helper to get hazard type at position
        const getHazardAt = (x: number): string | null => {
            for (const [start, end, hazardType] of level.hazards) {
                if (x >= start && x <= end) {
                    return hazardType;
                }
            }
            return null;
        };

        // Helper to get ground type at position (for themed levels)
        const getGroundTypeAt = (x: number): string => {
            if (level.groundSections) {
                for (const [start, end, groundType] of level.groundSections) {
                    if (x >= start && x <= end) {
                        return groundType;
                    }
                }
            }
            return 'ground'; // Default ground type
        };

        // Create ground or hazards based on position
        for (let x = tileSize / 2; x < WORLD_WIDTH; x += tileSize) {
            const hazard = getHazardAt(x);
            if (hazard) {
                // Create hazard tile
                const hazardTile = hazard === 'lava' ? 'lava' : 
                                   hazard === 'void' ? 'void' : 
                                   hazard === 'spikes' ? 'spikes' : 'lava';
                this.lava.create(x, groundY, hazardTile);
            } else {
                // Create themed ground tile
                const groundType = getGroundTypeAt(x);
                this.ground.create(x, groundY, groundType);
            }
        }

        // Create platforms from level config
        for (const platform of level.platforms) {
            const [x, y, widthTiles, tileType] = platform;
            const platformTile = tileType || 'platform';
            for (let i = 0; i < widthTiles; i++) {
                this.ground.create(x + i * 16, y, platformTile);
            }
        }

        // Create finish line
        this.createFinishLine();

        // Update level text
        this.updateLevelDisplay();
    }

    private updateLevelDisplay(): void {
        const level = LEVELS[this.currentLevel];
        const displayText = level?.name || `Level ${this.currentLevel + 1}`;
        
        if (this.levelText) {
            this.levelText.setText(displayText);
        } else {
            this.levelText = this.add.text(
                8,
                8,
                displayText,
                {
                    fontSize: '8px',
                    color: '#fbbf24',
                    backgroundColor: '#1f293780',
                    padding: { x: 4, y: 2 },
                },
            );
            this.levelText.setScrollFactor(0);
            this.levelText.setDepth(100);
        }
    }

    private nextLevel(): void {
        if (this.currentLevel < LEVELS.length - 1) {
            this.currentLevel++;
            this.hasFinished = false;
            
            // Clean up victory text if present
            if (this.victoryText) {
                this.victoryText.destroy();
                this.victoryText = undefined;
            }
            
            // Load the next level
            this.loadLevel(this.currentLevel);
            
            // Reset player position
            this.player.setPosition(this.spawnX, this.spawnY);
            this.player.setVelocity(0, 0);
            
            // Re-add colliders (they get cleared when groups are cleared)
            this.physics.add.collider(this.player, this.ground);
            this.physics.add.overlap(this.player, this.lava, () => {
                this.handleLavaDeath();
            });
            this.physics.add.overlap(this.player, this.finishLine, () => {
                this.handleFinishLine();
            });
            
            // Brief flash to indicate level change
            this.cameras.main.flash(300, 100, 200, 255);
        } else {
            // All levels complete - show game complete message
            this.showGameComplete();
        }
    }

    private showGameComplete(): void {
        if (this.victoryText) {
            this.victoryText.setText('ALL LEVELS COMPLETE!');
        }
    }

    private selectLevel(levelIndex: number): void {
        if (levelIndex < 0 || levelIndex >= LEVELS.length) return;

        // Clean up any victory text
        if (this.victoryText) {
            this.victoryText.destroy();
            this.victoryText = undefined;
        }

        // Reset finished state
        this.hasFinished = false;
        
        // Set and load the new level
        this.currentLevel = levelIndex;
        this.loadLevel(this.currentLevel);

        // Reset player position
        this.player.setPosition(this.spawnX, this.spawnY);
        this.player.setVelocity(0, 0);

        // Re-add colliders
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.overlap(this.player, this.lava, () => {
            this.handleLavaDeath();
        });
        this.physics.add.overlap(this.player, this.finishLine, () => {
            this.handleFinishLine();
        });

        // Flash to indicate level change
        this.cameras.main.flash(300, 100, 200, 255);
    }

    create(): void {
        // Set up larger world bounds for scrolling
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        
        // Initialize physics groups
        this.ground = this.physics.add.staticGroup();
        this.lava = this.physics.add.staticGroup();
        
        // Load the current level (this also creates the themed background)
        this.loadLevel(this.currentLevel);

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
            
            // Number keys for level selection (1-9)
        }

        this.player.anims.play(`idle_${this.playerCostume}`);
        
        // Set up camera to follow player smoothly
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(50, 30); // Small deadzone for smoother feel

        // Listen for other players' movements (multiplayer only)
        if (!this.isPractice) {
        this.setupWebSocketListeners();

        // Send initial position so other players can see us
        this.time.delayedCall(500, () => {
            this.sendPosition('idle');
        });
        }
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

        // Check if player passed the finish line (even if they jumped over it)
        if (!this.hasFinished && this.player.x >= this.finishLineX) {
            this.handleFinishLine();
        }

        // Update name label position
        this.playerNameText.setPosition(this.player.x, this.player.y - 12);

        // Multiplayer position sync (skip in practice mode)
        if (!this.isPractice) {
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
