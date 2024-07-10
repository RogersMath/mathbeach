import { initMode1, playMode1 } from './mode1.js';
import { initMode2, playMode2 } from './mode2.js';

const gameState = {
    currentMode: 0,
    score: 0,
    timeRemaining: 60,
    gameInterval: null
};

const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const summaryScreen = document.getElementById('summary-screen');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again-button');
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const gameArea = document.getElementById('game-area');

const backgroundMusic = new Audio('backgroundMusic.mp3');
backgroundMusic.loop = true;

function initGame() {
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', resetGame);
    initMode1(gameArea);
    initMode2(gameArea);
}

function startGame() {
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    backgroundMusic.play();
    startMode(1);
}

function startMode(mode) {
    gameState.currentMode = mode;
    gameState.timeRemaining = 60;
    clearInterval(gameState.gameInterval);
    
    if (mode === 1) {
        gameArea.style.backgroundImage = 'url("mode1Background.png")';
        playMode1(gameState, updateScore);
    } else {
        gameArea.style.backgroundImage = 'url("mode2Background.png")';
        playMode2(gameState, updateScore);
    }
    
    gameState.gameInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    gameState.timeRemaining--;
    timerValue.textContent = gameState.timeRemaining;
    
    if (gameState.timeRemaining <= 0) {
        if (gameState.currentMode === 1) {
            startMode(2);
        } else {
            endGame();
        }
    }
}

function updateScore(points) {
    gameState.score += points;
    scoreValue.textContent = gameState.score;
    new Audio('success.mp3').play();
}

function endGame() {
    clearInterval(gameState.gameInterval);
    gameScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
    document.getElementById('final-score').textContent = gameState.score;
    backgroundMusic.pause();
}

function resetGame() {
    gameState.score = 0;
    scoreValue.textContent = '0';
    summaryScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
}

initGame();
