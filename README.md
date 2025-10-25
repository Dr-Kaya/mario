# Van Gogh's Starry Adventure

A beautifully crafted Mario-like platformer game where you play as Vincent van Gogh himself, journeying through his most famous paintings!

## About

Experience an artistic platformer adventure featuring a detailed Van Gogh character (complete with his iconic red beard, hat, and blue jacket). Navigate through 4 stunning levels, each inspired by a different Van Gogh masterpiece. Collect golden stars, avoid pompous art critics, and reach your easel to complete each painting!

## Features

### Character & Graphics
- **Detailed Van Gogh Character**: Fully illustrated with red hair, beard, hat, blue jacket, and animated walking
- **Walking Animations**: Arms and legs move as you walk, creating a lively character
- **Direction Facing**: Character sprite flips based on movement direction
- **Smooth Movement**: Responsive controls with fluid physics

### 4 Unique Levels
Each level is inspired by a Van Gogh masterpiece with custom backgrounds and atmosphere:

1. **The Starry Night** - Navigate through a swirling night sky with twinkling stars and a glowing moon
2. **Sunflowers** - Bright sunny day with a radiant sun and fluffy clouds
3. **Café Terrace at Night** - Beautiful twilight scene with emerging stars
4. **The Bedroom** - Indoor scene with window and streaming sunlight

### Gameplay Elements
- **Level Progression**: Complete 4 increasingly challenging levels
- **Animated Golden Stars**: Rotating, pulsing stars with glow effects (100 points each)
- **Art Critic Enemies**: Pompous critics with top hats, monocles, and mustaches that bounce and patrol
- **Easel Goal**: Reach the painting easel after collecting all stars to complete each level
- **Enhanced Platforms**: Wooden planks with texture for floating platforms, grass-topped ground
- **Lives System**: Start with 3 lives across all levels
- **Score Tracking**: Accumulate points across all 4 levels

### Visual Polish
- **Dynamic Backgrounds**: Each level has unique atmospheric backgrounds
- **Shadows**: Characters and enemies cast realistic shadows
- **Particle Effects**: Glowing stars with radial gradients
- **Smooth Animations**: 60 FPS gameplay with requestAnimationFrame
- **Themed Color Palettes**: Each level uses colors from Van Gogh's original paintings

## How to Play

### Installation

1. Clone this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately - no build process or dependencies required!

### Controls

- **Move Left**: Left Arrow or `A` key
- **Move Right**: Right Arrow or `D` key
- **Jump**: Space Bar, Up Arrow, or `W` key

### Objective

Progress through all 4 levels by:
1. Collecting all golden stars in each level
2. Avoiding or jumping over art critic enemies
3. Reaching the easel at the end of each level
4. Completing all levels without losing all 3 lives

### Tips

- Plan your jumps carefully around moving enemies
- Each level has a different number of stars to collect (4-5 stars per level)
- You can only jump when standing on a platform (no double jumps!)
- Watch out for gaps in the platforms (Level 3 has a challenging gap to jump!)
- Enemy movement patterns vary - learn their patrol routes
- Reach the easel only after collecting ALL stars in that level

## Game Mechanics

### Win/Lose Conditions

- **Victory**: Complete all 4 levels by collecting all stars and reaching each easel
- **Defeat**: Lose all 3 lives (lives persist across levels)

### How to Lose Lives

- Falling off the bottom of the screen
- Touching an art critic enemy
- Each death respawns you at the start of the current level

## Technical Details

### Files

- `index.html` - Game structure and user interface (1.2 KB)
- `style.css` - Van Gogh themed styling with animations (2.5 KB)
- `game.js` - Complete game engine with 4 levels (25 KB)

### Technologies Used

- **HTML5 Canvas** for high-performance 2D rendering
- **Vanilla JavaScript** for game logic (no frameworks!)
- **CSS3** for UI styling and glow animations
- **Canvas 2D Context** for all graphics rendering
- Zero external dependencies

### Game Engine Specs

- **Gravity**: 0.6 pixels/frame² acceleration
- **Jump Power**: 13 pixels initial velocity
- **Player Speed**: 6 pixels/frame horizontal movement
- **Collision Detection**: AABB (Axis-Aligned Bounding Box)
- **Game Loop**: RequestAnimationFrame (60 FPS target)
- **Animation System**: Frame-based animations for walking, arm/leg movement
- **Level System**: 4 pre-designed levels with unique layouts

### Graphics Rendering

- **Van Gogh Character**: 60+ lines of canvas drawing code
- **Enemy Design**: Art critics with top hats, monocles, animated bounce
- **Star Animation**: Rotating with pulsing glow effect
- **Background Layers**: Gradients, celestial bodies, atmospheric effects
- **Platform Textures**: Wood grain, grass blades, realistic shadows

### Level Design

Each level features:
- 5-8 platforms at varying heights
- 4-5 collectible stars
- 2-3 patrolling enemies with unique speeds
- Custom background matching Van Gogh's painting style
- Strategic platform placement for challenging jumps

## Browser Compatibility

Tested and working on:
- Chrome/Edge 90+ (recommended)
- Firefox 88+
- Safari 14+
- Opera 76+

Requires HTML5 Canvas support.

## Development

### Code Structure

```
game.js structure:
- Level definitions (4 levels with platforms, stars, enemies)
- Player physics and controls
- Collision detection system
- Drawing functions (player, platforms, stars, enemies, backgrounds)
- Level progression system
- UI updates and game state management
```

### Performance

- Optimized rendering with single canvas
- Efficient collision detection (only active objects)
- No memory leaks (proper cleanup)
- Smooth 60 FPS on modern hardware

## What Makes This Special

Unlike typical browser games, this features:
- Hand-crafted art style inspired by Van Gogh
- Detailed character sprite drawn with canvas primitives
- 4 complete levels with unique themes
- Progressive difficulty
- Artistic attention to detail (beard texture, hat band, monocles, etc.)
- Atmospheric backgrounds that change per level
- No generic sprites - everything is custom drawn

## Credits

A passion project combining classic platformer gameplay with fine art aesthetics. Inspired by Vincent van Gogh's timeless masterpieces and classic Mario platformers.

## Future Enhancements (Potential)

- Sound effects and Van Gogh-era classical music
- More levels from other paintings (Irises, Almond Blossom, etc.)
- Power-ups (paintbrush, palette)
- Boss battles (art school professors?)
- High score leaderboard
- Mobile touch controls

## License

Free to use and modify for educational and personal purposes.

---

**Embark on an artistic journey through Van Gogh's greatest works!**
