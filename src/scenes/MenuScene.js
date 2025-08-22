export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        console.log('MenuScene: Creating menu...');
        
        // Background with steampunk-alien aesthetic
        this.createBackground();
        
        // Title
        const title = this.add.text(640, 150, 'FRACTURE SLASHER', {
            fontSize: '48px',
            fill: '#00ffff',
            fontFamily: 'monospace',
            stroke: '#004444',
            strokeThickness: 2
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(640, 200, 'Steampunk-Alien Roguelike', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'monospace'
        });
        subtitle.setOrigin(0.5);

        // Menu buttons
        this.createMenuButtons();

        // Version info
        const version = this.add.text(640, 680, 'v1.0.0 - Development Build', {
            fontSize: '12px',
            fill: '#444444',
            fontFamily: 'monospace'
        });
        version.setOrigin(0.5);
    }

    createBackground() {
        // Create a dark background with subtle grid pattern
        const graphics = this.add.graphics();
        
        // Main background
        graphics.fillStyle(0x0a0a0a);
        graphics.fillRect(0, 0, 1280, 720);
        
        // Grid pattern
        graphics.lineStyle(1, 0x1a1a1a);
        for (let x = 0; x < 1280; x += 40) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, 720);
        }
        for (let y = 0; y < 720; y += 40) {
            graphics.moveTo(0, y);
            graphics.lineTo(1280, y);
        }
        graphics.stroke();
        
        // Add some ambient particles
        this.createAmbientParticles();
    }

    createAmbientParticles() {
        // Create floating particles for atmosphere
        try {
            const particles = this.add.particles();
            const emitter = particles.createEmitter({
                frame: 'particle',
                x: { min: 0, max: 1280 },
                y: { min: 0, max: 720 },
                speed: { min: 10, max: 30 },
                scale: { start: 0.1, end: 0 },
                alpha: { start: 0.3, end: 0 },
                lifespan: 3000,
                frequency: 500,
                blendMode: 'ADD'
            });
        } catch (error) {
            console.log('Particles disabled:', error.message);
        }
    }

    createMenuButtons() {
        const buttonStyle = {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'monospace',
            backgroundColor: '#1a1a1a',
            padding: { x: 20, y: 10 }
        };

        const buttonHoverStyle = {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace',
            backgroundColor: '#2a2a2a',
            padding: { x: 20, y: 10 }
        };

        // New Game button
        const newGameBtn = this.add.text(640, 300, 'NEW GAME', buttonStyle);
        newGameBtn.setOrigin(0.5);
        newGameBtn.setInteractive();
        
        newGameBtn.on('pointerover', () => {
            newGameBtn.setStyle(buttonHoverStyle);
        });
        
        newGameBtn.on('pointerout', () => {
            newGameBtn.setStyle(buttonStyle);
        });
        
        newGameBtn.on('pointerdown', () => {
            this.scene.start('HubScene');
        });

        // Continue button (disabled for now)
        const continueBtn = this.add.text(640, 360, 'CONTINUE', {
            fontSize: '24px',
            fill: '#444444',
            fontFamily: 'monospace',
            backgroundColor: '#1a1a1a',
            padding: { x: 20, y: 10 }
        });
        continueBtn.setOrigin(0.5);

        // Settings button
        const settingsBtn = this.add.text(640, 420, 'SETTINGS', buttonStyle);
        settingsBtn.setOrigin(0.5);
        settingsBtn.setInteractive();
        
        settingsBtn.on('pointerover', () => {
            settingsBtn.setStyle(buttonHoverStyle);
        });
        
        settingsBtn.on('pointerout', () => {
            settingsBtn.setStyle(buttonStyle);
        });
        
        settingsBtn.on('pointerdown', () => {
            console.log('Settings clicked');
            // TODO: Implement settings menu
        });

        // Credits button
        const creditsBtn = this.add.text(640, 480, 'CREDITS', buttonStyle);
        creditsBtn.setOrigin(0.5);
        creditsBtn.setInteractive();
        
        creditsBtn.on('pointerover', () => {
            creditsBtn.setStyle(buttonHoverStyle);
        });
        
        creditsBtn.on('pointerout', () => {
            creditsBtn.setStyle(buttonStyle);
        });
        
        creditsBtn.on('pointerdown', () => {
            console.log('Credits clicked');
            // TODO: Implement credits screen
        });
    }
}
