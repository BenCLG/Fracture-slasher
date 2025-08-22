export class HubScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HubScene' });
        this.playerData = {
            level: 1,
            experience: 0,
            experienceToNext: 100,
            skillPoints: 0,
            stats: {
                strength: 10,
                dexterity: 10,
                intelligence: 10,
                vitality: 10
            },
            equipment: {
                weapon: null,
                armor: null,
                helmet: null,
                gloves: null,
                boots: null
            },
            inventory: [],
            resources: {
                crystals: 0,
                gears: 0,
                scrap: 0
            },
            fractureIndex: 0
        };
    }

    create() {
        this.createBackground();
        this.createUI();
        this.createCharacterPanel();
        this.createFracturePortal();
    }

    createBackground() {
        // Hub background - more industrial/steampunk feel
        const graphics = this.add.graphics();
        
        // Main background
        graphics.fillStyle(0x0a0a0a);
        graphics.fillRect(0, 0, 1280, 720);
        
        // Industrial grid pattern
        graphics.lineStyle(2, 0x2a2a2a);
        for (let x = 0; x < 1280; x += 60) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, 720);
        }
        for (let y = 0; y < 720; y += 60) {
            graphics.moveTo(0, y);
            graphics.lineTo(1280, y);
        }
        graphics.stroke();
        
        // Add some machinery elements
        this.createMachineryElements();
    }

    createMachineryElements() {
        // Add some decorative machinery elements
        const graphics = this.add.graphics();
        
        // Central hub structure
        graphics.lineStyle(3, 0x00ffff);
        graphics.strokeCircle(640, 360, 200);
        graphics.strokeCircle(640, 360, 150);
        
        // Connection lines
        graphics.lineStyle(1, 0x004444);
        graphics.beginPath();
        graphics.moveTo(440, 360);
        graphics.lineTo(840, 360);
        graphics.moveTo(640, 160);
        graphics.lineTo(640, 560);
        graphics.stroke();
    }

    createUI() {
        // Header
        const header = this.add.text(640, 30, 'HUB - FRACTURE BASE', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'monospace',
            stroke: '#004444',
            strokeThickness: 1
        });
        header.setOrigin(0.5);

        // Back to menu button
        const backBtn = this.add.text(50, 30, '← MENU', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'monospace',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        });
        backBtn.setInteractive();
        backBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Fracture Index display
        const fractureText = this.add.text(1100, 30, `Fracture Index: ${this.playerData.fractureIndex}`, {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        fractureText.setOrigin(1, 0);
    }

    createCharacterPanel() {
        // Character stats panel (left side)
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x1a1a1a, 0.8);
        panelBg.fillRect(20, 80, 300, 600);
        panelBg.lineStyle(2, 0x00ffff);
        panelBg.strokeRect(20, 80, 300, 600);

        // Character title
        const charTitle = this.add.text(170, 100, 'EXPLORER', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        charTitle.setOrigin(0.5);

        // Level and XP
        const levelText = this.add.text(40, 140, `Level: ${this.playerData.level}`, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });

        const xpText = this.add.text(40, 165, `XP: ${this.playerData.experience}/${this.playerData.experienceToNext}`, {
            fontSize: '14px',
            fill: '#888888',
            fontFamily: 'monospace'
        });

        // XP bar
        const xpBarBg = this.add.graphics();
        xpBarBg.fillStyle(0x333333);
        xpBarBg.fillRect(40, 185, 260, 10);
        
        const xpProgress = this.playerData.experience / this.playerData.experienceToNext;
        const xpBar = this.add.graphics();
        xpBar.fillStyle(0x00ffff);
        xpBar.fillRect(40, 185, 260 * xpProgress, 10);

        // Stats
        const statsY = 220;
        const stats = [
            { name: 'Strength', value: this.playerData.stats.strength, color: '#ff4444' },
            { name: 'Dexterity', value: this.playerData.stats.dexterity, color: '#44ff44' },
            { name: 'Intelligence', value: this.playerData.stats.intelligence, color: '#4444ff' },
            { name: 'Vitality', value: this.playerData.stats.vitality, color: '#ffff44' }
        ];

        stats.forEach((stat, index) => {
            const y = statsY + (index * 30);
            const statText = this.add.text(40, y, `${stat.name}: ${stat.value}`, {
                fontSize: '14px',
                fill: stat.color,
                fontFamily: 'monospace'
            });
        });

        // Skill points
        if (this.playerData.skillPoints > 0) {
            const skillPointsText = this.add.text(40, 360, `Skill Points: ${this.playerData.skillPoints}`, {
                fontSize: '16px',
                fill: '#ffff00',
                fontFamily: 'monospace'
            });
        }

        // Resources
        const resourcesY = 420;
        const resources = [
            { name: 'Crystals', value: this.playerData.resources.crystals, color: '#00ffff' },
            { name: 'Gears', value: this.playerData.resources.gears, color: '#ff8800' },
            { name: 'Scrap', value: this.playerData.resources.scrap, color: '#888888' }
        ];

        resources.forEach((resource, index) => {
            const y = resourcesY + (index * 25);
            const resourceText = this.add.text(40, y, `${resource.name}: ${resource.value}`, {
                fontSize: '14px',
                fill: resource.color,
                fontFamily: 'monospace'
            });
        });
    }

    createFracturePortal() {
        // Fracture portal (right side)
        const portalBg = this.add.graphics();
        portalBg.fillStyle(0x1a1a1a, 0.8);
        portalBg.fillRect(960, 80, 300, 600);
        portalBg.lineStyle(2, 0x00ffff);
        portalBg.strokeRect(960, 80, 300, 600);

        // Portal title
        const portalTitle = this.add.text(1110, 100, 'FRACTURE PORTAL', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        portalTitle.setOrigin(0.5);

        // Available fractures
        const fractures = [
            { name: 'The Tar Breach', difficulty: 1, unlocked: true },
            { name: 'Crystal Forest', difficulty: 3, unlocked: this.playerData.fractureIndex >= 2 },
            { name: 'Lost Floating City', difficulty: 5, unlocked: this.playerData.fractureIndex >= 5 }
        ];

        fractures.forEach((fracture, index) => {
            const y = 150 + (index * 80);
            const color = fracture.unlocked ? '#00ffff' : '#444444';
            
            const fractureText = this.add.text(980, y, fracture.name, {
                fontSize: '16px',
                fill: color,
                fontFamily: 'monospace'
            });

            const difficultyText = this.add.text(980, y + 20, `Difficulty: ${fracture.difficulty}`, {
                fontSize: '12px',
                fill: '#888888',
                fontFamily: 'monospace'
            });

            if (fracture.unlocked) {
                const enterBtn = this.add.text(980, y + 40, 'ENTER FRACTURE', {
                    fontSize: '14px',
                    fill: '#00ff00',
                    fontFamily: 'monospace',
                    backgroundColor: '#1a1a1a',
                    padding: { x: 10, y: 5 }
                });
                enterBtn.setInteractive();
                enterBtn.on('pointerdown', () => {
                    this.enterFracture(fracture);
                });
            } else {
                const lockedText = this.add.text(980, y + 40, 'LOCKED', {
                    fontSize: '14px',
                    fill: '#ff0000',
                    fontFamily: 'monospace'
                });
            }
        });
    }

    enterFracture(fracture) {
        console.log(`HubScene: Entering ${fracture.name}`);
        console.log('HubScene: Player data:', this.playerData);
        
        // Pass player data to the labyrinth scene
        this.scene.start('LabyrinthScene', { 
            playerData: this.playerData,
            fracture: fracture
        });
    }
}
