const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const appShell = document.querySelector(".app-shell");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const themeButtons = document.querySelectorAll("[data-theme-option]");
const themeStorageKey = "xamvera-theme";
const sidebarStorageKey = "xamvera-sidebar-collapsed";

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
let activeReviewFilter = "needs_review";

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

const generatorBlueprints = {
  imageSets: [
    {
      set_id: "local-img-mansa-musa",
      set_title: "Mansa Musa in a Fourteenth-Century Mediterranean Map",
      unit: "Unit 2: Networks of Exchange",
      period: "c. 1200-c. 1450",
      difficulty: "Medium",
      stimulus_format: "image_set",
      stimulus:
        "Image stimulus under review: a fourteenth-century Mediterranean map panel depicts the ruler of Mali seated in West Africa, holding a gold object and wearing a crown. The surrounding map labels and visual placement connect Mali to North Africa and Mediterranean geographic knowledge.",
      stimulus_assets: [
        {
          kind: "image",
          asset_status: "verified_public_domain_candidate_needs_local_asset",
          title: "Mansa Musa detail from the Catalan Atlas",
          source_url: "https://commons.wikimedia.org/wiki/File:Mansa_Musa.jpg",
          rights_notes: "Wikimedia Commons lists this as a public-domain faithful reproduction. Verify before publishing.",
          alt_text: "Map detail showing Mansa Musa seated with a gold object in West Africa."
        }
      ],
      questions: [
        {
          skill: "Contextualization",
          prompt: "The image is best understood in the context of which broader development?",
          choices: [
            "The expansion of trans-Saharan trade networks that linked West Africa to North Africa and the Mediterranean",
            "The collapse of Islamic influence in West African states after 1200",
            "The replacement of gold exports by plantation sugar production in Mali",
            "The isolation of Mediterranean mapmakers from Afro-Eurasian commercial information"
          ],
          answer_index: 0,
          explanation:
            "Mali's wealth and reputation were shaped by trans-Saharan exchanges in gold, salt, scholarship, and religious ideas connecting West Africa to wider Afro-Eurasian networks."
        },
        {
          skill: "Causation",
          prompt: "Which development most directly contributed to Mali being represented in this way?",
          choices: [
            "Demand for West African gold and the growth of caravan routes across the Sahara",
            "The spread of steam-powered transport through the interior of Africa",
            "Portuguese control over all West African commerce before 1450",
            "The decline of commercial cities such as Timbuktu and Gao"
          ],
          answer_index: 0,
          explanation:
            "The depiction reflects Mali's association with gold wealth, which circulated through caravan trade and helped make West African states known to observers beyond the region."
        },
        {
          skill: "Sourcing",
          prompt: "Which statement best describes a limitation of using the image as evidence about Mali?",
          choices: [
            "It reflects an outside mapmaker's representation and should be compared with evidence from West African and Arabic sources.",
            "It proves that Mali's rulers personally drew most Mediterranean maps.",
            "It shows that written geographic knowledge had disappeared in Europe.",
            "It can only be used to study military technology, not trade or cultural exchange."
          ],
          answer_index: 0,
          explanation:
            "The image is useful evidence for Mali's reputation abroad, but it was produced outside Mali and should be interpreted alongside other sources."
        }
      ]
    },
    {
      set_id: "local-img-ottoman-cannon",
      set_title: "Ottoman Siege Artillery in the Early Modern Period",
      unit: "Unit 3: Land-Based Empires",
      period: "c. 1450-c. 1750",
      difficulty: "Medium",
      stimulus_format: "image_set",
      stimulus:
        "Image stimulus under review: an early modern scene shows Ottoman soldiers operating large cannon near fortified walls. The image emphasizes the scale of siege warfare and the logistical organization needed to move and fire heavy artillery.",
      stimulus_assets: [
        {
          kind: "image",
          asset_status: "public_domain_search_target_needs_verification",
          title: "Ottoman cannon or siege-artillery image",
          source_url: "https://commons.wikimedia.org/wiki/Category:Ottoman_cannons",
          rights_notes: "Use a specific verified public-domain or freely licensed image before publishing.",
          alt_text: "Ottoman artillery positioned near a fortified city wall."
        }
      ],
      questions: [
        {
          skill: "Causation",
          prompt: "Which development most directly enabled the military activity shown in the image?",
          choices: [
            "The adoption of gunpowder weapons by expanding land-based empires",
            "The abandonment of centralized military forces by early modern states",
            "The end of competition among empires in Afro-Eurasia",
            "The replacement of taxation by voluntary military service"
          ],
          answer_index: 0,
          explanation:
            "Gunpowder artillery helped several land-based empires conquer fortified cities and expand territorial control."
        },
        {
          skill: "Contextualization",
          prompt: "The image would be most useful for studying which broader process?",
          choices: [
            "The consolidation of imperial authority through military technology and administrative capacity",
            "The decline of state involvement in warfare after 1450",
            "The spread of industrial factory production in the thirteenth century",
            "The disappearance of fortifications from early modern cities"
          ],
          answer_index: 0,
          explanation:
            "Artillery required revenue, specialists, transport, and command systems, linking military change to the growth of powerful imperial states."
        },
        {
          skill: "Comparison",
          prompt: "Which comparison best connects the image to other empires in the same period?",
          choices: [
            "Ottoman, Safavid, and Mughal rulers all used gunpowder forces while adapting them to different regional conditions.",
            "Only the Ottoman Empire used firearms, while all other empires rejected them.",
            "Gunpowder weapons ended the need for armies in both Europe and Asia.",
            "All early modern empires relied on identical systems of taxation and recruitment."
          ],
          answer_index: 0,
          explanation:
            "Gunpowder technologies spread widely, but rulers incorporated them into distinct imperial, fiscal, and military systems."
        }
      ]
    }
  ],
  documentSets: [
    {
      set_id: "local-doc-kongo-afonso",
      set_title: "A Kongo Ruler Responds to Portuguese Trade",
      unit: "Unit 4: Transoceanic Interconnections",
      period: "c. 1450-c. 1750",
      difficulty: "Hard",
      stimulus_format: "document_set",
      stimulus:
        "Document stimulus, classroom paraphrase for review: A ruler of Kongo writes to the king of Portugal in 1526 that merchants and royal officials have brought prohibited goods into his kingdom and weakened his authority over local elites. He argues that people from his realm, including nobles and relatives, are being seized and sold, causing disorder and depopulation. The ruler asks Portugal to stop sending goods that encourage illegal trade and instead send priests and teachers who can support Christian instruction. He presents himself as a Christian monarch and political ally, but he insists that foreign commerce must not undermine the security, population, and sovereignty of Kongo.",
      document_source: {
        author: "Nzinga Mbemba, also known as Afonso I of Kongo",
        date: "1526",
        source_url: "https://worldhistorycommons.org/excerpt-letter-nzinga-mbemba-portuguese-king-joao-iii",
        rights_notes: "Stimulus is an original XamVera paraphrase. Verify source, wording, and classroom rights before publishing.",
        verification_status: "source_identified_needs_human_verification"
      },
      questions: [
        {
          skill: "Sourcing",
          prompt: "Which claim about the author's point of view is best supported by the document?",
          choices: [
            "He viewed Atlantic commerce as useful only if it remained under royal regulation and did not weaken Kongo's authority.",
            "He rejected all contact with Europeans because he opposed Christianity.",
            "He wrote as a merchant seeking permission to expand private slave trading.",
            "He believed Portuguese officials had strengthened Kongo by ignoring royal authority."
          ],
          answer_index: 0,
          explanation:
            "The paraphrased letter presents the ruler as willing to maintain selected ties with Portugal while criticizing commerce that threatened his kingdom."
        },
        {
          skill: "Causation",
          prompt: "Which development most directly contributed to the problems described in the document?",
          choices: [
            "The growth of Atlantic trading networks and the forced movement of enslaved Africans",
            "The collapse of all European demand for African labor",
            "The spread of industrial textile factories in Central Africa",
            "The end of Portuguese maritime activity after 1450"
          ],
          answer_index: 0,
          explanation:
            "The ruler's complaints reflect the expansion of Atlantic commerce, including slave trading, and its disruptive effects on African states and societies."
        },
        {
          skill: "Contextualization",
          prompt: "The document is most useful for contextualizing which broader pattern?",
          choices: [
            "African rulers negotiated, resisted, and sometimes tried to regulate European commercial influence.",
            "European merchants immediately ended coercive labor systems in the Atlantic world.",
            "Central African states were isolated from Christianity and diplomacy.",
            "Portuguese influence in Africa depended entirely on industrial machinery."
          ],
          answer_index: 0,
          explanation:
            "The document shows that African rulers were active political actors who attempted to manage the terms and consequences of early Atlantic exchange."
        }
      ]
    },
    {
      set_id: "local-doc-qing-macartney",
      set_title: "The Qing Court Responds to a British Embassy",
      unit: "Unit 4: Transoceanic Interconnections",
      period: "c. 1450-c. 1750",
      difficulty: "Hard",
      stimulus_format: "document_set",
      stimulus:
        "Document stimulus, classroom paraphrase for review: In a 1793 response to a British diplomatic mission, the Qing emperor acknowledges that the British king has sent tribute and requested broader trade privileges. The emperor states that the empire already possesses abundant goods and has no need to import foreign manufactures. He rejects requests for a permanent British representative at court and for expanded trading rights outside existing regulations. The response presents Qing authority as universal and hierarchical, while treating foreign trade as something the state may restrict in order to preserve order.",
      document_source: {
        author: "Qianlong Emperor",
        date: "1793",
        source_url: "https://sourcebooks.web.fordham.edu/mod/1793qianlong.asp",
        rights_notes: "Stimulus is an original XamVera paraphrase. Verify the source and note historiographical cautions about the letter's transmission before publishing.",
        verification_status: "source_identified_needs_human_verification"
      },
      questions: [
        {
          skill: "Sourcing",
          prompt: "Which statement best explains how the author's purpose shapes the document?",
          choices: [
            "The response defends Qing diplomatic hierarchy and justifies limiting British commercial demands.",
            "The response asks Britain to colonize coastal China and manage Qing trade.",
            "The response promotes free trade as the only legitimate basis of diplomacy.",
            "The response rejects all state regulation of merchants."
          ],
          answer_index: 0,
          explanation:
            "The paraphrased response frames trade and diplomacy through Qing claims of authority and uses that framework to deny British requests."
        },
        {
          skill: "Contextualization",
          prompt: "The British requests described in the document are best understood in the context of which development?",
          choices: [
            "European efforts to expand commercial access to Asian markets during the early modern period",
            "The immediate collapse of Qing rule after 1450",
            "The replacement of maritime trade by trans-Saharan caravan exchange",
            "The end of European chartered-company activity in Asia before 1600"
          ],
          answer_index: 0,
          explanation:
            "European states and companies sought greater access to Asian goods and markets, even when Asian states restricted foreign trade."
        },
        {
          skill: "Continuity and Change",
          prompt: "Which statement best explains both continuity and change related to the document?",
          choices: [
            "Asian states continued to regulate trade, while European pressure for expanded access increased in the eighteenth century.",
            "Asian states abandoned all control over foreign merchants after 1450.",
            "European states stopped seeking Asian goods once Atlantic trade began.",
            "Qing officials replaced diplomacy with industrial mass production."
          ],
          answer_index: 0,
          explanation:
            "The document reflects continued state regulation of commerce as well as growing European pressure to alter the terms of trade."
        }
      ]
    }
  ],
  shortScenarios: [
    {
      unit: "Unit 1: The Global Tapestry",
      period: "c. 1200-c. 1450",
      skill: "Comparison",
      difficulty: "Medium",
      stimulus:
        "Two rulers in different regions sponsor religious scholars, appoint provincial officials, and use tax records to supervise large agrarian populations.",
      prompt: "Which comparison is best supported by the scenario?",
      choices: [
        "States in different regions used religious legitimacy and administration to strengthen rule.",
        "States in this period generally abandoned religion as a source of authority.",
        "Agrarian states avoided taxation because trade made revenue unnecessary.",
        "Large states became less centralized as bureaucratic offices expanded."
      ],
      answer_index: 0,
      explanation:
        "Many states combined claims of religious legitimacy with officials, taxation, and recordkeeping to maintain authority over large populations."
    },
    {
      unit: "Unit 2: Networks of Exchange",
      period: "c. 1200-c. 1450",
      skill: "Causation",
      difficulty: "Medium",
      stimulus:
        "Merchants traveling between inland cities and coastal ports use bills of exchange, caravanserai, and multilingual brokers to move goods across long distances.",
      prompt: "Which development most directly contributed to the commercial activity described?",
      choices: [
        "The growth of interregional trade networks linking Afro-Eurasian societies",
        "The disappearance of luxury trade across the Indian Ocean",
        "The isolation of inland cities from maritime exchange",
        "The replacement of merchant activity with state-owned factories"
      ],
      answer_index: 0,
      explanation:
        "Commercial practices, credit instruments, and support facilities helped merchants participate in expanding land and maritime networks."
    },
    {
      unit: "Unit 5: Revolutions",
      period: "c. 1750-c. 1900",
      skill: "Causation",
      difficulty: "Medium",
      stimulus:
        "A group of reformers argues that legitimate governments should protect individual rights and derive authority from the consent of citizens.",
      prompt: "Which intellectual development most directly influenced the reformers' argument?",
      choices: [
        "Enlightenment ideas about natural rights and popular sovereignty",
        "Mercantilist support for royal monopolies",
        "The rejection of written constitutions by revolutionary leaders",
        "The belief that political authority should never be debated"
      ],
      answer_index: 0,
      explanation:
        "Enlightenment thinkers advanced ideas about rights, consent, and sovereignty that influenced revolutionary and reform movements."
    },
    {
      unit: "Unit 6: Consequences of Industrialization",
      period: "c. 1750-c. 1900",
      skill: "Continuity and Change",
      difficulty: "Hard",
      stimulus:
        "A colonial administration expands railroads from inland mines to coastal ports while restricting local manufacturing that might compete with imported goods.",
      prompt: "Which statement best explains both change and continuity in this scenario?",
      choices: [
        "Industrial-era infrastructure expanded, while imperial economies often continued to prioritize extraction.",
        "Colonial governments generally promoted equal industrial development in all regions.",
        "Railroads ended the relationship between imperialism and global trade.",
        "Industrialization eliminated demand for raw materials from colonized regions."
      ],
      answer_index: 0,
      explanation:
        "Industrialization changed transportation and production, but imperial systems often continued to organize colonies around raw materials, export, and outside markets."
    },
    {
      unit: "Unit 7: Global Conflict",
      period: "c. 1900-present",
      skill: "Causation",
      difficulty: "Medium",
      stimulus:
        "A state mobilizes factories, censors newspapers, expands military conscription, and encourages citizens to buy war bonds.",
      prompt: "Which development most directly explains the state actions described?",
      choices: [
        "The rise of total war requiring large-scale economic and social mobilization",
        "The disappearance of state authority during twentieth-century conflicts",
        "The end of propaganda as a tool of governments",
        "The replacement of industrial warfare by local subsistence economies"
      ],
      answer_index: 0,
      explanation:
        "Twentieth-century total wars required states to mobilize industry, labor, finance, media, and civilians for military goals."
    },
    {
      unit: "Unit 8: Cold War and Decolonization",
      period: "c. 1900-present",
      skill: "Contextualization",
      difficulty: "Medium",
      stimulus:
        "A newly independent state seeks foreign aid from rival superpowers while also joining conferences with other recently decolonized nations.",
      prompt: "The state's actions are best understood in the context of which development?",
      choices: [
        "Decolonization and Cold War competition for influence in the Global South",
        "The complete withdrawal of superpowers from international politics",
        "The end of diplomatic activity among newly independent states",
        "The restoration of direct colonial rule after the Second World War"
      ],
      answer_index: 0,
      explanation:
        "Newly independent states often navigated Cold War pressures while pursuing development, sovereignty, and nonalignment."
    }
  ]
};

function getCourseById(courseId) {
  return apCourses.find((course) => course.id === courseId) || apCourses[0];
}

function isNarrowViewport() {
  return window.matchMedia("(max-width: 980px)").matches;
}

function applySidebarPreference() {
  if (!appShell) return;
  const collapsed = localStorage.getItem(sidebarStorageKey) === "true";
  const shouldCollapse = collapsed && !isNarrowViewport();
  appShell.classList.toggle("sidebar-collapsed", shouldCollapse);
  menuButton?.setAttribute("aria-label", shouldCollapse ? "Expand menu" : "Collapse menu");
}

function toggleSidebar() {
  if (isNarrowViewport()) {
    sidebar?.classList.toggle("open");
    const isOpen = sidebar?.classList.contains("open");
    menuButton?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    return;
  }

  const collapsed = !appShell?.classList.contains("sidebar-collapsed");
  appShell?.classList.toggle("sidebar-collapsed", collapsed);
  localStorage.setItem(sidebarStorageKey, String(collapsed));
  menuButton?.setAttribute("aria-label", collapsed ? "Expand menu" : "Collapse menu");
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

  if (isNarrowViewport()) {
    sidebar?.classList.remove("open");
    menuButton?.setAttribute("aria-label", "Open menu");
  }

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
    const localPublishedBank = localStorage.getItem("xamvera-published-approved-question-bank");
    if (localPublishedBank) {
      const bank = JSON.parse(localPublishedBank);
      if (bank.questions?.length) {
        practiceSet = {
          course: "AP World History: Modern",
          unit: "Approved Question Bank",
          rights: "Approved XamVera questions published from admin review.",
          questions: bank.questions
        };
        renderPracticeWorkspace();
        return;
      }
    }

    const bankResponse = await fetch("data/admin/approved-question-bank.json");
    if (bankResponse.ok) {
      const bank = await bankResponse.json();
      if (bank.questions?.length) {
        practiceSet = {
          course: "AP World History: Modern",
          unit: "Approved Question Bank",
          rights: "Approved XamVera questions published from admin review.",
          questions: bank.questions
        };
        renderPracticeWorkspace();
        return;
      }
    }

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

function copyValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function readCount(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return 0;
  const value = Number(input.value);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function nextLocalDraftId() {
  const current = Number(localStorage.getItem("xamvera-local-draft-sequence") || "0") + 1;
  localStorage.setItem("xamvera-local-draft-sequence", String(current));
  return `local-apwh-${String(current).padStart(4, "0")}`;
}

function sourceTypeForStimulusFormat(format) {
  if (format === "image_set") return "browser_generated_image_stimulus_public_domain_candidate";
  if (format === "document_set") return "browser_generated_document_paraphrase_source_identified";
  return "browser_generated_original_short_scenario";
}

function gatesForStimulusFormat(format) {
  const gates = {
    source_verified: false,
    answer_verified: false,
    explanation_verified: false,
    copyright_checked: true
  };

  if (format === "image_set") {
    gates.asset_rights_verified = false;
    gates.stimulus_verified = false;
  }

  if (format === "document_set") {
    gates.document_source_verified = false;
    gates.paraphrase_checked = false;
  }

  return gates;
}

function generationReviewNotes(draft) {
  const notes = [
    "Generated in the XamVera browser review console from original AP World templates.",
    "Private College Board source bank is not available in the browser and was not copied into this draft.",
    "Keep in needs_review until a human verifies accuracy, originality, and source rights."
  ];

  if (draft.stimulus_assets?.length) {
    notes.push(
      "Image source candidates: " +
        draft.stimulus_assets.map((asset) => `${asset.title}: ${asset.source_url}`).join(" | ")
    );
  }

  if (draft.document_source) {
    notes.push(
      `Document source candidate: ${draft.document_source.author}, ${draft.document_source.date}: ${draft.document_source.source_url}`
    );
  }

  return notes.join(" ");
}

function makeGeneratedSetDrafts(blueprint) {
  const setRunId = `${blueprint.set_id}-${nextLocalDraftId()}`;
  const linkedIds = blueprint.questions.map(() => nextLocalDraftId());

  return blueprint.questions.map((question, index) => {
    const draft = {
      id: linkedIds[index],
      status: "needs_review",
      course: "AP World History: Modern",
      unit: blueprint.unit,
      period: blueprint.period,
      skill: question.skill,
      difficulty: blueprint.difficulty,
      source_type: sourceTypeForStimulusFormat(blueprint.stimulus_format),
      similarity_risk: "low",
      stimulus_format: blueprint.stimulus_format,
      stimulus: blueprint.stimulus,
      prompt: question.prompt,
      choices: copyValue(question.choices),
      answer_index: question.answer_index,
      explanation: question.explanation,
      set_id: setRunId,
      set_title: blueprint.set_title,
      set_question_number: index + 1,
      set_question_count: blueprint.questions.length,
      linked_question_ids: linkedIds,
      review_notes: "",
      revision_feedback: "",
      generation_profile: {
        profile_source: "browser_review_console",
        pipeline_kind: blueprint.stimulus_format,
        private_source_text_used_in_output: false,
        private_source_leak_flags: []
      },
      gates: gatesForStimulusFormat(blueprint.stimulus_format)
    };

    if (blueprint.stimulus_assets) draft.stimulus_assets = copyValue(blueprint.stimulus_assets);
    if (blueprint.document_source) draft.document_source = copyValue(blueprint.document_source);
    draft.review_notes = generationReviewNotes(draft);
    return draft;
  });
}

function makeGeneratedShortDraft(blueprint) {
  const draft = {
    id: nextLocalDraftId(),
    status: "needs_review",
    course: "AP World History: Modern",
    unit: blueprint.unit,
    period: blueprint.period,
    skill: blueprint.skill,
    difficulty: blueprint.difficulty,
    source_type: sourceTypeForStimulusFormat("short_scenario"),
    similarity_risk: "low",
    stimulus_format: "short_scenario",
    stimulus: blueprint.stimulus,
    prompt: blueprint.prompt,
    choices: copyValue(blueprint.choices),
    answer_index: blueprint.answer_index,
    explanation: blueprint.explanation,
    review_notes: "",
    revision_feedback: "",
    generation_profile: {
      profile_source: "browser_review_console",
      pipeline_kind: "short_scenario",
      private_source_text_used_in_output: false,
      private_source_leak_flags: []
    },
    gates: gatesForStimulusFormat("short_scenario")
  };
  draft.review_notes = generationReviewNotes(draft);
  return draft;
}

function generateBlueprintDrafts() {
  const imageSetCount = readCount("imageSetCount");
  const documentSetCount = readCount("documentSetCount");
  const shortScenarioCount = readCount("shortScenarioCount");
  const drafts = [];

  for (let index = 0; index < imageSetCount; index += 1) {
    const blueprint = generatorBlueprints.imageSets[index % generatorBlueprints.imageSets.length];
    drafts.push(...makeGeneratedSetDrafts(blueprint));
  }

  for (let index = 0; index < documentSetCount; index += 1) {
    const blueprint = generatorBlueprints.documentSets[index % generatorBlueprints.documentSets.length];
    drafts.push(...makeGeneratedSetDrafts(blueprint));
  }

  for (let index = 0; index < shortScenarioCount; index += 1) {
    const blueprint = generatorBlueprints.shortScenarios[index % generatorBlueprints.shortScenarios.length];
    drafts.push(makeGeneratedShortDraft(blueprint));
  }

  return { drafts, imageSetCount, documentSetCount, shortScenarioCount };
}

function setGeneratorMessage(message, type = "") {
  const element = document.getElementById("generatorMessage");
  if (!element) return;
  element.hidden = !message;
  element.textContent = message;
  element.className = `generator-message ${type}`;
}

function generateDraftsForReview() {
  const { drafts, imageSetCount, documentSetCount, shortScenarioCount } = generateBlueprintDrafts();

  if (!drafts.length) {
    setGeneratorMessage("Pick at least one draft type to generate.", "error");
    return;
  }

  reviewItems = [...drafts, ...reviewItems];
  selectedReviewIndex = 0;
  activeReviewFilter = "needs_review";
  const filter = document.getElementById("reviewFilter");
  if (filter) filter.value = activeReviewFilter;
  saveReviewQueue();
  renderReviewWorkspace();

  setGeneratorMessage(
    `Generated ${drafts.length} review item${drafts.length === 1 ? "" : "s"}: ${imageSetCount} image set${imageSetCount === 1 ? "" : "s"}, ${documentSetCount} document set${documentSetCount === 1 ? "" : "s"}, ${shortScenarioCount} short scenario${shortScenarioCount === 1 ? "" : "s"}.`,
    "success"
  );
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
  renderPublishPackage();
}

function renderReviewQueue() {
  const queue = document.getElementById("reviewQueue");
  if (!queue) return;

  const items = filteredReviewItems();
  if (!items.length) {
    queue.innerHTML = '<div class="empty-state-row">No questions in this filter.</div>';
    return;
  }

  queue.innerHTML = items
    .map((item) => {
      const originalIndex = reviewItems.findIndex((candidate) => candidate.id === item.id);
      return `
        <button class="queue-item ${originalIndex === selectedReviewIndex ? "active" : ""}" type="button" data-review-index="${originalIndex}">
          <span class="queue-status ${item.status}">${formatStatus(item.status)}</span>
          <strong>${item.skill}</strong>
          <span>${item.unit}</span>
          <small>${formatStatus(item.stimulus_format || "short_scenario")}${item.set_question_count ? ` | Set ${item.set_question_number}/${item.set_question_count}` : ""}</small>
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

function renderReviewSourceDetails(item) {
  const section = document.getElementById("reviewSourceSection");
  const details = document.getElementById("reviewSourceDetails");
  if (!section || !details) return;

  const cards = [];

  if (item.set_id) {
    cards.push(`
      <article class="source-detail-card">
        <strong>Linked stimulus set</strong>
        <span>${item.set_title || item.set_id}</span>
        <small>Question ${item.set_question_number} of ${item.set_question_count}</small>
        <small>${(item.linked_question_ids || []).join(", ")}</small>
      </article>
    `);
  }

  if (item.document_source) {
    cards.push(`
      <article class="source-detail-card">
        <strong>Document source</strong>
        <span>${item.document_source.author}, ${item.document_source.date}</span>
        <a href="${item.document_source.source_url}" target="_blank" rel="noopener">Open source</a>
        <small>${formatStatus(item.document_source.verification_status || "needs_verification")}</small>
        <small>${item.document_source.rights_notes || ""}</small>
      </article>
    `);
  }

  (item.stimulus_assets || []).forEach((asset) => {
    cards.push(`
      <article class="source-detail-card">
        <strong>${asset.kind === "image" ? "Image source" : "Stimulus asset"}</strong>
        <span>${asset.title}</span>
        <a href="${asset.source_url}" target="_blank" rel="noopener">Open source</a>
        <small>${formatStatus(asset.asset_status || "needs_verification")}</small>
        <small>${asset.rights_notes || ""}</small>
        <small>${asset.alt_text || ""}</small>
      </article>
    `);
  });

  if (item.generation_profile) {
    cards.push(`
      <article class="source-detail-card">
        <strong>Generation profile</strong>
        <span>${formatStatus(item.generation_profile.pipeline_kind || item.stimulus_format || "unknown")}</span>
        <small>Profile source: ${item.generation_profile.profile_source || "not recorded"}</small>
        <small>Private source text used: ${item.generation_profile.private_source_text_used_in_output ? "yes" : "no"}</small>
      </article>
    `);
  }

  if (!cards.length) {
    section.hidden = true;
    details.innerHTML = "";
    return;
  }

  section.hidden = false;
  details.innerHTML = cards.join("");
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
  renderReviewSourceDetails(item);
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
    ["Format", formatStatus(item.stimulus_format || "short_scenario")],
    ["Difficulty", item.difficulty],
    ["Source", item.source_type],
    ["Similarity", item.similarity_risk]
  ];

  if (item.set_id) {
    metadata.push(["Set", item.set_title || item.set_id]);
    metadata.push(["Linked", `${item.set_question_number} of ${item.set_question_count}`]);
  }

  if (item.document_source) {
    metadata.push(["Document", `${item.document_source.author}, ${item.document_source.date}`]);
    metadata.push(["Verification", formatStatus(item.document_source.verification_status)]);
  }

  if (item.stimulus_assets?.length) {
    metadata.push(["Asset", formatStatus(item.stimulus_assets[0].asset_status)]);
  }

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

function selectFirstFilteredReviewItem() {
  const items = filteredReviewItems();
  if (!items.length) return;
  selectedReviewIndex = reviewItems.findIndex((item) => item.id === items[0].id);
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
    stimulus_format: item.stimulus_format,
    set_id: item.set_id,
    set_title: item.set_title,
    set_question_number: item.set_question_number,
    set_question_count: item.set_question_count,
    linked_question_ids: item.linked_question_ids,
    stimulus_assets: item.stimulus_assets,
    document_source: item.document_source,
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

function buildApprovedBankPayload() {
  return {
    bank_name: "XamVera Approved Question Bank",
    published_at: new Date().toISOString(),
    question_count: approvedQuestionBank.length,
    questions: approvedQuestionBank
      .slice()
      .sort((a, b) => String(a.unit || "").localeCompare(String(b.unit || "")) || String(a.id).localeCompare(String(b.id)))
  };
}

function renderPublishPackage() {
  const output = document.getElementById("publishOutput");
  const download = document.getElementById("downloadPublishJsonButton");
  if (!output && !download) return;

  const json = JSON.stringify(buildApprovedBankPayload(), null, 2);
  if (output) output.value = json;

  if (download) {
    const blob = new Blob([json], { type: "application/json" });
    if (download.dataset.objectUrl) URL.revokeObjectURL(download.dataset.objectUrl);
    const objectUrl = URL.createObjectURL(blob);
    download.href = objectUrl;
    download.dataset.objectUrl = objectUrl;
  }
}

function setPublishMessage(message, type = "") {
  const element = document.getElementById("publishMessage");
  if (!element) return;
  element.hidden = !message;
  element.textContent = message;
  element.className = `generator-message ${type}`;
}

async function copyPublishJson() {
  const output = document.getElementById("publishOutput");
  if (!output?.value) {
    renderPublishPackage();
  }
  const json = output?.value || JSON.stringify(buildApprovedBankPayload(), null, 2);

  try {
    await navigator.clipboard.writeText(json);
    setPublishMessage("Copied approved question bank JSON.", "success");
  } catch {
    output?.select();
    setPublishMessage("Select the JSON box and copy it manually.", "error");
  }
}

function publishApprovedQuestions() {
  if (!approvedQuestionBank.length) {
    setPublishMessage("Approve at least one question before publishing.", "error");
    return;
  }

  const payload = buildApprovedBankPayload();
  const json = JSON.stringify(payload, null, 2);
  localStorage.setItem("xamvera-published-approved-question-bank", json);
  renderPublishPackage();
  loadPracticeSet();
  setPublishMessage(
    `Prepared ${payload.question_count} approved question${payload.question_count === 1 ? "" : "s"} for public practice. Download or copy this JSON into data/admin/approved-question-bank.json, then commit and push to publish for everyone.`,
    "success"
  );
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
  if (activeReviewFilter !== "all" && item.status !== activeReviewFilter) {
    selectFirstFilteredReviewItem();
  }
  renderReviewWorkspace();
  setReviewMessage(message, messageType);
}

async function loadReviewQueue() {
  const savedBank = localStorage.getItem("xanvera-approved-question-bank");
  if (savedBank) {
    approvedQuestionBank = JSON.parse(savedBank);
  }
  renderPublishPackage();

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
      try {
        JSON.parse(saved).forEach((item) => {
          mergedItems.set(item.id, item);
        });
      } catch {
        localStorage.removeItem("xanvera-review-queue");
      }
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

async function reloadDeployedReviewQueue() {
  localStorage.removeItem("xanvera-review-queue");
  reviewItems = [];
  selectedReviewIndex = 0;
  activeReviewFilter = "all";
  const filter = document.getElementById("reviewFilter");
  if (filter) filter.value = activeReviewFilter;
  await loadReviewQueue();
  setGeneratorMessage("Reloaded the deployed review queue and cleared local draft overrides.", "success");
}

menuButton?.addEventListener("click", toggleSidebar);

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
document.getElementById("generateDraftsButton")?.addEventListener("click", generateDraftsForReview);
document.getElementById("reloadReviewQueueButton")?.addEventListener("click", reloadDeployedReviewQueue);
document.getElementById("publishApprovedButton")?.addEventListener("click", publishApprovedQuestions);
document.getElementById("copyPublishJsonButton")?.addEventListener("click", copyPublishJson);
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
window.addEventListener("resize", applySidebarPreference);

applySidebarPreference();
applyTheme(localStorage.getItem(themeStorageKey) || "system");
renderCourseCatalog();
renderPracticeCourseSelect();
loadPracticeSet();
loadReviewQueue();
showInitialViewFromHash();
