// Get canvas and context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Define game objects
const paddleWidth = 10, paddleHeight = 80;
const ballSize = 10;
let upPressed = false, downPressed = false;
let wPressed = false, sPressed = false;

// Define paddles
const player1 = { x: 10, y: (canvas.height - paddleHeight) / 2, score: 0 };
const player2 = { x: canvas.width - paddleWidth - 10, y: (canvas.height - paddleHeight) / 2, score: 0 };

// Define ball
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4 };

// Draw paddle
function drawPaddle(x, y) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
    ctx.fillStyle = "white";
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
}

// Draw scoreboard
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillText(`Player 1: ${player1.score}`, 50, 30);
    ctx.fillText(`Player 2: ${player2.score}`, canvas.width - 150, 30);
}

// Move paddles
function movePaddles() {
    if (wPressed && player1.y > 0) player1.y -= 6;
    if (sPressed && player1.y < canvas.height - paddleHeight) player1.y += 6;
    
    // AI Movement (Simple AI)
    if (ball.dx > 0) {
        if (player2.y + paddleHeight / 2 < ball.y) player2.y += 4;
        else if (player2.y + paddleHeight / 2 > ball.y) player2.y -= 4;
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) ball.dy *= -1;

    // Ball collision with paddles
    if (ball.x <= player1.x + paddleWidth && ball.y > player1.y && ball.y < player1.y + paddleHeight) {
        ball.dx *= -1;
        ball.x = player1.x + paddleWidth; // Prevents ball sticking
    }
    if (ball.x + ballSize >= player2.x && ball.y > player2.y && ball.y < player2.y + paddleHeight) {
        ball.dx *= -1;
        ball.x = player2.x - ballSize;
    }

    // Check for scoring
    if (ball.x <= 0) {
        player2.score++;
        resetBall();
    }
    if (ball.x >= canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.dx > 0 ? 4 : -4;
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawPaddle(player1.x, player1.y);
    drawPaddle(player2.x, player2.y);
    drawBall();
}

// Update game
function update() {
    movePaddles();
    moveBall();
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Key event listeners
document.addEventListener("keydown", (event) => {
    if (event.key === "w") wPressed = true;
    if (event.key === "s") sPressed = true;
});
document.addEventListener("keyup", (event) => {
    if (event.key === "w") wPressed = false;
    if (event.key === "s") sPressed = false;
});

// Start game
gameLoop();
