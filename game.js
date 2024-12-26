const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const plane = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 5
};

let obstacles = [];
let gameOver = false;
let score = 0;

// Engel oluşturma
function createObstacle() {
    return {
        x: Math.random() * (canvas.width - 30),
        y: -20,
        width: 30,
        height: 30,
        speed: 3
    };
}

// Tuş kontrollerini dinleme
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Uçağı hareket ettirme
function movePlane() {
    if (keys['ArrowLeft'] && plane.x > 0) {
        plane.x -= plane.speed;
    }
    if (keys['ArrowRight'] && plane.x < canvas.width - plane.width) {
        plane.x += plane.speed;
    }
}

// Çarpışma kontrolü
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);

function handleTouch(event) {
    event.preventDefault(); // Prevent scrolling when touching the canvas
    
    const touch = event.touches[0];
    const canvasRect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    
    // If touch is on the right half of the screen, move right
    if (touchX > canvas.width / 2) {
        plane.dx = 5; // Move right
    }
    // If touch is on the left half of the screen, move left
    else {
        plane.dx = -5; // Move left
    }
}

// Add touchend event to stop movement when user stops touching
canvas.addEventListener('touchend', function() {
    plane.dx = 0;
});

// Oyun döngüsü
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Oyun Bitti! Skor: ' + score, canvas.width/4, canvas.height/2);
        return;
    }

    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Uçağı çiz
    ctx.fillStyle = 'red';
    ctx.fillRect(plane.x, plane.y, plane.width, plane.height);

    // Engelleri yönet
    if (Math.random() < 0.02) {
        obstacles.push(createObstacle());
    }

    // Engelleri hareket ettir ve çiz
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Çarpışma kontrolü
        if (checkCollision(plane, obstacle)) {
            gameOver = true;
        }

        // Ekrandan çıkan engelleri sil ve skor ekle
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
        }
    });

    // Skoru göster
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Skor: ' + score, 10, 30);

    movePlane();
    requestAnimationFrame(gameLoop);
}

gameLoop(); 