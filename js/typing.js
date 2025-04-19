const difficultySelect = document.getElementById("difficulty-select");
const durationSelect = document.getElementById("duration-select");
const restartBtn = document.getElementById("restart-btn");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timerDisplay = document.getElementById("timer");
const wordsContainer = document.getElementById("word-display");
const inputField = document.getElementById("word-input");
const restartOverlay = document.getElementById("restart-overlay");
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

const wordLists = {
    easy: ["apple", "banana", "grape", "orange", "cherry", "love", "cat", "dog", "hat", "sun", "run", "fun", "yes", "no", "toy", "bat", "pen"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery", "window", "bottle", "forest", "orange", "super", "rocket", "planet", "flower", "castle"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "dictionary", "javascript", "complexity", "evaluation", "Typescript", "perception", "architecture"]
};

let words = [];
let currentWordIndex = 0;
let timer;
let timeLeft = 0;
let totalTyped = 0;
let correctTyped = 0;
let gameStarted = false;
let selectedDuration = 60;
let timerStarted = false;
let startTime = null;
let previousEndTime = null;
let totalCharactersTyped = 0;
let correctCharactersTyped = 0;

let isLoggedIn = false;
let username = '';

function initGame() {
    words = generateWords(difficultySelect.value);
    selectedDuration = +durationSelect.value;
    timeLeft = selectedDuration;
    currentWordIndex = 0;
    totalTyped = 0;
    correctTyped = 0;
    totalCharactersTyped = 0;
    correctCharactersTyped = 0;
    startTime = null;
    previousEndTime = null;
    gameStarted = true;
    timerStarted = false;

    displayWords();
    inputField.value = "";
    inputField.disabled = false;
    inputField.focus();
    updateTimerDisplay();
    updateStats();

    highlightCurrentCharacter();

    if (timer) clearInterval(timer);
}

function generateWords(difficulty) {
    const wordList = wordLists[difficulty];
    const generated = [];
    const wordCount = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 40 : 30;

    for (let i = 0; i < wordCount; i++) {
        generated.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return generated;
}

function displayWords() {
    wordsContainer.innerHTML = "";
    words.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        
        for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement("span");
            charSpan.textContent = word[i];
            charSpan.classList.add("char");
            wordSpan.appendChild(charSpan);
        }
        
        const spaceSpan = document.createElement("span");
        spaceSpan.textContent = " ";
        wordSpan.appendChild(spaceSpan);
        
        wordsContainer.appendChild(wordSpan);
    });
}

function startTimer() {
    if (!startTime) startTime = Date.now();
    if (!timerStarted) {
        timerStarted = true;
        timer = setInterval(updateGameTimer, 1000);
    }
}

function updateGameTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        endGame();
    }
}

function updateTimerDisplay() {
    timerDisplay.textContent = timeLeft + "s";
}

function calculateWPM() {
    if (!startTime) return 0;

    const elapsedMinutes = (selectedDuration - timeLeft) / 60;
    return Math.round((correctCharactersTyped / 5) / Math.max(elapsedMinutes, 0.1));
}

function calculateAccuracy() {
    if (totalCharactersTyped === 0) return 0;
    return Math.round((correctCharactersTyped / totalCharactersTyped) * 100);
}

function updateStats() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + "%";
}

function highlightCurrentCharacter() {
    const currentWord = words[currentWordIndex];
    const typedWord = inputField.value;
    const wordElements = wordsContainer.querySelectorAll(".word");
    const currentWordElement = wordElements[currentWordIndex];
    const charElements = currentWordElement.querySelectorAll(".char");

    document.querySelectorAll('.char').forEach(char => {
        char.classList.remove("correct-char", "incorrect-char", "current-char");
    });

    for (let i = 0; i < typedWord.length; i++) {
        if (i < currentWord.length) {
            if (typedWord[i] === currentWord[i]) {
                charElements[i].classList.add("correct-char");
            } else {
                charElements[i].classList.add("incorrect-char");
            }
        }
    }

    if (typedWord.length < currentWord.length) {
        charElements[typedWord.length].classList.add("current-char");
    }
}

function handleInput() {
    const typedWord = inputField.value;
    const currentWord = words[currentWordIndex];

    totalCharactersTyped = 0;
    correctCharactersTyped = 0;
    
    for (let i = 0; i < typedWord.length; i++) {
        totalCharactersTyped++;
        if (i < currentWord.length && typedWord[i] === currentWord[i]) {
            correctCharactersTyped++;
        }
    }

    highlightCurrentCharacter();
    updateStats();
}

function handleWordCompletion() {
    const typedWord = inputField.value.trim();
    const currentWord = words[currentWordIndex];
    const wordElements = wordsContainer.querySelectorAll(".word");
    const currentWordElement = wordElements[currentWordIndex];
    const charElements = currentWordElement.querySelectorAll(".char");

    totalTyped++;

    const isCorrect = typedWord === currentWord;
    charElements.forEach((char, i) => {
        if (i < typedWord.length) {
            if (typedWord[i] === currentWord[i]) {
                char.classList.add("correct-char");
            } else {
                char.classList.add("incorrect-char");
            }
        } else if (i < currentWord.length) {
            char.classList.add(isCorrect ? "correct-char" : "incorrect-char");
        }
    });

    if (isCorrect) {
        currentWordElement.classList.add("correct-word");
        correctTyped++;
        correctCharactersTyped += (currentWord.length - typedWord.length);
    } else {
        currentWordElement.classList.add("incorrect-word");
    }

    currentWordIndex++;
    previousEndTime = Date.now();
    inputField.value = "";

    if (currentWordIndex >= wordElements.length) {
        endGame();
    } else {
        // Mettre en surbrillance le premier caractère du mot suivant
        const nextWordElement = wordElements[currentWordIndex];
        const nextCharElements = nextWordElement.querySelectorAll(".char");
        if (nextCharElements.length > 0) {
            nextCharElements[0].classList.add("current-char");
        }
    }

    updateStats();
}

function endGame() {
    clearInterval(timer);
    inputField.disabled = true;
    showRestartOverlay();
}

function showRestartOverlay() {
    restartOverlay.textContent = `Time's up! Your score: ${wpmDisplay.textContent} WPM (${accuracyDisplay.textContent} accuracy)`;
    restartOverlay.classList.add("visible");
    setTimeout(() => {
        restartOverlay.classList.remove("visible");
        initGame();
    }, 3000);
}

inputField.addEventListener("input", handleInput);
inputField.addEventListener("keydown", (e) => {
    if (!gameStarted) return;

    startTimer();

    if (e.key === " " && inputField.value.trim()) {
        handleWordCompletion();
        e.preventDefault();
    }
});

restartBtn.addEventListener("click", initGame);
difficultySelect.addEventListener("change", initGame);
durationSelect.addEventListener("change", initGame);

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

window.addEventListener("load", initGame);

function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        isLoggedIn = true;
        username = userData.username;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authButton = document.getElementById('auth-button');
    const usernameDisplay = document.getElementById('username-display');
    
    if (isLoggedIn) {
        authButton.textContent = 'Logout';
        authButton.classList.remove('style-login');
        authButton.classList.add('style-logout');
        usernameDisplay.textContent = username;
        usernameDisplay.classList.add('visible');
    } else {
        authButton.textContent = 'Login';
        authButton.classList.add('style-login');
        authButton.classList.remove('style-logout');
        usernameDisplay.classList.remove('visible');
    }
}

function handleAuthClick(e) {
    if (isLoggedIn) {
        // Déconnexion
        e.preventDefault();
        localStorage.removeItem('currentUser');
        isLoggedIn = false;
        username = '';
        updateAuthUI();
    }
}

document.getElementById('auth-button').addEventListener('click', handleAuthClick);

window.addEventListener('load', () => {
    initGame();
    checkLoginStatus();
});