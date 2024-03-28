document.addEventListener('DOMContentLoaded', function () {
    visualSettingsManager.applyVisualSettings();
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Load and display leaderboard entries
    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const tableBody = document.querySelector('.leaderboard-table tbody');
        leaderboard.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${entry.score}</td><td>${entry.time}</td><td>${entry.date}</td><td>${entry.timeOfDay}</td>`;
            tableBody.appendChild(row);
        });
    }

    displayLeaderboard();
});
