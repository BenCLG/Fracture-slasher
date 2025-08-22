export class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
        this.player = null;
        this.enemy = null;
        this.playerData = null;
        this.fracture = null;
        this.preservedState = null;
        this.playerHealthBar = null;
        this.enemyHealthBar = null;
        this.playerHealthText = null;
        this.enemyHealthText = null;
        this.combatLog = null;
        this.combatEnded = false;
    }

    init(data) {
        this.playerData = data.playerData || {};
        this.fracture = data.fracture || { name: 'Unknown Fracture', difficulty: 1 };
        this.enemy = data.enemy || { health: 50, maxHealth: 50 };
        this.preservedState = data.preservedState;
    }

    create() {
        console.log('CombatScene: Starting combat...');
        
        // Reset combat state for new combat
        this.combatEnded = false;
        
        this.createBackground();
        this.createCombatants();
        this.createUI();
        this.setupInput();
        
        console.log('CombatScene: Combat ready!');
    }

    createBackground() {
        // Dark combat background
        this.add.rectangle(0, 0, 1280, 720, 0x0a0a0a).setOrigin(0, 0);
        
        // Combat arena border
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x00ffff);
        graphics.strokeRect(100, 100, 1080, 520);
    }

    createCombatants() {
        // Create player (circle)
        this.player = {
            sprite: this.add.circle(400, 360, 50, 0x00ffff),
            health: 100,
            maxHealth: 100,
            attackSpeed: 500, // milliseconds between attacks
            lastAttack: 0,
            damage: 15
        };
        
        // Create enemy (square)
        this.enemy = {
            sprite: this.add.rectangle(800, 360, 80, 80, 0xff4444),
            health: this.enemy.health,
            maxHealth: this.enemy.maxHealth,
            attackSpeed: 800, // milliseconds between attacks
            lastAttack: 0,
            damage: 10
        };
    }

    createUI() {
        // Player health bar
        this.add.text(200, 200, 'PLAYER', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        
        this.playerHealthBar = this.add.graphics();
        this.playerHealthText = this.add.text(200, 230, `Health: ${this.player.health}/${this.player.maxHealth}`, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        
        // Enemy health bar
        this.add.text(800, 200, 'ENEMY', {
            fontSize: '18px',
            fill: '#ff4444',
            fontFamily: 'monospace'
        });
        
        this.enemyHealthBar = this.add.graphics();
        this.enemyHealthText = this.add.text(800, 230, `Health: ${this.enemy.health}/${this.enemy.maxHealth}`, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        
        // Combat log
        this.combatLog = this.add.text(200, 500, 'Combat started! Click to attack!', {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'monospace',
            wordWrap: { width: 800 }
        });
        
        // Instructions
        this.add.text(200, 600, 'Left Click: Attack Enemy | ESC: Escape Combat', {
            fontSize: '14px',
            fill: '#888888',
            fontFamily: 'monospace'
        });
        
        this.updateHealthBars();
    }

    setupInput() {
        // Mouse input for attacking
        this.input.on('pointerdown', (pointer) => {
            this.handlePlayerAttack();
        });
        
        // Escape key
        this.input.keyboard.on('keydown-ESC', () => {
            this.escapeCombat();
        });
    }

    update() {
        if (!this.combatEnded) {
            this.handleEnemyAI();
        }
    }

    handlePlayerAttack() {
        if (this.combatEnded) return;
        
        const now = this.time.now;
        
        if (now - this.player.lastAttack >= this.player.attackSpeed) {
            this.playerAttack();
            this.player.lastAttack = now;
        }
    }

    playerAttack() {
        // Damage enemy
        this.enemy.health -= this.player.damage;
        
        // Ensure health doesn't go below 0
        if (this.enemy.health < 0) {
            this.enemy.health = 0;
        }
        
        // Visual feedback - flash white
        const originalColor = this.enemy.sprite.fillColor;
        this.enemy.sprite.setFillStyle(0xffffff);
        this.time.delayedCall(100, () => {
            this.enemy.sprite.setFillStyle(originalColor);
        });
        
        // Update UI
        this.updateHealthBars();
        this.addCombatLog(`Player deals ${this.player.damage} damage!`);
        
        // Check if enemy is dead
        if (this.enemy.health <= 0) {
            this.enemyDefeated();
        }
    }

    handleEnemyAI() {
        const now = this.time.now;
        
        if (now - this.enemy.lastAttack >= this.enemy.attackSpeed) {
            this.enemyAttack();
            this.enemy.lastAttack = now;
        }
    }

    enemyAttack() {
        // Damage player
        this.player.health -= this.enemy.damage;
        
        // Ensure health doesn't go below 0
        if (this.player.health < 0) {
            this.player.health = 0;
        }
        
        // Visual feedback - flash white
        const originalColor = this.player.sprite.fillColor;
        this.player.sprite.setFillStyle(0xffffff);
        this.time.delayedCall(100, () => {
            this.player.sprite.setFillStyle(originalColor);
        });
        
        // Update UI
        this.updateHealthBars();
        this.addCombatLog(`Enemy deals ${this.enemy.damage} damage!`);
        
        // Check if player is dead
        if (this.player.health <= 0) {
            this.playerDefeated();
        }
    }

    updateHealthBars() {
        // Player health bar
        this.playerHealthBar.clear();
        this.playerHealthBar.fillStyle(0x333333);
        this.playerHealthBar.fillRect(200, 250, 200, 20);
        
        const playerHealthPercent = this.player.health / this.player.maxHealth;
        this.playerHealthBar.fillStyle(0x00ff00);
        this.playerHealthBar.fillRect(200, 250, 200 * playerHealthPercent, 20);
        
        this.playerHealthText.setText(`Health: ${this.player.health}/${this.player.maxHealth}`);
        
        // Enemy health bar
        this.enemyHealthBar.clear();
        this.enemyHealthBar.fillStyle(0x333333);
        this.enemyHealthBar.fillRect(800, 250, 200, 20);
        
        const enemyHealthPercent = this.enemy.health / this.enemy.maxHealth;
        this.enemyHealthBar.fillStyle(0xff0000);
        this.enemyHealthBar.fillRect(800, 250, 200 * enemyHealthPercent, 20);
        
        this.enemyHealthText.setText(`Health: ${this.enemy.health}/${this.enemy.maxHealth}`);
    }

    addCombatLog(message) {
        this.combatLog.setText(message);
        
        // Clear log after 2 seconds
        this.time.delayedCall(2000, () => {
            this.combatLog.setText('Click to attack!');
        });
    }

    enemyDefeated() {
        this.combatEnded = true;
        this.addCombatLog('Enemy defeated! Returning to labyrinth...');
        
        // Give rewards
        this.playerData.experience += 20;
        this.playerData.resources.crystals += 3;
        this.playerData.resources.gears += 1;
        
        // Check for level up
        if (this.playerData.experience >= this.playerData.experienceToNext) {
            this.levelUp();
        }
        
        // Return to labyrinth after delay
        this.time.delayedCall(2000, () => {
            this.returnToLabyrinth();
        });
    }

    playerDefeated() {
        this.combatEnded = true;
        this.addCombatLog('You were defeated! Returning to hub...');
        
        // Reduce resources on death
        this.playerData.resources.crystals = Math.floor(this.playerData.resources.crystals * 0.7);
        this.playerData.resources.gears = Math.floor(this.playerData.resources.gears * 0.7);
        
        // Return to hub after delay
        this.time.delayedCall(2000, () => {
            this.scene.start('HubScene', { playerData: this.playerData });
        });
    }

    levelUp() {
        this.playerData.level++;
        this.playerData.experience -= this.playerData.experienceToNext;
        this.playerData.experienceToNext = Math.floor(this.playerData.experienceToNext * 1.2);
        this.playerData.skillPoints++;
        
        this.addCombatLog(`Level up! You are now level ${this.playerData.level}!`);
    }

    escapeCombat() {
        this.addCombatLog('Escaping combat...');
        
        // Return to labyrinth after delay
        this.time.delayedCall(1000, () => {
            this.returnToLabyrinth();
        });
    }

    returnToLabyrinth() {
        // Pass preserved state back to restore the exact labyrinth state
        this.scene.start('LabyrinthScene', {
            playerData: this.playerData,
            fracture: this.fracture,
            preservedState: this.preservedState
        });
    }

    shutdown() {
        // Clear preserved state when scene is shut down
        this.preservedState = null;
    }
}
