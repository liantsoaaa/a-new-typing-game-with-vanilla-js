document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('stats-chart').getContext('2d');
    let statsChart = null;

    const lastWpmElement = document.getElementById('last-wpm');
    const lastAccuracyElement = document.getElementById('last-accuracy');
    const bestWpmElement = document.getElementById('best-wpm');
    const totalTestsElement = document.getElementById('total-tests');
    const averageWpmElement = document.getElementById('average-wpm');
    const averageAccuracyElement = document.getElementById('average-accuracy');
    const totalCharactersElement = document.getElementById('total-characters');
    const correctCharactersElement = document.getElementById('correct-characters');
    const incorrectCharactersElement = document.getElementById('incorrect-characters');
    const newTestBtn = document.getElementById('new-test-btn');
    const clearStatsBtn = document.getElementById('clear-stats-btn');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    let stats = JSON.parse(localStorage.getItem('typingStats')) || {
        tests: [],
        bestWpm: 0,
        totalCharacters: 0,
        correctCharacters: 0
    };

    function initStatsPage() {
        updateLoginDisplay();
        updateStatsDisplay();
        renderChart();
        setupEventListeners();
    }

    function updateStatsDisplay() {
        if (stats.tests.length > 0) {
            const lastTest = stats.tests[stats.tests.length - 1];
            lastWpmElement.textContent = lastTest.wpm;
            lastAccuracyElement.textContent = `${lastTest.accuracy}%`;

            const totalWpm = stats.tests.reduce((sum, test) => sum + test.wpm, 0);
            const totalAccuracy = stats.tests.reduce((sum, test) => sum + test.accuracy, 0);
            const avgWpm = Math.round(totalWpm / stats.tests.length);
            const avgAccuracy = Math.round(totalAccuracy / stats.tests.length);

            bestWpmElement.textContent = stats.bestWpm;
            totalTestsElement.textContent = stats.tests.length;
            averageWpmElement.textContent = avgWpm;
            averageAccuracyElement.textContent = `${avgAccuracy}%`;
            totalCharactersElement.textContent = stats.totalCharacters;
            correctCharactersElement.textContent = stats.correctCharacters;
            incorrectCharactersElement.textContent = stats.totalCharacters - stats.correctCharacters;
        } else {
            lastWpmElement.textContent = '0';
            lastAccuracyElement.textContent = '0%';
            bestWpmElement.textContent = '0';
            totalTestsElement.textContent = '0';
            averageWpmElement.textContent = '0';
            averageAccuracyElement.textContent = '0%';
            totalCharactersElement.textContent = '0';
            correctCharactersElement.textContent = '0';
            incorrectCharactersElement.textContent = '0';
        }
    }

    function renderChart() {
        if (statsChart) {
            statsChart.destroy();
        }
    
        const ctx = document.getElementById('stats-chart').getContext('2d');
    
        if (!stats.tests || stats.tests.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('No test data available. Complete a test to see your progress!',
                ctx.canvas.width / 2,
                ctx.canvas.height / 2);
            return;
        }
    
        const labels = stats.tests.map((test, index) => `Test ${index + 1}`);
        const wpmData = stats.tests.map(test => test.wpm);
        const accuracyData = stats.tests.map(test => test.accuracy);
    
        statsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'WPM',
                        data: wpmData,
                        backgroundColor: 'rgba(223, 37, 49, 0.7)',
                        borderColor: '#df2531',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Accuracy %',
                        data: accuracyData,
                        backgroundColor: 'rgba(76, 175, 80, 0.7)',
                        borderColor: '#4CAF50',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Tests',
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        type: 'linear',
                        display: true,
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'WPM / Accuracy %',
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'white',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }

    function setupEventListeners() {
        if (newTestBtn) {
            newTestBtn.addEventListener('click', () => {
                window.location.href = 'typing.html';
            });
        }

        if (clearStatsBtn) {
            clearStatsBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all your typing statistics? This cannot be undone.')) {
                    stats = {
                        tests: [],
                        bestWpm: 0,
                        totalCharacters: 0,
                        correctCharacters: 0
                    };

                    localStorage.setItem('typingStats', JSON.stringify(stats));
                    updateStatsDisplay();
                    renderChart();

                    window.location.reload();
                }
            });
        }

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
    }

    function updateLoginDisplay() {
        const userGreeting = document.getElementById('user-greeting');
        const loginLink = document.querySelector('.style-login');
        const loggedInUser = localStorage.getItem('loggedInUser');

        if (!stats || typeof stats !== 'object') {
            stats = {
                tests: [],
                bestWpm: 0,
                totalCharacters: 0,
                correctCharacters: 0
            };
        }

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

    initStatsPage();
});

