export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create a simple loading screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x0a0a0a).setOrigin(0, 0);
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading Fracture Slasher...', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Progress text
        this.progressText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        this.progressText.setOrigin(0.5, 0.5);

        // Progress bar background
        this.progressBarBg = this.add.rectangle(width / 2, height / 2 + 50, 300, 20, 0x333333);
        
        // Progress bar
        this.progressBar = this.add.rectangle(width / 2 - 150, height / 2 + 50, 0, 20, 0x00ffff);
        this.progressBar.setOrigin(0, 0.5);

        // Update progress
        this.load.on('progress', (value) => {
            this.progressBar.width = 300 * value;
            this.progressText.setText(parseInt(value * 100) + '%');
        });

        // Load assets
        this.loadPlaceholderAssets();
    }

    loadPlaceholderAssets() {
        // Create placeholder graphics for development
        // Using larger base64 images to ensure proper loading
        this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('tile', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('particle', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        
        // Load UI elements
        this.load.image('button', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        
        // Add some additional assets to make loading more realistic
        this.load.image('ui_panel', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('ui_button', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        this.load.image('ui_icon', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }

    create() {
        console.log('BootScene: Assets loaded');
        
        // Show 100% completion briefly
        this.progressBar.width = 300;
        this.progressText.setText('100%');
        
        // Transition to menu after a short delay
        this.time.delayedCall(500, () => {
            console.log('BootScene: Starting MenuScene transition...');
            this.scene.start('MenuScene');
        });
    }
}
