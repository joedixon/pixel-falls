import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';

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
    playerCostume: number;
    startLevel?: number;
    isPractice?: boolean;
    className?: string;
}

export default function MultiplayerGameCanvas({
    roomId,
    playerId,
    playerName,
    playerCostume,
    startLevel = 0,
    isPractice = false,
    className = '',
}: MultiplayerGameCanvasProps) {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerReady, setContainerReady] = useState(false);

    // Wait for container to have dimensions
    useEffect(() => {
        if (!containerRef.current) return;

        const checkSize = () => {
            const container = containerRef.current;
            if (container && container.clientWidth > 0 && container.clientHeight > 0) {
                setContainerReady(true);
            }
        };

        // Check immediately
        checkSize();

        // Also check on resize in case it takes a moment
        const resizeObserver = new ResizeObserver(checkSize);
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    // Initialize Phaser once container is ready
    useEffect(() => {
        if (gameRef.current || !containerRef.current || !containerReady) {
            return;
        }

        const container = containerRef.current;

        // Create the multiplayer scene with room info
        const scene = new MultiplayerGameScene(roomId, playerId, playerName, playerCostume, startLevel, isPractice);

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
                expandParent: false,
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

        // Handle resize to refresh Phaser scaling
        const handleResize = () => {
            if (gameRef.current) {
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
    }, [roomId, playerId, playerName, playerCostume, startLevel, isPractice, containerReady]);

    return (
        <div
            ref={containerRef}
            id="game-container"
            className={`${className}`}
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
