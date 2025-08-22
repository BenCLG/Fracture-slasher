export class LabyrinthScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LabyrinthScene' });
        this.gridSize = 24; // Smaller grid tiles
        this.mazeWidth = 30; // Smaller maze width
        this.mazeHeight = 20; // Smaller maze height
        this.player = null;
        this.playerGridX = 1;
        this.playerGridY = 1;
        this.playerTargetX = 1;
        this.playerTargetY = 1;
        this.playerMoving = false;
        this.moveSpeed = 1.0; // Movement speed (1.0 = instant)
        this.maze = [];
        this.explored = [];
        this.enemies = [];
        this.playerData = null;
        this.fracture = null;
        this.mazeGraphics = null;
        this.exit = null;
        this.exitGridX = 0; // Will be set randomly
        this.exitGridY = 0; // Will be set randomly
    }

    init(data) {
        this.playerData = data.playerData || {};
        this.fracture = data.fracture || { name: 'Unknown Fracture', difficulty: 1 };
        this.preservedState = data.preservedState || null;
    }

    create() {
        console.log('LabyrinthScene: Creating labyrinth...');
        
        if (this.preservedState) {
            // Restore preserved state
            this.maze = this.preservedState.maze;
            this.explored = this.preservedState.explored;
            this.enemies = this.preservedState.enemies;
            this.playerGridX = this.preservedState.playerGridX;
            this.playerGridY = this.preservedState.playerGridY;
            this.playerTargetX = this.playerGridX;
            this.playerTargetY = this.playerGridY;
            this.playerMoving = false;
            this.preservedState = null; // Clear preserved state
            
            // Recreate enemy sprites for preserved enemies
            this.recreateEnemySprites();
        } else {
            // Generate new maze
            this.generateMaze();
            this.createEnemies();
        }
        
        this.createPlayer();
        this.createExit();
        this.createUI();
        this.setupInput();
        
        console.log('LabyrinthScene: Labyrinth ready!');
    }

    generateMaze() {
        // Choose random starting corner
        const corners = [
            { x: 1, y: 1 },                    // Top-left
            { x: this.mazeWidth - 2, y: 1 },   // Top-right
            { x: 1, y: this.mazeHeight - 2 },  // Bottom-left
            { x: this.mazeWidth - 2, y: this.mazeHeight - 2 } // Bottom-right
        ];
        
        const startCorner = corners[Math.floor(Math.random() * corners.length)];
        this.playerGridX = startCorner.x;
        this.playerGridY = startCorner.y;
        this.playerTargetX = startCorner.x;
        this.playerTargetY = startCorner.y;

        // Initialize maze with walls
        for (let y = 0; y < this.mazeHeight; y++) {
            this.maze[y] = [];
            this.explored[y] = [];
            for (let x = 0; x < this.mazeWidth; x++) {
                this.maze[y][x] = 1; // 1 = wall, 0 = path
                this.explored[y][x] = false;
            }
        }

        // Generate maze from the chosen starting corner
        this.generatePath(this.playerGridX, this.playerGridY);
        
        // Place exit randomly in the maze (but not at start position)
        this.placeRandomExit();
        
        this.drawMaze();
    }

    generatePath(x, y) {
        this.maze[y][x] = 0;
        
        const directions = [
            [0, -2], // North
            [2, 0],  // East
            [0, 2],  // South
            [-2, 0]  // West
        ];
        
        // Shuffle directions
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        
        for (let [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            
            if (newX > 0 && newX < this.mazeWidth - 1 && 
                newY > 0 && newY < this.mazeHeight - 1 && 
                this.maze[newY][newX] === 1) {
                
                this.maze[y + dy/2][x + dx/2] = 0; // Carve path
                this.generatePath(newX, newY);
            }
        }
    }

    placeRandomExit() {
        // Find all valid path positions (excluding start position)
        const validPositions = [];
        
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                if (this.maze[y][x] === 0 && !(x === this.playerGridX && y === this.playerGridY)) {
                    validPositions.push({ x, y });
                }
            }
        }
        
        // Choose random position for exit
        if (validPositions.length > 0) {
            const randomPosition = validPositions[Math.floor(Math.random() * validPositions.length)];
            this.exitGridX = randomPosition.x;
            this.exitGridY = randomPosition.y;
        } else {
            // Fallback: place exit at a corner opposite to start
            this.exitGridX = this.mazeWidth - 2;
            this.exitGridY = this.mazeHeight - 2;
        }
    }

    drawMaze() {
        // Clear previous maze graphics
        if (this.mazeGraphics) {
            this.mazeGraphics.destroy();
        }
        
        // Create new graphics object for maze
        this.mazeGraphics = this.add.graphics();
        
        // Calculate maze position to center it on screen
        const mazeWidth = this.mazeWidth * this.gridSize;
        const mazeHeight = this.mazeHeight * this.gridSize;
        const offsetX = (1280 - mazeWidth) / 2;
        const offsetY = (720 - mazeHeight) / 2;
        
        // Draw maze
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                const screenX = offsetX + (x * this.gridSize);
                const screenY = offsetY + (y * this.gridSize);
                
                if (this.maze[y][x] === 1) {
                    // Wall
                    this.mazeGraphics.fillStyle(0x2a2a2a);
                    this.mazeGraphics.fillRect(screenX, screenY, this.gridSize, this.gridSize);
                } else if (this.explored[y][x]) {
                    // Explored path
                    this.mazeGraphics.fillStyle(0x1a1a1a);
                    this.mazeGraphics.fillRect(screenX, screenY, this.gridSize, this.gridSize);
                }
                // Unexplored areas remain black (fog of war)
            }
        }
    }

    createPlayer() {
        const offsetX = (1280 - (this.mazeWidth * this.gridSize)) / 2;
        const offsetY = (720 - (this.mazeHeight * this.gridSize)) / 2;
        const screenX = offsetX + (this.playerGridX * this.gridSize) + this.gridSize / 2;
        const screenY = offsetY + (this.playerGridY * this.gridSize) + this.gridSize / 2;
        
        // Create smaller blue circle for player
        this.player = this.add.circle(screenX, screenY, this.gridSize / 4, 0x0088ff);
        this.exploreArea(this.playerGridX, this.playerGridY);
    }

    createExit() {
        const offsetX = (1280 - (this.mazeWidth * this.gridSize)) / 2;
        const offsetY = (720 - (this.mazeHeight * this.gridSize)) / 2;
        const screenX = offsetX + (this.exitGridX * this.gridSize) + this.gridSize / 2;
        const screenY = offsetY + (this.exitGridY * this.gridSize) + this.gridSize / 2;
        
        // Create green exit square
        this.exit = this.add.rectangle(screenX, screenY, this.gridSize * 0.8, this.gridSize * 0.8, 0x00ff00);
        
        // Add exit text
        this.add.text(screenX, screenY - 30, 'EXIT', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
    }

    createEnemies() {
        // Place enemies randomly in the maze
        // Difficulty 1 = 7 enemies, Difficulty 3 = 11 enemies, Difficulty 5 = 15 enemies
        const numEnemies = 5 + this.fracture.difficulty * 2;
        const offsetX = (1280 - (this.mazeWidth * this.gridSize)) / 2;
        const offsetY = (720 - (this.mazeHeight * this.gridSize)) / 2;
        
        for (let i = 0; i < numEnemies; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * (this.mazeWidth - 2)) + 1;
                y = Math.floor(Math.random() * (this.mazeHeight - 2)) + 1;
            } while (this.maze[y][x] !== 0 || 
                     (x === this.playerGridX && y === this.playerGridY) || 
                     (x === this.exitGridX && y === this.exitGridY));
            
            const enemy = {
                gridX: x,
                gridY: y,
                sprite: this.add.rectangle(
                    offsetX + (x * this.gridSize) + this.gridSize / 2,
                    offsetY + (y * this.gridSize) + this.gridSize / 2,
                    this.gridSize * 0.8,
                    this.gridSize * 0.8,
                    0xff4444
                ),
                health: 50,
                maxHealth: 50
            };
            
            this.enemies.push(enemy);
        }
    }

    recreateEnemySprites() {
        // Recreate sprites for preserved enemies
        const offsetX = (1280 - (this.mazeWidth * this.gridSize)) / 2;
        const offsetY = (720 - (this.mazeHeight * this.gridSize)) / 2;
        
        this.enemies.forEach(enemy => {
            enemy.sprite = this.add.rectangle(
                offsetX + (enemy.gridX * this.gridSize) + this.gridSize / 2,
                offsetY + (enemy.gridY * this.gridSize) + this.gridSize / 2,
                this.gridSize * 0.8,
                this.gridSize * 0.8,
                0xff4444
            );
        });
    }

    createUI() {
        // Fracture info
        this.add.text(10, 10, `Fracture: ${this.fracture.name}`, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'monospace'
        });
        
        // Enemy count
        this.enemyCountText = this.add.text(10, 30, `Enemies: ${this.enemies.length}`, {
            fontSize: '14px',
            fill: '#ff4444',
            fontFamily: 'monospace'
        });
        
        // Escape button
        const escapeBtn = this.add.text(1100, 10, 'ESCAPE', {
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
        
        // Reveal mode instruction
        this.add.text(10, 50, 'Press R: Toggle enemy reveal mode', {
            fontSize: '12px',
            fill: '#888888',
            fontFamily: 'monospace'
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
        
        // Reveal key (R)
        this.revealKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        // Track key states to prevent continuous movement
        this.keyStates = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // Reveal mode state
        this.revealMode = false;
    }

    update() {
        this.handlePlayerMovement();
        this.updatePlayerMovement();
        this.handleRevealMode();
        this.updateUI();
    }

    handleRevealMode() {
        // Toggle reveal mode when R is pressed
        if (Phaser.Input.Keyboard.JustDown(this.revealKey)) {
            this.revealMode = !this.revealMode;
            this.redrawEnemies();
            
            // Show/hide reveal mode indicator
            if (this.revealMode) {
                this.showRevealIndicator();
            } else {
                this.hideRevealIndicator();
            }
        }
    }

    showRevealIndicator() {
        // Create reveal mode indicator
        this.revealIndicator = this.add.text(640, 50, 'REVEAL MODE: All enemies visible', {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'monospace',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }

    hideRevealIndicator() {
        // Remove reveal mode indicator
        if (this.revealIndicator) {
            this.revealIndicator.destroy();
            this.revealIndicator = null;
        }
    }

    handlePlayerMovement() {
        if (this.playerMoving) return; // Don't accept new input while moving
        
        let newX = this.playerGridX;
        let newY = this.playerGridY;
        let moved = false;
        
        // Check for key press (not hold) - only move once per key press
        if ((this.cursors.left.isDown || this.wasd.left.isDown) && !this.keyStates.left) {
            newX--;
            moved = true;
            this.keyStates.left = true;
        } else if (!this.cursors.left.isDown && !this.wasd.left.isDown) {
            this.keyStates.left = false;
        }
        
        if ((this.cursors.right.isDown || this.wasd.right.isDown) && !this.keyStates.right) {
            newX++;
            moved = true;
            this.keyStates.right = true;
        } else if (!this.cursors.right.isDown && !this.wasd.right.isDown) {
            this.keyStates.right = false;
        }
        
        if ((this.cursors.up.isDown || this.wasd.up.isDown) && !this.keyStates.up) {
            newY--;
            moved = true;
            this.keyStates.up = true;
        } else if (!this.cursors.up.isDown && !this.wasd.up.isDown) {
            this.keyStates.up = false;
        }
        
        if ((this.cursors.down.isDown || this.wasd.down.isDown) && !this.keyStates.down) {
            newY++;
            moved = true;
            this.keyStates.down = true;
        } else if (!this.cursors.down.isDown && !this.wasd.down.isDown) {
            this.keyStates.down = false;
        }
        
        // Check if the move is valid before starting movement
        if (moved) {
            if (this.isValidMove(newX, newY)) {
                this.startPlayerMove(newX, newY);
            } else {
                // Invalid move - don't move at all
                console.log(`Invalid move: (${newX}, ${newY}) - Wall or out of bounds`);
            }
        }
    }

    isValidMove(x, y) {
        // Check bounds first
        if (x < 0 || x >= this.mazeWidth || y < 0 || y >= this.mazeHeight) {
            console.log(`Out of bounds: (${x}, ${y})`);
            return false;
        }
        
        // Check if it's a wall (1 = wall, 0 = path)
        if (this.maze[y][x] === 1) {
            console.log(`Wall detected at: (${x}, ${y})`);
            return false;
        }
        
        // Allow moving to exit
        if (x === this.exitGridX && y === this.exitGridY) {
            console.log(`Moving to exit at: (${x}, ${y})`);
            return true;
        }
        
        console.log(`Valid move to: (${x}, ${y})`);
        return true;
    }

    startPlayerMove(newX, newY) {
        this.playerTargetX = newX;
        this.playerTargetY = newY;
        this.playerMoving = true;
        
        // Explore new area immediately
        this.exploreArea(newX, newY);
    }

    updatePlayerMovement() {
        if (!this.playerMoving) return;
        
        // Instant movement - just snap to target
        const offsetX = (1280 - (this.mazeWidth * this.gridSize)) / 2;
        const offsetY = (720 - (this.mazeHeight * this.gridSize)) / 2;
        
        const targetScreenX = offsetX + (this.playerTargetX * this.gridSize) + this.gridSize / 2;
        const targetScreenY = offsetY + (this.playerTargetY * this.gridSize) + this.gridSize / 2;
        
        this.player.setPosition(targetScreenX, targetScreenY);
        
        // Update grid position and complete movement
        this.playerGridX = this.playerTargetX;
        this.playerGridY = this.playerTargetY;
        this.playerMoving = false;
        
        // Check for enemy encounter
        this.checkEnemyEncounter();
    }

    exploreArea(x, y) {
        // Only explore the current tile (no adjacent tiles)
        if (x >= 0 && x < this.mazeWidth && y >= 0 && y < this.mazeHeight) {
            this.explored[y][x] = true;
        }
        
        this.drawMaze();
        this.redrawEnemies();
    }

    redrawEnemies() {
        this.enemies.forEach(enemy => {
            if (this.revealMode || (this.explored[enemy.gridY] && this.explored[enemy.gridY][enemy.gridX])) {
                enemy.sprite.setVisible(true);
            } else {
                enemy.sprite.setVisible(false);
            }
        });
    }

    checkEnemyEncounter() {
        // Check for exit first
        if (this.playerGridX === this.exitGridX && this.playerGridY === this.exitGridY) {
            this.reachExit();
            return;
        }
        
        // Check for enemy encounters
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            if (enemy.gridX === this.playerGridX && enemy.gridY === this.playerGridY) {
                // Start combat
                this.startCombat(enemy, i);
                return;
            }
        }
    }

    startCombat(enemy, enemyIndex) {
        console.log('Starting combat with enemy!');
        
        // Remove enemy from labyrinth
        enemy.sprite.destroy();
        this.enemies.splice(enemyIndex, 1);
        
        // Preserve labyrinth state
        const preservedState = {
            maze: this.maze,
            explored: this.explored,
            enemies: this.enemies,
            playerGridX: this.playerGridX,
            playerGridY: this.playerGridY
        };
        
        // Start combat scene
        this.scene.start('CombatScene', {
            playerData: this.playerData,
            fracture: this.fracture,
            enemy: enemy,
            preservedState: preservedState
        });
    }

    reachExit() {
        console.log('Player reached the exit! Level completed!');
        
        // Give rewards for completing the level
        this.playerData.resources.crystals += 10;
        this.playerData.resources.gears += 5;
        this.playerData.experience += 50;
        
        // Check if player leveled up
        if (this.playerData.experience >= this.playerData.experienceToNext) {
            this.playerData.level += 1;
            this.playerData.experience -= this.playerData.experienceToNext;
            this.playerData.experienceToNext = this.playerData.level * 100;
            this.playerData.skillPoints += 1;
        }
        
        // Show completion message
        const completionText = this.add.text(640, 360, 'LEVEL COMPLETED!', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'monospace',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        // Return to hub after 2 seconds
        this.time.delayedCall(2000, () => {
            this.scene.start('HubScene', { playerData: this.playerData });
        });
    }

    updateUI() {
        this.enemyCountText.setText(`Enemies: ${this.enemies.length}`);
    }

    returnFromCombat() {
        // Called when returning from combat
        console.log('Returned from combat to labyrinth');
    }

    escapeToHub() {
        // Give some rewards for escaping (but don't progress difficulty)
        this.playerData.resources.crystals += 5;
        this.playerData.resources.gears += 2;
        // Don't increment fractureIndex - player stays at same difficulty level
        
        // Clear any preserved state to prevent enemy accumulation
        this.preservedState = null;
        
        // Destroy all labyrinth objects to ensure fresh start
        if (this.mazeGraphics) {
            this.mazeGraphics.destroy();
        }
        if (this.player) {
            this.player.destroy();
        }
        if (this.exit) {
            this.exit.destroy();
        }
        this.enemies.forEach(enemy => {
            if (enemy.sprite) {
                enemy.sprite.destroy();
            }
        });
        
        // Clear all arrays
        this.maze = [];
        this.explored = [];
        this.enemies = [];
        
        this.scene.start('HubScene', { playerData: this.playerData });
    }

    shutdown() {
        // Clean up when scene is shut down
        if (this.mazeGraphics) {
            this.mazeGraphics.destroy();
        }
        if (this.player) {
            this.player.destroy();
        }
        if (this.exit) {
            this.exit.destroy();
        }
        if (this.revealIndicator) {
            this.revealIndicator.destroy();
        }
        this.enemies.forEach(enemy => {
            if (enemy.sprite) {
                enemy.sprite.destroy();
            }
        });
        
        // Clear all arrays
        this.maze = [];
        this.explored = [];
        this.enemies = [];
        this.preservedState = null;
    }
}
