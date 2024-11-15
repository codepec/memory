function showAchievementPopup(achievement) {
    let popup = document.getElementById('achievement-popup');
    let achievementText = document.getElementById('achievement-text');

    switch (achievement) {
        case 'firstWin':
            achievementText.textContent = "Gratulation! Du hast deinen ersten Sieg errungen!";
            break;
        case 'fastWin':
            achievementText.textContent = "Schnell! Du hast ein Level in weniger als 1 Minute abgeschlossen!";
            break;
        case 'perfectWin':
            achievementText.textContent = "Perfekt! Du hast das Level ohne Fehler abgeschlossen!";
            break;
        case 'levelUp':
            achievementText.textContent = "Level-up! Du bist auf das nächste Level aufgestiegen!";
            break;
        default:
            achievementText.textContent = "Du hast ein Achievement freigeschaltet!";
    }

    popup.style.display = 'block';
}

function closeAchievementPopup() {
    document.getElementById('achievement-popup').style.display = 'none';
}


function updateAchievementTracker() {
    if (achievements.firstWin) {
        document.getElementById('firstWin-tracker').querySelector('.status').textContent = 'Erreicht';
        document.getElementById('firstWin-tracker').querySelector('.status').classList.add('achieved');
    }
    if (achievements.fastWin) {
        document.getElementById('fastWin-tracker').querySelector('.status').textContent = 'Erreicht';
        document.getElementById('fastWin-tracker').querySelector('.status').classList.add('achieved');
    }
    if (achievements.perfectWin) {
        document.getElementById('perfectWin-tracker').querySelector('.status').textContent = 'Erreicht';
        document.getElementById('perfectWin-tracker').querySelector('.status').classList.add('achieved');
    }
    if (achievements.levelUp) {
        document.getElementById('levelUp-tracker').querySelector('.status').textContent = 'Erreicht';
        document.getElementById('levelUp-tracker').querySelector('.status').classList.add('achieved');
    }
}
