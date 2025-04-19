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
    if (!startTime || timeLeft === selectedDuration) return 0;

    const elapsedTime = (Date.now() - startTime) / 1000;
    const elapsedMinutes = elapsedTime / 60;

    const wordsTyped = correctCharactersTyped / 5;
    const wpm = Math.round(wordsTyped / elapsedMinutes);

    return isNaN(wpm) ? 0 : wpm;
}

function calculateAccuracy() {
    if (totalCharactersTyped === 0) return 0;
    const accuracy = Math.round((correctCharactersTyped / totalCharactersTyped) * 100);
    return Math.min(accuracy, 100);
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

function updateLoginDisplay() {
    const userGreeting = document.getElementById('user-greeting');
    const loginLink = document.querySelector('.style-login');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
        userGreeting.textContent = `Hello, ${loggedInUser}`;
        userGreeting.style.display = 'block';
        loginLink.textContent = 'Logout';
        loginLink.classList.add('style-logout');
        loginLink.classList.remove('style-login');
        loginLink.href = '#';
        loginLink.addEventListener('click', handleLogout);
    } else {
        userGreeting.style.display = 'none';
        loginLink.textContent = 'Login';
        loginLink.classList.add('style-login');
        loginLink.classList.remove('style-logout');
        loginLink.href = 'register.html';
        loginLink.removeEventListener('click', handleLogout);
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    updateLoginDisplay();
    window.location.href = 'index.html';
}

window.addEventListener('load', () => {
    initGame();
    updateLoginDisplay();
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.classList.contains('style-logout')) {
            handleLogout(e);
        } else {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

function showRestartOverlay() {
    console.log("Showing restart overlay");
    restartOverlay.innerHTML = `
        <p>Great job! Your score: ${wpmDisplay.textContent} WPM (${accuracyDisplay.textContent} accuracy)</p>
        <div class="overlay-buttons">
            <button id="view-stats-btn" class="action-btn">View Statistics</button>
            <button id="try-again-btn" class="action-btn secondary">Try Again</button>
        </div>
    `;
    restartOverlay.classList.add("visible");
    console.log("Overlay should be visible now");

    try {
        storeTestResults();
    } catch (error) {
        console.error("Error storing test results:", error);
    }

    const viewStatsBtn = document.getElementById('view-stats-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');

    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', () => {
            console.log("View Stats button clicked");
            window.location.href = "stats_typing.html";
        });
    }

    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', () => {
            console.log("Try Again button clicked");
            restartOverlay.classList.remove("visible");
            initGame();
        });
    }
}

function storeTestResults() {
    let stats;
    try {
        stats = JSON.parse(localStorage.getItem('typingStats'));
        if (!stats || typeof stats !== 'object') {
            stats = {
                tests: [],
                bestWpm: 0,
                totalCharacters: 0,
                correctCharacters: 0
            };
        }

        if (!Array.isArray(stats.tests)) {
            stats.tests = [];
        }

        const newTest = {
            wpm: parseInt(wpmDisplay.textContent) || 0,
            accuracy: parseInt(accuracyDisplay.textContent) || 0,
            date: new Date().toISOString(),
            charactersTyped: totalCharactersTyped || 0,
            correctCharacters: correctCharactersTyped || 0
        };

        stats.tests.push(newTest);

        if (newTest.wpm > (stats.bestWpm || 0)) {
            stats.bestWpm = newTest.wpm;
        }

        stats.totalCharacters = (stats.totalCharacters || 0) + (totalCharactersTyped || 0);
        stats.correctCharacters = (stats.correctCharacters || 0) + (correctCharactersTyped || 0);

        localStorage.setItem('typingStats', JSON.stringify(stats));
        console.log("Test results stored successfully", stats);
    } catch (error) {
        console.error("Error in storeTestResults:", error);
        stats = {
            tests: [{
                wpm: parseInt(wpmDisplay.textContent) || 0,
                accuracy: parseInt(accuracyDisplay.textContent) || 0,
                date: new Date().toISOString(),
                charactersTyped: totalCharactersTyped || 0,
                correctCharacters: correctCharactersTyped || 0
            }],
            bestWpm: parseInt(wpmDisplay.textContent) || 0,
            totalCharacters: totalCharactersTyped || 0,
            correctCharacters: correctCharactersTyped || 0
        };
        localStorage.setItem('typingStats', JSON.stringify(stats));
    }
}