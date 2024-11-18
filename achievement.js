function checkAchievements() {
    const elapsedTime = parseInt(timeElement.textContent);
  
    // Beispielbedingungen für Achievements:
    if (matches === cards.length / 2) {
      unlockAchievement("firstWin-tracker", "Erster Sieg");
    }
    if (elapsedTime <= 30) {
      unlockAchievement("fastWin-tracker", "Schnellster Sieg");
    }
    if (matches === cards.length / 2 && flippedIndexes.length === 0) {
      unlockAchievement("perfectWin-tracker", "Perfekter Sieg");
    }
    if (currentLevel > 1) {
      unlockAchievement("levelUp-tracker", "Level-up");
    }
  }
  
  function unlockAchievement(achievementId, achievementText) {
    const achievementElement = document.getElementById(achievementId);
    
    if (achievementElement && achievementElement.querySelector(".status").textContent === "Nicht erreicht") {
      // Markiere das Achievement als erreicht
      achievementElement.querySelector(".status").textContent = "Erreicht";
      
      // Zeige ein Popup an
      showAchievementPopup(achievementText);
    }
  }

  

  function showAchievementPopup(achievementText) {
    const popup = document.getElementById("achievement-popup");
    const popupText = document.getElementById("achievement-text");
    
    popupText.textContent = achievementText;
    popup.style.display = "block";
  
    // Schließt das Popup nach 3 Sekunden automatisch
    setTimeout(closeAchievementPopup, 3000);
  }
  
  function closeAchievementPopup() {
    const popup = document.getElementById("achievement-popup");
    popup.style.display = "none";
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
