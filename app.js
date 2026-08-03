const progressBar = document.getElementById("progressBar");
const revealButton = document.getElementById("revealAnswer");
const quizAnswer = document.getElementById("quizAnswer");
const giftCards = document.querySelectorAll(".gift-card");
const selectedGift = document.getElementById("selectedGift");
const startGameButton = document.getElementById("startGame");
const scoreValue = document.getElementById("score");
const timerValue = document.getElementById("timer");
const gameArea = document.getElementById("gameArea");
const gameMessage = document.getElementById("gameMessage");

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("load", updateProgressBar);

revealButton?.addEventListener("click", () => {
  quizAnswer.hidden = false;
  revealButton.textContent = "Answer revealed";
});

giftCards.forEach((card) => {
  card.addEventListener("click", () => {
    const giftName = card.dataset.gift;
    selectedGift.textContent = `You chose ${giftName}. This will become the centerpiece of your final gift.`;
  });
});

let gameInterval;
let countdownInterval;
let score = 0;
let timeLeft = 10;

function clearGame() {
  clearInterval(gameInterval);
  clearInterval(countdownInterval);
  gameArea.innerHTML = "";
}

function spawnHeart() {
  const heart = document.createElement("button");
  heart.className = "heart-target";
  heart.textContent = "💗";
  heart.style.left = `${Math.random() * 72}%`;
  heart.style.top = `${Math.random() * 70}%`;
  heart.addEventListener("click", () => {
    score += 1;
    scoreValue.textContent = score;
    heart.remove();
    gameMessage.textContent = "You caught a little love!";
  });
  gameArea.appendChild(heart);
}

function startGame() {
  clearGame();
  score = 0;
  timeLeft = 10;
  scoreValue.textContent = score;
  timerValue.textContent = timeLeft;
  gameMessage.textContent = "Catch as many hearts as you can!";

  gameInterval = window.setInterval(spawnHeart, 600);
  countdownInterval = window.setInterval(() => {
    timeLeft -= 1;
    timerValue.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearGame();
      gameMessage.textContent = `Game over! You caught ${score} hearts.`;
    }
  }, 1000);
}

startGameButton?.addEventListener("click", startGame);
