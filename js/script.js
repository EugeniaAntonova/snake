const playBoard = document.querySelector('.play-board');

let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let snakeBody = [];

let score = 0;
const scoreOutput = document.querySelector('.current-score');
const highScoreOutput = document.querySelector('.high-score');

const controls = document.querySelectorAll('.arrow');

let highScore = localStorage.getItem("high-score") || 0;
highScoreOutput.textContent = highScore;

let setIntervalId;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 29) + 1;
    foodY = Math.floor(Math.random() * 29) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert('Game over! Press OK to try again...');
    location.reload();
}

const changeDirection = (evt) => {
    const key = evt.key;
    if (key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach((control) => {
    control.addEventListener('pointerdown', () => {
        changeDirection({key: control.dataset.key})
    })
})
const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score ++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreOutput.textContent = score;
        highScoreOutput.textContent = highScore;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener('keydown', changeDirection)