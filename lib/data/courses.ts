export type CourseShell = {
  id: string;
  title: string;
  short: string;
  category: string;
  status: string;
  readiness: number;
  focus: string;
  format: string;
  units: number;
  active?: boolean;
};

export const apCourses: CourseShell[] = [
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

export function getCourseById(courseId: string) {
  return apCourses.find((course) => course.id === courseId) || apCourses[0];
}
