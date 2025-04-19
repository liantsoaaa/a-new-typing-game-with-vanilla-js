document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.querySelector('input[type="submit"]');
    const usernameInput = document.getElementById('username');
    const emailInput = document.querySelector('.mail input');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const messageBox = document.createElement('div');
    
    messageBox.style.display = 'none';
    messageBox.style.marginTop = '15px';
    messageBox.style.fontSize = '14px';
    messageBox.style.fontWeight = 'bold';
    messageBox.style.opacity = '0';
    messageBox.style.transition = 'opacity 0.5s ease';
    messageBox.classList.add('message-box');
    document.querySelector('.forms').prepend(messageBox);

    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            updateAuthUI(loggedInUser);
        }
    }

    function updateAuthUI(username) {
        const authButton = document.getElementById('auth-button');
        const usernameDisplay = document.getElementById('username-display');
        
        if (username) {
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

    document.getElementById('auth-button').addEventListener('click', function(e) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            updateAuthUI(null);
            window.location.href = "register.html";
        }
    });

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    signInButton.addEventListener("click", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        messageBox.innerHTML = '';
        messageBox.style.display = 'block';

        if (!username || !email || !password) {
            showMessage("All fields are required!", 'red');
            return;
        }

        localStorage.setItem('loggedInUser', username);
        updateAuthUI(username);

        showMessage(`Welcome, ${username}! Redirecting to the game...`, 'green', true);

        setTimeout(() => {
            window.location.href = "../html/index.html";
        }, 3000);
    });

    function showMessage(message, color, withSpinner = false) {
        messageBox.style.color = color;
        
        if (withSpinner) {
            const spinner = document.createElement('span');
            spinner.classList.add('loader');
            spinner.style.marginRight = '8px';
            messageBox.appendChild(spinner);
        }

        const messageText = document.createElement('span');
        messageText.textContent = message;
        messageBox.appendChild(messageText);

        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 100);
    }

    checkLoginStatus();
});