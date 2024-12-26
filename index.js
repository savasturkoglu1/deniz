// Canvas ve context'i al
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun değişkenleri güncellendi
let snake = [
    { x: 200, y: 200 },
];
let food = { x: 0, y: 0 };
let dx = 10;
let dy = 0;
const gridSize = 10;
let score = 0;
let gameOver = false;
let level = 1;
let foodEaten = 0;
let obstacles = [];

// Engelleri oluştur
function createObstacles(level) {
    obstacles = [];
    switch(level) {
        case 1:
            // İlk level için basit engeller
            obstacles.push(
                {x: 100, y: 100, width: 50, height: 10},
                {x: 250, y: 300, width: 50, height: 10}
            );
            break;
        case 2:
            // İkinci level için L şeklinde engeller
            obstacles.push(
                {x: 100, y: 100, width: 100, height: 10},
                {x: 100, y: 100, width: 10, height: 100},
                {x: 300, y: 200, width: 10, height: 100}
            );
            break;
        case 3:
            // Üçüncü level için çapraz engeller
            obstacles.push(
                {x: 50, y: 50, width: 100, height: 10},
                {x: 250, y: 250, width: 100, height: 10},
                {x: 150, y: 150, width: 100, height: 10},
                {x: 350, y: 350, width: 10, height: 50}
            );
            break;
    }
}

// Level'ı yükselt
function nextLevel() {
    level++;
    if (level > 3) level = 1; // 3 level döngüsü
    foodEaten = 0;
    snake = [{ x: 200, y: 200 }];
    dx = 10;
    dy = 0;
    createObstacles(level);
    placeFood();
    // Arka plan rengini değiştir
    document.body.style.backgroundColor = level === 1 ? '#fff' : level === 2 ? '#f0f0f0' : '#e0e0e0';
}

// Yiyeceği rastgele konuma yerleştir
function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        
        // Engellerin üzerine yiyecek koymamak için kontrol
        validPosition = !obstacles.some(obstacle => 
            food.x >= obstacle.x && 
            food.x < obstacle.x + obstacle.width &&
            food.y >= obstacle.y && 
            food.y < obstacle.y + obstacle.height
        );
    }
}

// Oyunu çiz
function draw() {
    // Canvası temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Engelleri çiz
    ctx.fillStyle = '#666';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Yılanı çiz
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Yiyeceği çiz
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Skoru ve leveli göster
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Skor: ' + score + ' Level: ' + level + ' Yem: ' + foodEaten + '/7', 10, 30);
}

// Oyunu güncelle
function update() {
    if (gameOver) return;

    // Yılanın yeni başını hesapla
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Engellere çarpma kontrolü
    const hitObstacle = obstacles.some(obstacle => {
        return head.x >= obstacle.x && 
               head.x < obstacle.x + obstacle.width &&
               head.y >= obstacle.y && 
               head.y < obstacle.y + obstacle.height;
    });

    if (hitObstacle) {
        gameOver = true;
        alert('Engele çarptınız! Oyun Bitti! Skorunuz: ' + score);
        return;
    }

    // Yiyecek yendi mi kontrol et
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        foodEaten++;
        
        if (foodEaten >= 7) {
            alert('Tebrikler! Level ' + level + ' tamamlandı!');
            nextLevel();
        } else {
            placeFood();
        }
    } else {
        snake.pop();
    }

    // Çarpışma kontrolü
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        alert('Oyun Bitti! Skorunuz: ' + score);
        return;
    }
}

// Klavye kontrollerini dinle
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -gridSize; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = gridSize; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -gridSize; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = gridSize; dy = 0; }
            break;
    }
});

// Oyunu başlat
createObstacles(level);
placeFood();
setInterval(() => {
    update();
    draw();
}, 100);
