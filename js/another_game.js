// Elements
const wordInput = document.getElementById("wordInput");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const endScreen = document.getElementById("endScreen");
const finalScore = document.getElementById("finalScore");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const seeStatsBtn = document.getElementById("seeStatsBtn");
const difficultySelect = document.getElementById("difficulty");
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Game variables
let words = ["keyboard", "javascript", "fun", "typing", "game", "explode", "score", "challenge", "fast", "win"];
let activeWords = [];
let score = 0;
let lives = 5;
let gameInterval;
let gameRunning = false;
let difficulty = "easy";

// Hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Difficulty change
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    if (gameRunning) {
        resetGame();
        startGame();
    }
});

// Game functions
function getFallSpeed() {
    switch (difficulty) {
        case "easy": return 1;
        case "medium": return 2;
        case "hard": return 3;
    }
}

function spawnWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    const wordElement = document.createElement("div");
    wordElement.classList.add("word");
    wordElement.textContent = word;
    
    const maxLeft = gameArea.clientWidth - 150;
    wordElement.style.left = `${Math.random() * maxLeft}px`;
    wordElement.style.top = "0px";
    
    gameArea.appendChild(wordElement);
    activeWords.push({
        element: wordElement,
        text: word,
        y: 0
    });
}

function updateWords() {
    const speed = getFallSpeed();
    for (let i = activeWords.length - 1; i >= 0; i--) {
        const word = activeWords[i];
        word.y += speed;
        word.element.style.top = `${word.y}px`;

        if (word.y > gameArea.clientHeight) {
            gameArea.removeChild(word.element);
            activeWords.splice(i, 1);
            loseLife();
        }
    }
}

function loseLife() {
    lives--;
    livesDisplay.textContent = "❤️".repeat(lives);
    if (lives <= 0) {
        endGame(false);
    }
}

function checkWord(input) {
    for (let i = 0; i < activeWords.length; i++) {
        if (input === activeWords[i].text) {
            createExplosion(activeWords[i].element);
            gameArea.removeChild(activeWords[i].element);
            activeWords.splice(i, 1);
            wordInput.value = "";
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            return;
        }
    }
}

function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        
        particle.style.left = `${rect.left - gameRect.left + rect.width/2}px`;
        particle.style.top = `${rect.top - gameRect.top + rect.height/2}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        
        gameArea.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }
}

function gameLoop() {
    updateWords();
    if (Math.random() < 0.03) spawnWord();
}

function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    wordInput.focus();
    gameInterval = setInterval(gameLoop, 50);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

function pauseGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetGame() {
    // Clear active words
    activeWords.forEach(word => word.element.remove());
    activeWords = [];
    
    // Reset game state
    score = 0;
    lives = 5;
    gameRunning = false;
    
    // Update UI
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = "❤️❤️❤️❤️❤️";
    wordInput.value = "";
    endScreen.classList.remove("show");
    
    // Clear intervals
    clearInterval(gameInterval);
    
    // Enable/disable buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function endGame(won) {
    gameRunning = false;
    clearInterval(gameInterval);
    
    finalScore.textContent = score;
    document.getElementById("gameResult").textContent = won ? "You Win!" : "Game Over";
    endScreen.classList.add("show");
    
    saveStats(score);
}

function saveStats(score) {
    const stats = JSON.parse(localStorage.getItem("typingStats")) || { scores: [] };
    stats.scores.push(score);
    localStorage.setItem("typingStats", JSON.stringify(stats));
}

// Event listeners
wordInput.addEventListener("input", (e) => checkWord(e.target.value));
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", () => {
    resetGame();
    startGame();
});
seeStatsBtn.addEventListener("click", () => {
    window.location.href = "stats.html";
});

// Initialize game
resetGame();