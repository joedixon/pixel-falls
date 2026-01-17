import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

// Pixel art color palette (cute/friendly style)
const COLORS = {
    skin: 0xffd5c8,
    skinDark: 0xf0b8a8,
    hair: 0x4a3728,
    shirt: 0x5b8dd9,
    shirtDark: 0x4a7bc4,
    pants: 0x3d5a80,
    shoes: 0x2d3436,
    eyes: 0x2d3436,
    grass: 0x4ade80,
    grassDark: 0x22c55e,
    dirt: 0x92400e,
    dirtDark: 0x78350f,
};

export class GameScene extends Phaser.Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };
    private ground!: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        // Generate pixel art sprites programmatically
        this.createPlayerSprites();
        this.createGroundTile();
    }

    private createPlayerSprites(): void {
        // Create a canvas for the sprite sheet (5 frames: 1 idle + 4 walk)
        const frameWidth = 16;
        const frameHeight = 16;
        const frameCount = 5;

        const canvas = document.createElement('canvas');
        canvas.width = frameWidth * frameCount;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d')!;

        // Draw each frame
        for (let frame = 0; frame < frameCount; frame++) {
            const offsetX = frame * frameWidth;
            this.drawPlayerFrame(ctx, offsetX, frame);
        }

        // Add the sprite sheet to Phaser
        this.textures.addSpriteSheet('player', canvas, {
            frameWidth,
            frameHeight,
        });
    }

    private drawPlayerFrame(
        ctx: CanvasRenderingContext2D,
        offsetX: number,
        frame: number,
    ): void {
        // Animation offset for walking frames
        const walkOffset = frame === 0 ? 0 : Math.sin((frame / 4) * Math.PI * 2);
        const bobY = frame === 0 ? 0 : Math.abs(walkOffset) * 1;

        // Helper to draw a pixel
        const pixel = (x: number, y: number, color: number) => {
            ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
            ctx.fillRect(offsetX + x, y - bobY, 1, 1);
        };

        // Hair (top of head)
        pixel(6, 2, COLORS.hair);
        pixel(7, 2, COLORS.hair);
        pixel(8, 2, COLORS.hair);
        pixel(9, 2, COLORS.hair);
        pixel(5, 3, COLORS.hair);
        pixel(6, 3, COLORS.hair);
        pixel(7, 3, COLORS.hair);
        pixel(8, 3, COLORS.hair);
        pixel(9, 3, COLORS.hair);
        pixel(10, 3, COLORS.hair);

        // Face
        pixel(6, 4, COLORS.skin);
        pixel(7, 4, COLORS.skin);
        pixel(8, 4, COLORS.skin);
        pixel(9, 4, COLORS.skin);
        pixel(5, 5, COLORS.skin);
        pixel(6, 5, COLORS.skin);
        pixel(7, 5, COLORS.eyes); // Left eye
        pixel(8, 5, COLORS.skin);
        pixel(9, 5, COLORS.eyes); // Right eye
        pixel(10, 5, COLORS.skin);
        pixel(6, 6, COLORS.skin);
        pixel(7, 6, COLORS.skin);
        pixel(8, 6, COLORS.skinDark); // Mouth/smile
        pixel(9, 6, COLORS.skin);

        // Body (shirt)
        pixel(6, 7, COLORS.shirt);
        pixel(7, 7, COLORS.shirt);
        pixel(8, 7, COLORS.shirt);
        pixel(9, 7, COLORS.shirt);
        pixel(5, 8, COLORS.shirt);
        pixel(6, 8, COLORS.shirt);
        pixel(7, 8, COLORS.shirtDark);
        pixel(8, 8, COLORS.shirtDark);
        pixel(9, 8, COLORS.shirt);
        pixel(10, 8, COLORS.shirt);
        pixel(6, 9, COLORS.shirt);
        pixel(7, 9, COLORS.shirt);
        pixel(8, 9, COLORS.shirt);
        pixel(9, 9, COLORS.shirt);

        // Arms (animate during walk)
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset * 2);
        pixel(4, 8 + armSwing, COLORS.skin);
        pixel(11, 8 - armSwing, COLORS.skin);

        // Pants
        pixel(6, 10, COLORS.pants);
        pixel(7, 10, COLORS.pants);
        pixel(8, 10, COLORS.pants);
        pixel(9, 10, COLORS.pants);

        // Legs (animate during walk)
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(6, 11, COLORS.pants);
        pixel(7, 11 + legOffset, COLORS.pants);
        pixel(8, 11 - legOffset, COLORS.pants);
        pixel(9, 11, COLORS.pants);

        // Feet
        pixel(6, 12 + legOffset, COLORS.shoes);
        pixel(7, 12 + legOffset, COLORS.shoes);
        pixel(8, 12 - legOffset, COLORS.shoes);
        pixel(9, 12 - legOffset, COLORS.shoes);
    }

    private createGroundTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        // Draw grass layer (top 4 pixels)
        ctx.fillStyle = '#' + COLORS.grass.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, size, 4);

        // Add some grass variation
        ctx.fillStyle = '#' + COLORS.grassDark.toString(16).padStart(6, '0');
        for (let x = 0; x < size; x += 3) {
            ctx.fillRect(x, 0, 1, 2);
        }

        // Draw dirt layer (bottom 12 pixels)
        ctx.fillStyle = '#' + COLORS.dirt.toString(16).padStart(6, '0');
        ctx.fillRect(0, 4, size, 12);

        // Add dirt texture
        ctx.fillStyle = '#' + COLORS.dirtDark.toString(16).padStart(6, '0');
        for (let y = 5; y < size; y += 3) {
            for (let x = (y % 6 === 5 ? 2 : 0); x < size; x += 4) {
                ctx.fillRect(x, y, 2, 2);
            }
        }

        this.textures.addImage('ground', canvas);
    }

    create(): void {
        // Create ground platform
        this.ground = this.physics.add.staticGroup();

        // Create a row of ground tiles across the bottom
        const tileSize = 16;
        const groundY = GAME_HEIGHT - tileSize / 2;

        for (let x = tileSize / 2; x < GAME_WIDTH; x += tileSize) {
            this.ground.create(x, groundY, 'ground');
        }

        // Create the player sprite
        this.player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.1);

        // Add collision between player and ground
        this.physics.add.collider(this.player, this.ground);

        // Create animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });

        // Set up keyboard input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.wasd = {
                W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            };
        }

        // Start with idle animation
        this.player.anims.play('idle');
    }

    update(): void {
        const speed = 100;

        // Check for left/right movement (arrow keys or WASD)
        const leftPressed = this.cursors?.left.isDown || this.wasd?.A.isDown;
        const rightPressed = this.cursors?.right.isDown || this.wasd?.D.isDown;

        if (leftPressed) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            if (this.player.body.touching.down) {
                this.player.anims.play('walk', true);
            }
        } else if (rightPressed) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            if (this.player.body.touching.down) {
                this.player.anims.play('walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.anims.play('idle', true);
            }
        }
    }
}
