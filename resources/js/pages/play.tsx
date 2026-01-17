import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import GameCanvas from '@/components/game-canvas';

export default function Play() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Brief loading state to ensure Phaser initializes properly
        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Play">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=silkscreen:400,700"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="flex h-screen flex-col p-3"
                style={{
                    fontFamily: "'Silkscreen', cursive",
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                }}
            >
                {/* Pixel art decorative stars */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-1 w-1 bg-white"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 60}%`,
                                opacity: 0.3 + Math.random() * 0.7,
                                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Header with title and back button */}
                <div className="relative z-10 mb-2 flex items-center justify-between">
                    <Link
                        href="/"
                        className="border-2 border-yellow-400 bg-transparent px-4 py-1 text-sm text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-gray-900"
                    >
                        ← BACK
                    </Link>
                    <h1
                        className="text-center text-2xl tracking-wider text-yellow-400 md:text-3xl"
                        style={{
                            textShadow: '2px 2px 0 #7c3aed, 4px 4px 0 #1e1b4b',
                            imageRendering: 'pixelated',
                        }}
                    >
                        PIXEL FALLS
                    </h1>
                    {/* Controls hint - compact */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex gap-1">
                            <kbd className="border border-gray-600 bg-gray-800 px-1.5 py-0.5 text-white">
                                ←→
                            </kbd>
                        </div>
                        <span className="text-gray-500">or</span>
                        <div className="flex gap-1">
                            <kbd className="border border-gray-600 bg-gray-800 px-1.5 py-0.5 text-white">
                                AD
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Game container - fills remaining space */}
                <div
                    className="relative flex flex-1 items-center justify-center overflow-hidden rounded-none border-4 border-yellow-400 bg-gray-900"
                    style={{
                        boxShadow: '6px 6px 0 #7c3aed, 12px 12px 0 rgba(0,0,0,0.3)',
                    }}
                >
                    {isLoading ? (
                        <div className="flex h-full w-full items-center justify-center bg-gray-900">
                            <div className="text-center text-yellow-400">
                                <div className="mb-4 text-2xl">LOADING...</div>
                                <div className="flex justify-center gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="h-4 w-4 bg-yellow-400"
                                            style={{
                                                animation: 'bounce 0.6s ease-in-out infinite',
                                                animationDelay: `${i * 0.1}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <GameCanvas className="h-full w-full" />
                    )}
                </div>
            </div>

            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </>
    );
}
