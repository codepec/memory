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
const timeElement = document.getElementById("time-value");
const newGameBtn = document.getElementById("new-game-btn");
const highscoreList = document.getElementById("highscore-list");
const levelContainer = document.getElementById("level-container");
const gameContainer = document.getElementById("game-container");
const headerContainer = document.getElementById("header-container");

function startStopwatch() {
  startTime = Date.now();
  setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
  endTime = Date.now();
  const elapsedTime = Math.floor((endTime - startTime) / 1000);
  timeElement.textContent = elapsedTime;
}

function endGame() {
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
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const score = { time: time, level: level, score: generateScore(time) };
  highscores.push(score);
  highscores.sort((a, b) => b.score - a.score); // Sortiere nach absteigendem Highscore

  // Behalte nur die besten 5 Highscores
  if (highscores.length > 5) {
    highscores.pop();
  }

  localStorage.setItem("highscores", JSON.stringify(highscores));
}

function generateScore(time) {
  // Beispiel für eine einfache Formel zur Erzeugung des Highscore-Werts
  // Du kannst dies anpassen, um die Wertung nach deinen eigenen Kriterien zu berechnen
  return (1 / time) * 1000 * 23;
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
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${progressPercentage}%`;

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

function displayHighscores() {
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const bestScores = {};

  // Gruppiere Highscores nach Level und finde den besten Highscore für jedes Level
  highscores.forEach((score) => {
    const level = score.level;
    if (!bestScores[level] || score.score > bestScores[level]) {
      bestScores[level] = score.score;
    }
  });

  // Aktualisiere die Highscore-Anzeige für jedes Level im HTML
  for (let level = 1; level <= 5; level++) {
    const bestScore = bestScores[level];
    const highscoreElement = document.querySelector(
      `.level-${level} .level-label-highscore`
    );

    if (bestScore) {
      highscoreElement.innerText = `<b>Highscore: ${bestScore.toFixed(2)}</b>`;
    } else {
      highscoreElement.innerText = "No highscore yet";
    }
  }
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
  progressBar.textContent = `${progressPercentage}%`;
  choosenLevelElement.textContent = `Level ${currentLevel}`;
}

function startNewGame() {
  location.reload();

}

// Function to show the level selection menu
function showLevels() {
  levelContainer.style.display = "block";
  gameContainer.style.display = "none";

}

function showGameTable() {
  gameContainer.style.display = "block";
  levelContainer.style.display = "none";

}

function showHighscores() {
  const storedHighscores = JSON.parse(localStorage.getItem("highscores")) || [];

  if (storedHighscores.length === 0) {
    alert("No highscores available!");
  } else {
    const highscoreMessage = storedHighscores
      .map((score, index) => `${index + 1}. ${formatHighscore(score)}`)
      .join("\n");
    alert(`Highscores:\n${highscoreMessage}`);
  }
}

function formatHighscore(score) {
  // Formatierung des Highscores nach deinen Anforderungen
  // Hier verwende ich eine einfache Formatierung, die die Zeit anzeigt
  return `${score.score.toFixed(2)} (${score.time} seconds)`;
}

function updateLevel(level) {
  const root = document.documentElement; // Wurzel-Element des Dokuments (html)

  switch (level) {
    case 1:
      root.style.setProperty("--card-bg", "#4CAF50");
      root.style.setProperty("--card-hover-bg", "#1a462d");
      root.style.setProperty("--card-shadow", "#1a462d");
      break;
    case 2:
      root.style.setProperty("--card-bg", "#db79ff");
      root.style.setProperty("--card-hover-bg", "#db79ff");
      root.style.setProperty("--card-shadow", "#4800a6");
      break;
    case 3:
      root.style.setProperty("--card-bg", "#4682B4");
      root.style.setProperty("--card-hover-bg", "#4682B4");
      root.style.setProperty("--card-shadow", "#001554");
      break;

    case 4:
      root.style.setProperty("--card-bg", "#20B2AA");
      root.style.setProperty("--card-hover-bg", "#20B2AA");
      root.style.setProperty("--card-shadow", "#001554");
      break;

    case 5:
      root.style.setProperty("--card-bg", "#FFA07A");
      root.style.setProperty("--card-hover-bg", "#FFA07A");
      root.style.setProperty("--card-shadow", "black");
      break;
    default:
      // Standardfarben für unbekannte Level
      break;
  }
}
