const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const loginLink = document.querySelector('.style-login');

const text = "Improve your typing while having fun";
const typingText = document.getElementById("typing-text");
const keys = document.querySelectorAll(".key");

let index = 0;

function updateUserUI() {
    const welcomeEl = document.getElementById('welcomeMessage');
    const username = localStorage.getItem('loggedInUser');

    if (username) {
        welcomeEl.textContent = `Welcome, ${username}!`;
        loginLink.textContent = "Logout";  
        loginLink.href = "#";  
        loginLink.addEventListener('click', handleLogout); 
    } else {
        welcomeEl.textContent = "Welcome, guest!";
        loginLink.textContent = "Login";
        loginLink.href = "register.html";
        loginLink.removeEventListener('click', handleLogout); 
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
