// Costume definitions shared between React UI and Phaser game
// type: 'ears' = animal with ears, 'frog' = big eyes on top, 'bird' = no ears, 'bean' = jellybean
export const COSTUMES = [
    { 
        id: 0, 
        name: 'Cat', 
        body: '#f59e0b', // Orange
        bodyDark: '#d97706',
        belly: '#fef3c7',
        ears: '#f59e0b',
        earInner: '#fecaca',
        nose: '#ec4899',
        eyes: '#22c55e',
        type: 'ears' as const,
    },
    { 
        id: 1, 
        name: 'Dog', 
        body: '#92400e', // Brown
        bodyDark: '#78350f',
        belly: '#fef3c7',
        ears: '#78350f',
        earInner: '#fecaca',
        nose: '#1f2937',
        eyes: '#1f2937',
        type: 'ears' as const,
    },
    { 
        id: 2, 
        name: 'Bunny', 
        body: '#fafafa', // White
        bodyDark: '#e5e5e5',
        belly: '#fafafa',
        ears: '#fafafa',
        earInner: '#fecaca',
        nose: '#ec4899',
        eyes: '#ef4444',
        type: 'bunny' as const, // Tall ears
    },
    { 
        id: 3, 
        name: 'Fox', 
        body: '#ea580c', // Orange-red
        bodyDark: '#c2410c',
        belly: '#fef3c7',
        ears: '#ea580c',
        earInner: '#1f2937',
        nose: '#1f2937',
        eyes: '#f59e0b',
        type: 'ears' as const,
    },
    { 
        id: 4, 
        name: 'Panda', 
        body: '#fafafa', // White
        bodyDark: '#e5e5e5',
        belly: '#fafafa',
        ears: '#1f2937',
        earInner: '#1f2937',
        nose: '#1f2937',
        eyes: '#1f2937',
        type: 'ears' as const,
    },
    { 
        id: 5, 
        name: 'Frog', 
        body: '#22c55e', // Green
        bodyDark: '#16a34a',
        belly: '#bbf7d0',
        ears: '#22c55e',
        earInner: '#22c55e',
        nose: '#16a34a',
        eyes: '#fef08a',
        type: 'frog' as const, // Big eyes on top, no ears
    },
    { 
        id: 6, 
        name: 'Bear', 
        body: '#78350f', // Dark brown
        bodyDark: '#451a03',
        belly: '#a16207',
        ears: '#78350f',
        earInner: '#a16207',
        nose: '#1f2937',
        eyes: '#1f2937',
        type: 'ears' as const,
    },
    { 
        id: 7, 
        name: 'Penguin', 
        body: '#1f2937', // Black
        bodyDark: '#111827',
        belly: '#fafafa',
        ears: '#1f2937',
        earInner: '#1f2937',
        nose: '#f97316',
        eyes: '#fafafa',
        type: 'bird' as const, // No ears, beak
    },
    // Fall Guys style beans!
    { 
        id: 8, 
        name: 'Pink Bean', 
        body: '#f472b6', // Pink
        bodyDark: '#ec4899',
        belly: '#fafafa',
        ears: '#f472b6',
        earInner: '#f472b6',
        nose: '#f472b6',
        eyes: '#1f2937',
        type: 'bean' as const,
    },
    { 
        id: 9, 
        name: 'Blue Bean', 
        body: '#60a5fa', // Blue
        bodyDark: '#3b82f6',
        belly: '#fafafa',
        ears: '#60a5fa',
        earInner: '#60a5fa',
        nose: '#60a5fa',
        eyes: '#1f2937',
        type: 'bean' as const,
    },
    { 
        id: 10, 
        name: 'Yellow Bean', 
        body: '#fbbf24', // Yellow
        bodyDark: '#f59e0b',
        belly: '#fafafa',
        ears: '#fbbf24',
        earInner: '#fbbf24',
        nose: '#fbbf24',
        eyes: '#1f2937',
        type: 'bean' as const,
    },
    { 
        id: 11, 
        name: 'Green Bean', 
        body: '#4ade80', // Green
        bodyDark: '#22c55e',
        belly: '#fafafa',
        ears: '#4ade80',
        earInner: '#4ade80',
        nose: '#4ade80',
        eyes: '#1f2937',
        type: 'bean' as const,
    },
    // Nintendo-inspired characters
    { 
        id: 12, 
        name: 'Mario', 
        body: '#dc2626', // Red
        bodyDark: '#b91c1c',
        belly: '#3b82f6', // Blue overalls
        ears: '#dc2626',
        earInner: '#dc2626',
        nose: '#fcd34d', // Skin tone
        eyes: '#1f2937',
        type: 'mario' as const,
    },
    { 
        id: 13, 
        name: 'Luigi', 
        body: '#22c55e', // Green
        bodyDark: '#16a34a',
        belly: '#3b82f6', // Blue overalls
        ears: '#22c55e',
        earInner: '#22c55e',
        nose: '#fcd34d', // Skin tone
        eyes: '#1f2937',
        type: 'luigi' as const,
    },
    { 
        id: 14, 
        name: 'Yoshi', 
        body: '#22c55e', // Green
        bodyDark: '#16a34a',
        belly: '#fafafa', // White belly
        ears: '#22c55e',
        earInner: '#ef4444', // Red saddle/shell
        nose: '#22c55e',
        eyes: '#1f2937',
        type: 'yoshi' as const,
    },
    { 
        id: 15, 
        name: 'DK', 
        body: '#92400e', // Brown fur
        bodyDark: '#78350f',
        belly: '#d4a574', // Lighter chest
        ears: '#92400e',
        earInner: '#d4a574',
        nose: '#78350f',
        eyes: '#1f2937',
        type: 'dk' as const,
    },
    // Wicked characters!
    { 
        id: 16, 
        name: 'Galinda', 
        body: '#fce7f3', // Light pink skin
        bodyDark: '#fbcfe8',
        belly: '#f9a8d4', // Pink dress
        ears: '#fde68a', // Blonde hair
        earInner: '#fbbf24', // Gold tiara
        nose: '#fce7f3',
        eyes: '#60a5fa', // Blue eyes
        type: 'galinda' as const,
    },
    { 
        id: 17, 
        name: 'Elphaba', 
        body: '#22c55e', // Green skin
        bodyDark: '#16a34a',
        belly: '#1f2937', // Black dress
        ears: '#1f2937', // Black hair
        earInner: '#1f2937', // Witch hat
        nose: '#22c55e',
        eyes: '#1f2937', // Dark eyes
        type: 'elphaba' as const,
    },
];

export type Costume = typeof COSTUMES[number];
