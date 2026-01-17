import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Room {
    id: number;
    code: string;
    name: string;
    status: string;
    host: {
        id: number;
        name: string;
    };
}

interface Props {
    rooms: Room[];
}

export default function Lobby({ rooms }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);

    const createForm = useForm({
        name: '',
    });

    const joinForm = useForm({
        code: '',
    });

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        createForm.post('/lobby');
    };

    const handleJoin = (e: FormEvent) => {
        e.preventDefault();
        joinForm.post('/lobby/join');
    };

    return (
        <>
            <Head title="Game Lobby">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=silkscreen:400,700"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="flex min-h-screen flex-col items-center p-6"
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
                                left: `${(i * 17) % 100}%`,
                                top: `${(i * 13) % 60}%`,
                                opacity: 0.3 + ((i * 7) % 70) / 100,
                            }}
                        />
                    ))}
                </div>

                {/* Header */}
                <div className="relative z-10 mb-8 flex w-full max-w-2xl items-center justify-between">
                    <Link
                        href="/"
                        className="border-2 border-yellow-400 bg-transparent px-4 py-2 text-sm text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-gray-900"
                    >
                        ← HOME
                    </Link>
                    <h1
                        className="text-3xl tracking-wider text-yellow-400"
                        style={{
                            textShadow: '2px 2px 0 #7c3aed, 4px 4px 0 #1e1b4b',
                        }}
                    >
                        GAME LOBBY
                    </h1>
                    <div className="w-20" /> {/* Spacer */}
                </div>

                {/* Main content */}
                <div className="relative z-10 w-full max-w-2xl space-y-6">
                    {/* Action buttons */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                setShowCreate(true);
                                setShowJoin(false);
                            }}
                            className="border-4 border-green-400 bg-green-400/20 px-8 py-4 text-lg text-green-400 transition-all hover:bg-green-400 hover:text-gray-900"
                            style={{ boxShadow: '4px 4px 0 #166534' }}
                        >
                            CREATE ROOM
                        </button>
                        <button
                            onClick={() => {
                                setShowJoin(true);
                                setShowCreate(false);
                            }}
                            className="border-4 border-blue-400 bg-blue-400/20 px-8 py-4 text-lg text-blue-400 transition-all hover:bg-blue-400 hover:text-gray-900"
                            style={{ boxShadow: '4px 4px 0 #1e40af' }}
                        >
                            JOIN ROOM
                        </button>
                    </div>

                    {/* Create room form */}
                    {showCreate && (
                        <div
                            className="border-4 border-green-400 bg-gray-900/90 p-6"
                            style={{ boxShadow: '6px 6px 0 #166534' }}
                        >
                            <h2 className="mb-4 text-xl text-green-400">CREATE NEW ROOM</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-gray-300">
                                        Room Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="My Awesome Room"
                                        className="mt-1 border-2 border-gray-600 bg-gray-800 text-white"
                                        style={{ fontFamily: 'inherit' }}
                                    />
                                    {createForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-400">{createForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="border-2 border-green-400 bg-green-400 text-gray-900 hover:bg-green-300"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        {createForm.processing ? 'CREATING...' : 'CREATE'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreate(false)}
                                        className="border-2 border-gray-600 text-gray-400 hover:bg-gray-800"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        CANCEL
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Join room form */}
                    {showJoin && (
                        <div
                            className="border-4 border-blue-400 bg-gray-900/90 p-6"
                            style={{ boxShadow: '6px 6px 0 #1e40af' }}
                        >
                            <h2 className="mb-4 text-xl text-blue-400">JOIN ROOM</h2>
                            <form onSubmit={handleJoin} className="space-y-4">
                                <div>
                                    <Label htmlFor="code" className="text-gray-300">
                                        Room Code
                                    </Label>
                                    <Input
                                        id="code"
                                        value={joinForm.data.code}
                                        onChange={(e) =>
                                            joinForm.setData('code', e.target.value.toUpperCase())
                                        }
                                        placeholder="ABC123"
                                        maxLength={6}
                                        className="mt-1 border-2 border-gray-600 bg-gray-800 text-center text-2xl tracking-widest text-white uppercase"
                                        style={{ fontFamily: 'inherit' }}
                                    />
                                    {joinForm.errors.code && (
                                        <p className="mt-1 text-sm text-red-400">{joinForm.errors.code}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={joinForm.processing}
                                        className="border-2 border-blue-400 bg-blue-400 text-gray-900 hover:bg-blue-300"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        {joinForm.processing ? 'JOINING...' : 'JOIN'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowJoin(false)}
                                        className="border-2 border-gray-600 text-gray-400 hover:bg-gray-800"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        CANCEL
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Available rooms */}
                    <div
                        className="border-4 border-yellow-400 bg-gray-900/90 p-6"
                        style={{ boxShadow: '6px 6px 0 #7c3aed' }}
                    >
                        <h2 className="mb-4 text-xl text-yellow-400">OPEN ROOMS</h2>
                        {rooms.length === 0 ? (
                            <p className="text-center text-gray-500">No rooms available. Create one!</p>
                        ) : (
                            <div className="space-y-2">
                                {rooms.map((room) => (
                                    <Link
                                        key={room.id}
                                        href={`/game/${room.code}`}
                                        className="flex items-center justify-between border-2 border-gray-700 bg-gray-800 p-3 transition-colors hover:border-yellow-400"
                                    >
                                        <div>
                                            <span className="text-white">{room.name}</span>
                                            <span className="ml-2 text-sm text-gray-500">
                                                by {room.host.name}
                                            </span>
                                        </div>
                                        <span className="font-mono text-yellow-400">{room.code}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
