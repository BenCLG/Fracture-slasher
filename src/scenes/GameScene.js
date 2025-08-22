export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.cursors = null;
        this.playerData = null;
        this.fracture = null;
        this.gameUI = null;
    }

    init(data) {
        this.playerData = data.playerData || {};
        this.fracture = data.fracture || { name: 'Unknown Fracture', difficulty: 1 };
    }

    create() {
        console.log('GameScene: Creating game...');
        
        this.createBackground();
        console.log('GameScene: Background created');
        
        this.createPlayer();
        console.log('GameScene: Player created');
        
        this.createEnemies();
        console.log('GameScene: Enemies created');
        
        this.createUI();
        console.log('GameScene: UI created');
        
        this.setupInput();
        console.log('GameScene: Input setup');
        
        this.setupCollisions();
        console.log('GameScene: Collisions setup');
        
        console.log('GameScene: Game ready!');
    }

    createBackground() {
        // Create a procedural maze-like background
        const graphics = this.add.graphics();
        
        // Base background
        graphics.fillStyle(0x0a0a0a);
        graphics.fillRect(0, 0, 1280, 720);
        
        // Maze walls
        graphics.lineStyle(3, 0x2a2a2a);
        
        // Create a simple maze pattern
        const wallPositions = [
            // Horizontal walls
            { x: 100, y: 100, width: 400, height: 20 },
            { x: 600, y: 200, width: 300, height: 20 },
            { x: 200, y: 300, width: 500, height: 20 },
            { x: 700, y: 400, width: 200, height: 20 },
            { x: 100, y: 500, width: 400, height: 20 },
            { x: 600, y: 600, width: 300, height: 20 },
            
            // Vertical walls
            { x: 300, y: 100, width: 20, height: 200 },
            { x: 700, y: 200, width: 20, height: 200 },
            { x: 400, y: 300, width: 20, height: 200 },
            { x: 800, y: 400, width: 20, height: 200 }
        ];
        
        wallPositions.forEach(wall => {
            graphics.fillStyle(0x2a2a2a);
            graphics.fillRect(wall.x, wall.y, wall.width, wall.height);
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect(wall.x, wall.y, wall.width, wall.height);
        });
        
        // Add some ambient lighting effects
        this.createAmbientEffects();
    }

    createAmbientEffects() {
        // Add some floating particles for atmosphere
        try {
            const particles = this.add.particles();
            const emitter = particles.createEmitter({
                frame: 'particle',
                x: { min: 0, max: 1280 },
                y: { min: 0, max: 720 },
                speed: { min: 5, max: 15 },
                scale: { start: 0.05, end: 0 },
                alpha: { start: 0.2, end: 0 },
                lifespan: 4000,
                frequency: 1000,
                blendMode: 'ADD'
            });
        } catch (error) {
            console.log('GameScene particles disabled:', error.message);
        }
    }

    createPlayer() {
        // Create player sprite
        this.player = this.add.sprite(640, 360, 'player');
        this.player.setScale(2);
        this.player.setTint(0x00ffff);
        
        // Add physics body
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        
        // Player properties
        this.player.health = 100;
        this.player.maxHealth = 100;
        this.player.speed = 200;
        this.player.lastShot = 0;
        this.player.shootCooldown = 300; // milliseconds
        this.player.invulnerable = false;
    }

    createEnemies() {
        // Create some basic enemies
        const enemyPositions = [
            { x: 200, y: 200 },
            { x: 800, y: 300 },
            { x: 400, y: 500 },
            { x: 900, y: 150 }
        ];
        
        enemyPositions.forEach(pos => {
            const enemy = this.add.sprite(pos.x, pos.y, 'enemy');
            enemy.setScale(1.5);
            enemy.setTint(0xff4444);
            
            // Add physics
            this.physics.add.existing(enemy);
            
            // Enemy properties
            enemy.health = 50;
            enemy.maxHealth = 50;
            enemy.speed = 100;
            enemy.lastShot = 0;
            enemy.shootCooldown = 1000;
            enemy.direction = Phaser.Math.Vector2.ZERO;
            
            this.enemies.push(enemy);
        });
    }

    createUI() {
        // Health bar background
        this.healthBarBg = this.add.graphics();
        this.healthBarBg.fillStyle(0x333333);
        this.healthBarBg.fillRect(20, 20, 200, 20);
        
        // Health bar
        this.healthBar = this.add.graphics();
        
        // Health text - create this BEFORE calling updateHealthBar
        this.healthText = this.add.text(30, 22, `Health: ${this.player.health}/${this.player.maxHealth}`, {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        
        // Now update the health bar
        this.updateHealthBar();
        
        // Fracture info
        this.fractureText = this.add.text(20, 50, `Fracture: ${this.fracture.name}`, {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        
        // Enemy count
        this.enemyCountText = this.add.text(20, 70, `Enemies: ${this.enemies.length}`, {
            fontSize: '12px',
            fill: '#ff4444',
            fontFamily: 'monospace'
        });
        
        // Escape button
        const escapeBtn = this.add.text(1100, 20, 'ESCAPE', {
            fontSize: '14px',
            fill: '#ff0000',
            fontFamily: 'monospace',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        });
        escapeBtn.setInteractive();
        escapeBtn.on('pointerdown', () => {
            this.escapeToHub();
        });
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // WASD keys
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Mouse input for shooting
        this.input.on('pointerdown', (pointer) => {
            this.shoot(pointer.x, pointer.y);
        });
    }

    setupCollisions() {
        // Player bullets vs enemies
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        
        // Enemy bullets vs player
        this.physics.add.overlap(this.enemyBullets, this.player, this.hitPlayer, null, this);
        
        // Player vs enemies
        this.physics.add.overlap(this.player, this.enemies, this.playerEnemyCollision, null, this);
    }

    update() {
        this.handlePlayerMovement();
        this.handleEnemyAI();
        this.updateUI();
    }

    handlePlayerMovement() {
        const speed = this.player.speed;
        let velocityX = 0;
        let velocityY = 0;
        
        // Handle input
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -speed;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = speed;
        }
        
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = speed;
        }
        
        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }
        
        this.player.body.setVelocity(velocityX, velocityY);
    }

    handleEnemyAI() {
        this.enemies.forEach(enemy => {
            if (enemy.health <= 0 || !enemy.active || !enemy.body) return;
            
            // Simple AI: move towards player
            const direction = new Phaser.Math.Vector2(
                this.player.x - enemy.x,
                this.player.y - enemy.y
            );
            
            if (direction.length() > 0) {
                direction.normalize();
                enemy.body.setVelocity(
                    direction.x * enemy.speed,
                    direction.y * enemy.speed
                );
            }
            
            // Shoot at player
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            if (distance < 300 && this.time.now > enemy.lastShot + enemy.shootCooldown) {
                this.enemyShoot(enemy);
                enemy.lastShot = this.time.now;
            }
        });
    }

    shoot(targetX, targetY) {
        if (this.time.now < this.player.lastShot + this.player.shootCooldown) return;
        
        const bullet = this.add.sprite(this.player.x, this.player.y, 'player');
        bullet.setScale(0.5);
        bullet.setTint(0x00ffff);
        
        this.physics.add.existing(bullet);
        
        const direction = new Phaser.Math.Vector2(targetX - this.player.x, targetY - this.player.y);
        direction.normalize();
        
        bullet.body.setVelocity(direction.x * 400, direction.y * 400);
        
        this.bullets.push(bullet);
        this.player.lastShot = this.time.now;
        
        // Remove bullet after 2 seconds
        this.time.delayedCall(2000, () => {
            if (bullet.active) {
                bullet.destroy();
                this.bullets = this.bullets.filter(b => b !== bullet);
            }
        });
    }

    enemyShoot(enemy) {
        const bullet = this.add.sprite(enemy.x, enemy.y, 'enemy');
        bullet.setScale(0.3);
        bullet.setTint(0xff4444);
        
        this.physics.add.existing(bullet);
        
        const direction = new Phaser.Math.Vector2(this.player.x - enemy.x, this.player.y - enemy.y);
        direction.normalize();
        
        bullet.body.setVelocity(direction.x * 200, direction.y * 200);
        
        this.enemyBullets.push(bullet);
        
        // Remove bullet after 3 seconds
        this.time.delayedCall(3000, () => {
            if (bullet.active) {
                bullet.destroy();
                this.enemyBullets = this.enemyBullets.filter(b => b !== bullet);
            }
        });
    }

    hitEnemy(bullet, enemy) {
        // Damage enemy
        enemy.health -= 25;
        
        // Remove bullet
        bullet.destroy();
        this.bullets = this.bullets.filter(b => b !== bullet);
        
        // Check if enemy is dead
        if (enemy.health <= 0) {
            enemy.destroy();
            this.enemies = this.enemies.filter(e => e !== enemy);
            
            // Give player experience
            this.playerData.experience += 10;
            if (this.playerData.experience >= this.playerData.experienceToNext) {
                this.levelUp();
            }
        }
    }

    hitPlayer(bullet, player) {
        // Check if player is invulnerable
        if (player.invulnerable) {
            bullet.destroy();
            this.enemyBullets = this.enemyBullets.filter(b => b !== bullet);
            return;
        }
        
        // Damage player
        player.health -= 5; // Reduced damage
        
        // Remove bullet
        bullet.destroy();
        this.enemyBullets = this.enemyBullets.filter(b => b !== bullet);
        
        this.updateHealthBar();
        
        // Make player invulnerable for a short time
        player.invulnerable = true;
        player.setTint(0xff0000); // Red tint to show damage
        
        this.time.delayedCall(1000, () => {
            if (player.active) {
                player.invulnerable = false;
                player.setTint(0x00ffff); // Back to cyan
            }
        });
        
        // Check if player is dead
        if (player.health <= 0) {
            this.gameOver();
        }
    }

    playerEnemyCollision(player, enemy) {
        // Check if player is invulnerable
        if (player.invulnerable) return;
        
        // Push player back
        const direction = new Phaser.Math.Vector2(player.x - enemy.x, player.y - enemy.y);
        direction.normalize();
        player.body.setVelocity(direction.x * 200, direction.y * 200);
        
        // Damage player
        player.health -= 2; // Reduced damage
        this.updateHealthBar();
        
        // Make player invulnerable for a short time
        player.invulnerable = true;
        player.setTint(0xff0000); // Red tint to show damage
        
        this.time.delayedCall(1000, () => {
            if (player.active) {
                player.invulnerable = false;
                player.setTint(0x00ffff); // Back to cyan
            }
        });
        
        if (player.health <= 0) {
            this.gameOver();
        }
    }

    updateHealthBar() {
        this.healthBar.clear();
        const healthPercent = this.player.health / this.player.maxHealth;
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(20, 20, 200 * healthPercent, 20);
        
        this.healthText.setText(`Health: ${this.player.health}/${this.player.maxHealth}`);
    }

    updateUI() {
        this.enemyCountText.setText(`Enemies: ${this.enemies.length}`);
    }

    levelUp() {
        this.playerData.level++;
        this.playerData.experience -= this.playerData.experienceToNext;
        this.playerData.experienceToNext = Math.floor(this.playerData.experienceToNext * 1.2);
        this.playerData.skillPoints++;
        
        // Increase player stats
        this.player.maxHealth += 20;
        this.player.health = this.player.maxHealth;
        this.updateHealthBar();
        
        console.log(`Level up! You are now level ${this.playerData.level}`);
    }

    gameOver() {
        console.log('Game Over!');
        // Return to hub with reduced resources
        this.playerData.resources.crystals = Math.floor(this.playerData.resources.crystals * 0.5);
        this.playerData.resources.gears = Math.floor(this.playerData.resources.gears * 0.5);
        this.playerData.resources.scrap = Math.floor(this.playerData.resources.scrap * 0.5);
        
        this.scene.start('HubScene', { playerData: this.playerData });
    }

    escapeToHub() {
        // Give some rewards for escaping
        this.playerData.resources.crystals += 10;
        this.playerData.resources.gears += 5;
        this.playerData.fractureIndex += 1;
        
        this.scene.start('HubScene', { playerData: this.playerData });
    }
}
