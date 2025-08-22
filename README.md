# Fracture Slasher

A roguelike action game with steampunk-alien aesthetics built with Phaser.js.

## 🎮 Game Overview

**Fracture Slasher** is a top-down action roguelike where players explore mysterious "Fractures" - labyrinthine zones filled with alien creatures and ancient technology. Navigate through procedurally generated mazes, fight enemies, collect resources, and upgrade your character between runs.

### Key Features

- **Three Character Classes**: Archéotech (ranged), Forge-Lame (melee), Symbiote (support)
- **Procedural Maze Generation**: Each run offers unique challenges
- **Character Progression**: Level up, unlock skills, and improve stats
- **Equipment System**: Collect and upgrade weapons, armor, and accessories
- **Multiple Biomes**: The Tar Breach, Crystal Forest, Lost Floating City
- **Steampunk-Alien Aesthetic**: Dark tones with neon accents and industrial elements

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LadderSlasher
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Game Controls

- **Movement**: WASD or Arrow Keys
- **Shoot**: Click mouse
- **Escape**: ESC key or click "ESCAPE" button

## 🏗️ Project Structure

```
src/
├── main.js              # Game entry point and configuration
├── scenes/
│   ├── BootScene.js     # Asset loading and initialization
│   ├── MenuScene.js     # Main menu
│   ├── HubScene.js      # Character management and fracture selection
│   └── GameScene.js     # Main gameplay
├── entities/            # Game objects (player, enemies, etc.)
├── systems/             # Game systems (combat, inventory, etc.)
└── utils/               # Utility functions
```

## 🎨 Art Style Guide

### Color Palette
- **Primary**: Dark backgrounds (#0a0a0a, #1a1a1a)
- **Accent**: Cyan/Teal (#00ffff, #004444)
- **UI Elements**: White (#ffffff), Gray (#888888)
- **Enemies**: Red (#ff4444)
- **Player**: Cyan (#00ffff)

### Visual Elements
- Industrial grid patterns
- Neon lighting effects
- Steampunk machinery aesthetics
- Alien organic elements
- Particle effects for atmosphere

## 🛠️ Development Roadmap

### Phase 1: Core Systems ✅
- [x] Basic project setup
- [x] Menu system
- [x] Hub/character management
- [x] Basic combat system
- [x] Player movement and shooting

### Phase 2: Enhanced Gameplay
- [ ] Character classes implementation
- [ ] Skill tree system
- [ ] Equipment and inventory
- [ ] Procedural maze generation
- [ ] Boss encounters

### Phase 3: Content & Polish
- [ ] Multiple biomes
- [ ] Enemy variety
- [ ] Sound effects and music
- [ ] Visual effects and animations
- [ ] Save/load system

### Phase 4: Advanced Features
- [ ] Multiplayer elements
- [ ] Seasonal resets
- [ ] Leaderboards
- [ ] Achievement system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Game Design Philosophy

**Fracture Slasher** emphasizes:
- **Risk vs Reward**: Every decision matters
- **Progressive Difficulty**: Unlock harder challenges as you improve
- **Replayability**: Each run is unique
- **Player Agency**: Multiple paths to success
- **Atmospheric Immersion**: Rich world-building through visuals and gameplay

---

*"In the depths of the Fractures, only the strongest explorers survive..."*
