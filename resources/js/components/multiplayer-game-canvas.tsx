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
        };
    }
}

window.touchControls = { left: false, right: false };

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

    const [leftPressed, setLeftPressed] = useState(false);
    const [rightPressed, setRightPressed] = useState(false);

    const handleLeftDown = () => {
        setLeftPressed(true);
        window.touchControls.left = true;
    };

    const handleLeftUp = () => {
        setLeftPressed(false);
        window.touchControls.left = false;
    };

    const handleRightDown = () => {
        setRightPressed(true);
        window.touchControls.right = true;
    };

    const handleRightUp = () => {
        setRightPressed(false);
        window.touchControls.right = false;
    };

    return (
        <div className={`relative ${className}`}>
            <div
                ref={containerRef}
                id="game-container"
                className="flex h-full w-full items-center justify-center"
                style={{ imageRendering: 'pixelated' }}
            />
            
            {/* Touch controls - always visible, positioned at bottom left */}
            <div className="absolute bottom-4 left-4 z-50 flex gap-2">
                <button
                    className={`flex h-14 w-14 items-center justify-center border-2 border-yellow-500 text-3xl transition-colors select-none ${
                        leftPressed ? 'bg-yellow-400 text-gray-900' : 'bg-yellow-400/70 text-gray-800'
                    }`}
                    onPointerDown={handleLeftDown}
                    onPointerUp={handleLeftUp}
                    onPointerLeave={handleLeftUp}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    ◀
                </button>
                <button
                    className={`flex h-14 w-14 items-center justify-center border-2 border-yellow-500 text-3xl transition-colors select-none ${
                        rightPressed ? 'bg-yellow-400 text-gray-900' : 'bg-yellow-400/70 text-gray-800'
                    }`}
                    onPointerDown={handleRightDown}
                    onPointerUp={handleRightUp}
                    onPointerLeave={handleRightUp}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}
