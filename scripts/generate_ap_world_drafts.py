import argparse
import json
import statistics
from collections import Counter
from copy import deepcopy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CANDIDATES = ROOT / "content-cache/college-board/ap-world-history-local/deduped-question-candidates.json"
REVIEW_QUEUE = ROOT / "data/admin/question-review-queue.json"
PROFILE_OUTPUT = ROOT / "content-cache/question-generation/ap-world-style-profile.json"
GENERATED_OUTPUT = ROOT / "data/admin/generated-ap-world-drafts.json"

COURSE_NAME = "AP World History: Modern"
DEFAULT_KIND_ORDER = ("image_set", "document_set", "short_scenario")
PRIVATE_COPY_WARNINGS = (
    "college board",
    "ap classroom",
    "return to table of contents",
    "learning objective historical thinking skill",
    "go on to the next page",
)


IMAGE_STIMULUS_SETS = [
    {
        "set_id": "img-apwh-mansa-musa-catalan-atlas",
        "set_title": "Mansa Musa in a Fourteenth-Century Mediterranean Map",
        "unit": "Unit 2: Networks of Exchange",
        "period": "c. 1200-c. 1450",
        "difficulty": "Medium",
        "stimulus_format": "image_set",
        "stimulus": (
            "Image stimulus under review: a fourteenth-century Mediterranean map panel depicts the ruler of Mali "
            "seated in West Africa, holding a gold object and wearing a crown. The surrounding map labels and visual "
            "placement connect Mali to North Africa and Mediterranean geographic knowledge."
        ),
        "stimulus_assets": [
            {
                "kind": "image",
                "asset_status": "verified_public_domain_candidate_needs_local_asset",
                "title": "Mansa Musa detail from the Catalan Atlas",
                "source_url": "https://commons.wikimedia.org/wiki/File:Mansa_Musa.jpg",
                "rights_notes": "Wikimedia Commons lists this as a public-domain faithful reproduction. Verify before publishing.",
                "alt_text": "Map detail showing Mansa Musa seated with a gold object in West Africa."
            }
        ],
        "questions": [
            {
                "skill": "Contextualization",
                "prompt": "The image is best understood in the context of which broader development?",
                "choices": [
                    "The expansion of trans-Saharan trade networks that linked West Africa to North Africa and the Mediterranean",
                    "The collapse of Islamic influence in West African states after 1200",
                    "The replacement of gold exports by plantation sugar production in Mali",
                    "The isolation of Mediterranean mapmakers from Afro-Eurasian commercial information"
                ],
                "answer_index": 0,
                "explanation": (
                    "Mali's wealth and reputation were shaped by trans-Saharan exchanges in gold, salt, scholarship, "
                    "and religious ideas connecting West Africa to wider Afro-Eurasian networks."
                )
            },
            {
                "skill": "Causation",
                "prompt": "Which development most directly contributed to Mali being represented in this way?",
                "choices": [
                    "Demand for West African gold and the growth of caravan routes across the Sahara",
                    "The spread of steam-powered transport through the interior of Africa",
                    "Portuguese control over all West African commerce before 1450",
                    "The decline of commercial cities such as Timbuktu and Gao"
                ],
                "answer_index": 0,
                "explanation": (
                    "The depiction reflects Mali's association with gold wealth, which circulated through caravan trade "
                    "and helped make West African states known to observers beyond the region."
                )
            },
            {
                "skill": "Sourcing",
                "prompt": "Which statement best describes a limitation of using the image as evidence about Mali?",
                "choices": [
                    "It reflects an outside mapmaker's representation and should be compared with evidence from West African and Arabic sources.",
                    "It proves that Mali's rulers personally drew most Mediterranean maps.",
                    "It shows that written geographic knowledge had disappeared in Europe.",
                    "It can only be used to study military technology, not trade or cultural exchange."
                ],
                "answer_index": 0,
                "explanation": (
                    "The image is useful evidence for Mali's reputation abroad, but it was produced outside Mali and "
                    "should be interpreted alongside other sources."
                )
            }
        ]
    },
    {
        "set_id": "img-apwh-ottoman-cannon-siege",
        "set_title": "Ottoman Siege Artillery in the Early Modern Period",
        "unit": "Unit 3: Land-Based Empires",
        "period": "c. 1450-c. 1750",
        "difficulty": "Medium",
        "stimulus_format": "image_set",
        "stimulus": (
            "Image stimulus under review: an early modern scene shows Ottoman soldiers operating large cannon near "
            "fortified walls. The image emphasizes the scale of siege warfare and the logistical organization needed "
            "to move and fire heavy artillery."
        ),
        "stimulus_assets": [
            {
                "kind": "image",
                "asset_status": "public_domain_search_target_needs_verification",
                "title": "Ottoman cannon or siege-artillery image",
                "source_url": "https://commons.wikimedia.org/wiki/Category:Ottoman_cannons",
                "rights_notes": "Use a specific verified public-domain or freely licensed image before publishing.",
                "alt_text": "Ottoman artillery positioned near a fortified city wall."
            }
        ],
        "questions": [
            {
                "skill": "Causation",
                "prompt": "Which development most directly enabled the military activity shown in the image?",
                "choices": [
                    "The adoption of gunpowder weapons by expanding land-based empires",
                    "The abandonment of centralized military forces by early modern states",
                    "The end of competition among empires in Afro-Eurasia",
                    "The replacement of taxation by voluntary military service"
                ],
                "answer_index": 0,
                "explanation": (
                    "Gunpowder artillery helped several land-based empires conquer fortified cities and expand their "
                    "territorial control."
                )
            },
            {
                "skill": "Contextualization",
                "prompt": "The image would be most useful for studying which broader process?",
                "choices": [
                    "The consolidation of imperial authority through military technology and administrative capacity",
                    "The decline of state involvement in warfare after 1450",
                    "The spread of industrial factory production in the thirteenth century",
                    "The disappearance of fortifications from early modern cities"
                ],
                "answer_index": 0,
                "explanation": (
                    "Artillery required revenue, specialists, transport, and command systems, linking military change "
                    "to the growth of powerful imperial states."
                )
            },
            {
                "skill": "Comparison",
                "prompt": "Which comparison best connects the image to other empires in the same period?",
                "choices": [
                    "Ottoman, Safavid, and Mughal rulers all used gunpowder forces while adapting them to different regional conditions.",
                    "Only the Ottoman Empire used firearms, while all other empires rejected them.",
                    "Gunpowder weapons ended the need for armies in both Europe and Asia.",
                    "All early modern empires relied on identical systems of taxation and recruitment."
                ],
                "answer_index": 0,
                "explanation": (
                    "Gunpowder technologies spread widely, but rulers incorporated them into distinct imperial, fiscal, "
                    "and military systems."
                )
            }
        ]
    }
]


DOCUMENT_STIMULUS_SETS = [
    {
        "set_id": "doc-apwh-kongo-afonso-letter",
        "set_title": "A Kongo Ruler Responds to Portuguese Trade",
        "unit": "Unit 4: Transoceanic Interconnections",
        "period": "c. 1450-c. 1750",
        "difficulty": "Hard",
        "stimulus_format": "document_set",
        "stimulus": (
            "Document stimulus, classroom paraphrase for review: A ruler of Kongo writes to the king of Portugal in "
            "1526 that merchants and royal officials have brought prohibited goods into his kingdom and weakened his "
            "authority over local elites. He argues that people from his realm, including nobles and relatives, are "
            "being seized and sold, causing disorder and depopulation. The ruler asks Portugal to stop sending goods "
            "that encourage illegal trade and instead send priests and teachers who can support Christian instruction. "
            "He presents himself as a Christian monarch and political ally, but he insists that foreign commerce must "
            "not undermine the security, population, and sovereignty of Kongo."
        ),
        "document_source": {
            "author": "Nzinga Mbemba, also known as Afonso I of Kongo",
            "date": "1526",
            "source_url": "https://worldhistorycommons.org/excerpt-letter-nzinga-mbemba-portuguese-king-joao-iii",
            "rights_notes": "Stimulus is an original XamVera paraphrase. Verify source, wording, and classroom rights before publishing.",
            "verification_status": "source_identified_needs_human_verification"
        },
        "questions": [
            {
                "skill": "Sourcing",
                "prompt": "Which claim about the author's point of view is best supported by the document?",
                "choices": [
                    "He viewed Atlantic commerce as useful only if it remained under royal regulation and did not weaken Kongo's authority.",
                    "He rejected all contact with Europeans because he opposed Christianity.",
                    "He wrote as a merchant seeking permission to expand private slave trading.",
                    "He believed Portuguese officials had strengthened Kongo by ignoring royal authority."
                ],
                "answer_index": 0,
                "explanation": (
                    "The paraphrased letter presents the ruler as willing to maintain selected ties with Portugal while "
                    "criticizing commerce that threatened his kingdom's sovereignty and population."
                )
            },
            {
                "skill": "Causation",
                "prompt": "Which development most directly contributed to the problems described in the document?",
                "choices": [
                    "The growth of Atlantic trading networks and the forced movement of enslaved Africans",
                    "The collapse of all European demand for African labor",
                    "The spread of industrial textile factories in Central Africa",
                    "The end of Portuguese maritime activity after 1450"
                ],
                "answer_index": 0,
                "explanation": (
                    "The ruler's complaints reflect the expansion of Atlantic commerce, including slave trading, and "
                    "its disruptive effects on African states and societies."
                )
            },
            {
                "skill": "Contextualization",
                "prompt": "The document is most useful for contextualizing which broader pattern?",
                "choices": [
                    "African rulers negotiated, resisted, and sometimes tried to regulate European commercial influence.",
                    "European merchants immediately ended coercive labor systems in the Atlantic world.",
                    "Central African states were isolated from Christianity and diplomacy.",
                    "Portuguese influence in Africa depended entirely on industrial machinery."
                ],
                "answer_index": 0,
                "explanation": (
                    "The document shows that African rulers were active political actors who attempted to manage the "
                    "terms and consequences of early Atlantic exchange."
                )
            }
        ]
    },
    {
        "set_id": "doc-apwh-qing-macartney",
        "set_title": "The Qing Court Responds to a British Embassy",
        "unit": "Unit 4: Transoceanic Interconnections",
        "period": "c. 1450-c. 1750",
        "difficulty": "Hard",
        "stimulus_format": "document_set",
        "stimulus": (
            "Document stimulus, classroom paraphrase for review: In a 1793 response to a British diplomatic mission, "
            "the Qing emperor acknowledges that the British king has sent tribute and requested broader trade privileges. "
            "The emperor states that the empire already possesses abundant goods and has no need to import foreign "
            "manufactures. He rejects requests for a permanent British representative at court and for expanded trading "
            "rights outside existing regulations. The response presents Qing authority as universal and hierarchical, "
            "while treating foreign trade as something the state may restrict in order to preserve order."
        ),
        "document_source": {
            "author": "Qianlong Emperor",
            "date": "1793",
            "source_url": "https://sourcebooks.web.fordham.edu/mod/1793qianlong.asp",
            "rights_notes": (
                "Stimulus is an original XamVera paraphrase. Verify the source and note historiographical cautions "
                "about the letter's transmission before publishing."
            ),
            "verification_status": "source_identified_needs_human_verification"
        },
        "questions": [
            {
                "skill": "Sourcing",
                "prompt": "Which statement best explains how the author's purpose shapes the document?",
                "choices": [
                    "The response defends Qing diplomatic hierarchy and justifies limiting British commercial demands.",
                    "The response asks Britain to colonize coastal China and manage Qing trade.",
                    "The response promotes free trade as the only legitimate basis of diplomacy.",
                    "The response rejects all state regulation of merchants."
                ],
                "answer_index": 0,
                "explanation": (
                    "The paraphrased response frames trade and diplomacy through Qing claims of authority and uses that "
                    "framework to deny British requests."
                )
            },
            {
                "skill": "Contextualization",
                "prompt": "The British requests described in the document are best understood in the context of which development?",
                "choices": [
                    "European efforts to expand commercial access to Asian markets during the early modern period",
                    "The immediate collapse of Qing rule after 1450",
                    "The replacement of maritime trade by trans-Saharan caravan exchange",
                    "The end of European chartered-company activity in Asia before 1600"
                ],
                "answer_index": 0,
                "explanation": (
                    "European states and companies sought greater access to Asian goods and markets, even when Asian "
                    "states restricted foreign trade."
                )
            },
            {
                "skill": "Continuity and Change",
                "prompt": "Which statement best explains both continuity and change related to the document?",
                "choices": [
                    "Asian states continued to regulate trade, while European pressure for expanded access increased in the eighteenth century.",
                    "Asian states abandoned all control over foreign merchants after 1450.",
                    "European states stopped seeking Asian goods once Atlantic trade began.",
                    "Qing officials replaced diplomacy with industrial mass production."
                ],
                "answer_index": 0,
                "explanation": (
                    "The document reflects continued state regulation of commerce as well as growing European pressure "
                    "to alter the terms of trade."
                )
            }
        ]
    }
]


SHORT_SCENARIOS = [
    {
        "unit": "Unit 1: The Global Tapestry",
        "period": "c. 1200-c. 1450",
        "skill": "Comparison",
        "difficulty": "Medium",
        "stimulus": (
            "Two rulers in different regions sponsor religious scholars, appoint provincial officials, and use tax "
            "records to supervise large agrarian populations."
        ),
        "prompt": "Which comparison is best supported by the scenario?",
        "choices": [
            "States in different regions used religious legitimacy and administration to strengthen rule.",
            "States in this period generally abandoned religion as a source of authority.",
            "Agrarian states avoided taxation because trade made revenue unnecessary.",
            "Large states became less centralized as bureaucratic offices expanded."
        ],
        "answer_index": 0,
        "explanation": (
            "Many states combined claims of religious legitimacy with officials, taxation, and recordkeeping to maintain "
            "authority over large populations."
        )
    },
    {
        "unit": "Unit 2: Networks of Exchange",
        "period": "c. 1200-c. 1450",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": (
            "Merchants traveling between inland cities and coastal ports use bills of exchange, caravanserai, and "
            "multilingual brokers to move goods across long distances."
        ),
        "prompt": "Which development most directly contributed to the commercial activity described?",
        "choices": [
            "The growth of interregional trade networks linking Afro-Eurasian societies",
            "The disappearance of luxury trade across the Indian Ocean",
            "The isolation of inland cities from maritime exchange",
            "The replacement of merchant activity with state-owned factories"
        ],
        "answer_index": 0,
        "explanation": (
            "Commercial practices, credit instruments, and support facilities helped merchants participate in expanding "
            "land and maritime networks."
        )
    },
    {
        "unit": "Unit 5: Revolutions",
        "period": "c. 1750-c. 1900",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": (
            "A group of reformers argues that legitimate governments should protect individual rights and derive "
            "authority from the consent of citizens."
        ),
        "prompt": "Which intellectual development most directly influenced the reformers' argument?",
        "choices": [
            "Enlightenment ideas about natural rights and popular sovereignty",
            "Mercantilist support for royal monopolies",
            "The rejection of written constitutions by revolutionary leaders",
            "The belief that political authority should never be debated"
        ],
        "answer_index": 0,
        "explanation": (
            "Enlightenment thinkers advanced ideas about rights, consent, and sovereignty that influenced revolutionary "
            "and reform movements."
        )
    },
    {
        "unit": "Unit 6: Consequences of Industrialization",
        "period": "c. 1750-c. 1900",
        "skill": "Continuity and Change",
        "difficulty": "Hard",
        "stimulus": (
            "A colonial administration expands railroads from inland mines to coastal ports while restricting local "
            "manufacturing that might compete with imported goods."
        ),
        "prompt": "Which statement best explains both change and continuity in this scenario?",
        "choices": [
            "Industrial-era infrastructure expanded, while imperial economies often continued to prioritize extraction.",
            "Colonial governments generally promoted equal industrial development in all regions.",
            "Railroads ended the relationship between imperialism and global trade.",
            "Industrialization eliminated demand for raw materials from colonized regions."
        ],
        "answer_index": 0,
        "explanation": (
            "Industrialization changed transportation and production, but imperial economic systems often continued to "
            "organize colonies around raw materials, export, and outside markets."
        )
    },
    {
        "unit": "Unit 7: Global Conflict",
        "period": "c. 1900-present",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": (
            "A state mobilizes factories, censors newspapers, expands military conscription, and encourages citizens "
            "to buy war bonds."
        ),
        "prompt": "Which development most directly explains the state actions described?",
        "choices": [
            "The rise of total war requiring large-scale economic and social mobilization",
            "The disappearance of state authority during twentieth-century conflicts",
            "The end of propaganda as a tool of governments",
            "The replacement of industrial warfare by local subsistence economies"
        ],
        "answer_index": 0,
        "explanation": (
            "Twentieth-century total wars required states to mobilize industry, labor, finance, media, and civilians "
            "for military goals."
        )
    },
    {
        "unit": "Unit 8: Cold War and Decolonization",
        "period": "c. 1900-present",
        "skill": "Contextualization",
        "difficulty": "Medium",
        "stimulus": (
            "A newly independent state seeks foreign aid from rival superpowers while also joining conferences with "
            "other recently decolonized nations."
        ),
        "prompt": "The state's actions are best understood in the context of which development?",
        "choices": [
            "Decolonization and Cold War competition for influence in the Global South",
            "The complete withdrawal of superpowers from international politics",
            "The end of diplomatic activity among newly independent states",
            "The restoration of direct colonial rule after the Second World War"
        ],
        "answer_index": 0,
        "explanation": (
            "Newly independent states often navigated Cold War pressures while pursuing development, sovereignty, and "
            "nonalignment."
        )
    }
]


PLANNED_PIPELINE_KINDS = [
    {
        "kind": "no_stimulus",
        "status": "planned",
        "notes": "Add once review UI can clearly distinguish direct-recall conceptual items from stimulus-based MCQs."
    },
    {
        "kind": "data_map_chart",
        "status": "planned",
        "notes": "Add after we have a rights-safe data-source registry and frontend rendering for tables, maps, and charts."
    }
]


def load_source_candidates(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def build_style_profile(candidates: list[dict]) -> dict:
    type_counts = Counter(item.get("question_type", "unknown") for item in candidates)
    choice_counts = Counter(len(item.get("choices", [])) for item in candidates)
    raw_lengths = [len(item.get("raw_text", "")) for item in candidates if item.get("raw_text")]
    prompt_lengths = [len(item.get("prompt_candidate", "")) for item in candidates if item.get("prompt_candidate")]
    mcq_candidates = [item for item in candidates if item.get("question_type") == "multiple_choice"]

    target_choice_count = 4
    if choice_counts:
        target_choice_count = choice_counts.most_common(1)[0][0] or 4

    return {
        "source": str(SOURCE_CANDIDATES.relative_to(ROOT)),
        "candidate_count": len(candidates),
        "multiple_choice_count": len(mcq_candidates),
        "question_type_counts": dict(type_counts),
        "choice_count_distribution": {str(key): value for key, value in sorted(choice_counts.items())},
        "target_choice_count": target_choice_count,
        "median_raw_text_length": round(statistics.median(raw_lengths), 1) if raw_lengths else 0,
        "median_prompt_candidate_length": round(statistics.median(prompt_lengths), 1) if prompt_lengths else 0,
        "pipeline_kinds": [
            "image stimulus sets with 3 linked questions",
            "long historical document stimulus sets with 3 linked questions",
            "short stimulus/scenario questions",
        ],
        "planned_pipeline_kinds": PLANNED_PIPELINE_KINDS,
        "generation_policy": [
            "Use source bank for structural profile only.",
            "Do not copy source prompts, answer choices, explanations, images, or document text.",
            "Use original XamVera stimuli or explicitly reviewed public-domain/open sources.",
            "Generated questions must remain in needs_review until human approval."
        ],
    }


def gates_for_draft(stimulus_format: str) -> dict:
    gates = {
        "source_verified": False,
        "answer_verified": False,
        "explanation_verified": False,
        "copyright_checked": True,
    }
    if stimulus_format == "image_set":
        gates["asset_rights_verified"] = False
        gates["stimulus_verified"] = False
    if stimulus_format == "document_set":
        gates["document_source_verified"] = False
        gates["paraphrase_checked"] = False
    return gates


def source_type_for(stimulus_format: str) -> str:
    if stimulus_format == "image_set":
        return "generated_image_stimulus_public_domain_candidate"
    if stimulus_format == "document_set":
        return "generated_document_paraphrase_source_identified"
    return "generated_original_short_scenario"


def review_notes_for(draft: dict, profile: dict) -> str:
    notes = [
        "Original XamVera draft generated from AP World course concepts.",
        f"Private source bank profile used {profile['candidate_count']} candidates for structure only.",
        "No copied College Board prompts, answer choices, explanations, images, or source text included.",
    ]

    if draft.get("stimulus_assets"):
        asset_notes = [
            f"{asset['title']} ({asset['asset_status']}): {asset['source_url']}"
            for asset in draft["stimulus_assets"]
        ]
        notes.append("Image asset review needed: " + " | ".join(asset_notes))

    if draft.get("document_source"):
        source = draft["document_source"]
        notes.append(
            "Document source review needed: "
            f"{source['author']}, {source['date']}, {source['source_url']}. {source['rights_notes']}"
        )

    return " ".join(notes)


def private_source_leak_flags(draft: dict) -> list[str]:
    haystack_parts = [
        draft.get("stimulus", ""),
        draft.get("prompt", ""),
        draft.get("explanation", ""),
        " ".join(draft.get("choices", [])),
    ]
    haystack = " ".join(haystack_parts).lower()
    return [warning for warning in PRIVATE_COPY_WARNINGS if warning in haystack]


def normalize_choices(choices: list[str], target_count: int) -> list[str]:
    if len(choices) < target_count:
        raise ValueError(f"Question has {len(choices)} choices, expected at least {target_count}")
    return choices[:target_count]


def make_set_drafts(stimulus_set: dict, sequence_start: int, profile: dict) -> list[dict]:
    linked_ids = [
        f"gen-apwh-{sequence_start + offset:03}"
        for offset in range(len(stimulus_set["questions"]))
    ]
    drafts = []

    for offset, question in enumerate(stimulus_set["questions"]):
        draft_id = linked_ids[offset]
        draft = {
            "id": draft_id,
            "status": "needs_review",
            "course": COURSE_NAME,
            "unit": stimulus_set["unit"],
            "period": stimulus_set["period"],
            "skill": question["skill"],
            "difficulty": stimulus_set["difficulty"],
            "source_type": source_type_for(stimulus_set["stimulus_format"]),
            "similarity_risk": "low",
            "stimulus_format": stimulus_set["stimulus_format"],
            "stimulus": stimulus_set["stimulus"],
            "prompt": question["prompt"],
            "choices": normalize_choices(question["choices"], profile["target_choice_count"]),
            "answer_index": question["answer_index"],
            "explanation": question["explanation"],
            "set_id": stimulus_set["set_id"],
            "set_title": stimulus_set["set_title"],
            "set_question_number": offset + 1,
            "set_question_count": len(stimulus_set["questions"]),
            "linked_question_ids": linked_ids,
            "review_notes": "",
            "revision_feedback": "",
            "generation_profile": {
                "profile_source": profile["source"],
                "target_choice_count": profile["target_choice_count"],
                "source_candidate_count": profile["candidate_count"],
                "private_source_text_used_in_output": False,
                "pipeline_kind": stimulus_set["stimulus_format"],
            },
            "gates": gates_for_draft(stimulus_set["stimulus_format"]),
        }

        if stimulus_set.get("stimulus_assets"):
            draft["stimulus_assets"] = deepcopy(stimulus_set["stimulus_assets"])
        if stimulus_set.get("document_source"):
            draft["document_source"] = deepcopy(stimulus_set["document_source"])

        draft["review_notes"] = review_notes_for(draft, profile)
        draft["generation_profile"]["private_source_leak_flags"] = private_source_leak_flags(draft)
        drafts.append(draft)

    return drafts


def make_short_draft(scenario: dict, index: int, profile: dict) -> dict:
    draft = {
        "id": f"gen-apwh-{index:03}",
        "status": "needs_review",
        "course": COURSE_NAME,
        "unit": scenario["unit"],
        "period": scenario["period"],
        "skill": scenario["skill"],
        "difficulty": scenario["difficulty"],
        "source_type": source_type_for("short_scenario"),
        "similarity_risk": "low",
        "stimulus_format": "short_scenario",
        "stimulus": scenario["stimulus"],
        "prompt": scenario["prompt"],
        "choices": normalize_choices(scenario["choices"], profile["target_choice_count"]),
        "answer_index": scenario["answer_index"],
        "explanation": scenario["explanation"],
        "review_notes": "",
        "revision_feedback": "",
        "generation_profile": {
            "profile_source": profile["source"],
            "target_choice_count": profile["target_choice_count"],
            "source_candidate_count": profile["candidate_count"],
            "private_source_text_used_in_output": False,
            "pipeline_kind": "short_scenario",
        },
        "gates": gates_for_draft("short_scenario"),
    }
    draft["review_notes"] = review_notes_for(draft, profile)
    draft["generation_profile"]["private_source_leak_flags"] = private_source_leak_flags(draft)
    return draft


def build_pipeline_drafts(profile: dict, kinds: tuple[str, ...]) -> list[dict]:
    drafts = []
    next_index = 1

    if "image_set" in kinds:
        for stimulus_set in IMAGE_STIMULUS_SETS:
            set_drafts = make_set_drafts(stimulus_set, next_index, profile)
            drafts.extend(set_drafts)
            next_index += len(set_drafts)

    if "document_set" in kinds:
        for stimulus_set in DOCUMENT_STIMULUS_SETS:
            set_drafts = make_set_drafts(stimulus_set, next_index, profile)
            drafts.extend(set_drafts)
            next_index += len(set_drafts)

    if "short_scenario" in kinds:
        for scenario in SHORT_SCENARIOS:
            drafts.append(make_short_draft(scenario, next_index, profile))
            next_index += 1

    return drafts


def load_review_queue(path: Path) -> dict:
    if not path.exists():
        return {"queue_name": "AP World History Review Queue", "items": []}
    return json.loads(path.read_text(encoding="utf-8"))


def merge_generated_drafts(queue: dict, drafts: list[dict]) -> dict:
    existing = {item["id"]: item for item in queue["items"]}
    for draft in drafts:
        existing[draft["id"]] = draft
    queue["items"] = list(existing.values())
    return queue


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def parse_kinds(raw_kinds: str) -> tuple[str, ...]:
    if raw_kinds == "all":
        return DEFAULT_KIND_ORDER
    kinds = tuple(kind.strip() for kind in raw_kinds.split(",") if kind.strip())
    allowed = set(DEFAULT_KIND_ORDER)
    unknown = sorted(set(kinds) - allowed)
    if unknown:
        raise ValueError(f"Unknown pipeline kind(s): {', '.join(unknown)}")
    return kinds


def generate(args: argparse.Namespace) -> int:
    candidates = load_source_candidates(args.source_candidates)
    profile = build_style_profile(candidates)
    kinds = parse_kinds(args.kinds)
    drafts = build_pipeline_drafts(profile, kinds)[: args.count]

    write_json(args.profile_output, profile)
    write_json(args.generated_output, {"queue_name": "Generated AP World Drafts", "items": drafts})

    if args.update_review_queue:
        queue = load_review_queue(args.review_queue)
        queue = merge_generated_drafts(queue, drafts)
        write_json(args.review_queue, queue)

    kind_counts = Counter(draft["stimulus_format"] for draft in drafts)
    leak_flags = {
        draft["id"]: draft["generation_profile"]["private_source_leak_flags"]
        for draft in drafts
        if draft["generation_profile"]["private_source_leak_flags"]
    }

    print(f"Source candidates profiled: {profile['candidate_count']}")
    print(f"Generated drafts: {len(drafts)}")
    print(f"Pipeline kinds: {dict(kind_counts)}")
    if leak_flags:
        print(f"Private-source warning flags: {leak_flags}")
    print(f"Wrote {args.profile_output}")
    print(f"Wrote {args.generated_output}")
    if args.update_review_queue:
        print(f"Updated {args.review_queue}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate original AP World draft questions from a private source-bank style profile."
    )
    parser.add_argument("--source-candidates", type=Path, default=SOURCE_CANDIDATES)
    parser.add_argument("--review-queue", type=Path, default=REVIEW_QUEUE)
    parser.add_argument("--profile-output", type=Path, default=PROFILE_OUTPUT)
    parser.add_argument("--generated-output", type=Path, default=GENERATED_OUTPUT)
    parser.add_argument("--count", type=int, default=18)
    parser.add_argument(
        "--kinds",
        default="all",
        help="Comma-separated pipeline kinds: image_set,document_set,short_scenario. Use all for every current kind.",
    )
    parser.add_argument("--update-review-queue", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(generate(parse_args()))
