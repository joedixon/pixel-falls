import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import MultiplayerGameCanvas from '@/components/multiplayer-game-canvas';
import { LEVEL_INFO } from '@/game/levels';
import { type SharedData } from '@/types';

// Ensure touchControls exists
if (typeof window !== 'undefined') {
    window.touchControls = window.touchControls || { left: false, right: false, jump: false };
}

interface Props {
    playerCostume: number;
    startLevel: number;
}

export default function Practice({ playerCostume, startLevel }: Props) {
    const { auth } = usePage<SharedData>().props;
    const levelInfo = LEVEL_INFO[startLevel] || LEVEL_INFO[0];
    
    // Touch control state
    const [leftPressed, setLeftPressed] = useState(false);
    const [rightPressed, setRightPressed] = useState(false);
    const [jumpPressed, setJumpPressed] = useState(false);

    // Touch control handlers
    const handleLeftDown = () => {
        setLeftPressed(true);
        if (window.touchControls) window.touchControls.left = true;
    };
    const handleLeftUp = () => {
        setLeftPressed(false);
        if (window.touchControls) window.touchControls.left = false;
    };
    const handleRightDown = () => {
        setRightPressed(true);
        if (window.touchControls) window.touchControls.right = true;
    };
    const handleRightUp = () => {
        setRightPressed(false);
        if (window.touchControls) window.touchControls.right = false;
    };
    const handleJumpDown = () => {
        setJumpPressed(true);
        if (window.touchControls) window.touchControls.jump = true;
    };
    const handleJumpUp = () => {
        setJumpPressed(false);
        if (window.touchControls) window.touchControls.jump = false;
    };

    return (
        <>
            <Head title={`Practice: ${levelInfo.name}`}>
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
                {/* Header */}
                <div className="relative z-10 mb-2 flex items-center justify-between">
                    <Link
                        href="/lobby"
                        className="border-2 border-yellow-400 bg-transparent px-4 py-1 text-sm text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-gray-900"
                    >
                        ← LOBBY
                    </Link>

                    <div className="flex items-center gap-4">
                        <h1
                            className="text-xl tracking-wider text-yellow-400 md:text-2xl"
                            style={{
                                textShadow: '2px 2px 0 #7c3aed',
                            }}
                        >
                            {levelInfo.name}
                        </h1>
                        <span
                            className="border-2 border-orange-500 bg-orange-500/20 px-3 py-1 font-mono text-sm text-orange-400"
                        >
                            PRACTICE
                        </span>
                    </div>

                    {/* Solo indicator */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        <span className="text-gray-400">Solo Mode</span>
                    </div>
                </div>

                {/* Game container */}
                <div
                    className="relative flex flex-1 items-center justify-center border-4 border-yellow-400 bg-gray-900"
                    style={{
                        boxShadow: '6px 6px 0 #7c3aed, 12px 12px 0 rgba(0,0,0,0.3)',
                    }}
                >
                    <MultiplayerGameCanvas
                        roomId={0}
                        playerId={auth.user!.id}
                        playerName={auth.user!.name}
                        playerCostume={playerCostume}
                        startLevel={startLevel}
                        isPractice={true}
                        className="h-full w-full"
                    />
                </div>

                {/* Controls hint */}
                <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span>
                        <kbd className="border border-gray-600 bg-gray-800 px-1 text-white">←→</kbd> or{' '}
                        <kbd className="border border-gray-600 bg-gray-800 px-1 text-white">AD</kbd> Move
                    </span>
                    <span>
                        <kbd className="border border-gray-600 bg-gray-800 px-1 text-white">SPACE</kbd> Jump
                    </span>
                </div>
            </div>

            {/* Touch controls - ergonomic layout for tablet/phone */}
            {/* D-pad on left side */}
            <div className="fixed bottom-8 left-6 z-[9999] flex gap-3 md:bottom-12 md:left-10 md:gap-4">
                <button
                    className={`flex h-20 w-20 touch-none items-center justify-center rounded-2xl border-4 border-yellow-600 shadow-lg select-none active:scale-95 md:h-28 md:w-28 ${
                        leftPressed ? 'bg-yellow-400 text-gray-900' : 'bg-yellow-500/90 text-gray-900'
                    }`}
                    onPointerDown={handleLeftDown}
                    onPointerUp={handleLeftUp}
                    onPointerCancel={handleLeftUp}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <span className="flex h-full w-full items-center justify-center text-4xl leading-none md:text-5xl">
                        ◀
                    </span>
                </button>
                <button
                    className={`flex h-20 w-20 touch-none items-center justify-center rounded-2xl border-4 border-yellow-600 shadow-lg select-none active:scale-95 md:h-28 md:w-28 ${
                        rightPressed ? 'bg-yellow-400 text-gray-900' : 'bg-yellow-500/90 text-gray-900'
                    }`}
                    onPointerDown={handleRightDown}
                    onPointerUp={handleRightUp}
                    onPointerCancel={handleRightUp}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <span className="flex h-full w-full items-center justify-center text-4xl leading-none md:text-5xl">
                        ▶
                    </span>
                </button>
            </div>
            
            {/* Jump button on right side - bigger for easy thumb access */}
            <div className="fixed bottom-8 right-6 z-[9999] md:bottom-12 md:right-10">
                <button
                    className={`flex h-24 w-24 touch-none items-center justify-center rounded-full border-4 border-green-600 shadow-lg select-none active:scale-95 md:h-32 md:w-32 ${
                        jumpPressed ? 'bg-green-400 text-gray-900' : 'bg-green-500/90 text-gray-900'
                    }`}
                    onPointerDown={handleJumpDown}
                    onPointerUp={handleJumpUp}
                    onPointerCancel={handleJumpUp}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <span className="flex h-full w-full items-center justify-center text-5xl leading-none md:text-6xl" style={{ marginTop: '-2px' }}>
                        ▲
                    </span>
                </button>
            </div>
        </>
    );
}
