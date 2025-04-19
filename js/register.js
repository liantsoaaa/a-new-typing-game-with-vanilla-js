    document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.querySelector('input[type="submit"]');
    const usernameInput = document.getElementById('username');
    const emailInput = document.querySelector('.mail input');
    const passwordInput = document.querySelector('.password input');
    const messageBox = document.createElement('div');
    
    
    messageBox.style.display = 'none';
    messageBox.style.marginTop = '15px';
    messageBox.style.fontSize = '14px';
    messageBox.style.fontWeight = 'bold';
    messageBox.style.opacity = '0';
    messageBox.style.transition = 'opacity 0.5s ease';
    messageBox.classList.add('message-box');
    document.querySelector('.forms').prepend(messageBox);

    signInButton.addEventListener("click", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        messageBox.innerHTML = '';
        messageBox.style.display = 'block';

        if (!username || !email || !password) {
            messageBox.style.color = 'red';
            messageBox.textContent = "All fields are required!";
            messageBox.style.opacity = '1';
            return;
        }

        localStorage.setItem('loggedInUser', username);

        messageBox.style.color = 'green';

        const spinner = document.createElement('span');
        spinner.classList.add('loader');
        spinner.style.marginRight = '8px';

        const messageText = document.createElement('span');
        messageText.textContent = `Welcome, ${username}! Redirecting to the game...`;

        messageBox.appendChild(spinner);
        messageBox.appendChild(messageText);

        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            window.location.href = "../html/index.html";
        }, 3000);
    });
});
