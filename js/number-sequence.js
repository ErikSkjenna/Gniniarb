const pageLoader = document.getElementById("pageLoader");

function hidePageLoader() {
  if (!pageLoader) {
    return;
  }

  pageLoader.classList.add("hide-loader");
}

function showPageLoader() {
  if (!pageLoader) {
    return;
  }

  pageLoader.classList.remove("hide-loader");
}

window.addEventListener("load", function () {
  setTimeout(hidePageLoader, 700);
});

document.addEventListener("click", function (event) {
  const link = event.target.closest("a");

  if (!link) {
    return;
  }

  const href = link.getAttribute("href");

  if (!href) {
    return;
  }

  const isSamePageSection = href.startsWith("#");
  const opensNewTab = link.getAttribute("target") === "_blank";
  const isExternal = href.startsWith("http");

  if (isSamePageSection || opensNewTab || isExternal) {
    return;
  }

  showPageLoader();
});

const TOTAL_QUESTIONS = 15;
const TOTAL_TIME = 75;

const startPanel = document.getElementById("startPanel");
const gamePanel = document.getElementById("gamePanel");
const resultPanel = document.getElementById("resultPanel");
const lockedPanel = document.getElementById("lockedPanel");

const startButton = document.getElementById("startButton");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");

const questionCounter = document.getElementById("questionCounter");
const scoreCounter = document.getElementById("scoreCounter");
const timeCounter = document.getElementById("timeCounter");
const timerFill = document.getElementById("timerFill");
const sequenceText = document.getElementById("sequenceText");
const hintText = document.getElementById("hintText");
const feedback = document.getElementById("feedback");

const iqNumber = document.getElementById("iqNumber");
const resultMessage = document.getElementById("resultMessage");
const finalCorrect = document.getElementById("finalCorrect");
const finalTime = document.getElementById("finalTime");
const finalSpeedBonus = document.getElementById("finalSpeedBonus");

const savedIqNumber = document.getElementById("savedIqNumber");
const savedCorrect = document.getElementById("savedCorrect");
const savedTime = document.getElementById("savedTime");
const savedDate = document.getElementById("savedDate");

let timerInterval = null;
let gameState = null;

const today = getTodayKey();
const storageKey = "gniniarb_number_sequence_" + today;

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function saveGame() {
  localStorage.setItem(storageKey, JSON.stringify(gameState));
}

function loadGame() {
  const savedGame = localStorage.getItem(storageKey);

  if (!savedGame) {
    return null;
  }

  return JSON.parse(savedGame);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestions() {
  const questions = [];

  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    questions.push(generateQuestion(i));
  }

  return questions;
}

function generateQuestion(level) {
  if (level <= 3) {
    return generateArithmeticSequence(level);
  }

  if (level <= 5) {
    return generateBiggerArithmeticSequence(level);
  }

  if (level <= 8) {
    return generateMultiplicationSequence(level);
  }

  if (level <= 10) {
    return generateSquareSequence(level);
  }

  if (level <= 12) {
    return generateFibonacciStyleSequence(level);
  }

  if (level <= 14) {
    return generateAlternatingSequence(level);
  }

  return generateSecondDifferenceSequence(level);
}

function generateArithmeticSequence(level) {
  const start = randomNumber(1, 12);
  const difference = randomNumber(2, 6 + level);
  const sequence = [];

  for (let i = 0; i < 5; i++) {
    sequence.push(start + difference * i);
  }

  return {
    sequence: sequence,
    answer: start + difference * 5,
    hint: "The difference between each number stays the same."
  };
}

function generateBiggerArithmeticSequence(level) {
  const start = randomNumber(20, 60);
  const difference = randomNumber(7, 14);
  const sequence = [];

  for (let i = 0; i < 5; i++) {
    sequence.push(start + difference * i);
  }

  return {
    sequence: sequence,
    answer: start + difference * 5,
    hint: "The numbers are increasing by the same amount."
  };
}

function generateMultiplicationSequence(level) {
  const start = randomNumber(1, 5);
  const multiplier = level <= 7 ? 2 : 3;
  const sequence = [];

  for (let i = 0; i < 5; i++) {
    sequence.push(start * Math.pow(multiplier, i));
  }

  return {
    sequence: sequence,
    answer: start * Math.pow(multiplier, 5),
    hint: "Each number is multiplied by the same value."
  };
}

function generateSquareSequence(level) {
  const start = randomNumber(1, 4);
  const offset = randomNumber(0, 5);
  const sequence = [];

  for (let i = start; i < start + 5; i++) {
    sequence.push(i * i + offset);
  }

  const next = start + 5;

  return {
    sequence: sequence,
    answer: next * next + offset,
    hint: "Think about square numbers."
  };
}

function generateFibonacciStyleSequence(level) {
  const first = randomNumber(1, 5);
  const second = randomNumber(2, 7);
  const sequence = [first, second];

  for (let i = 2; i < 6; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }

  return {
    sequence: sequence.slice(0, 5),
    answer: sequence[5],
    hint: "Each new number uses the two previous numbers."
  };
}

function generateAlternatingSequence(level) {
  const start = randomNumber(3, 15);
  const firstJump = randomNumber(2, 8);
  const secondJump = randomNumber(9, 16);
  const sequence = [start];

  for (let i = 1; i < 6; i++) {
    if (i % 2 === 1) {
      sequence.push(sequence[i - 1] + firstJump);
    } else {
      sequence.push(sequence[i - 1] + secondJump);
    }
  }

  return {
    sequence: sequence.slice(0, 5),
    answer: sequence[5],
    hint: "The pattern alternates between two different jumps."
  };
}

function generateSecondDifferenceSequence(level) {
  let current = randomNumber(2, 8);
  let difference = randomNumber(2, 5);
  const secondDifference = randomNumber(2, 4);
  const sequence = [current];

  for (let i = 1; i < 6; i++) {
    current += difference;
    sequence.push(current);
    difference += secondDifference;
  }

  return {
    sequence: sequence.slice(0, 5),
    answer: sequence[5],
    hint: "The difference between numbers is also increasing."
  };
}

function calculateSequenceIq(correctAnswers, timeUsed) {
  const remainingTime = Math.max(0, TOTAL_TIME - timeUsed);
  const speedRatio = remainingTime / TOTAL_TIME;

  const correctScore = correctAnswers * 5;
  const speedBonus = Math.round(speedRatio * 30);
  const iq = 70 + correctScore + speedBonus;

  return {
    iq: iq,
    speedBonus: speedBonus
  };
}

function startGame() {
  const now = Date.now();

  gameState = {
    status: "in-progress",
    date: today,
    questions: generateQuestions(),
    currentQuestion: 0,
    correct: 0,
    answered: 0,
    startedAt: now,
    endsAt: now + TOTAL_TIME * 1000,
    finishedAt: null,
    sequenceIq: null,
    speedBonus: null,
    timeUsed: null
  };

  saveGame();
  showGamePanel();
  displayQuestion();
  startTimer();
}

function showGamePanel() {
  startPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  lockedPanel.classList.add("hidden");
  gamePanel.style.display = "block";
}

function displayQuestion() {
  const current = gameState.questions[gameState.currentQuestion];

  questionCounter.textContent = `${gameState.currentQuestion + 1} / ${TOTAL_QUESTIONS}`;
  scoreCounter.textContent = gameState.correct;
  sequenceText.textContent = `${current.sequence.join(", ")}, ?`;
  hintText.textContent = current.hint;

  answerInput.value = "";
  answerInput.focus();

  feedback.textContent = "";
  feedback.className = "feedback";
}

function submitAnswer(event) {
  event.preventDefault();

  if (!gameState || gameState.status !== "in-progress") {
    return;
  }

  const current = gameState.questions[gameState.currentQuestion];
  const userAnswer = Number(answerInput.value);

  if (Number.isNaN(userAnswer)) {
    return;
  }

  if (userAnswer === current.answer) {
    gameState.correct++;
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = `Wrong. Correct answer: ${current.answer}`;
    feedback.className = "feedback wrong";
  }

  gameState.answered++;
  gameState.currentQuestion++;
  saveGame();

  scoreCounter.textContent = gameState.correct;

  if (gameState.currentQuestion >= TOTAL_QUESTIONS) {
    setTimeout(finishGame, 450);
    return;
  }

  setTimeout(displayQuestion, 450);
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(function () {
    const now = Date.now();
    const remainingMilliseconds = gameState.endsAt - now;
    const remainingSeconds = Math.max(0, Math.ceil(remainingMilliseconds / 1000));
    const percentage = Math.max(0, (remainingMilliseconds / (TOTAL_TIME * 1000)) * 100);

    timeCounter.textContent = remainingSeconds;
    timerFill.style.width = percentage + "%";

    if (remainingMilliseconds <= 0) {
      finishGame();
    }
  }, 150);
}

function finishGame() {
  clearInterval(timerInterval);

  if (!gameState || gameState.status === "finished") {
    return;
  }

  gameState.status = "finished";
  gameState.finishedAt = Date.now();

  const timeUsed = Math.min(
    TOTAL_TIME,
    Math.round((gameState.finishedAt - gameState.startedAt) / 1000)
  );

  const iqResult = calculateSequenceIq(gameState.correct, timeUsed);

  gameState.timeUsed = timeUsed;
  gameState.sequenceIq = iqResult.iq;
  gameState.speedBonus = iqResult.speedBonus;

  saveGame();
  showResult();
}

function showResult() {
  gamePanel.style.display = "none";
  startPanel.classList.add("hidden");
  lockedPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  iqNumber.textContent = gameState.sequenceIq;
  finalCorrect.textContent = `${gameState.correct} / ${TOTAL_QUESTIONS}`;
  finalTime.textContent = `${gameState.timeUsed}s`;
  finalSpeedBonus.textContent = `+${gameState.speedBonus}`;

  if (gameState.correct === TOTAL_QUESTIONS && gameState.speedBonus >= 20) {
    resultMessage.textContent = "Excellent. You solved the patterns quickly and accurately.";
  } else if (gameState.correct >= 12) {
    resultMessage.textContent = "Strong pattern recognition. Your Sequence IQ has been saved for today.";
  } else if (gameState.correct >= 8) {
    resultMessage.textContent = "Good attempt. Your Sequence IQ has been saved for today.";
  } else {
    resultMessage.textContent = "Attempt saved. Come back tomorrow and try to improve your pattern speed.";
  }
}

function showLockedResult(savedGame) {
  startPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  gamePanel.style.display = "none";
  lockedPanel.classList.remove("hidden");

  savedIqNumber.textContent = savedGame.sequenceIq;
  savedCorrect.textContent = `${savedGame.correct} / ${TOTAL_QUESTIONS}`;
  savedTime.textContent = `${savedGame.timeUsed}s`;
  savedDate.textContent = savedGame.date;
}

function continueGame(savedGame) {
  gameState = savedGame;

  const now = Date.now();

  if (now >= gameState.endsAt) {
    finishGame();
    return;
  }

  showGamePanel();
  displayQuestion();
  startTimer();
}

function checkDailyAttempt() {
  const savedGame = loadGame();

  if (!savedGame) {
    return;
  }

  if (savedGame.status === "finished") {
    showLockedResult(savedGame);
    return;
  }

  if (savedGame.status === "in-progress") {
    continueGame(savedGame);
  }
}

startButton.addEventListener("click", startGame);
answerForm.addEventListener("submit", submitAnswer);

checkDailyAttempt();