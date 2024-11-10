// Get the canvas element and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constants for game dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game Variables
let birdY = canvasHeight / 2;
let birdVelocity = 0;
let gravity = 0.5;
let jumpStrength = -10;
let isJumping = false;

// Pipe Variables
let pipes = [];
let pipeWidth = 50;
let pipeGap = 250;
let pipeSpeed = 2;

// Controls
let isGameOver = false;

// Handle Bird Movement (Jump)
document.addEventListener('click', function() {
    if (isGameOver) {
        resetGame();
    } else {
        birdVelocity = jumpStrength;
    }
});

// Bird Object
const bird = {
    width: 30,
    height: 30,
    x: 50,
    y: birdY,
    color: "yellow",
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function() {
        this.y += birdVelocity;
        birdVelocity += gravity;
    }
};

// Pipe Object
function Pipe(x) {
    this.x = x;
    this.topHeight = Math.floor(Math.random() * (canvasHeight / 2));
    this.bottomHeight = canvasHeight - this.topHeight - pipeGap;

    this.draw = function() {
        ctx.fillStyle = "green";
        // Top Pipe
        ctx.fillRect(this.x, 0, pipeWidth, this.topHeight);
        // Bottom Pipe
        ctx.fillRect(this.x, canvasHeight - this.bottomHeight, pipeWidth, this.bottomHeight);
    };

    this.update = function() {
        this.x -= pipeSpeed;
    };
}

// Game Loop
function gameLoop() {
    if (isGameOver) return;

    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    bird.update();
    bird.draw();

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvasWidth - 200) {
        pipes.push(new Pipe(canvasWidth));
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.update();
        pipe.draw();
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.topHeight || bird.y + bird.height > canvasHeight - pipe.bottomHeight) {
                isGameOver = true;
            }
        }
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }

    if (bird.y + bird.height > canvasHeight || bird.y < 0) {
        isGameOver = true;
    }

    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        displayGameOver();
    }
}

// Start a new game
function resetGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    birdY = canvasHeight / 2;
    birdVelocity = 0;
    bird.y = birdY
    pipes = [];
    isGameOver = false;
    requestAnimationFrame(gameLoop);
}

// Display Game Over Screen
function displayGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvasWidth / 4, canvasHeight / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Click to Restart", canvasWidth / 4, canvasHeight / 2 + 40);
}

// Start the game
gameLoop();