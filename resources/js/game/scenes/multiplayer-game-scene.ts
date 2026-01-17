import Phaser from 'phaser';

import { GAME_HEIGHT, GAME_WIDTH } from '../config';

// Player color palettes for different players
const PLAYER_PALETTES = [
    { shirt: 0x5b8dd9, shirtDark: 0x4a7bc4, hair: 0x4a3728 }, // Blue (Player 1)
    { shirt: 0xef4444, shirtDark: 0xdc2626, hair: 0x1a1a1a }, // Red (Player 2)
    { shirt: 0x22c55e, shirtDark: 0x16a34a, hair: 0xfbbf24 }, // Green (Player 3)
    { shirt: 0xa855f7, shirtDark: 0x9333ea, hair: 0xf97316 }, // Purple (Player 4)
];

const BASE_COLORS = {
    skin: 0xffd5c8,
    skinDark: 0xf0b8a8,
    pants: 0x3d5a80,
    shoes: 0x2d3436,
    eyes: 0x2d3436,
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
    ) {
        super({ key: 'MultiplayerGameScene' });
    }

    preload(): void {
        // Create player sprites for all possible colors
        for (let i = 0; i < PLAYER_PALETTES.length; i++) {
            this.createPlayerSprites(i);
        }
        this.createGroundTile();
    }

    private createPlayerSprites(paletteIndex: number): void {
        const frameWidth = 16;
        const frameHeight = 16;
        const frameCount = 5;
        const palette = PLAYER_PALETTES[paletteIndex];

        const canvas = document.createElement('canvas');
        canvas.width = frameWidth * frameCount;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d')!;

        for (let frame = 0; frame < frameCount; frame++) {
            const offsetX = frame * frameWidth;
            this.drawPlayerFrame(ctx, offsetX, frame, palette);
        }

        this.textures.addSpriteSheet(`player_${paletteIndex}`, canvas, {
            frameWidth,
            frameHeight,
        });
    }

    private drawPlayerFrame(
        ctx: CanvasRenderingContext2D,
        offsetX: number,
        frame: number,
        palette: { shirt: number; shirtDark: number; hair: number },
    ): void {
        const walkOffset = frame === 0 ? 0 : Math.sin((frame / 4) * Math.PI * 2);
        const bobY = frame === 0 ? 0 : Math.abs(walkOffset) * 1;

        const pixel = (x: number, y: number, color: number) => {
            ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
            ctx.fillRect(offsetX + x, y - bobY, 1, 1);
        };

        // Hair
        pixel(6, 2, palette.hair);
        pixel(7, 2, palette.hair);
        pixel(8, 2, palette.hair);
        pixel(9, 2, palette.hair);
        pixel(5, 3, palette.hair);
        pixel(6, 3, palette.hair);
        pixel(7, 3, palette.hair);
        pixel(8, 3, palette.hair);
        pixel(9, 3, palette.hair);
        pixel(10, 3, palette.hair);

        // Face
        pixel(6, 4, BASE_COLORS.skin);
        pixel(7, 4, BASE_COLORS.skin);
        pixel(8, 4, BASE_COLORS.skin);
        pixel(9, 4, BASE_COLORS.skin);
        pixel(5, 5, BASE_COLORS.skin);
        pixel(6, 5, BASE_COLORS.skin);
        pixel(7, 5, BASE_COLORS.eyes);
        pixel(8, 5, BASE_COLORS.skin);
        pixel(9, 5, BASE_COLORS.eyes);
        pixel(10, 5, BASE_COLORS.skin);
        pixel(6, 6, BASE_COLORS.skin);
        pixel(7, 6, BASE_COLORS.skin);
        pixel(8, 6, BASE_COLORS.skinDark);
        pixel(9, 6, BASE_COLORS.skin);

        // Shirt
        pixel(6, 7, palette.shirt);
        pixel(7, 7, palette.shirt);
        pixel(8, 7, palette.shirt);
        pixel(9, 7, palette.shirt);
        pixel(5, 8, palette.shirt);
        pixel(6, 8, palette.shirt);
        pixel(7, 8, palette.shirtDark);
        pixel(8, 8, palette.shirtDark);
        pixel(9, 8, palette.shirt);
        pixel(10, 8, palette.shirt);
        pixel(6, 9, palette.shirt);
        pixel(7, 9, palette.shirt);
        pixel(8, 9, palette.shirt);
        pixel(9, 9, palette.shirt);

        // Arms
        const armSwing = frame === 0 ? 0 : Math.round(walkOffset * 2);
        pixel(4, 8 + armSwing, BASE_COLORS.skin);
        pixel(11, 8 - armSwing, BASE_COLORS.skin);

        // Pants
        pixel(6, 10, BASE_COLORS.pants);
        pixel(7, 10, BASE_COLORS.pants);
        pixel(8, 10, BASE_COLORS.pants);
        pixel(9, 10, BASE_COLORS.pants);

        // Legs
        const legOffset = frame === 0 ? 0 : Math.round(walkOffset);
        pixel(6, 11, BASE_COLORS.pants);
        pixel(7, 11 + legOffset, BASE_COLORS.pants);
        pixel(8, 11 - legOffset, BASE_COLORS.pants);
        pixel(9, 11, BASE_COLORS.pants);

        // Feet
        pixel(6, 12 + legOffset, BASE_COLORS.shoes);
        pixel(7, 12 + legOffset, BASE_COLORS.shoes);
        pixel(8, 12 - legOffset, BASE_COLORS.shoes);
        pixel(9, 12 - legOffset, BASE_COLORS.shoes);
    }

    private createGroundTile(): void {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#' + BASE_COLORS.grass.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, size, 4);

        ctx.fillStyle = '#' + BASE_COLORS.grassDark.toString(16).padStart(6, '0');
        for (let x = 0; x < size; x += 3) {
            ctx.fillRect(x, 0, 1, 2);
        }

        ctx.fillStyle = '#' + BASE_COLORS.dirt.toString(16).padStart(6, '0');
        ctx.fillRect(0, 4, size, 12);

        ctx.fillStyle = '#' + BASE_COLORS.dirtDark.toString(16).padStart(6, '0');
        for (let y = 5; y < size; y += 3) {
            for (let x = y % 6 === 5 ? 2 : 0; x < size; x += 4) {
                ctx.fillRect(x, y, 2, 2);
            }
        }

        this.textures.addImage('ground', canvas);
    }

    create(): void {
        // Create ground
        this.ground = this.physics.add.staticGroup();
        const tileSize = 16;
        const groundY = GAME_HEIGHT - tileSize / 2;

        for (let x = tileSize / 2; x < GAME_WIDTH; x += tileSize) {
            this.ground.create(x, groundY, 'ground');
        }

        // Create local player (always blue - palette 0)
        this.player = this.physics.add.sprite(
            GAME_WIDTH / 2,
            GAME_HEIGHT - 40,
            'player_0',
        );
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.1);
        this.physics.add.collider(this.player, this.ground);

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
        for (let i = 0; i < PLAYER_PALETTES.length; i++) {
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

        this.player.anims.play('idle_0');

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

        if (!remote) {
            // Create new remote player with a different color
            const paletteIndex = (this.remotePlayers.size + 1) % PLAYER_PALETTES.length;
            
            try {
                const sprite = this.physics.add.sprite(data.x, data.y, `player_${paletteIndex}`);
                sprite.setCollideWorldBounds(true);
                this.physics.add.collider(sprite, this.ground);

                const nameText = this.add.text(data.x, data.y - 16, data.playerName, {
                    fontSize: '8px',
                    color: '#ffffff',
                    backgroundColor: '#00000080',
                    padding: { x: 2, y: 1 },
                });
                nameText.setOrigin(0.5, 1);

                // Store palette index on sprite for animation
                sprite.setData('paletteIndex', paletteIndex);

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
            const paletteIndex = remote.sprite.getData('paletteIndex') as number;
            remote.sprite.setFlipX(data.flipX);

            if (data.animation === 'walk') {
                remote.sprite.anims.play(`walk_${paletteIndex}`, true);
            } else {
                remote.sprite.anims.play(`idle_${paletteIndex}`, true);
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
                this.player.anims.play('walk_0', true);
                animation = 'walk';
            }
        } else if (rightPressed) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            if (this.player.body.touching.down) {
                this.player.anims.play('walk_0', true);
                animation = 'walk';
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.anims.play('idle_0', true);
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
