const numbers = [];
const categories = ['Natural', 'Rational', 'Complex'];
const containers = [];

export function initMode1(gameArea) {
    categories.forEach((category, index) => {
        const container = document.createElement('div');
        container.className = 'container';
        container.style.left = `${(index + 1) * 25}%`;
        container.style.bottom = '20%';
        container.dataset.category = category;
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
        
        const hammer = new Hammer(number);
        hammer.on('pan', handlePan);
        
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
    
    function handlePan(event) {
        const number = event.target;
        const posX = event.center.x - gameArea.offsetLeft - 25;
        const posY = event.center.y - gameArea.offsetTop - 25;
        
        number.style.left = `${posX}px`;
        number.style.top = `${posY}px`;
        
        if (event.isFinal) {
            const category = getCategory(number.dataset.value);
            const container = containers.find(c => c.dataset.category === category);
            
            if (isOverlapping(number, container)) {
                updateScore(1);
                gameArea.removeChild(number);
                numbers.splice(numbers.indexOf(number), 1);
            }
        }
    }
    
    function getCategory(value) {
        if (!isNaN(value) && Number.isInteger(Number(value))) {
            return 'Natural';
        } else if (!isNaN(value)) {
            return 'Rational';
        } else {
            return 'Complex';
        }
    }
    
    function isOverlapping(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
    
    const spawnInterval = setInterval(spawnNumber, 2000);
    
    return () => {
        clearInterval(spawnInterval);
        numbers.forEach(number => gameArea.removeChild(number));
        numbers.length = 0;
    };
}
