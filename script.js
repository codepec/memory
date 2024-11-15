let cards = [];
let currentLevel = 1; // Default level

const memoryBoard = document.getElementById("memory-board");
let flippedCards = [];
let flippedIndexes = [];
let matches = 0;
let startTime = 0;
let endTime = 0;
let isFlipping = false;
let progressPercentage = 0; // Setze den Fortschritt zu Beginn auf 0

const progressBar = document.getElementById("progress-bar");
const progressBarText = document.getElementById("progress-text");
const timeElement = document.getElementById("time-value");
const newGameBtn = document.getElementById("new-game-btn");
const highscoreList = document.getElementById("highscore-list");
const levelContainer = document.getElementById("level-container");
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
  const placement = getPlacement(highscores, elapsedTime);

  alert(
    `Game Over!\nYour time: ${elapsedTime} seconds\nPlacement: ${placement}`
  );
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

// Function to show the level selection menu
function showLevels() {
  levelContainer.style.display = "block";
  gameContainer.style.display = "none";
  settingsContainer.style.display = "none";
}

function showSettings() {
  levelContainer.style.display = "none";
  gameContainer.style.display = "none";
  settingsContainer.style.display = "block";

}

function showGameTable() {
  gameContainer.style.display = "block";
  levelContainer.style.display = "none";
  settingsContainer.style.display = "none";

}

function showHighscores() {
  // Initialisiere das Highscore-Inhaltsformat
  let content = '<h2>Highscores</h2>';
  
  // Iteriere durch alle Levels und füge Highscores hinzu
  for (let level = 1; level <= 5; level++) {
    const levelKey = `highscores_level_${level}`;
    const highscores = JSON.parse(localStorage.getItem(levelKey)) || [];
    
    content += `<h3>Level ${level}</h3>`;
    
    if (highscores.length === 0) {
      content += '<p>No highscores available!</p>';
    } else {
      content += '<ul>';
      highscores.forEach((score) => {
        content += `<li> ${score.score.toFixed(0)} (${score.time} seconds)</li>`;
      });
      content += '</ul>';
    }
  }
  
  // Zeige die Inhalte im Modal an
  openModal(content);
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


function updateHighscoreDisplay() {
  for (let level = 1; level <= 5; level++) {
    const levelKey = `highscores_level_${level}`;
    const highscores = JSON.parse(localStorage.getItem(levelKey)) || [];
    
    // Bestimmen des besten Scores (höchster Wert)
    let bestScore = "No highscore yet"; // Standardwert, falls keine Highscores existieren
    if (highscores.length > 0) {
      bestScore = `${highscores[0].score.toFixed(0)}`;
    }

    // Aktualisieren des HTML-Elements
    const highscoreElement = document.getElementById(`level-highscore-${level}`);
    if (highscoreElement) {
      highscoreElement.innerHTML = `Highscore: <b>${bestScore}</b>`;
    }
  }
}

// Beispiel: Highscore für alle Levels laden
updateHighscoreDisplay();

