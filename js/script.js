const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const loginLink = document.querySelector('.style-login');
const usernameDisplay = document.getElementById('username-display');

const text = "Improve your typing while having fun";
const typingText = document.getElementById("typing-text");
const keys = document.querySelectorAll(".key");

let index = 0;

function updateUserUI() {
    const welcomeEl = document.getElementById('welcomeMessage');
    const usernameDisplay = document.getElementById('username-display');
    const authButton = document.getElementById('auth-button');
    const username = localStorage.getItem('loggedInUser');

    if (username) {
        welcomeEl.textContent = `Welcome, ${username}!`;
        usernameDisplay.textContent = `Hello, ${username}`;
        usernameDisplay.classList.add('visible');
        authButton.textContent = "Logout";  
        authButton.classList.add('style-logout');
        authButton.classList.remove('style-login');
        authButton.href = "#";  
        authButton.addEventListener('click', handleLogout); 
    } else {
        welcomeEl.textContent = "Welcome, guest!";
        usernameDisplay.classList.remove('visible');
        authButton.textContent = "Login";
        authButton.classList.add('style-login');
        authButton.classList.remove('style-logout');
        authButton.href = "register.html";
        authButton.removeEventListener('click', handleLogout); 
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    updateUserUI();
    window.location.href = "index.html";
}

function highlightKey(char) {
    const lowerChar = char.toLowerCase();
    const key = document.querySelector(`.key[data-key="${lowerChar}"]`);
    if (key) {
        key.classList.add("active");
        setTimeout(() => {
            key.classList.remove("active");
        }, 100);
    }
}

function typeNextCharacter() {
    if (index < text.length) {
        const currentChar = text[index];
        typingText.textContent += currentChar;
        highlightKey(currentChar);
        index++;
        setTimeout(typeNextCharacter, 100);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    typingText.textContent = "";
    typeNextCharacter();

    updateUserUI();

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
});