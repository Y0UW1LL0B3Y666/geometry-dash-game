// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio system
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};

// Load and play sound function
function loadSound(name, url) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            sounds[name] = audioBuffer;
            console.log(`Sound loaded: ${name}`);
        })
        .catch(error => {
            console.error(`Error loading sound ${name}:`, error);
        });
}

// Load multiple sounds for an event
function loadSoundGroup(groupName, urls) {
    urls.forEach((url, index) => {
        const soundName = `${groupName}_${index + 1}`;
        loadSound(soundName, url);
    });
}

// Play a random sound from a group
function playRandomSound(groupName, volume = 1.0) {
    const groupSounds = Object.keys(sounds).filter(key => key.startsWith(groupName + '_'));
    if (groupSounds.length > 0) {
        const randomSound = groupSounds[Math.floor(Math.random() * groupSounds.length)];
        playSound(randomSound, volume);
    }
}

// Play a specific sound from a group
function playSoundFromGroup(groupName, index, volume = 1.0) {
    const soundName = `${groupName}_${index}`;
    playSound(soundName, volume);
}

function playSound(name, volume = 1.0) {
    if (sounds[name] && audioContext.state === 'running') {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = sounds[name];
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.value = volume;
        source.start(0);
    }
}

// Load your custom sounds here
// You can add multiple sounds for each event!

// Single sounds (original method)
loadSound('jump', './sounds/jump.mp3');
loadSound('death', './sounds/death.mp3');
loadSound('score', './sounds/score.mp3');

// Load only the background music files that exist
loadSound('background', './sounds/background.mp3');
loadSound('background2', './sounds/background2.mp3');
loadSound('background3', './sounds/background3.mp3');

// Multiple jump sounds (example)
loadSoundGroup('jump', [
    './sounds/jump1.mp3',
    './sounds/jump2.mp3',
    './sounds/jump3.mp3'
]);

// Multiple death sounds (example)
loadSoundGroup('death', [
    './sounds/death1.mp3',
    './sounds/death2.mp3',
    './sounds/death3.mp3'
]);

// Multiple score sounds (example)
loadSoundGroup('score', [
    './sounds/score1.mp3',
    './sounds/score2.mp3',
    './sounds/score3.mp3'
]);

// Multiple background music tracks (your actual files)
loadSoundGroup('background', [
    './sounds/background.mp3',
    './sounds/background2.mp3',
    './sounds/background3.mp3'
]);

// Additional sound effects (example)
loadSound('powerup', './sounds/powerup.mp3');
loadSound('levelup', './sounds/levelup.mp3');
loadSound('menu_select', './sounds/menu_select.mp3');
loadSound('menu_confirm', './sounds/menu_confirm.mp3');

// Background music control
let backgroundMusic = [];
let isMusicPlaying = false;
let currentBackgroundTrack = 1;

function playBackgroundMusic() {
    if (!isMusicPlaying) {
        // Play all available background tracks simultaneously
        const backgroundSounds = ['background', 'background2', 'background3'].filter(name => sounds[name]);
        
        if (backgroundSounds.length > 0) {
            // Play multiple background tracks together
            backgroundSounds.forEach(trackName => {
                playBackgroundTrack(trackName, 0.3); // Lower volume for multiple tracks
            });
            console.log(`Playing ${backgroundSounds.length} background tracks: ${backgroundSounds.join(', ')}`);
        } else {
            console.log('No background music files found');
        }
        
        isMusicPlaying = true;
    }
}

function playBackgroundTrack(trackName, volume = 1.0) {
    if (sounds[trackName]) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = sounds[trackName];
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.value = volume;
        source.loop = true;
        source.start(0);
        
        // Store reference to stop later
        backgroundMusic.push({ source, gainNode });
        
        console.log(`Playing background track: ${trackName} at volume ${volume}`);
    }
}

function stopBackgroundMusic() {
    if (backgroundMusic.length > 0) {
        backgroundMusic.forEach(track => {
            try {
                track.source.stop();
            } catch (e) {
                // Track might have already stopped
            }
        });
        backgroundMusic = [];
        isMusicPlaying = false;
    }
}

// Game state
let gameRunning = true;
let score = 0;
let distance = 0;
let gameSpeed = 5;
let gravity = 0.8;
let jumpForce = -15;

// Player object
const player = {
    x: 100,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    velocityY: 0,
    isJumping: false,
    rotation: 0,
    rotationSpeed: 0
};

// Obstacles array
let obstacles = [];
let groundBlocks = [];

// Particle effects
let particles = [];

// Colors
const colors = {
    player: '#ff6b6b',
    obstacle: '#ff4757',
    ground: '#2f3542',
    particle: '#ffa502'
};

// Initialize ground blocks
function initGround() {
    groundBlocks = [];
    for (let i = 0; i < 20; i++) {
        groundBlocks.push({
            x: i * 40,
            y: canvas.height - 20,
            width: 40,
            height: 20
        });
    }
}

// Create obstacle
function createObstacle() {
    const types = ['spike', 'block'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let obstacle = {
        x: canvas.width + Math.random() * 200,
        y: canvas.height - 60,
        width: 30,
        height: 30,
        type: type
    };
    
    if (type === 'spike') {
        obstacle.height = 40;
        obstacle.y = canvas.height - 40;
    }
    
    obstacles.push(obstacle);
}

// Create particle effect
function createParticles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 10,
            velocityY: (Math.random() - 0.5) * 10,
            life: 1,
            decay: 0.02
        });
    }
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life -= particle.decay;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Draw particles
function drawParticles() {
    ctx.save();
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = colors.particle;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

// Player jump
function jump() {
    if (!player.isJumping && gameRunning) {
        player.velocityY = jumpForce;
        player.isJumping = true;
        player.rotationSpeed = -10;
        createParticles(player.x + player.width/2, player.y + player.height/2, 3);
        
        // Play random jump sound
        playRandomSound('jump', 0.3);
        
        // Fallback to single jump sound if no variations exist
        if (!Object.keys(sounds).some(key => key.startsWith('jump_'))) {
            playSound('jump', 0.3);
        }
    }
}

// Update player
function updatePlayer() {
    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;
    
    // Ground collision
    if (player.y >= canvas.height - 60) {
        player.y = canvas.height - 60;
        player.velocityY = 0;
        player.isJumping = false;
    }
    
    // Update rotation
    player.rotation += player.rotationSpeed;
    player.rotationSpeed *= 0.9;
    
    // Keep rotation in bounds
    if (player.rotation > 360) player.rotation -= 360;
    if (player.rotation < 0) player.rotation += 360;
}

// Draw player
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width/2, player.y + player.height/2);
    ctx.rotate(player.rotation * Math.PI / 180);
    
    // Player body
    ctx.fillStyle = colors.player;
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    
    // Player face
    ctx.fillStyle = '#fff';
    ctx.fillRect(-player.width/3, -player.height/3, player.width/1.5, player.height/1.5);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(-player.width/4, -player.height/4, 4, 4);
    ctx.fillRect(player.width/8, -player.height/4, 4, 4);
    
    ctx.restore();
}

// Update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= gameSpeed;
        
        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            
            // Play random score sound
            playRandomSound('score', 0.2);
            
            // Fallback to single score sound if no variations exist
            if (!Object.keys(sounds).some(key => key.startsWith('score_'))) {
                playSound('score', 0.2);
            }
        }
    }
    
    // Create new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        if (Math.random() < 0.02) {
            createObstacle();
        }
    }
}

// Draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = colors.obstacle;
        
        if (obstacle.type === 'spike') {
            // Draw spike
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + obstacle.width/2, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw block
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

// Draw ground
function drawGround() {
    ctx.fillStyle = colors.ground;
    groundBlocks.forEach(block => {
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

// Update ground blocks
function updateGround() {
    groundBlocks.forEach(block => {
        block.x -= gameSpeed;
    });
    
    // Remove off-screen blocks and add new ones
    if (groundBlocks[0].x + groundBlocks[0].width < 0) {
        groundBlocks.shift();
        groundBlocks.push({
            x: groundBlocks[groundBlocks.length - 1].x + 40,
            y: canvas.height - 20,
            width: 40,
            height: 20
        });
    }
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check collisions
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            gameOver();
        }
    });
}

// Game over
function gameOver() {
    gameRunning = false;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalDistance').textContent = Math.floor(distance);
    
    // Create explosion effect
    createParticles(player.x + player.width/2, player.y + player.height/2, 20);
    
    // Play random death sound
    playRandomSound('death', 0.4);
    
    // Fallback to single death sound if no variations exist
    if (!Object.keys(sounds).some(key => key.startsWith('death_'))) {
        playSound('death', 0.4);
    }
    
    stopBackgroundMusic();
}

// Restart game
function restartGame() {
    gameRunning = true;
    score = 0;
    distance = 0;
    gameSpeed = 5;
    player.x = 100;
    player.y = canvas.height - 60;
    player.velocityY = 0;
    player.isJumping = false;
    player.rotation = 0;
    player.rotationSpeed = 0;
    obstacles = [];
    particles = [];
    initGround();
    document.getElementById('gameOver').style.display = 'none';
    
    // Start background music again
    playBackgroundMusic();
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('distance').textContent = Math.floor(distance);
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update game objects
        updatePlayer();
        updateObstacles();
        updateGround();
        updateParticles();
        
        // Check collisions
        checkCollisions();
        
        // Update distance and speed
        distance += gameSpeed * 0.1;
        gameSpeed += 0.001;
        
        // Draw everything
        drawGround();
        drawObstacles();
        drawPlayer();
        drawParticles();
        
        // Update UI
        updateUI();
    }
    
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

canvas.addEventListener('click', jump);

// Initialize and start game
initGround();
gameLoop();

// Start background music when user first interacts
document.addEventListener('click', function startAudio() {
    console.log('User clicked - starting audio...');
    if (audioContext.state === 'suspended') {
        console.log('Resuming audio context...');
        audioContext.resume();
    }
    console.log('Audio context state:', audioContext.state);
    console.log('Loaded sounds:', Object.keys(sounds));
    playBackgroundMusic();
    document.removeEventListener('click', startAudio);
}, { once: true }); 