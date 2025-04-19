document.addEventListener("DOMContentLoaded", function () {
    updateLoginDisplay();

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    loadStats();

    document.getElementById('backToGame').addEventListener('click', () => {
        window.location.href = 'another_game.html';
    });

    document.getElementById('resetStats').addEventListener('click', resetStats);
});

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
    window.location.href = '../index.html';
}

function loadStats() {
    const stats = JSON.parse(localStorage.getItem("typingStats")) || { scores: [] };
    const scores = stats.scores;

    document.getElementById('total-games').textContent = scores.length;
    document.getElementById('high-score').textContent = scores.length > 0 ? Math.max(...scores) : 0;
    document.getElementById('average-score').textContent = scores.length > 0 ?
        Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    document.getElementById('last-score').textContent = scores.length > 0 ? scores[scores.length - 1] : 0;

    createChart(scores);
}

function createChart(scores) {
    const ctx = document.getElementById('scoreChart').getContext('2d');

    const lineColor = (ctx) => {
        const score = scores[ctx.dataIndex] || 0;
        if (score >= 50) return '#4CAF50';
        if (score >= 30) return '#FFC107';
        return '#F44336';
    };

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: scores.map((_, i) => `Game ${i + 1}`),
            datasets: [{
                label: 'Score',
                data: scores,
                borderColor: scores.map((_, i) => lineColor({ dataIndex: i })),
                backgroundColor: 'rgba(223, 37, 49, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                pointBackgroundColor: scores.map((_, i) => lineColor({ dataIndex: i })),
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Score: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

function resetStats() {
    if (confirm('Are you sure you want to reset all your game statistics? This cannot be undone.')) {
        localStorage.setItem("typingStats", JSON.stringify({ scores: [] }));
        loadStats();
    }
}