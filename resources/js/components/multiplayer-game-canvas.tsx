import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

import { GAME_HEIGHT, GAME_WIDTH } from '@/game/config';
import { MultiplayerGameScene } from '@/game/scenes/multiplayer-game-scene';

// Global touch state that the Phaser scene can read
declare global {
    interface Window {
        touchControls: {
            left: boolean;
            right: boolean;
            jump: boolean;
        };
    }
}

interface MultiplayerGameCanvasProps {
    roomId: number;
    playerId: number;
    playerName: string;
    className?: string;
}

export default function MultiplayerGameCanvas({
    roomId,
    playerId,
    playerName,
    className = '',
}: MultiplayerGameCanvasProps) {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gameRef.current || !containerRef.current) {
            return;
        }

        const container = containerRef.current;

        const calculateScale = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const scaleX = Math.floor(containerWidth / GAME_WIDTH);
            const scaleY = Math.floor(containerHeight / GAME_HEIGHT);
            return Math.max(1, Math.min(scaleX, scaleY));
        };

        const initialScale = calculateScale();

        // Create the multiplayer scene with room info
        const scene = new MultiplayerGameScene(roomId, playerId, playerName);

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            parent: container,
            backgroundColor: '#1a1a2e',
            pixelArt: true,
            roundPixels: true,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                zoom: initialScale,
                min: { width: GAME_WIDTH, height: GAME_HEIGHT },
                max: { width: GAME_WIDTH * 8, height: GAME_HEIGHT * 8 },
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 800 },
                    debug: false,
                },
            },
            scene: [scene],
        };

        gameRef.current = new Phaser.Game(config);

        const handleResize = () => {
            if (gameRef.current) {
                const newScale = calculateScale();
                gameRef.current.scale.setZoom(newScale);
                gameRef.current.scale.refresh();
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [roomId, playerId, playerName]);

    return (
        <div
            ref={containerRef}
            id="game-container"
            className={`flex items-center justify-center ${className}`}
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
