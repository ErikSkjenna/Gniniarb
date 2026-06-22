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

const menuButton = document.getElementById("menuButton");
const mobileNav = document.getElementById("mobileNav");

menuButton.addEventListener("click", function () {
  mobileNav.classList.toggle("show");
});

const mobileLinks = document.querySelectorAll(".mobile-nav a");

mobileLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mobileNav.classList.remove("show");
  });
});

const knowledgeFacts = [
  {
    title: "Why puzzles help your brain",
    text: "Puzzles can help improve problem-solving, memory, focus, and pattern recognition because they make your brain practice connecting information in new ways."
  },
  {
    title: "Your brain loves patterns",
    text: "The brain naturally searches for patterns. That is why sequence puzzles, riddles, and logic games can feel satisfying when you solve them."
  },
  {
    title: "Small challenges build focus",
    text: "Short mental challenges can help train attention because they force your mind to ignore distractions and stay with one task."
  },
  {
    title: "Learning daily helps memory",
    text: "Learning small pieces of information regularly can make it easier for your brain to store and connect new ideas."
  },
  {
    title: "Relaxation helps thinking",
    text: "A calm mind often solves problems better because stress can make it harder to focus, remember details, and think clearly."
  },
  {
    title: "Mistakes help learning",
    text: "When you make a mistake and correct it, your brain gets feedback. That feedback can make the correct answer easier to remember later."
  },
  {
    title: "Fast thinking can be trained",
    text: "Timed puzzles can help your brain become quicker at recognizing familiar patterns and choosing useful strategies."
  }
];

const knowledgeTitle = document.getElementById("knowledgeTitle");
const knowledgeText = document.getElementById("knowledgeText");
const newKnowledgeButton = document.getElementById("newKnowledgeButton");

let lastFactIndex = 0;

newKnowledgeButton.addEventListener("click", function () {
  let randomIndex = Math.floor(Math.random() * knowledgeFacts.length);

  while (randomIndex === lastFactIndex && knowledgeFacts.length > 1) {
    randomIndex = Math.floor(Math.random() * knowledgeFacts.length);
  }

  lastFactIndex = randomIndex;

  const fact = knowledgeFacts[randomIndex];

  knowledgeTitle.textContent = fact.title;
  knowledgeText.textContent = fact.text;
});

const puzzles = [
  {
    title: "Number Sequence",
    category: "math",
    icon: "🔢",
    description: "Find the hidden pattern in a sequence of numbers.",
    link: "#"
  },
  {
    title: "Logic Riddle",
    category: "logic",
    icon: "🧩",
    description: "Use clues and reasoning to solve a calm brain teaser.",
    link: "#"
  },
  {
    title: "Word Scramble",
    category: "word",
    icon: "📝",
    description: "Unscramble letters to discover the correct word.",
    link: "#"
  },
  {
    title: "Memory Tiles",
    category: "memory",
    icon: "🧠",
    description: "Remember the pattern and repeat it correctly.",
    link: "#"
  },
  {
    title: "Quick Math",
    category: "math",
    icon: "➕",
    description: "Answer 25 increasing math questions in 40 seconds. One try per day.",
    link: "games/quick-math.html"
  },
  {
    title: "Mystery Clue",
    category: "logic",
    icon: "🔍",
    description: "Read the clues carefully and find the answer.",
    link: "#"
  }
];

/*
  HOW TO ADD A NEW GAME:

  1. Create a new file inside the games folder.

     Example:
     games/memory-tiles.html

  2. Add a new object inside the puzzles array above.

     Example:

     {
       title: "Memory Tiles",
       category: "memory",
       icon: "🧠",
       description: "Repeat the pattern before time runs out.",
       link: "games/memory-tiles.html"
     }

  Categories currently supported:
  - logic
  - math
  - word
  - memory
*/

const puzzleGrid = document.getElementById("puzzleGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

function displayPuzzles(category) {
  puzzleGrid.innerHTML = "";

  const filteredPuzzles = puzzles.filter(function (puzzle) {
    return category === "all" || puzzle.category === category;
  });

  filteredPuzzles.forEach(function (puzzle) {
    const card = document.createElement("article");
    card.classList.add("puzzle-card");

    card.innerHTML = `
      <div class="puzzle-icon">${puzzle.icon}</div>
      <span class="puzzle-meta">${puzzle.category}</span>
      <h3>${puzzle.title}</h3>
      <p>${puzzle.description}</p>
      <a class="puzzle-link" href="${puzzle.link}">Start Puzzle →</a>
    `;

    puzzleGrid.appendChild(card);
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.getAttribute("data-filter");
    displayPuzzles(category);
  });
});

displayPuzzles("all");