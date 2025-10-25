// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let score = 0;
let lives = 3;
let starsCollected = 0;
let gameRunning = true;
let keys = {};

// Player (Van Gogh)
const player = {
    x: 50,
    y: 400,
    width: 40,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 12,
    onGround: false,
    color: '#ff6b35'
};

// Gravity
const gravity = 0.5;

// Platforms
const platforms = [
    { x: 0, y: 550, width: 800, height: 50, color: '#8b7355' }, // Ground
    { x: 150, y: 450, width: 100, height: 20, color: '#8b7355' },
    { x: 300, y: 380, width: 120, height: 20, color: '#8b7355' },
    { x: 500, y: 320, width: 100, height: 20, color: '#8b7355' },
    { x: 200, y: 250, width: 100, height: 20, color: '#8b7355' },
    { x: 400, y: 180, width: 150, height: 20, color: '#8b7355' },
    { x: 650, y: 400, width: 120, height: 20, color: '#8b7355' }
];

// Stars to collect
const stars = [
    { x: 180, y: 410, width: 25, height: 25, collected: false },
    { x: 340, y: 340, width: 25, height: 25, collected: false },
    { x: 530, y: 280, width: 25, height: 25, collected: false },
    { x: 230, y: 210, width: 25, height: 25, collected: false },
    { x: 450, y: 140, width: 25, height: 25, collected: false }
];

// Enemies (moving obstacles)
const enemies = [
    { x: 300, y: 350, width: 30, height: 30, velocityX: 2, minX: 300, maxX: 420 },
    { x: 650, y: 370, width: 30, height: 30, velocityX: -2, minX: 650, maxX: 770 }
];

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

// Draw player (Van Gogh)
function drawPlayer() {
    // Body
    ctx.fillStyle = '#2c5f9e'; // Blue jacket
    ctx.fillRect(player.x, player.y + 20, player.width, 30);

    // Head
    ctx.fillStyle = '#ffdbac'; // Skin
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + 10, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hat
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(player.x + 8, player.y - 5, 24, 10);
    ctx.fillRect(player.x + 12, player.y - 10, 16, 5);

    // Beard
    ctx.fillStyle = '#ff6b35'; // Van Gogh's famous red beard
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + 15, 8, 0, Math.PI);
    ctx.fill();
}

// Draw platforms
function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Add texture
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < platform.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(platform.x + i, platform.y);
            ctx.lineTo(platform.x + i, platform.y + platform.height);
            ctx.stroke();
        }
    });
}

// Draw stars
function drawStars() {
    stars.forEach(star => {
        if (!star.collected) {
            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#ffed4e';
            ctx.lineWidth = 2;

            // Draw 5-pointed star
            ctx.beginPath();
            const centerX = star.x + star.width / 2;
            const centerY = star.y + star.height / 2;
            const spikes = 5;
            const outerRadius = star.width / 2;
            const innerRadius = outerRadius / 2;

            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Draw angry face
        ctx.fillStyle = '#fff';
        ctx.fillRect(enemy.x + 8, enemy.y + 8, 5, 5);
        ctx.fillRect(enemy.x + 17, enemy.y + 8, 5, 5);

        // Angry mouth
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(enemy.x + 8, enemy.y + 22);
        ctx.lineTo(enemy.x + 22, enemy.y + 22);
        ctx.stroke();
    });
}

// Check collision between two rectangles
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update player position
function updatePlayer() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['a']) {
        player.velocityX = -player.speed;
    } else if (keys['ArrowRight'] || keys['d']) {
        player.velocityX = player.speed;
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
            endGame(false);
        } else {
            resetPlayerPosition();
        }
    }

    // Platform collision
    player.onGround = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            // Landing on top
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
            // Hitting from bottom
            else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
        }
    });

    // Star collection
    stars.forEach(star => {
        if (!star.collected && checkCollision(player, star)) {
            star.collected = true;
            starsCollected++;
            score += 100;
            updateScore();
            updateStars();

            if (starsCollected === stars.length) {
                endGame(true);
            }
        }
    });

    // Enemy collision
    enemies.forEach(enemy => {
        if (checkCollision(player, enemy)) {
            lives--;
            updateLives();
            if (lives <= 0) {
                endGame(false);
            } else {
                resetPlayerPosition();
            }
        }
    });
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

// Update UI
function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateLives() {
    document.getElementById('lives').textContent = lives;
}

function updateStars() {
    document.getElementById('stars').textContent = starsCollected;
}

// End game
function endGame(won) {
    gameRunning = false;
    const gameOverDiv = document.getElementById('gameOver');
    const messageDiv = document.getElementById('gameOverMessage');

    if (won) {
        messageDiv.innerHTML = `<strong>Congratulations!</strong><br>You collected all the stars!<br>Final Score: ${score}`;
    } else {
        messageDiv.innerHTML = `<strong>Game Over!</strong><br>Try again to collect all the stars!<br>Score: ${score}`;
    }

    gameOverDiv.classList.remove('hidden');
}

// Draw background
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#4682b4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, Math.PI * 2);
    ctx.arc(130, 80, 35, 0, Math.PI * 2);
    ctx.arc(160, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(600, 120, 25, 0, Math.PI * 2);
    ctx.arc(625, 120, 30, 0, Math.PI * 2);
    ctx.arc(650, 120, 25, 0, Math.PI * 2);
    ctx.fill();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    drawBackground();

    // Update
    updatePlayer();
    updateEnemies();

    // Draw
    drawPlatforms();
    drawStars();
    drawEnemies();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
