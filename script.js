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
let reviewItems = [];
let selectedReviewIndex = 0;
let activeReviewFilter = "all";

const seedReviewQueue = {
  items: [
    {
      id: "draft-apwh-001",
      status: "needs_review",
      course: "AP World History: Modern",
      unit: "Unit 2: Networks of Exchange",
      period: "c. 1200-c. 1450",
      skill: "Causation",
      difficulty: "Medium",
      source_type: "original",
      similarity_risk: "low",
      stimulus:
        "A merchant family uses caravan routes to move textiles, spices, and paper money across several regions connected by imperial postal stations and protected trading cities.",
      prompt: "Which development most directly helped make the commercial activity described possible?",
      choices: [
        "The expansion of secure overland trade networks under large empires",
        "The collapse of all long-distance exchange between Afro-Eurasian regions",
        "The replacement of merchant activity by subsistence agriculture",
        "The emergence of Atlantic plantation economies"
      ],
      answer_index: 0,
      explanation:
        "Large empires and stable trade routes helped merchants move goods, technologies, and credit instruments across Afro-Eurasia during this period.",
      review_notes:
        "Check whether the paper money reference is too specific for the intended region. Consider adding a clearer Mongol-era context if needed.",
      gates: {
        source_verified: true,
        answer_verified: true,
        explanation_verified: false,
        copyright_checked: true
      }
    }
  ]
};

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

function formatStatus(status) {
  return status.replaceAll("_", " ");
}

function filteredReviewItems() {
  if (activeReviewFilter === "all") return reviewItems;
  return reviewItems.filter((item) => item.status === activeReviewFilter);
}

function selectedReviewItem() {
  return reviewItems[selectedReviewIndex] || reviewItems[0];
}

function renderReviewMetrics() {
  const counts = reviewItems.reduce(
    (totals, item) => {
      totals[item.status] = (totals[item.status] || 0) + 1;
      return totals;
    },
    {}
  );

  document.getElementById("needsReviewCount").textContent = counts.needs_review || 0;
  document.getElementById("needsRevisionCount").textContent = counts.needs_revision || 0;
  document.getElementById("approvedCount").textContent = counts.approved || 0;
}

function renderReviewQueue() {
  const queue = document.getElementById("reviewQueue");
  if (!queue) return;

  const items = filteredReviewItems();
  queue.innerHTML = items
    .map((item) => {
      const originalIndex = reviewItems.findIndex((candidate) => candidate.id === item.id);
      return `
        <button class="queue-item ${originalIndex === selectedReviewIndex ? "active" : ""}" type="button" data-review-index="${originalIndex}">
          <span>${formatStatus(item.status)}</span>
          <strong>${item.skill}</strong>
          <span>${item.unit}</span>
        </button>
      `;
    })
    .join("");

  queue.querySelectorAll("[data-review-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedReviewIndex = Number(button.dataset.reviewIndex);
      renderReviewWorkspace();
    });
  });
}

function renderReviewDetail() {
  const item = selectedReviewItem();
  if (!item) return;

  document.getElementById("reviewItemId").textContent = item.id;
  document.getElementById("reviewPrompt").textContent = item.prompt;
  document.getElementById("reviewStimulus").textContent = item.stimulus;
  document.getElementById("reviewExplanation").textContent = item.explanation;
  document.getElementById("reviewNotes").value = item.review_notes || "";

  const status = document.getElementById("reviewStatus");
  status.textContent = formatStatus(item.status);
  status.className = `status-badge ${item.status}`;

  document.getElementById("reviewChoices").innerHTML = item.choices
    .map(
      (choice, index) => `
        <div class="review-choice ${index === item.answer_index ? "correct" : ""}">
          <mark>${String.fromCharCode(65 + index)}</mark>
          <span>${choice}</span>
        </div>
      `
    )
    .join("");

  const metadata = [
    ["Course", item.course],
    ["Unit", item.unit],
    ["Period", item.period],
    ["Difficulty", item.difficulty],
    ["Source", item.source_type],
    ["Similarity", item.similarity_risk]
  ];

  document.getElementById("reviewMetadata").innerHTML = metadata
    .map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`)
    .join("");

  document.getElementById("reviewGates").innerHTML = Object.entries(item.gates)
    .map(
      ([gate, checked]) => `
        <label>
          <span>${formatStatus(gate)}</span>
          <input type="checkbox" data-gate="${gate}" ${checked ? "checked" : ""}>
        </label>
      `
    )
    .join("");

  document.querySelectorAll("[data-gate]").forEach((input) => {
    input.addEventListener("change", () => {
      item.gates[input.dataset.gate] = input.checked;
      saveReviewQueue();
      renderReviewMetrics();
    });
  });
}

function renderReviewWorkspace() {
  renderReviewMetrics();
  renderReviewQueue();
  renderReviewDetail();
}

function saveReviewQueue() {
  localStorage.setItem("xanvera-review-queue", JSON.stringify(reviewItems));
}

function updateReviewStatus(status) {
  const item = selectedReviewItem();
  if (!item) return;

  item.status = status;
  item.review_notes = document.getElementById("reviewNotes").value;
  saveReviewQueue();
  renderReviewWorkspace();
}

async function loadReviewQueue() {
  const saved = localStorage.getItem("xanvera-review-queue");
  if (saved) {
    reviewItems = JSON.parse(saved);
    renderReviewWorkspace();
    return;
  }

  try {
    const response = await fetch("data/admin/question-review-queue.json");
    if (!response.ok) throw new Error("Review data unavailable");
    const queue = await response.json();
    reviewItems = queue.items;
  } catch {
    reviewItems = seedReviewQueue.items;
  } finally {
    renderReviewWorkspace();
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
document.getElementById("reviewFilter")?.addEventListener("change", (event) => {
  activeReviewFilter = event.target.value;
  const items = filteredReviewItems();
  if (items.length) {
    selectedReviewIndex = reviewItems.findIndex((item) => item.id === items[0].id);
  }
  renderReviewWorkspace();
});
document.querySelectorAll("[data-review-action]").forEach((button) => {
  button.addEventListener("click", () => updateReviewStatus(button.dataset.reviewAction));
});
document.getElementById("reviewNotes")?.addEventListener("input", (event) => {
  const item = selectedReviewItem();
  if (!item) return;
  item.review_notes = event.target.value;
  saveReviewQueue();
});

applyTheme(localStorage.getItem(themeStorageKey) || "system");
loadPracticeSet();
loadReviewQueue();
