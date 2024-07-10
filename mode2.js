let numbers = [];
const operations = ['isEven', 'isPrime'];
let notModifier = null;

export function initMode2(gameArea) {
    operations.forEach((op, index) => {
        const container = document.createElement('div');
        container.className = 'container';
        container.style.left = `${(index + 1) * 33}%`;
        container.style.bottom = '20%';
        container.dataset.operation = op;
        gameArea.appendChild(container);
    });

    const craftButton = document.createElement('button');
    craftButton.textContent = 'Craft';
    craftButton.style.position = 'absolute';
    craftButton.style.bottom = '5%';
    craftButton.style.left = '50%';
    craftButton.style.transform = 'translateX(-50%)';
    craftButton.addEventListener('click', craftIngredient);
    gameArea.appendChild(craftButton);

    createNotModifier(gameArea);
}

export function playMode2(gameState, updateScore) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    initMode2(gameArea);
    
    function spawnNumber() {
        if (numbers.length < 10) {
            const number = createNumber();
            gameArea.appendChild(number);
            numbers.push(number);
        }
    }
    
    function createNumber() {
        const number = document.createElement('div');
        number.className = 'draggable number';
        number.style.left = `${Math.random() * 80 + 10}%`;
        number.style.top = `${Math.random() * 30 + 60}%`;
        
        const value = generateRandomNumber();
        number.textContent = value;
        number.dataset.value = value;
        
        const hammer = new Hammer(number);
        hammer.on('pan', handlePan);
        
        return number;
    }
    
    function generateRandomNumber() {
        const rand = Math.random();
        if (rand < 0.4) return Math.floor(Math.random() * 100);
        if (rand < 0.7) return (Math.random() * 10 - 5).toFixed(2);
        if (rand < 0.85) return `√${Math.floor(Math.random() * 20) + 1}`;
        return `${Math.floor(Math.random() * 10)}+${Math.floor(Math.random() * 10)}i`;
    }
    
    function handlePan(event) {
        const element = event.target;
        const posX = event.center.x - gameArea.offsetLeft - 25;
        const posY = event.center.y - gameArea.offsetTop - 25;
        
        element.style.left = `${posX}px`;
        element.style.top = `${posY}px`;
        
        if (event.isFinal) {
            const containers = Array.from(document.querySelectorAll('.container'));
            const container = containers.find(c => isOverlapping(element, c));
            
            if (container) {
                snapToContainer(element, container);
            } else if (element.classList.contains('not') && !element.parentElement.classList.contains('container')) {
                gameArea.removeChild(element);
                createNotModifier(gameArea);
            }
        }
    }
    
    function snapToContainer(element, container) {
        const rect = container.getBoundingClientRect();
        element.style.left = `${rect.left + 5}px`;
        element.style.top = `${rect.top + 5}px`;
        container.appendChild(element);
    }
    
    function isOverlapping(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        return !(rect1.right < rect2.left || rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }
    
    function createNotModifier(gameArea) {
        notModifier = document.createElement('div');
        notModifier.className = 'draggable not';
        notModifier.textContent = 'NOT';
        notModifier.style.left = '10%';
        notModifier.style.top = '10%';
        
        const hammer = new Hammer(notModifier);
        hammer.on('pan', handlePan);
        
        gameArea.appendChild(notModifier);
    }
    
    function craftIngredient() {
        const containers = Array.from(document.querySelectorAll('.container'));
        const values = containers.map(container => {
            const number = container.querySelector('.number');
            const not = container.querySelector('.not');
            return {
                value: number ? parseFloat(number.dataset.value) : null,
                not: !!not,
                operation: container.dataset.operation
            };
        });
        
        if (values.every(v => v.value !== null)) {
            const result = evaluateOperation(values[0], values[1]);
            if (result) {
                updateScore(5);
            }
        }
        
        resetContainers(containers);
    }
    
    function evaluateOperation(v1, v2) {
        const isEven = (n) => n % 2 === 0;
        const isPrime = (n) => {
            if (n <= 1) return false;
            for (let i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0) return false;
            }
            return true;
        };
        
        const r1 = v1.not ? !v1.operation(v1.value) : v1.operation(v1.value);
        const r2 = v2.not ? !v2.operation(v2.value) : v2.operation(v2.value);
        
        return r1 && r2;
    }
    
    function resetContainers(containers) {
        containers.forEach(container => {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        });
    }
    
    const spawnInterval = setInterval(spawnNumber, 2000);
    
    return () => {
        clearInterval(spawnInterval);
        numbers.forEach(number => gameArea.removeChild(number));
        numbers.length = 0;
    };
}
