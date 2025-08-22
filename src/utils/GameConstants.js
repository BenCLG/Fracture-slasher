// Game Constants and Configuration

export const GAME_CONFIG = {
    WIDTH: 1280,
    HEIGHT: 720,
    BACKGROUND_COLOR: '#0a0a0a',
    FPS: 60
};

export const COLORS = {
    PRIMARY: '#00ffff',
    SECONDARY: '#004444',
    BACKGROUND: '#0a0a0a',
    UI_BACKGROUND: '#1a1a1a',
    UI_BORDER: '#2a2a2a',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#888888',
    PLAYER: '#00ffff',
    ENEMY: '#ff4444',
    HEALTH: '#ff0000',
    EXPERIENCE: '#00ff00',
    CRYSTALS: '#00ffff',
    GEARS: '#ff8800',
    SCRAP: '#888888'
};

export const PLAYER_CONFIG = {
    STARTING_HEALTH: 100,
    STARTING_SPEED: 200,
    SHOOT_COOLDOWN: 300,
    BULLET_SPEED: 400,
    BULLET_LIFESPAN: 2000
};

export const ENEMY_CONFIG = {
    BASIC: {
        HEALTH: 50,
        SPEED: 100,
        SHOOT_COOLDOWN: 1000,
        BULLET_SPEED: 200,
        BULLET_LIFESPAN: 3000,
        DAMAGE: 10,
        EXPERIENCE_REWARD: 10
    },
    ELITE: {
        HEALTH: 100,
        SPEED: 120,
        SHOOT_COOLDOWN: 800,
        BULLET_SPEED: 250,
        BULLET_LIFESPAN: 3000,
        DAMAGE: 15,
        EXPERIENCE_REWARD: 25
    }
};

export const FRACTURES = {
    TAR_BREACH: {
        name: 'The Tar Breach',
        difficulty: 1,
        unlockRequirement: 0,
        enemyTypes: ['basic'],
        background: 'industrial'
    },
    CRYSTAL_FOREST: {
        name: 'Crystal Forest',
        difficulty: 3,
        unlockRequirement: 2,
        enemyTypes: ['basic', 'elite'],
        background: 'crystal'
    },
    FLOATING_CITY: {
        name: 'Lost Floating City',
        difficulty: 5,
        unlockRequirement: 5,
        enemyTypes: ['basic', 'elite', 'boss'],
        background: 'floating'
    }
};

export const EXPERIENCE_LEVELS = [
    100, 200, 350, 550, 800, 1100, 1450, 1850, 2300, 2800,
    3350, 3950, 4600, 5300, 6050, 6850, 7700, 8600, 9550, 10550
];

export const STATS = {
    STRENGTH: {
        name: 'Strength',
        color: '#ff4444',
        description: 'Increases melee damage and health'
    },
    DEXTERITY: {
        name: 'Dexterity',
        color: '#44ff44',
        description: 'Increases ranged damage and critical chance'
    },
    INTELLIGENCE: {
        name: 'Intelligence',
        color: '#4444ff',
        description: 'Increases magical damage and energy'
    },
    VITALITY: {
        name: 'Vitality',
        color: '#ffff44',
        description: 'Increases health and resistances'
    }
};

export const ITEM_RARITY = {
    COMMON: {
        name: 'Common',
        color: '#ffffff',
        dropChance: 0.6
    },
    UNCOMMON: {
        name: 'Uncommon',
        color: '#44ff44',
        dropChance: 0.25
    },
    RARE: {
        name: 'Rare',
        color: '#4444ff',
        dropChance: 0.1
    },
    EPIC: {
        name: 'Epic',
        color: '#ff44ff',
        dropChance: 0.04
    },
    LEGENDARY: {
        name: 'Legendary',
        color: '#ff8800',
        dropChance: 0.01
    }
};

export const UI_CONFIG = {
    HEALTH_BAR_WIDTH: 200,
    HEALTH_BAR_HEIGHT: 20,
    BUTTON_PADDING: { x: 20, y: 10 },
    PANEL_PADDING: 20
};
