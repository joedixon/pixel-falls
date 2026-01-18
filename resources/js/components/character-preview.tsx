import { useEffect, useRef } from 'react';

import { COSTUMES } from '@/game/costumes';

interface CharacterPreviewProps {
    costumeId: number;
    size?: number;
    className?: string;
}

export default function CharacterPreview({ costumeId, size = 64, className = '' }: CharacterPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const costume = COSTUMES[costumeId] || COSTUMES[0];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, 16, 16);

        const pixel = (x: number, y: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        };

        switch (costume.type) {
            case 'bean':
                drawBean(pixel, costume);
                break;
            case 'frog':
                drawFrog(pixel, costume);
                break;
            case 'bird':
                drawBird(pixel, costume);
                break;
            case 'bunny':
                drawBunny(pixel, costume);
                break;
            case 'mario':
            case 'luigi':
                drawMarioBro(pixel, costume);
                break;
            case 'yoshi':
                drawYoshi(pixel, costume);
                break;
            case 'dk':
                drawDK(pixel, costume);
                break;
            case 'galinda':
                drawGalinda(pixel, costume);
                break;
            case 'elphaba':
                drawElphaba(pixel, costume);
                break;
            default:
                drawAnimalWithEars(pixel, costume);
        }
    }, [costume]);

    return (
        <canvas
            ref={canvasRef}
            width={16}
            height={16}
            className={className}
            style={{
                width: size,
                height: size,
                imageRendering: 'pixelated',
            }}
        />
    );
}

type PixelFn = (x: number, y: number, color: string) => void;
type CostumeType = typeof COSTUMES[number];

function drawBean(pixel: PixelFn, c: CostumeType) {
    // Smooth round top - NO EARS, solid color
    pixel(6, 1, c.body);
    pixel(7, 1, c.body);
    pixel(8, 1, c.body);
    pixel(9, 1, c.body);
    
    pixel(5, 2, c.body);
    pixel(6, 2, c.body);
    pixel(7, 2, c.body);
    pixel(8, 2, c.body);
    pixel(9, 2, c.body);
    pixel(10, 2, c.body);
    
    // Big cute eyes (white with dark pupil)
    pixel(5, 3, c.body);
    pixel(6, 3, '#fafafa');
    pixel(7, 3, c.eyes);
    pixel(8, 3, '#fafafa');
    pixel(9, 3, c.eyes);
    pixel(10, 3, c.body);
    
    pixel(5, 4, c.body);
    pixel(6, 4, c.body);
    pixel(7, 4, c.body);
    pixel(8, 4, c.body);
    pixel(9, 4, c.body);
    pixel(10, 4, c.body);
    
    // Wide body - SOLID COLOR (no belly)
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
    
    pixel(5, 8, c.body);
    pixel(6, 8, c.body);
    pixel(7, 8, c.body);
    pixel(8, 8, c.body);
    pixel(9, 8, c.body);
    pixel(10, 8, c.body);
    
    // Stubby arms
    pixel(3, 5, c.body);
    pixel(3, 6, c.body);
    pixel(12, 5, c.body);
    pixel(12, 6, c.body);
    
    // Stubby legs (slightly darker)
    pixel(5, 9, c.bodyDark);
    pixel(6, 9, c.bodyDark);
    pixel(9, 9, c.bodyDark);
    pixel(10, 9, c.bodyDark);
    pixel(5, 10, c.bodyDark);
    pixel(6, 10, c.bodyDark);
    pixel(9, 10, c.bodyDark);
    pixel(10, 10, c.bodyDark);
}

function drawFrog(pixel: PixelFn, c: CostumeType) {
    // Big bulging eyes on TOP (frog style)
    pixel(5, 1, c.eyes);
    pixel(6, 1, c.eyes);
    pixel(9, 1, c.eyes);
    pixel(10, 1, c.eyes);
    pixel(5, 2, c.body);
    pixel(6, 2, '#1f2937'); // Pupil
    pixel(9, 2, '#1f2937');
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

    // Arms
    pixel(4, 5, c.body);
    pixel(4, 6, c.body);
    pixel(11, 5, c.body);
    pixel(11, 6, c.body);

    // Legs (froggy)
    pixel(4, 8, c.bodyDark);
    pixel(5, 8, c.bodyDark);
    pixel(6, 8, c.bodyDark);
    pixel(9, 8, c.bodyDark);
    pixel(10, 8, c.bodyDark);
    pixel(11, 8, c.bodyDark);
}

function drawBird(pixel: PixelFn, c: CostumeType) {
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

    // Flippers/wings
    pixel(4, 6, c.body);
    pixel(4, 7, c.body);
    pixel(11, 6, c.body);
    pixel(11, 7, c.body);

    // Feet
    pixel(6, 9, c.nose);
    pixel(7, 9, c.nose);
    pixel(8, 9, c.nose);
    pixel(9, 9, c.nose);
}

function drawBunny(pixel: PixelFn, c: CostumeType) {
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
    
    // Nose and mouth
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

    // Arms
    pixel(4, 7, c.body);
    pixel(4, 8, c.body);
    pixel(11, 7, c.body);
    pixel(11, 8, c.body);

    // Feet
    pixel(5, 9, c.bodyDark);
    pixel(6, 9, c.bodyDark);
    pixel(9, 9, c.bodyDark);
    pixel(10, 9, c.bodyDark);
}

function drawAnimalWithEars(pixel: PixelFn, c: CostumeType) {
    // Regular pointed ears
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
    
    // Eyes
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
    pixel(6, 9, c.body);
    pixel(7, 9, c.belly);
    pixel(8, 9, c.belly);
    pixel(9, 9, c.body);

    // Arms
    pixel(4, 7, c.body);
    pixel(4, 8, c.body);
    pixel(11, 7, c.body);
    pixel(11, 8, c.body);

    // Feet
    pixel(6, 10, c.bodyDark);
    pixel(7, 10, c.bodyDark);
    pixel(8, 10, c.bodyDark);
    pixel(9, 10, c.bodyDark);
    pixel(5, 11, c.bodyDark);
    pixel(6, 11, c.bodyDark);
    pixel(9, 11, c.bodyDark);
    pixel(10, 11, c.bodyDark);
}

// Mario Bros style character
function drawMarioBro(pixel: (x: number, y: number, color: string) => void, c: typeof COSTUMES[number]) {
    const SKIN = c.nose; // Skin tone stored in nose
    const CAP = c.body;
    const OVERALLS = c.belly;
    const BROWN = '#78350f'; // Hair/mustache
    
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
    
    // Nose and mustache
    pixel(5, 4, SKIN);
    pixel(6, 4, SKIN);
    pixel(7, 4, SKIN);
    pixel(8, 4, SKIN);
    pixel(9, 4, SKIN);
    pixel(10, 4, SKIN);
    
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
    
    // Overalls
    pixel(4, 7, SKIN); // Arms
    pixel(5, 7, OVERALLS);
    pixel(6, 7, OVERALLS);
    pixel(7, 7, '#fbbf24'); // Gold buttons
    pixel(8, 7, '#fbbf24');
    pixel(9, 7, OVERALLS);
    pixel(10, 7, OVERALLS);
    pixel(11, 7, SKIN);
    
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
    
    // Shoes
    pixel(4, 10, '#78350f');
    pixel(5, 10, '#78350f');
    pixel(6, 10, '#78350f');
    pixel(9, 10, '#78350f');
    pixel(10, 10, '#78350f');
    pixel(11, 10, '#78350f');
}

// Yoshi dinosaur character
function drawYoshi(pixel: (x: number, y: number, color: string) => void, c: typeof COSTUMES[number]) {
    const GREEN = c.body;
    const WHITE = c.belly;
    const RED = c.earInner; // Shell/saddle color
    const ORANGE = '#f97316';
    
    // Dome eyes sticking up (iconic Yoshi feature)
    pixel(5, 0, '#fafafa');
    pixel(6, 0, '#fafafa');
    pixel(9, 0, '#fafafa');
    pixel(10, 0, '#fafafa');
    
    // Eyes with pupils
    pixel(5, 1, '#fafafa');
    pixel(6, 1, c.eyes);
    pixel(9, 1, c.eyes);
    pixel(10, 1, '#fafafa');
    
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
    
    // Arms
    pixel(3, 5, GREEN);
    pixel(10, 5, GREEN);
    
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
    
    // Orange boots
    pixel(5, 9, ORANGE);
    pixel(6, 9, ORANGE);
    pixel(8, 9, ORANGE);
    pixel(9, 9, ORANGE);
    
    pixel(5, 10, ORANGE);
    pixel(6, 10, ORANGE);
    pixel(8, 10, ORANGE);
    pixel(9, 10, ORANGE);
}

// Donkey Kong gorilla character
function drawDK(pixel: (x: number, y: number, color: string) => void, c: typeof COSTUMES[number]) {
    const FUR = c.body;
    const FACE = c.belly;
    const DARK = c.bodyDark;
    const RED = '#dc2626';
    
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
    pixel(5, 3, '#fafafa');
    pixel(6, 3, c.eyes);
    pixel(7, 3, FACE);
    pixel(8, 3, FACE);
    pixel(9, 3, '#fafafa');
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
    
    // Big arms
    pixel(3, 6, FUR);
    pixel(4, 6, FUR);
    pixel(5, 6, FUR);
    pixel(10, 6, FUR);
    pixel(11, 6, FUR);
    pixel(12, 6, FUR);
    
    pixel(2, 7, FUR);
    pixel(3, 7, FUR);
    pixel(4, 7, FUR);
    pixel(11, 7, FUR);
    pixel(12, 7, FUR);
    pixel(13, 7, FUR);
    
    pixel(2, 8, FACE); // Hands
    pixel(3, 8, FACE);
    pixel(12, 8, FACE);
    pixel(13, 8, FACE);
    
    // Body
    pixel(5, 8, FUR);
    pixel(6, 8, FUR);
    pixel(7, 8, FUR);
    pixel(8, 8, FUR);
    pixel(9, 8, FUR);
    pixel(10, 8, FUR);
    
    // Legs
    pixel(5, 9, FUR);
    pixel(6, 9, FUR);
    pixel(9, 9, FUR);
    pixel(10, 9, FUR);
    
    // Feet
    pixel(4, 10, DARK);
    pixel(5, 10, DARK);
    pixel(6, 10, DARK);
    pixel(9, 10, DARK);
    pixel(10, 10, DARK);
    pixel(11, 10, DARK);
}

// Galinda from Wicked
function drawGalinda(pixel: (x: number, y: number, color: string) => void, c: typeof COSTUMES[number]) {
    const SKIN = '#fcd9bd'; // Warm skin tone
    const DRESS = c.belly; // Pink dress
    const HAIR = c.ears; // Blonde
    const TIARA = c.earInner; // Gold
    const EYES = c.eyes;
    const PINK_DARK = '#ec4899';
    
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
    pixel(5, 4, '#fda4af'); // Blush
    pixel(6, 4, SKIN);
    pixel(7, 4, SKIN);
    pixel(8, 4, SKIN);
    pixel(9, 4, SKIN);
    pixel(10, 4, '#fda4af'); // Blush
    
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
    
    // Arms and dress
    pixel(4, 7, SKIN);
    pixel(5, 7, DRESS);
    pixel(6, 7, DRESS);
    pixel(7, 7, '#fafafa'); // White trim
    pixel(8, 7, '#fafafa');
    pixel(9, 7, DRESS);
    pixel(10, 7, DRESS);
    pixel(11, 7, SKIN);
    
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
    
    // Shoes
    pixel(5, 10, PINK_DARK);
    pixel(6, 10, PINK_DARK);
    pixel(9, 10, PINK_DARK);
    pixel(10, 10, PINK_DARK);
}

// Elphaba from Wicked
function drawElphaba(pixel: (x: number, y: number, color: string) => void, c: typeof COSTUMES[number]) {
    const SKIN = c.body; // Green!
    const DRESS = c.belly; // Black
    const HAIR = c.ears; // Black hair
    const HAT = c.earInner; // Black hat
    const EYES = c.eyes;
    
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
    pixel(6, 4, '#fafafa');
    pixel(7, 4, EYES);
    pixel(8, 4, '#fafafa');
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
    
    // Arms and dress
    pixel(4, 7, SKIN);
    pixel(5, 7, DRESS);
    pixel(6, 7, DRESS);
    pixel(7, 7, DRESS);
    pixel(8, 7, DRESS);
    pixel(9, 7, DRESS);
    pixel(10, 7, DRESS);
    pixel(11, 7, SKIN);
    
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
    
    // Boots
    pixel(5, 10, HAT);
    pixel(6, 10, HAT);
    pixel(9, 10, HAT);
    pixel(10, 10, HAT);
}
