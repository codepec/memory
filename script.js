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
  let isFlipping = false; // Variable, um zu überprüfen, ob bereits zwei Karten aufgedeckt sind

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
    newGameBtn.style.display = "block";
    const elapsedTime = parseInt(timeElement.textContent);
    addToHighscore(elapsedTime);
  }

  function addToHighscore(time) {
    const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.push(time);
    highscores.sort((a, b) => a - b);

    // Keep only the top 5 highscores
    if (highscores.length > 5) {
      highscores.pop();
    }

    localStorage.setItem("highscores", JSON.stringify(highscores));
    displayHighscores(highscores);
  }

  function displayHighscores(highscores) {
    highscoreList.innerHTML = "Highscore List:";
    for (let i = 0; i < highscores.length; i++) {
      const listItem = document.createElement("div");
      listItem.textContent = `${i + 1}. ${highscores[i]} seconds`;
      highscoreList.appendChild(listItem);
    }
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
      return; // Verhindert das Umklappen weiterer Karten, während bereits zwei Karten aufgedeckt sind
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

  function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const [firstIndex, secondIndex] = flippedIndexes;

    if (
      firstCard.dataset.card === secondCard.dataset.card &&
      firstIndex !== secondIndex
    ) {
      disableCards();
      matches++;

      // Update progress bar
      const progressPercentage = (matches / (cards.length / 2)) * 100;
      progressBar.style.width = `${progressPercentage}%`;

      if (matches === cards.length / 2) {
        // All matches found
        endGame();
      }
    } else {
      setTimeout(resetCards, 1000); // Delay resetCards for better user experience
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

  // Load and display highscores
  const storedHighscores = JSON.parse(localStorage.getItem("highscores")) || [];
  displayHighscores(storedHighscores);
});

function startNewGame() {
  location.reload();
}
