// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let score = 0;
let lives = 3;
let currentLevel = 0;
let gameRunning = true;
let keys = {};
let animationFrame = 0;
let levelTransitioning = false;

// Player (Van Gogh)
const player = {
    x: 50,
    y: 400,
    width: 45,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    speed: 6,
    jumpPower: 13,
    onGround: false,
    direction: 1, // 1 = right, -1 = left
    animFrame: 0
};

// Gravity
const gravity = 0.6;

// Level definitions
const levels = [
    {
        name: "The Starry Night",
        theme: "night",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
            { x: 150, y: 450, width: 120, height: 25, type: 'platform' },
            { x: 350, y: 380, width: 140, height: 25, type: 'platform' },
            { x: 550, y: 300, width: 120, height: 25, type: 'platform' },
            { x: 200, y: 250, width: 100, height: 25, type: 'platform' },
            { x: 450, y: 170, width: 160, height: 25, type: 'platform' }
        ],
        stars: [
            { x: 180, y: 405, width: 30, height: 30, collected: false },
            { x: 390, y: 335, width: 30, height: 30, collected: false },
            { x: 590, y: 255, width: 30, height: 30, collected: false },
            { x: 500, y: 125, width: 30, height: 30, collected: false }
        ],
        enemies: [
            { x: 350, y: 345, width: 35, height: 35, velocityX: 2.5, minX: 350, maxX: 470, type: 'critic' },
            { x: 450, y: 135, width: 35, height: 35, velocityX: -2, minX: 450, maxX: 590, type: 'critic' }
        ],
        goal: { x: 720, y: 485, width: 50, height: 65 }
    },
    {
        name: "Sunflowers",
        theme: "day",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
            { x: 100, y: 470, width: 100, height: 25, type: 'platform' },
            { x: 280, y: 420, width: 80, height: 25, type: 'platform' },
            { x: 180, y: 340, width: 120, height: 25, type: 'platform' },
            { x: 380, y: 280, width: 100, height: 25, type: 'platform' },
            { x: 560, y: 350, width: 140, height: 25, type: 'platform' },
            { x: 420, y: 180, width: 120, height: 25, type: 'platform' }
        ],
        stars: [
            { x: 130, y: 425, width: 30, height: 30, collected: false },
            { x: 220, y: 295, width: 30, height: 30, collected: false },
            { x: 410, y: 235, width: 30, height: 30, collected: false },
            { x: 460, y: 135, width: 30, height: 30, collected: false }
        ],
        enemies: [
            { x: 280, y: 385, width: 35, height: 35, velocityX: 1.8, minX: 280, maxX: 350, type: 'critic' },
            { x: 180, y: 305, width: 35, height: 35, velocityX: -2.2, minX: 180, maxX: 290, type: 'critic' },
            { x: 560, y: 315, width: 35, height: 35, velocityX: 2, minX: 560, maxX: 690, type: 'critic' }
        ],
        goal: { x: 720, y: 485, width: 50, height: 65 }
    },
    {
        name: "Café Terrace at Night",
        theme: "twilight",
        platforms: [
            { x: 0, y: 550, width: 200, height: 50, type: 'ground' },
            { x: 300, y: 550, width: 500, height: 50, type: 'ground' },
            { x: 80, y: 470, width: 100, height: 25, type: 'platform' },
            { x: 220, y: 390, width: 120, height: 25, type: 'platform' },
            { x: 400, y: 320, width: 100, height: 25, type: 'platform' },
            { x: 250, y: 250, width: 100, height: 25, type: 'platform' },
            { x: 450, y: 200, width: 140, height: 25, type: 'platform' },
            { x: 650, y: 430, width: 100, height: 25, type: 'platform' }
        ],
        stars: [
            { x: 110, y: 425, width: 30, height: 30, collected: false },
            { x: 260, y: 345, width: 30, height: 30, collected: false },
            { x: 430, y: 275, width: 30, height: 30, collected: false },
            { x: 500, y: 155, width: 30, height: 30, collected: false },
            { x: 680, y: 385, width: 30, height: 30, collected: false }
        ],
        enemies: [
            { x: 220, y: 355, width: 35, height: 35, velocityX: 2.2, minX: 220, maxX: 330, type: 'critic' },
            { x: 450, y: 165, width: 35, height: 35, velocityX: -2.5, minX: 450, maxX: 580, type: 'critic' }
        ],
        goal: { x: 720, y: 485, width: 50, height: 65 }
    },
    {
        name: "The Bedroom",
        theme: "indoor",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
            { x: 100, y: 460, width: 140, height: 25, type: 'platform' },
            { x: 320, y: 390, width: 160, height: 25, type: 'platform' },
            { x: 140, y: 310, width: 120, height: 25, type: 'platform' },
            { x: 380, y: 240, width: 140, height: 25, type: 'platform' },
            { x: 580, y: 340, width: 120, height: 25, type: 'platform' },
            { x: 250, y: 160, width: 180, height: 25, type: 'platform' }
        ],
        stars: [
            { x: 150, y: 415, width: 30, height: 30, collected: false },
            { x: 370, y: 345, width: 30, height: 30, collected: false },
            { x: 180, y: 265, width: 30, height: 30, collected: false },
            { x: 420, y: 195, width: 30, height: 30, collected: false },
            { x: 310, y: 115, width: 30, height: 30, collected: false }
        ],
        enemies: [
            { x: 320, y: 355, width: 35, height: 35, velocityX: 2.8, minX: 320, maxX: 470, type: 'critic' },
            { x: 140, y: 275, width: 35, height: 35, velocityX: -2.3, minX: 140, maxX: 250, type: 'critic' },
            { x: 580, y: 305, width: 35, height: 35, velocityX: 2, minX: 580, maxX: 690, type: 'critic' }
        ],
        goal: { x: 720, y: 485, width: 50, height: 65 }
    }
];

// Current level data
let platforms, stars, enemies, goal;

// Input handling
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Load level
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        endGame(true, true); // Won all levels
        return;
    }

    currentLevel = levelIndex;
    const level = levels[currentLevel];

    // Deep copy level data
    platforms = JSON.parse(JSON.stringify(level.platforms));
    stars = JSON.parse(JSON.stringify(level.stars));
    enemies = JSON.parse(JSON.stringify(level.enemies));
    goal = JSON.parse(JSON.stringify(level.goal));

    // Reset player position
    player.x = 50;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;

    updateLevelDisplay();
}

// Draw Van Gogh character with better graphics
function drawPlayer() {
    const px = player.x;
    const py = player.y;
    const dir = player.direction;

    ctx.save();

    // Flip horizontally if facing left
    if (dir === -1) {
        ctx.translate(px + player.width / 2, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(px + player.width / 2), 0);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(px + player.width / 2, py + player.height + 3, 20, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (simple animation)
    ctx.fillStyle = '#2c3e50';
    const legOffset = player.onGround && Math.abs(player.velocityX) > 0 ? Math.sin(animationFrame * 0.3) * 3 : 0;
    ctx.fillRect(px + 12, py + 42, 8, 18);
    ctx.fillRect(px + 25, py + 42 + legOffset, 8, 18 - legOffset);

    // Body - blue jacket
    ctx.fillStyle = '#2c5f9e';
    ctx.fillRect(px + 8, py + 22, 30, 22);

    // Jacket details
    ctx.strokeStyle = '#1a3d6e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 23, py + 22);
    ctx.lineTo(px + 23, py + 44);
    ctx.stroke();

    // Arms
    const armSwing = player.onGround && Math.abs(player.velocityX) > 0 ? Math.sin(animationFrame * 0.3) * 5 : 0;
    ctx.fillStyle = '#2c5f9e';
    ctx.fillRect(px + 3, py + 25 + armSwing, 6, 15);
    ctx.fillRect(px + 37, py + 25 - armSwing, 6, 15);

    // Hands
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(px + 2, py + 38 + armSwing, 7, 7);
    ctx.fillRect(px + 37, py + 38 - armSwing, 7, 7);

    // Neck
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(px + 18, py + 16, 10, 8);

    // Head
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.ellipse(px + 23, py + 10, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ear
    ctx.fillStyle = '#f5c99a';
    ctx.beginPath();
    ctx.ellipse(px + 35, py + 12, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair - Van Gogh's distinctive red hair
    ctx.fillStyle = '#d94e2a';
    ctx.beginPath();
    ctx.ellipse(px + 23, py + 3, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair strands
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(px + 12 + i * 5, py - 2, 3, 6);
    }

    // Hat
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(px + 10, py - 3, 26, 8);
    ctx.fillRect(px + 14, py - 8, 18, 6);

    // Hat band
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(px + 10, py + 3, 26, 2);

    // Face details
    // Eye
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(px + 26, py + 8, 4, 3);

    // Eyebrow
    ctx.strokeStyle = '#d94e2a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 24, py + 6);
    ctx.lineTo(px + 31, py + 6);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#e6b899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 28, py + 10);
    ctx.lineTo(px + 30, py + 14);
    ctx.stroke();

    // Mouth
    ctx.strokeStyle = '#c47a56';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px + 26, py + 16, 3, 0, Math.PI);
    ctx.stroke();

    // Van Gogh's famous beard
    ctx.fillStyle = '#d94e2a';
    ctx.beginPath();
    ctx.ellipse(px + 26, py + 20, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beard texture
    ctx.strokeStyle = '#c43e1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(px + 18 + i * 3, py + 18);
        ctx.lineTo(px + 18 + i * 3, py + 25);
        ctx.stroke();
    }

    ctx.restore();
}

// Draw platforms with better graphics
function drawPlatforms() {
    const level = levels[currentLevel];

    platforms.forEach(platform => {
        if (platform.type === 'ground') {
            // Ground with grass
            const gradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.height);
            gradient.addColorStop(0, '#7cb342');
            gradient.addColorStop(0.3, '#558b2f');
            gradient.addColorStop(1, '#33691e');
            ctx.fillStyle = gradient;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

            // Grass blades
            ctx.strokeStyle = '#9ccc65';
            ctx.lineWidth = 2;
            for (let i = platform.x; i < platform.x + platform.width; i += 15) {
                ctx.beginPath();
                ctx.moveTo(i, platform.y);
                ctx.lineTo(i - 2, platform.y - 5);
                ctx.moveTo(i + 5, platform.y);
                ctx.lineTo(i + 3, platform.y - 6);
                ctx.moveTo(i + 10, platform.y);
                ctx.lineTo(i + 8, platform.y - 4);
                ctx.stroke();
            }
        } else {
            // Floating platforms - wooden planks
            const gradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.height);
            gradient.addColorStop(0, '#a0826d');
            gradient.addColorStop(0.5, '#8b6f47');
            gradient.addColorStop(1, '#6d5638');
            ctx.fillStyle = gradient;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

            // Wood texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < platform.width; i += 25) {
                ctx.beginPath();
                ctx.moveTo(platform.x + i, platform.y);
                ctx.lineTo(platform.x + i, platform.y + platform.height);
                ctx.stroke();
            }

            // Wood grain
            ctx.strokeStyle = 'rgba(139, 111, 71, 0.5)';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(platform.x, platform.y + 8 + i * 6);
                ctx.lineTo(platform.x + platform.width, platform.y + 8 + i * 6);
                ctx.stroke();
            }

            // Platform edge highlight
            ctx.strokeStyle = '#c4a57b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(platform.x, platform.y);
            ctx.lineTo(platform.x + platform.width, platform.y);
            ctx.stroke();
        }
    });
}

// Draw stars with animation
function drawStars() {
    stars.forEach((star, index) => {
        if (!star.collected) {
            const pulse = Math.sin(animationFrame * 0.1 + index) * 0.15 + 1;
            const glow = Math.sin(animationFrame * 0.08 + index) * 10 + 15;

            // Glow effect
            const gradient = ctx.createRadialGradient(
                star.x + star.width / 2,
                star.y + star.height / 2,
                5,
                star.x + star.width / 2,
                star.y + star.height / 2,
                glow
            );
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(
                star.x - glow + star.width / 2,
                star.y - glow + star.height / 2,
                glow * 2,
                glow * 2
            );

            // Star shape
            ctx.save();
            ctx.translate(star.x + star.width / 2, star.y + star.height / 2);
            ctx.scale(pulse, pulse);
            ctx.rotate(animationFrame * 0.02);

            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#ffed4e';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const spikes = 5;
            const outerRadius = star.width / 2;
            const innerRadius = outerRadius * 0.5;

            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }
    });
}

// Draw enemies (art critics) with better graphics
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        const bounce = Math.sin(animationFrame * 0.15 + index) * 3;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height + 2, 15, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        const gradient = ctx.createLinearGradient(0, enemy.y, 0, enemy.y + enemy.height);
        gradient.addColorStop(0, '#c62828');
        gradient.addColorStop(1, '#8b0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(enemy.x, enemy.y + bounce, enemy.width, enemy.height - 5);

        // Arms
        ctx.fillStyle = '#c62828';
        ctx.fillRect(enemy.x - 5, enemy.y + 10 + bounce, 5, 12);
        ctx.fillRect(enemy.x + enemy.width, enemy.y + 10 + bounce, 5, 12);

        // Head
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + 8 + bounce, 10, 0, Math.PI * 2);
        ctx.fill();

        // Top hat
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(enemy.x + enemy.width / 2 - 12, enemy.y + bounce, 24, 5);
        ctx.fillRect(enemy.x + enemy.width / 2 - 8, enemy.y - 8 + bounce, 16, 8);

        // Monocle
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2 + 4, enemy.y + 8 + bounce, 4, 0, Math.PI * 2);
        ctx.stroke();

        // Angry eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(enemy.x + 10, enemy.y + 6 + bounce, 4, 4);
        ctx.fillRect(enemy.x + 21, enemy.y + 6 + bounce, 4, 4);

        // Pupils
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 11, enemy.y + 7 + bounce, 2, 2);
        ctx.fillRect(enemy.x + 22, enemy.y + 7 + bounce, 2, 2);

        // Angry eyebrows
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(enemy.x + 8, enemy.y + 4 + bounce);
        ctx.lineTo(enemy.x + 14, enemy.y + 6 + bounce);
        ctx.moveTo(enemy.x + 27, enemy.y + 6 + bounce);
        ctx.lineTo(enemy.x + 21, enemy.y + 4 + bounce);
        ctx.stroke();

        // Mustache
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + 13 + bounce, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw goal (easel)
function drawGoal() {
    if (!goal) return;

    const pulse = Math.sin(animationFrame * 0.1) * 0.05 + 1;

    ctx.save();
    ctx.translate(goal.x + goal.width / 2, goal.y + goal.height / 2);
    ctx.scale(pulse, pulse);
    ctx.translate(-(goal.x + goal.width / 2), -(goal.y + goal.height / 2));

    // Easel legs
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(goal.x + 10, goal.y + goal.height);
    ctx.lineTo(goal.x + 25, goal.y);
    ctx.moveTo(goal.x + goal.width - 10, goal.y + goal.height);
    ctx.lineTo(goal.x + 25, goal.y);
    ctx.stroke();

    // Canvas
    const canvasGradient = ctx.createLinearGradient(goal.x, goal.y, goal.x + goal.width, goal.y);
    canvasGradient.addColorStop(0, '#f5f5dc');
    canvasGradient.addColorStop(1, '#fffacd');
    ctx.fillStyle = canvasGradient;
    ctx.fillRect(goal.x + 5, goal.y + 5, goal.width - 10, goal.height - 25);

    // Canvas frame
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 3;
    ctx.strokeRect(goal.x + 5, goal.y + 5, goal.width - 10, goal.height - 25);

    // Simple painting on canvas
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(goal.x + 25, goal.y + 20, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4682b4';
    ctx.fillRect(goal.x + 10, goal.y + 35, 30, 15);

    ctx.restore();
}

// Draw backgrounds based on level theme
function drawBackground() {
    const level = levels[currentLevel];

    switch (level.theme) {
        case 'night':
            // Starry Night theme
            const nightGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            nightGradient.addColorStop(0, '#0a1628');
            nightGradient.addColorStop(0.5, '#1e3a5f');
            nightGradient.addColorStop(1, '#2c5a8a');
            ctx.fillStyle = nightGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Swirling stars
            ctx.fillStyle = '#ffd700';
            for (let i = 0; i < 50; i++) {
                const x = (i * 137.5) % canvas.width;
                const y = (i * 73.3) % (canvas.height - 100);
                const size = Math.sin(animationFrame * 0.05 + i) * 0.5 + 1.5;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Moon
            ctx.fillStyle = '#ffffcc';
            ctx.beginPath();
            ctx.arc(650, 80, 40, 0, Math.PI * 2);
            ctx.fill();

            // Swirls
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(200 + i * 200, 100, 30 + i * 10, 0, Math.PI * 1.5);
                ctx.stroke();
            }
            break;

        case 'day':
            // Sunflowers theme - bright yellow day
            const dayGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            dayGradient.addColorStop(0, '#87CEEB');
            dayGradient.addColorStop(0.7, '#E0F6FF');
            dayGradient.addColorStop(1, '#FFE5B4');
            ctx.fillStyle = dayGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Sun
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(100, 80, 50, 0, Math.PI * 2);
            ctx.fill();

            // Sun rays
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 4;
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(100 + Math.cos(angle) * 55, 80 + Math.sin(angle) * 55);
                ctx.lineTo(100 + Math.cos(angle) * 75, 80 + Math.sin(angle) * 75);
                ctx.stroke();
            }

            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 3; i++) {
                const cx = 300 + i * 200;
                const cy = 100 + i * 20;
                ctx.beginPath();
                ctx.arc(cx, cy, 25, 0, Math.PI * 2);
                ctx.arc(cx + 25, cy, 30, 0, Math.PI * 2);
                ctx.arc(cx + 50, cy, 25, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'twilight':
            // Café Terrace - twilight colors
            const twilightGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            twilightGradient.addColorStop(0, '#1a237e');
            twilightGradient.addColorStop(0.5, '#5e35b1');
            twilightGradient.addColorStop(1, '#f57f17');
            ctx.fillStyle = twilightGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars appearing
            ctx.fillStyle = '#fff9c4';
            for (let i = 0; i < 30; i++) {
                const x = (i * 167.3) % canvas.width;
                const y = (i * 91.7) % 200;
                const twinkle = Math.sin(animationFrame * 0.1 + i) * 0.5 + 1;
                ctx.globalAlpha = twinkle * 0.7;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            break;

        case 'indoor':
            // The Bedroom - indoor scene
            const indoorGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            indoorGradient.addColorStop(0, '#6a8ab0');
            indoorGradient.addColorStop(1, '#a4b8c8');
            ctx.fillStyle = indoorGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Window
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(600, 50, 150, 180);
            ctx.strokeStyle = '#4a4a4a';
            ctx.lineWidth = 5;
            ctx.strokeRect(600, 50, 150, 180);
            ctx.beginPath();
            ctx.moveTo(675, 50);
            ctx.lineTo(675, 230);
            ctx.moveTo(600, 140);
            ctx.lineTo(750, 140);
            ctx.stroke();

            // Sunlight through window
            ctx.fillStyle = 'rgba(255, 255, 200, 0.2)';
            ctx.beginPath();
            ctx.moveTo(600, 50);
            ctx.lineTo(400, 200);
            ctx.lineTo(400, 300);
            ctx.lineTo(600, 230);
            ctx.fill();
            break;
    }
}

// Check collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update player
function updatePlayer() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['a']) {
        player.velocityX = -player.speed;
        player.direction = -1;
    } else if (keys['ArrowRight'] || keys['d']) {
        player.velocityX = player.speed;
        player.direction = 1;
    } else {
        player.velocityX = 0;
    }

    // Jump
    if ((keys[' '] || keys['ArrowUp'] || keys['w']) && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }

    // Apply gravity
    player.velocityY += gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Check if player fell off screen
    if (player.y > canvas.height) {
        lives--;
        updateLives();
        if (lives <= 0) {
            endGame(false, false);
        } else {
            resetPlayerPosition();
        }
    }

    // Platform collision
    player.onGround = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y + 5) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
            else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height - 5) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
        }
    });

    // Star collection
    stars.forEach(star => {
        if (!star.collected && checkCollision(player, star)) {
            star.collected = true;
            score += 100;
            updateScore();
        }
    });

    // Enemy collision
    enemies.forEach(enemy => {
        if (checkCollision(player, enemy)) {
            lives--;
            updateLives();
            if (lives <= 0) {
                endGame(false, false);
            } else {
                resetPlayerPosition();
            }
        }
    });

    // Goal collision - complete level
    if (goal && checkCollision(player, goal)) {
        const allStarsCollected = stars.every(star => star.collected);
        if (allStarsCollected) {
            nextLevel();
        }
    }
}

// Update enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;

        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.velocityX *= -1;
        }
    });
}

// Reset player position
function resetPlayerPosition() {
    player.x = 50;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
}

// Next level
function nextLevel() {
    levelTransitioning = true;
    gameRunning = false;

    setTimeout(() => {
        loadLevel(currentLevel + 1);
        levelTransitioning = false;
        gameRunning = true;
        gameLoop();
    }, 2000);

    showLevelComplete();
}

// Show level complete message
function showLevelComplete() {
    const tempCanvas = ctx;
    let alpha = 0;
    let fadeInterval = setInterval(() => {
        alpha += 0.05;
        if (alpha >= 1) {
            clearInterval(fadeInterval);
        }
    }, 30);
}

// Update UI
function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateLives() {
    document.getElementById('lives').textContent = lives;
}

function updateLevelDisplay() {
    document.getElementById('stars').textContent = `Level ${currentLevel + 1}/${levels.length} - ${levels[currentLevel].name}`;
}

// End game
function endGame(won, allLevels) {
    gameRunning = false;
    const gameOverDiv = document.getElementById('gameOver');
    const messageDiv = document.getElementById('gameOverMessage');

    if (won && allLevels) {
        messageDiv.innerHTML = `<strong>Masterpiece!</strong><br>You've completed all levels!<br>Final Score: ${score}`;
    } else if (won) {
        messageDiv.innerHTML = `<strong>Level Complete!</strong><br>Score: ${score}`;
    } else {
        messageDiv.innerHTML = `<strong>Game Over!</strong><br>Try again!<br>Score: ${score}`;
    }

    gameOverDiv.classList.remove('hidden');
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;

    animationFrame++;

    // Clear and draw
    drawBackground();
    drawPlatforms();
    drawGoal();
    drawStars();
    drawEnemies();
    drawPlayer();

    // Update
    updatePlayer();
    updateEnemies();

    requestAnimationFrame(gameLoop);
}

// Start game
loadLevel(0);
gameLoop();
