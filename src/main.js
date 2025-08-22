import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { HubScene } from './scenes/HubScene.js';
import { LabyrinthScene } from './scenes/LabyrinthScene.js';
import { CombatScene } from './scenes/CombatScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#0a0a0a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, HubScene, LabyrinthScene, CombatScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,
    roundPixels: false
};

// Initialize the game
const game = new Phaser.Game(config);

// Make game instance globally available for debugging
window.game = game;
