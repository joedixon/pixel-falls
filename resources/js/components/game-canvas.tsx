import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { GAME_HEIGHT, GAME_WIDTH, gameConfig } from '@/game/config';

interface GameCanvasProps {
    className?: string;
}

export default function GameCanvas({ className = '' }: GameCanvasProps) {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only create the game if it doesn't exist and we have a container
        if (gameRef.current || !containerRef.current) {
            return;
        }

        const container = containerRef.current;

        // Calculate the maximum integer scale that fits in the container
        const calculateScale = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Find the largest integer scale that fits
            const scaleX = Math.floor(containerWidth / GAME_WIDTH);
            const scaleY = Math.floor(containerHeight / GAME_HEIGHT);
            return Math.max(1, Math.min(scaleX, scaleY));
        };

        const initialScale = calculateScale();

        // Create the Phaser game instance with calculated scale
        const config: Phaser.Types.Core.GameConfig = {
            ...gameConfig,
            parent: container,
            scale: {
                ...gameConfig.scale,
                zoom: initialScale,
            },
        };

        gameRef.current = new Phaser.Game(config);

        // Handle container resize
        const handleResize = () => {
            if (gameRef.current) {
                const newScale = calculateScale();
                gameRef.current.scale.setZoom(newScale);
                gameRef.current.scale.refresh();
            }
        };

        // Use ResizeObserver for container size changes
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        // Cleanup on unmount
        return () => {
            resizeObserver.disconnect();
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="game-container"
            className={`flex items-center justify-center ${className}`}
            style={{
                imageRendering: 'pixelated',
            }}
        />
    );
}
