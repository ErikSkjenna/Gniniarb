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

const TOTAL_QUESTIONS = 25;
const TOTAL_TIME = 40;

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
const questionText = document.getElementById("questionText");
const feedback = document.getElementById("feedback");

const iqNumber = document.getElementById("iqNumber");
const resultMessage = document.getElementById("resultMessage");
const finalCorrect = document.getElementById("finalCorrect");
const finalAnswered = document.getElementById("finalAnswered");
const finalTime = document.getElementById("finalTime");

const savedIqNumber = document.getElementById("savedIqNumber");
const savedCorrect = document.getElementById("savedCorrect");
const savedAnswered = document.getElementById("savedAnswered");
const savedDate = document.getElementById("savedDate");

let timerInterval = null;
let gameState = null;

const today = getTodayKey();
const storageKey = "gniniarb_quick_math_" + today;

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
  let a;
  let b;
  let c;
  let d;
  let text;
  let answer;

  if (level <= 5) {
    a = randomNumber(1, 20);
    b = randomNumber(1, 20);

    if (Math.random() < 0.5) {
      text = `${a} + ${b}`;
      answer = a + b;
    } else {
      if (b > a) {
        const temp = a;
        a = b;
        b = temp;
      }

      text = `${a} - ${b}`;
      answer = a - b;
    }
  } else if (level <= 10) {
    a = randomNumber(2, 12);
    b = randomNumber(2, 12);

    if (Math.random() < 0.65) {
      text = `${a} × ${b}`;
      answer = a * b;
    } else {
      c = randomNumber(10, 40);
      text = `${a * b} + ${c}`;
      answer = a * b + c;
    }
  } else if (level <= 15) {
    a = randomNumber(10, 50);
    b = randomNumber(2, 12);
    c = randomNumber(2, 12);

    if (Math.random() < 0.5) {
      text = `${a} + ${b} × ${c}`;
      answer = a + b * c;
    } else {
      text = `${a} - ${b} + ${c}`;
      answer = a - b + c;
    }
  } else if (level <= 20) {
    a = randomNumber(4, 15);
    b = randomNumber(4, 15);
    c = randomNumber(2, 8);

    if (Math.random() < 0.5) {
      text = `(${a} + ${b}) × ${c}`;
      answer = (a + b) * c;
    } else {
      d = randomNumber(2, 10);
      text = `${a * d} ÷ ${d} + ${b}`;
      answer = a + b;
    }
  } else {
    a = randomNumber(8, 20);
    b = randomNumber(8, 20);
    c = randomNumber(3, 12);
    d = randomNumber(3, 12);

    if (Math.random() < 0.5) {
      text = `${a} × ${b} - ${c} × ${d}`;
      answer = a * b - c * d;
    } else {
      text = `${a}² + ${b} × ${c}`;
      answer = a * a + b * c;
    }
  }

  return {
    text: text,
    answer: answer
  };
}

function calculateMathIq(correctAnswers) {
  return 70 + correctAnswers * 5;
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
    mathIq: null
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
  questionText.textContent = current.text;
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
    setTimeout(finishGame, 400);
    return;
  }

  setTimeout(displayQuestion, 400);
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
  gameState.mathIq = calculateMathIq(gameState.correct);

  saveGame();
  showResult();
}

function showResult() {
  gamePanel.style.display = "none";
  startPanel.classList.add("hidden");
  lockedPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  const timeUsed = Math.min(
    TOTAL_TIME,
    Math.round((gameState.finishedAt - gameState.startedAt) / 1000)
  );

  iqNumber.textContent = gameState.mathIq;
  finalCorrect.textContent = `${gameState.correct} / ${TOTAL_QUESTIONS}`;
  finalAnswered.textContent = `${gameState.answered} / ${TOTAL_QUESTIONS}`;
  finalTime.textContent = `${timeUsed}s`;

  if (gameState.correct === TOTAL_QUESTIONS) {
    resultMessage.textContent = "Perfect score. Your brain was moving fast today.";
  } else if (gameState.correct >= 18) {
    resultMessage.textContent = "Strong result. Your daily Math IQ has been saved on this computer.";
  } else if (gameState.correct >= 10) {
    resultMessage.textContent = "Good attempt. Your daily Math IQ has been saved on this computer.";
  } else {
    resultMessage.textContent = "Attempt saved. Come back tomorrow and try to beat your score.";
  }
}

function showLockedResult(savedGame) {
  startPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  gamePanel.style.display = "none";
  lockedPanel.classList.remove("hidden");

  savedIqNumber.textContent = savedGame.mathIq;
  savedCorrect.textContent = `${savedGame.correct} / ${TOTAL_QUESTIONS}`;
  savedAnswered.textContent = `${savedGame.answered} / ${TOTAL_QUESTIONS}`;
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