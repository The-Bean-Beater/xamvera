const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const navItems = document.querySelectorAll(".nav-item");
const viewLinks = document.querySelectorAll("[data-view-link], [data-view-target]");
const views = document.querySelectorAll(".view");
const themeButtons = document.querySelectorAll("[data-theme-option]");
const themeStorageKey = "xamvera-theme";

const seedPracticeSet = {
  course: "AP World History: Modern",
  unit: "Starter Practice",
  rights: "Original Xanvera seed questions for public demo use.",
  questions: [
    {
      id: "xan-apwh-001",
      skill: "Contextualization",
      period: "c. 1200-c. 1450",
      difficulty: "Medium",
      stimulus:
        "A ruler sponsors religious scholars, repairs roads used by merchants, and grants privileges to long-distance trading communities that connect inland cities to ports.",
      prompt: "Which broader historical process is best reflected by these actions?",
      choices: [
        "The decline of state support for commercial exchange",
        "The use of state power to strengthen regional and interregional trade",
        "The replacement of land-based trade by Atlantic maritime routes",
        "The spread of industrial production through imperial charter companies"
      ],
      answer_index: 1,
      explanation:
        "States often supported trade by protecting routes, standardizing rules, and encouraging merchant activity. Atlantic and industrial patterns belong to later periods."
    },
    {
      id: "xan-apwh-002",
      skill: "Causation",
      period: "c. 1450-c. 1750",
      difficulty: "Medium",
      stimulus:
        "Silver mined in the Americas moved across the Atlantic and Pacific, financing state expansion and linking markets in Europe, the Americas, and Asia.",
      prompt: "Which development most directly contributed to the pattern described?",
      choices: [
        "The growth of transoceanic empires and global maritime commerce",
        "The collapse of all centralized states in East Asia",
        "The end of coerced labor systems in the Americas",
        "The disappearance of luxury-goods trade across Afro-Eurasia"
      ],
      answer_index: 0,
      explanation:
        "The Spanish empire, American silver production, and Pacific trade through Manila helped connect regional economies into wider global networks."
    },
    {
      id: "xan-apwh-003",
      skill: "Comparison",
      period: "c. 1750-c. 1900",
      difficulty: "Hard",
      stimulus:
        "Industrial factories concentrated workers, increased demand for raw materials, and encouraged states to invest in railroads, ports, and military power.",
      prompt: "Which comparison best describes industrialization in this period?",
      choices: [
        "Industrialization reduced global economic inequality by eliminating imperial competition.",
        "Industrialization only affected Europe and had no relationship to colonial economies.",
        "Industrialization increased the economic and military power of some states while intensifying extraction from other regions.",
        "Industrialization ended urban growth because most production returned to rural households."
      ],
      answer_index: 2,
      explanation:
        "Industrialization strengthened some states and firms while deepening global demand for labor, land, raw materials, and colonial markets."
    },
    {
      id: "xan-apwh-004",
      skill: "Continuity and Change",
      period: "c. 1900-present",
      difficulty: "Medium",
      stimulus:
        "After the Second World War, many colonies became independent states, but their governments often still depended on exporting a narrow range of raw materials.",
      prompt: "Which statement best explains both change and continuity in the situation described?",
      choices: [
        "Political sovereignty often changed, while economic relationships shaped by imperialism frequently persisted.",
        "New states usually rejected participation in the global economy entirely.",
        "Imperial borders disappeared immediately after independence.",
        "Former colonies quickly became the dominant industrial powers in every region."
      ],
      answer_index: 0,
      explanation:
        "Decolonization changed formal political control, but many economic patterns from imperial rule continued through trade, debt, and resource dependency."
    }
  ]
};

let practiceSet = seedPracticeSet;
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;

function showView(viewId) {
  views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  sidebar.classList.remove("open");
}

function applyTheme(theme) {
  const selectedTheme = theme || "system";

  if (selectedTheme === "system") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem(themeStorageKey);
  } else {
    document.documentElement.dataset.theme = selectedTheme;
    localStorage.setItem(themeStorageKey, selectedTheme);
  }

  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.themeOption === selectedTheme);
  });
}

function getPracticeElements() {
  return {
    counter: document.getElementById("questionCounter"),
    meta: document.getElementById("questionMeta"),
    stimulus: document.getElementById("questionStimulus"),
    prompt: document.getElementById("questionPrompt"),
    stack: document.getElementById("answerStack"),
    feedback: document.getElementById("feedbackBox"),
    next: document.getElementById("nextQuestion"),
    reset: document.getElementById("resetPractice")
  };
}

function renderQuestion() {
  const elements = getPracticeElements();
  if (!elements.prompt || !practiceSet.questions.length) return;

  selectedAnswerIndex = null;
  const question = practiceSet.questions[currentQuestionIndex];

  elements.counter.textContent = `Question ${currentQuestionIndex + 1} of ${practiceSet.questions.length}`;
  elements.meta.textContent = `${question.skill} | ${question.difficulty} | ${question.period}`;
  elements.stimulus.textContent = question.stimulus;
  elements.prompt.textContent = question.prompt;
  elements.feedback.hidden = true;
  elements.feedback.innerHTML = "";
  elements.next.textContent =
    currentQuestionIndex === practiceSet.questions.length - 1 ? "Finish Set" : "Next Question";

  elements.stack.innerHTML = question.choices
    .map((choice, index) => `<button type="button" data-answer-index="${index}">${choice}</button>`)
    .join("");

  elements.stack.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => selectAnswer(Number(button.dataset.answerIndex)));
  });
}

function selectAnswer(answerIndex) {
  const question = practiceSet.questions[currentQuestionIndex];
  const elements = getPracticeElements();
  selectedAnswerIndex = answerIndex;

  elements.stack.querySelectorAll("button").forEach((button) => {
    const buttonIndex = Number(button.dataset.answerIndex);
    button.classList.toggle("selected", buttonIndex === answerIndex);
    button.classList.toggle("correct", buttonIndex === question.answer_index);
    button.classList.toggle("incorrect", buttonIndex === answerIndex && answerIndex !== question.answer_index);
  });

  const isCorrect = answerIndex === question.answer_index;
  elements.feedback.hidden = false;
  elements.feedback.innerHTML = `
    <strong>${isCorrect ? "Correct" : "Not quite"}</strong>
    ${question.explanation}
  `;
}

function nextQuestion() {
  if (currentQuestionIndex === practiceSet.questions.length - 1) {
    currentQuestionIndex = 0;
  } else {
    currentQuestionIndex += 1;
  }
  renderQuestion();
}

function resetPractice() {
  currentQuestionIndex = 0;
  renderQuestion();
}

async function loadPracticeSet() {
  try {
    const response = await fetch("data/practice/ap-world-history-sample.json");
    if (!response.ok) throw new Error("Practice data unavailable");
    practiceSet = await response.json();
  } catch {
    practiceSet = seedPracticeSet;
  } finally {
    renderQuestion();
  }
}

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView(link.dataset.viewLink || link.dataset.viewTarget);
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.themeOption));
});

document.getElementById("nextQuestion")?.addEventListener("click", nextQuestion);
document.getElementById("resetPractice")?.addEventListener("click", resetPractice);

applyTheme(localStorage.getItem(themeStorageKey) || "system");
loadPracticeSet();
