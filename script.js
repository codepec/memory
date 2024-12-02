let cards = [];
let currentLevel = 1; // Default level

const memoryBoard = document.getElementById("memory-board");
let flippedCards = [];
let flippedIndexes = [];
let matches = 0;
let startTime = 0;
let endTime = 0;
let isFlipping = false;
let progressPercentage = 0; 
let moves = 0;

const progressBar = document.getElementById("progress-bar");
const progressBarText = document.getElementById("progress-text");
const timeElement = document.getElementById("time-value");
const movesElement = document.getElementById("moves-value");
const newGameBtn = document.getElementById("new-game-btn");
const highscoreList = document.getElementById("highscore-list");
const levelContainer = document.getElementById("level-container");
const showAchievementsContainer = document.getElementById("achievements-container");
const highscoreContainer = document.getElementById("highscore-container");
const settingsContainer = document.getElementById("settings-container");
const gameContainer = document.getElementById("game-container");
const headerContainer = document.getElementById("header-container");

let stopwatchInterval;



function startStopwatch() {
  startTime = Date.now();
  stopwatchInterval = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
  endTime = Date.now();
  const elapsedTime = Math.floor((endTime - startTime) / 1000);
  timeElement.textContent = elapsedTime;
}

function endGame() {
  clearInterval(stopwatchInterval);
  const elapsedTime = parseInt(timeElement.textContent);
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const moves = parseInt(movesElement.textContent);

  if (moves <= 15) {
    alert(
      `Legendary Performance! 🏆\nYou nailed it with only ${moves} moves!\nTime: ${elapsedTime} seconds\nYou're a true master!`
    );
  } else if (moves <= 25) {
    alert(
      `Amazing Job! 🌟\nYou completed the game with just ${moves} moves!\nTime: ${elapsedTime} seconds\nKeep up the great work!`
    );
  } else if (moves <= 40) {
    alert(
      `Great Effort! 👏\nYou finished the game in ${moves} moves.\nTime: ${elapsedTime} seconds\nPractice makes perfect!`
    );
  } else {
    alert(
      `You Did It! 🎉\nIt took ${moves} moves and ${elapsedTime} seconds to finish.\nTry again to beat your record!`
    );
  }

  newGameBtn.style.display = "block";

  addToHighscore(elapsedTime);
  displayHighscores(highscores);
}

function getPlacement(highscores, currentTime) {
  const sortedHighscores = [...highscores, currentTime].sort((a, b) => a - b);
  const placement = sortedHighscores.indexOf(currentTime) + 1;
  return placement;
}

function addToHighscore(time) {
  const levelKey = `highscores_level_${currentLevel}`;  // Key for each level
  const highscores = JSON.parse(localStorage.getItem(levelKey)) || [];
    
  // Create a score object with the level and time
  const score = { time: time, score: generateScore(time) };
  
  // Add the new score to the highscores array
  highscores.push(score);
  
  // Sort the scores by highest score
  highscores.sort((a, b) => b.score - a.score);
  
  // Keep only the top 5 scores
  if (highscores.length > 5) {
    highscores.pop();
  }
  
  // Save the updated highscores array for the current level
  localStorage.setItem(levelKey, JSON.stringify(highscores));


}

function generateScore(time) {
  // Beispiel für eine einfache Formel zur Erzeugung des Highscore-Werts
  // Du kannst dies anpassen, um die Wertung nach deinen eigenen Kriterien zu berechnen
  return (1 / time) * 100000 * Math.PI * Math.PI;
}

function flipCard() {
  if (isFlipping) {
    return;
  }

  const selectedCard = this;
  selectedCard.style.backgroundImage = `url(${selectedCard.dataset.card})`;

  flippedCards.push(selectedCard);
  flippedIndexes.push(selectedCard.dataset.index);

  if (flippedCards.length === 2) {
    isFlipping = true;
    setTimeout(checkMatch, 500);
  }
}

progressBar.style.width = `${progressPercentage}%`;

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const [firstIndex, secondIndex] = flippedIndexes;

  if (
    firstCard.dataset.card === secondCard.dataset.card &&
    firstIndex !== secondIndex
  ) {
    disableCards();
    matches++;

    progressPercentage = (matches / (cards.length / 2)) * 100;
    progressBar.style.width = `${progressPercentage}%`; // Fortschrittsbalken-Breite
    progressBarText.textContent = `${progressPercentage}%`; // Textinhalt mit Abstand
    

    if (matches === cards.length / 2) {
      endGame();
    }
  } else {
    setTimeout(resetCards, 1000);
  }

  moves++;
  movesElement.textContent = moves;

}

function disableCards() {
  flippedCards.forEach((card) => card.removeEventListener("click", flipCard));
  flippedCards = [];
  flippedIndexes = [];
  isFlipping = false;
}

function resetCards() {
  flippedCards.forEach((card) => {
    card.style.backgroundImage = "";
  });
  flippedCards = [];
  flippedIndexes = [];
  isFlipping = false;
}

// Function to initialize cards array based on the selected level
function initializeCards() {
  cards = [
    `img/${currentLevel}/1.jpg`,
    `img/${currentLevel}/2.jpg`,
    `img/${currentLevel}/3.jpg`,
    `img/${currentLevel}/4.jpg`,
    `img/${currentLevel}/5.jpg`,
    `img/${currentLevel}/6.jpg`,
    `img/${currentLevel}/7.jpg`,
    `img/${currentLevel}/8.jpg`,
    `img/${currentLevel}/1.jpg`,
    `img/${currentLevel}/2.jpg`,
    `img/${currentLevel}/3.jpg`,
    `img/${currentLevel}/4.jpg`,
    `img/${currentLevel}/5.jpg`,
    `img/${currentLevel}/6.jpg`,
    `img/${currentLevel}/7.jpg`,
    `img/${currentLevel}/8.jpg`,
    // Add other jungle images here
  ];

  // Shuffle the cards
  cards.sort(() => Math.random() - 0.5);
}

// Function to start the memory game
function startMemoryGame() {
  initializeCards();
  // Remove existing cards from memory board
  while (memoryBoard.firstChild) {
    memoryBoard.removeChild(memoryBoard.firstChild);
  }
  // Add new cards to the board
  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i;
    card.dataset.card = cards[i];
    card.addEventListener("click", flipCard);
    memoryBoard.appendChild(card);
  }
  // Reset game variables
  flippedCards = [];
  flippedIndexes = [];
  matches = 0;
  moves = 0;
  movesElement.textContent = moves;
  startStopwatch();
  progressPercentage = 0;
}

// Update the chosenLevel element
const choosenLevelElement = document.getElementById("choosenLevel");
// Event listener for level selection
function selectLevel(level) {
  currentLevel = level;
  updateLevel(currentLevel);
  showGameTable();
  startMemoryGame(); // Start the game when a level is selected
  displayHighscores();
  console.log(level);
  progressPercentage = 0;
  progressPercentage = (matches / (cards.length / 2)) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressBarText.textContent = `${progressPercentage}%`;
  choosenLevelElement.textContent = `Level ${currentLevel}`;
}

function startNewGame() {
  location.reload();
}



function showAchievements(){
  levelContainer.style.display = "none";
  gameContainer.style.display = "none";
  settingsContainer.style.display = "none";
  showAchievementsContainer.style.display = "block";
  highscoreContainer.style.display ="none";
}

// Function to show the level selection menu
function showLevels() {
  levelContainer.style.display = "block";
  gameContainer.style.display = "none";
  settingsContainer.style.display = "none";
  showAchievementsContainer.style.display = "none";
  highscoreContainer.style.display ="none";
}

function showSettings() {
  levelContainer.style.display = "none";
  gameContainer.style.display = "none";
  settingsContainer.style.display = "block";
  showAchievementsContainer.style.display = "none";
  highscoreContainer.style.display ="none";
}

function showGameTable() {
  gameContainer.style.display = "block";
  levelContainer.style.display = "none";
  settingsContainer.style.display = "none";
  showAchievementsContainer.style.display = "none";
  highscoreContainer.style.display ="none";
}

function showHighscores() {
  displayHighscores();
  gameContainer.style.display = "none";
  levelContainer.style.display = "none";
  settingsContainer.style.display = "none";
  showAchievementsContainer.style.display = "none";
  highscoreContainer.style.display ="block";
}

function displayHighscores() {
  // Initialize the highscore content format
  let content = '';
  
  // Loop through all levels and add the highscores
  for (let level = 1; level <= 5; level++) {
    const levelKey = `highscores_level_${level}`;
    const highscores = JSON.parse(localStorage.getItem(levelKey)) || [];
    
    content += `<h3>Level ${level}</h3>`;
    
    if (highscores.length === 0) {
      content += '<p>No highscores available!</p>';
    } else {
      // HTML table for displaying the highscores
      content += `
        <table class="highscore-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Seconds</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
      `;
      highscores.forEach((score, index) => {
        content += `
          <tr>
            <td>${index + 1}</td>
            <td>${score.time} seconds</td>
            <td>${score.score.toFixed(0)}</td>
          </tr>
        `;
      });
      content += '</tbody></table>';
    }
  }
  
  // Insert the highscore content directly into the container
  document.getElementById('highscore-container').innerHTML = content;
}


// Safe function to insert HTML content into an element
function safeInsertHTML(element, htmlContent) {
  // Ensure content is parsed properly and safely inserted into the DOM
  const doc = new DOMParser().parseFromString(htmlContent, "text/html");
  element.innerHTML = doc.body.innerHTML;  // Safe HTML injection
}




function formatHighscore(score) {
  // Formatierung des Highscores nach deinen Anforderungen
  // Hier verwende ich eine einfache Formatierung, die die Zeit anzeigt
  return `${score.score.toFixed(0)} (${score.time} seconds)`;
}

function updateLevel(level) {
  const root = document.documentElement;

  switch (level) {
    case 1:
      root.style.setProperty("--card-bg", "#11b816");         // Helle Grundfarbe für Level 1
      root.style.setProperty("--card-hover-bg", "#0f8014");   // Etwas dunklere Farbe für Hover-Effekt
      root.style.setProperty("--card-shadow", "#000000");     // Dunkle Farbe für Schatten
      root.style.setProperty(
        "--level-background",
        "linear-gradient(to bottom right, #11b816, #000000)"
      );
      break;
      
    case 2:
      root.style.setProperty("--card-bg", "#6309ff");         // Helle Grundfarbe für Level 2
      root.style.setProperty("--card-hover-bg", "#5008cc");   // Etwas dunklere Farbe für Hover-Effekt
      root.style.setProperty("--card-shadow", "#330055");     // Dunklere Farbe für Schatten
      root.style.setProperty(
        "--level-background",
        "linear-gradient(to bottom right, #6309ff, #7a1662)"
      );
      break;
      
    case 3:
      root.style.setProperty("--card-bg", "#1565c0");         // Helle Grundfarbe für Level 3
      root.style.setProperty("--card-hover-bg", "#104a8a");   // Etwas dunklere Farbe für Hover-Effekt
      root.style.setProperty("--card-shadow", "#001554");     // Dunkle Farbe für Schatten
      root.style.setProperty(
        "--level-background",
        "linear-gradient(to bottom right, #181e23, #1565c0)"
      );
      break;
      
    case 4:
      root.style.setProperty("--card-bg", "#20B2AA");         // Helle Grundfarbe für Level 4
      root.style.setProperty("--card-hover-bg", "#1a908a");   // Etwas dunklere Farbe für Hover-Effekt
      root.style.setProperty("--card-shadow", "#041918");     // Dunkle Farbe für Schatten
      root.style.setProperty(
        "--level-background",
        "linear-gradient(to bottom right, #20B2AA, #041918)"
      );
      break;
      
    case 5:
      root.style.setProperty("--card-bg", "#fbc02d");         // Helle Grundfarbe für Level 5
      root.style.setProperty("--card-hover-bg", "#f1a022");   // Etwas dunklere Farbe für Hover-Effekt
      root.style.setProperty("--card-shadow", "#000");     // Passende Farbe für Schatten
      root.style.setProperty(
        "--level-background",
        "linear-gradient(to bottom right, #fbc02d, #FFA07A)"
      );
      break;
      
    default:
      // Standardfarben für unbekannte Level
      break;
  }
}


function clearContainer(container) {
  while (container.firstChild) {
      container.removeChild(container.firstChild);
  }
}

function updateStars(score, level) {
  const starContainer = document.getElementById(`score-stars-container-level-${level}`);
  if (!starContainer) return; // Abbrechen, falls der Container nicht gefunden wird

  // Sicheres Entfernen aller Kinder
  clearContainer(starContainer);

  let starCount = 0;
  if (score > 30000) {
      starCount = 3;
  } else if (score > 20000) {
      starCount = 2;
  } else if (score > 10000) {
      starCount = 1;
  }

  // Sterne generieren und einfügen
  for (let i = 0; i < starCount; i++) {
      const star = document.createElement('img');
      star.src = 'img/stars/star_full.png'; // Pfad zum Bild der Sterne
      star.alt = 'Star';
      star.classList.add('star-icon'); // Optional: CSS-Klasse hinzufügen
      starContainer.appendChild(star);
  }
}






function updateHighscoreDisplay() {
  for (let level = 1; level <= 5; level++) {
    const levelKey = `highscores_level_${level}`;
    const highscores = JSON.parse(localStorage.getItem(levelKey)) || [];
    
    // Bestimmen des besten Scores (höchster Wert)
    let bestScore = "No highscore yet"; // Standardwert, falls keine Highscores existieren
    if (highscores.length > 0) {
      bestScore = `${highscores[0].score.toFixed(0)}`;
    }

    updateStars(bestScore, level);

    // Aktualisieren des HTML-Elements
    const highscoreElement = document.getElementById(`level-highscore-${level}`);
    if (highscoreElement) {
      highscoreElement.innerHTML = `Highscore: <b>${bestScore}</b>`;

    }
    
  }
}








//Achievements

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


//First Win Level 1
function checkFirstWinAchievement() {
  const achievementElementFirstWin = document.getElementById("firstWin");
  const achievementImage = document.querySelector("#firstWin-tracker img");

  const highscores = JSON.parse(localStorage.getItem("highscores_level_1")) || [];

  // Wenn ein Highscore für Level 1 vorhanden ist, markiere den Erfolg
  if (highscores.length > 0) {
    achievementElementFirstWin.textContent = "Achieved";
    achievementElementFirstWin.style.color = "#28a745";  // Erfolg (grün)
    
    // Ändere das Bild des Erfolges auf das erreichte Bild
    achievementImage.src = "img/achievements/trophy_achieved.jpg";
    //console.log("First win achievement unlocked!");
  } else {
    achievementElementFirstWin.textContent = "Not Achieved";
    achievementElementFirstWin.style.color = "crimson";  // Nicht erreicht (rot)
    
    // Bild bleibt auf nicht erreicht
    achievementImage.src = "img/achievements/trophy_notachieved.jpg";
  }

  //console.log(achievementElementFirstWin.textContent); // Debugging-Ausgabe
}


//Fastes Win Level 1
function checkFastestWinAchievement() {
  const achievementElementFastWin = document.getElementById("fastWin");
  const achievementImage = document.querySelector("#fastWin-tracker img");

  // Beste Zeit für Level 1 aus dem localStorage holen (angenommen, es handelt sich um eine Zeit in Sekunden)
  const highscoresBestTime = JSON.parse(localStorage.getItem("highscores_level_1"))[0].time || null;

  console.log(highscoresBestTime); // Debugging-Ausgabe

  // Überprüfen, ob eine Zeit vorhanden ist und ob sie unter 30 Sekunden liegt
  if (highscoresBestTime !== null && highscoresBestTime < 30) {
    // Achievement erreicht (unter 30 Sekunden)
    achievementElementFastWin.textContent = "Achieved";
    achievementElementFastWin.style.color = "#28a745";  // Erfolg (grün)
    
    // Ändere das Bild des Erfolges auf das erreichte Bild
    achievementImage.src = "img/achievements/speed_achieved.jpg";
    //console.log("Fastest win achievement unlocked!"); // Debugging-Ausgabe
  } else {
    // Achievement nicht erreicht
    achievementElementFastWin.textContent = "Not Achieved";
    achievementElementFastWin.style.color = "crimson";  // Nicht erreicht (rot)
    
    // Bild bleibt auf nicht erreicht
    achievementImage.src = "img/achievements/speed_notachieved.jpg";
  }

  //console.log(achievementElementFastWin.textContent); // Debugging-Ausgabe
}


//Win 5x Level 1
function checkWin5xLevel1Achievement() {
  const achievementElementWin5xLevel1 = document.getElementById("level1Win5");
  const achievementImage = document.querySelector("#level1Win5-tracker img");

  // Beste Zeit für Level 1 aus dem localStorage holen (angenommen, es handelt sich um eine Zeit in Sekunden)
  const highscores5Times = JSON.parse(localStorage.getItem("highscores_level_1")).length || null;

  //console.log(highscores5Times); // Debugging-Ausgabe

  // Überprüfen, ob eine Zeit vorhanden ist und ob sie unter 30 Sekunden liegt
  if (highscores5Times !== null && highscores5Times > 4) {
    // Achievement erreicht (unter 30 Sekunden)
    achievementElementWin5xLevel1.textContent = "Achieved";
    achievementElementWin5xLevel1.style.color = "#28a745";  // Erfolg (grün)
    
    // Ändere das Bild des Erfolges auf das erreichte Bild
    achievementImage.src = "img/achievements/medal_achieved.jpg";
    //console.log("level1Win5 achievement unlocked!"); // Debugging-Ausgabe
  } else {
    // Achievement nicht erreicht
    achievementElementWin5xLevel1.textContent = "Not Achieved";
    achievementElementWin5xLevel1.style.color = "crimson";  // Nicht erreicht (rot)
    
    // Bild bleibt auf nicht erreicht
    achievementImage.src = "img/achievements/medal_notachieved.jpg";
  }

  //console.log(achievementElementWin5xLevel1.textContent); // Debugging-Ausgabe
}


//Perfect Win
//Level-up
//Win 5x Level 1
//Win Level 1 in under 30 seconds
//Win Level 1 without mistakes

//Play all Levels
//Win with <30 clicks
//Win with <20 clicks

//etc

//baue clicks ein
//bau click anzeige ein




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


document.addEventListener("DOMContentLoaded", function() {
  // This event ensures the DOM content is ready before manipulation

  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.classList.add("hide");

  const loading = document.getElementById("loading-page");
  loading.classList.add("visible");

  updateHighscoreDisplay();
  checkAchievements();
  checkFirstWinAchievement();
  checkFastestWinAchievement();
  checkWin5xLevel1Achievement();
});