import { isOverlapping } from './helpers.js';

const numbers = [];
const categories = ['Natural', 'Rational', 'Complex'];
const containers = [];

export function initMode1(gameArea) {
    gameArea.style.backgroundImage = 'url("mode1Background.png")';
    gameArea.style.backgroundSize = 'cover';
    
    categories.forEach((category, index) => {
        const container = document.createElement('div');
        container.className = 'container';
        container.style.left = `${(index + 1) * 25}%`;
        container.style.bottom = '20%';
        container.dataset.category = category;
        container.textContent = category;
        gameArea.appendChild(container);
        containers.push(container);
    });
}

export function playMode1(gameState, updateScore) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    initMode1(gameArea);
    
    function spawnNumber() {
        if (numbers.length < 5) {
            const number = createNumber();
            gameArea.appendChild(number);
            numbers.push(number);
            animateNumber(number);
        }
    }
    
    function createNumber() {
        const number = document.createElement('div');
        number.className = 'draggable';
        number.style.left = `${Math.random() * 80 + 10}%`;
        number.style.top = '0';
        
        const value = generateRandomNumber();
        number.textContent = value;
        number.dataset.value = value;
        
        number.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        return number;
    }
    
    function generateRandomNumber() {
        const rand = Math.random();
        if (rand < 0.33) {
            return Math.floor(Math.random() * 100); // Natural
        } else if (rand < 0.66) {
            return (Math.random() * 10 - 5).toFixed(2); // Rational
        } else {
            return `${Math.floor(Math.random() * 10)}+${Math.floor(Math.random() * 10)}i`; // Complex
        }
    }
    
    function animateNumber(number) {
        let pos = 0;
        const interval = setInterval(() => {
            pos += 1;
            number.style.top = `${pos}px`;
            if (pos >= gameArea.clientHeight - 60) {
                clearInterval(interval);
                gameArea.removeChild(number);
                numbers.splice(numbers.indexOf(number), 1);
            }
        }, 50);
    }
    
    let draggedElement = null;
    let offsetX, offsetY;

    function dragStart(e) {
        draggedElement = e.target;
        offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
        offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
        draggedElement.style.zIndex = 1000;
    }

    function drag(e) {
        if (draggedElement) {
            const gameAreaRect = gameArea.getBoundingClientRect();
            let newX = e.clientX - gameAreaRect.left - offsetX;
            let newY = e.clientY - gameAreaRect.top - offsetY;
            
            newX = Math.max(0, Math.min(newX, gameAreaRect.width - draggedElement.offsetWidth));
            newY = Math.max(0, Math.min(newY, gameAreaRect.height - draggedElement.offsetHeight));
            
            draggedElement.style.left = `${newX}px`;
            draggedElement.style.top = `${newY}px`;
        }
    }

    function dragEnd() {
        if (draggedElement) {
            const category = getCategory(draggedElement.dataset.value);
            const container = containers.find(c => c.dataset.category === category);
            
            if (isOverlapping(draggedElement, container)) {
                updateScore(1);
                gameArea.removeChild(draggedElement);
                numbers.splice(numbers.indexOf(draggedElement), 1);
            }
            
            draggedElement.style.zIndex = '';
            draggedElement = null;
        }
    }
    
    function getCategory(value) {
        if (!isNaN(value) && Number.isInteger(Number(value)) && Number(value) >= 0) {
            return 'Natural';
        } else if (!isNaN(value)) {
            return 'Rational';
        } else {
            return 'Complex';
        }
    }
    
    const spawnInterval = setInterval(spawnNumber, 2000);
    
    return () => {
        clearInterval(spawnInterval);
        numbers.forEach(number => gameArea.removeChild(number));
        numbers.length = 0;
    };
}
