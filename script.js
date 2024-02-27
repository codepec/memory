document.addEventListener("DOMContentLoaded", () => {
  let cards = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
  ];

  cards.sort(() => Math.random() - 0.5);

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
    highscores.push(time);
    highscores.sort((a, b) => a - b);

    // Behalte nur die besten 5 Highscores
    if (highscores.length > 5) {
      highscores.pop();
    }

    localStorage.setItem("highscores", JSON.stringify(highscores));
  }

  startStopwatch();

  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i;
    card.dataset.card = cards[i];
    card.addEventListener("click", flipCard);
    memoryBoard.appendChild(card);
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
});

function startNewGame() {
  location.reload();
}

function showHighscores() {
  const storedHighscores = JSON.parse(localStorage.getItem("highscores")) || [];

  if (storedHighscores.length === 0) {
    alert("No highscores available!");
  } else {
    const highscoreMessage = storedHighscores
      .map((time, index) => `${index + 1}. ${time} seconds`)
      .join("\n");
    alert(`Highscores:\n${highscoreMessage}`);
  }
}
