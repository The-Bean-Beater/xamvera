const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const themeButtons = document.querySelectorAll("[data-theme-option]");
const themeStorageKey = "xamvera-theme";

const apCourses = [
  {
    id: "ap-world-history-modern",
    title: "AP World History: Modern",
    short: "AP World",
    category: "History & Social Science",
    status: "Active beta",
    readiness: 35,
    focus: "Global processes, causation, comparison, continuity and change",
    format: "MCQ, SAQ, DBQ, LEQ",
    units: 9,
    active: true
  },
  {
    id: "ap-united-states-history",
    title: "AP United States History",
    short: "APUSH",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "U.S. political, social, economic, and cultural development",
    format: "MCQ, SAQ, DBQ, LEQ",
    units: 9
  },
  {
    id: "ap-european-history",
    title: "AP European History",
    short: "AP Euro",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "European political, intellectual, social, and economic change",
    format: "MCQ, SAQ, DBQ, LEQ",
    units: 9
  },
  {
    id: "ap-united-states-government-and-politics",
    title: "AP United States Government and Politics",
    short: "AP Gov",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Foundations, branches, civil liberties, participation, policy",
    format: "MCQ and FRQ",
    units: 5
  },
  {
    id: "ap-comparative-government-and-politics",
    title: "AP Comparative Government and Politics",
    short: "AP Comp Gov",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Political systems, institutions, participation, policy comparison",
    format: "MCQ and FRQ",
    units: 5
  },
  {
    id: "ap-human-geography",
    title: "AP Human Geography",
    short: "AP HUG",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Population, culture, cities, agriculture, industry, development",
    format: "MCQ and FRQ",
    units: 7
  },
  {
    id: "ap-psychology",
    title: "AP Psychology",
    short: "AP Psych",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Scientific foundations, cognition, behavior, development, disorders",
    format: "MCQ and FRQ",
    units: 9
  },
  {
    id: "ap-macroeconomics",
    title: "AP Macroeconomics",
    short: "AP Macro",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "National income, financial sector, stabilization, open economies",
    format: "MCQ and FRQ",
    units: 6
  },
  {
    id: "ap-microeconomics",
    title: "AP Microeconomics",
    short: "AP Micro",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Supply, demand, markets, firm behavior, market failure",
    format: "MCQ and FRQ",
    units: 6
  },
  {
    id: "ap-african-american-studies",
    title: "AP African American Studies",
    short: "AP African American Studies",
    category: "History & Social Science",
    status: "Placeholder",
    readiness: 8,
    focus: "African American history, culture, movements, and interdisciplinary sources",
    format: "MCQ, short answer, project",
    units: 4
  },
  {
    id: "ap-biology",
    title: "AP Biology",
    short: "AP Bio",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Evolution, cellular processes, genetics, ecology, data analysis",
    format: "MCQ and FRQ",
    units: 8
  },
  {
    id: "ap-chemistry",
    title: "AP Chemistry",
    short: "AP Chem",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Atomic structure, bonding, reactions, equilibrium, thermodynamics",
    format: "MCQ and FRQ",
    units: 9
  },
  {
    id: "ap-environmental-science",
    title: "AP Environmental Science",
    short: "APES",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Ecosystems, populations, resources, pollution, global change",
    format: "MCQ and FRQ",
    units: 9
  },
  {
    id: "ap-physics-1-algebra-based",
    title: "AP Physics 1: Algebra-Based",
    short: "AP Physics 1",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Kinematics, dynamics, energy, momentum, rotation, waves",
    format: "MCQ and FRQ",
    units: 8
  },
  {
    id: "ap-physics-2-algebra-based",
    title: "AP Physics 2: Algebra-Based",
    short: "AP Physics 2",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Fluids, thermodynamics, electricity, magnetism, optics, modern physics",
    format: "MCQ and FRQ",
    units: 7
  },
  {
    id: "ap-physics-c-mechanics",
    title: "AP Physics C: Mechanics",
    short: "AP Physics C Mech",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Calculus-based mechanics, energy, momentum, rotation, gravitation",
    format: "MCQ and FRQ",
    units: 7
  },
  {
    id: "ap-physics-c-electricity-and-magnetism",
    title: "AP Physics C: Electricity and Magnetism",
    short: "AP Physics C E&M",
    category: "Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Electrostatics, circuits, magnetic fields, electromagnetism",
    format: "MCQ and FRQ",
    units: 5
  },
  {
    id: "ap-calculus-ab",
    title: "AP Calculus AB",
    short: "AP Calc AB",
    category: "Math & Computer Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Limits, derivatives, integrals, differential equations, applications",
    format: "MCQ and FRQ",
    units: 8
  },
  {
    id: "ap-calculus-bc",
    title: "AP Calculus BC",
    short: "AP Calc BC",
    category: "Math & Computer Science",
    status: "Placeholder",
    readiness: 8,
    focus: "AB topics plus parametric, polar, vector, and series analysis",
    format: "MCQ and FRQ",
    units: 10
  },
  {
    id: "ap-statistics",
    title: "AP Statistics",
    short: "AP Stats",
    category: "Math & Computer Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Data, probability, sampling, inference, statistical communication",
    format: "MCQ and FRQ",
    units: 9
  },
  {
    id: "ap-precalculus",
    title: "AP Precalculus",
    short: "AP Precalc",
    category: "Math & Computer Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Polynomial, rational, exponential, logarithmic, trigonometric, polar functions",
    format: "MCQ and FRQ",
    units: 4
  },
  {
    id: "ap-computer-science-a",
    title: "AP Computer Science A",
    short: "AP CSA",
    category: "Math & Computer Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Java programming, objects, arrays, algorithms, inheritance",
    format: "MCQ and FRQ",
    units: 10
  },
  {
    id: "ap-computer-science-principles",
    title: "AP Computer Science Principles",
    short: "AP CSP",
    category: "Math & Computer Science",
    status: "Placeholder",
    readiness: 8,
    focus: "Computing systems, networks, data, algorithms, programming, impacts",
    format: "MCQ and performance task",
    units: 5
  },
  {
    id: "ap-english-language-and-composition",
    title: "AP English Language and Composition",
    short: "AP Lang",
    category: "English",
    status: "Placeholder",
    readiness: 8,
    focus: "Rhetorical analysis, argument, synthesis, source-based writing",
    format: "MCQ and essays",
    units: 9
  },
  {
    id: "ap-english-literature-and-composition",
    title: "AP English Literature and Composition",
    short: "AP Lit",
    category: "English",
    status: "Placeholder",
    readiness: 8,
    focus: "Poetry, prose, drama, literary argument, close reading",
    format: "MCQ and essays",
    units: 9
  }
];

const seedPracticeSet = {
  course: "AP World History: Modern",
  unit: "Starter Practice",
  rights: "Original XamVera seed questions for public demo use.",
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
let selectedCourseId = "ap-world-history-modern";
let activeCourseFilter = "all";
let activePracticeMode = "MCQ";
let reviewItems = [];
let approvedQuestionBank = [];
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
      revision_feedback: "",
      gates: {
        source_verified: true,
        answer_verified: true,
        explanation_verified: false,
        copyright_checked: true
      }
    }
  ]
};

function getCourseById(courseId) {
  return apCourses.find((course) => course.id === courseId) || apCourses[0];
}

function showView(viewId) {
  if (viewId === "review" && window.location.hash !== "#admin-review") {
    window.location.hash = "admin-review";
  }

  views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  const topbarContext = document.getElementById("topbarContext");
  const activeView = document.getElementById(viewId);
  const viewTitle = activeView?.querySelector("h1")?.textContent || "Home";
  if (topbarContext) topbarContext.textContent = viewTitle;

  sidebar?.classList.remove("open");
}

function showInitialViewFromHash() {
  if (window.location.hash === "#admin-review") {
    showView("review");
  }
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

function courseStatusClass(course) {
  return course.active ? "active" : "placeholder";
}

function filteredCourses() {
  if (activeCourseFilter === "all") return apCourses;
  return apCourses.filter((course) => course.category === activeCourseFilter);
}

function renderCourseCatalog() {
  const courseGrid = document.getElementById("courseGrid");
  const courseCount = document.getElementById("courseCount");
  if (!courseGrid) return;

  if (courseCount) courseCount.textContent = apCourses.length;

  courseGrid.innerHTML = filteredCourses()
    .map(
      (course) => `
        <article class="course-card ${course.id === selectedCourseId ? "selected" : ""}" data-course-id="${course.id}">
          <div class="course-card-top">
            <span>${course.category}</span>
            <mark class="${courseStatusClass(course)}">${course.status}</mark>
          </div>
          <h2>${course.title}</h2>
          <p>${course.focus}</p>
          <div class="course-meta">
            <span>${course.units} units</span>
            <span>${course.format}</span>
          </div>
          <button class="secondary-button compact" type="button" data-course-practice="${course.id}">Practice</button>
        </article>
      `
    )
    .join("");

  renderCourseDetail();
}

function renderCourseDetail() {
  const detail = document.getElementById("courseDetail");
  if (!detail) return;

  const course = getCourseById(selectedCourseId);
  const unitItems = Array.from({ length: course.units }, (_, index) => {
    const unitNumber = index + 1;
    const stateClass = course.active && unitNumber <= 2 ? "active" : "";
    return `<span class="${stateClass}">Unit ${unitNumber}</span>`;
  }).join("");

  detail.innerHTML = `
    <span class="panel-label">Selected Course</span>
    <h2>${course.title}</h2>
    <p>${course.focus}</p>
    <div class="course-detail-list">
      <div>
        <strong>Category</strong>
        <span>${course.category}</span>
      </div>
      <div>
        <strong>Exam format</strong>
        <span>${course.format}</span>
      </div>
      <div>
        <strong>Status</strong>
        <span>${course.status}</span>
      </div>
    </div>
    <div class="unit-pill-grid" aria-label="${course.short} units">
      ${unitItems}
    </div>
    <button class="primary-button" type="button" data-course-practice="${course.id}">Open Practice</button>
  `;
}

function renderPracticeCourseSelect() {
  const select = document.getElementById("practiceCourseSelect");
  if (!select) return;

  select.innerHTML = apCourses
    .map((course) => `<option value="${course.id}" ${course.id === selectedCourseId ? "selected" : ""}>${course.title}</option>`)
    .join("");
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

function isActiveMcqPractice() {
  const course = getCourseById(selectedCourseId);
  return course.active && activePracticeMode === "MCQ";
}

function renderPracticePlaceholder(course) {
  const elements = getPracticeElements();
  if (!elements.prompt) return;

  const modeName = activePracticeMode === "MCQ" ? "MCQ Practice" : `${activePracticeMode} Mode`;
  elements.counter.textContent = modeName;
  elements.meta.textContent = `${course.category} | ${course.status}`;
  elements.stimulus.textContent =
    course.active
      ? "This mode is staged for the next build. The public beta currently has MCQ seed practice for AP World."
      : "This course shell is ready for layout testing. Questions will appear after the source, remix, and approval databases are connected.";
  elements.prompt.textContent = `${course.title} practice is queued for the approved question bank.`;
  elements.feedback.hidden = true;
  elements.feedback.innerHTML = "";
  elements.next.textContent = "Queued";
  elements.stack.innerHTML = `
    <div class="empty-state-row">Source bank pending</div>
    <div class="empty-state-row">Remix review pending</div>
    <div class="empty-state-row">Approved practice pending</div>
  `;
}

function renderQuestion() {
  const elements = getPracticeElements();
  if (!elements.prompt) return;

  const course = getCourseById(selectedCourseId);
  if (!isActiveMcqPractice() || !practiceSet.questions.length) {
    renderPracticePlaceholder(course);
    return;
  }

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

function renderPracticeSidebar() {
  const course = getCourseById(selectedCourseId);
  const badge = document.getElementById("practiceCourseBadge");
  const title = document.getElementById("practiceCourseTitle");
  const sourceList = document.getElementById("practiceSourceList");
  const modeLabel = document.getElementById("practiceModeLabel");

  if (badge) badge.textContent = course.status;
  if (title) title.textContent = course.title;
  if (modeLabel) modeLabel.textContent = activePracticeMode === "MCQ" ? "MCQ Practice" : `${activePracticeMode} Mode`;

  if (!sourceList) return;
  const sourceRows = course.active
    ? [
        ["Public practice", "Original AP-style seed questions"],
        ["Source bank", "College Board and third-party materials kept private"],
        ["Review gate", "Remixed questions must be approved before publishing"]
      ]
    : [
        ["Course shell", "Navigation and layout placeholder ready"],
        ["Source bank", "No public questions connected yet"],
        ["Practice status", "Waiting for approved question database"]
      ];

  sourceList.innerHTML = sourceRows
    .map(
      ([label, value]) => `
        <div>
          <strong>${label}</strong>
          <span>${value}</span>
        </div>
      `
    )
    .join("");
}

function renderPracticeWorkspace() {
  renderPracticeCourseSelect();
  renderPracticeSidebar();
  renderQuestion();
}

function selectAnswer(answerIndex) {
  if (!isActiveMcqPractice()) return;

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
  if (!isActiveMcqPractice()) return;

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
    renderPracticeWorkspace();
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
  document.getElementById("questionBankCount").textContent = approvedQuestionBank.length;
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
  document.getElementById("revisionFeedback").value = item.revision_feedback || "";
  setReviewMessage("");

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

  renderApprovedBank();
}

function renderReviewWorkspace() {
  renderReviewMetrics();
  renderReviewQueue();
  renderReviewDetail();
}

function saveReviewQueue() {
  localStorage.setItem("xanvera-review-queue", JSON.stringify(reviewItems));
}

function saveQuestionBank() {
  localStorage.setItem("xanvera-approved-question-bank", JSON.stringify(approvedQuestionBank));
}

function setReviewMessage(message, type = "") {
  const element = document.getElementById("reviewMessage");
  if (!element) return;
  element.hidden = !message;
  element.textContent = message;
  element.className = `review-message ${type}`;
}

function allGatesPassed(item) {
  return Object.values(item.gates || {}).every(Boolean);
}

function toApprovedQuestion(item) {
  return {
    id: item.id,
    course: item.course,
    unit: item.unit,
    period: item.period,
    skill: item.skill,
    difficulty: item.difficulty,
    source_type: item.source_type,
    similarity_risk: item.similarity_risk,
    stimulus: item.stimulus,
    prompt: item.prompt,
    choices: item.choices,
    answer_index: item.answer_index,
    explanation: item.explanation,
    status: "approved",
    approved_at: new Date().toISOString()
  };
}

function addToQuestionBank(item) {
  const approvedQuestion = toApprovedQuestion(item);
  const existingIndex = approvedQuestionBank.findIndex((question) => question.id === item.id);
  if (existingIndex >= 0) {
    approvedQuestionBank[existingIndex] = approvedQuestion;
  } else {
    approvedQuestionBank.push(approvedQuestion);
  }
  saveQuestionBank();
}

function removeFromQuestionBank(itemId) {
  approvedQuestionBank = approvedQuestionBank.filter((question) => question.id !== itemId);
  saveQuestionBank();
}

function renderApprovedBank() {
  const element = document.getElementById("approvedBankList");
  if (!element) return;

  if (!approvedQuestionBank.length) {
    element.innerHTML = '<div class="approved-bank-item"><span>No approved questions yet.</span></div>';
    return;
  }

  element.innerHTML = approvedQuestionBank
    .map(
      (question) => `
        <div class="approved-bank-item">
          <strong>${question.skill}</strong>
          <span>${question.unit}</span>
        </div>
      `
    )
    .join("");
}

function seedApprovedBankFromQueue() {
  reviewItems
    .filter((item) => item.status === "approved" && allGatesPassed(item))
    .forEach(addToQuestionBank);
}

function updateReviewStatus(status) {
  const item = selectedReviewItem();
  if (!item) return;
  let message = "";
  let messageType = "success";

  item.review_notes = document.getElementById("reviewNotes").value;
  item.revision_feedback = document.getElementById("revisionFeedback").value.trim();

  if (status === "approved" && !allGatesPassed(item)) {
    setReviewMessage("Complete every review gate before approving this question.", "error");
    return;
  }

  if (status === "needs_revision" && !item.revision_feedback) {
    setReviewMessage("Write revision feedback before sending this question back for changes.", "error");
    return;
  }

  item.status = status;
  if (status === "approved") {
    addToQuestionBank(item);
    message = "Approved and saved to the local approved question bank.";
  } else {
    removeFromQuestionBank(item.id);
    message = status === "rejected" ? "Rejected and removed from the approved bank." : "Saved as needs revision with feedback.";
    messageType = status === "rejected" ? "error" : "success";
  }

  saveReviewQueue();
  renderReviewWorkspace();
  setReviewMessage(message, messageType);
}

async function loadReviewQueue() {
  const savedBank = localStorage.getItem("xanvera-approved-question-bank");
  if (savedBank) {
    approvedQuestionBank = JSON.parse(savedBank);
  }

  let fetchedItems = seedReviewQueue.items;

  try {
    const response = await fetch("data/admin/question-review-queue.json");
    if (!response.ok) throw new Error("Review data unavailable");
    const queue = await response.json();
    fetchedItems = queue.items;
  } catch {
    fetchedItems = seedReviewQueue.items;
  } finally {
    const saved = localStorage.getItem("xanvera-review-queue");
    if (saved) {
      const mergedItems = new Map(fetchedItems.map((item) => [item.id, item]));
      JSON.parse(saved).forEach((item) => {
        mergedItems.set(item.id, item);
      });
      reviewItems = Array.from(mergedItems.values());
    } else {
      reviewItems = fetchedItems;
    }

    if (!savedBank) {
      seedApprovedBankFromQueue();
    }
    saveReviewQueue();
    renderReviewWorkspace();
  }
}

menuButton?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => showView(item.dataset.view));
});

document.addEventListener("click", (event) => {
  const viewTarget = event.target.closest("[data-view-link], [data-view-target]");
  if (viewTarget) {
    event.preventDefault();
    showView(viewTarget.dataset.viewLink || viewTarget.dataset.viewTarget);
  }
});

document.getElementById("courseGrid")?.addEventListener("click", (event) => {
  const practiceButton = event.target.closest("[data-course-practice]");
  const courseCard = event.target.closest("[data-course-id]");

  if (practiceButton) {
    selectedCourseId = practiceButton.dataset.coursePractice;
    currentQuestionIndex = 0;
    renderCourseCatalog();
    renderPracticeWorkspace();
    showView("practice");
    return;
  }

  if (courseCard) {
    selectedCourseId = courseCard.dataset.courseId;
    renderCourseCatalog();
    renderPracticeWorkspace();
  }
});

document.getElementById("courseDetail")?.addEventListener("click", (event) => {
  const practiceButton = event.target.closest("[data-course-practice]");
  if (!practiceButton) return;

  selectedCourseId = practiceButton.dataset.coursePractice;
  currentQuestionIndex = 0;
  renderCourseCatalog();
  renderPracticeWorkspace();
  showView("practice");
});

document.querySelectorAll("[data-course-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCourseFilter = button.dataset.courseFilter;
    document.querySelectorAll("[data-course-filter]").forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });
    renderCourseCatalog();
  });
});

document.getElementById("practiceCourseSelect")?.addEventListener("change", (event) => {
  selectedCourseId = event.target.value;
  currentQuestionIndex = 0;
  renderCourseCatalog();
  renderPracticeWorkspace();
});

document.querySelectorAll("[data-practice-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    activePracticeMode = button.dataset.practiceMode;
    document.querySelectorAll("[data-practice-mode]").forEach((modeButton) => {
      modeButton.classList.toggle("active", modeButton === button);
    });
    renderPracticeWorkspace();
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
document.getElementById("revisionFeedback")?.addEventListener("input", (event) => {
  const item = selectedReviewItem();
  if (!item) return;
  item.revision_feedback = event.target.value;
  saveReviewQueue();
});

window.addEventListener("hashchange", showInitialViewFromHash);

applyTheme(localStorage.getItem(themeStorageKey) || "system");
renderCourseCatalog();
renderPracticeCourseSelect();
loadPracticeSet();
loadReviewQueue();
showInitialViewFromHash();
