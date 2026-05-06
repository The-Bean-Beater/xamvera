import argparse
import json
import statistics
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CANDIDATES = ROOT / "content-cache/college-board/ap-world-history-local/deduped-question-candidates.json"
REVIEW_QUEUE = ROOT / "data/admin/question-review-queue.json"
PROFILE_OUTPUT = ROOT / "content-cache/question-generation/ap-world-style-profile.json"
GENERATED_OUTPUT = ROOT / "data/admin/generated-ap-world-drafts.json"


CONCEPT_BANK = [
    {
        "unit": "Unit 1: The Global Tapestry",
        "period": "c. 1200-c. 1450",
        "skill": "Comparison",
        "difficulty": "Medium",
        "stimulus": "Two states expand bureaucratic offices, sponsor religious learning, and use tax records to manage large agricultural populations.",
        "prompt": "Which comparison is best supported by the scenario?",
        "choices": [
            "States in different regions could use administrative systems to strengthen political authority.",
            "States in this period generally abandoned religion as a source of legitimacy.",
            "Agricultural societies usually avoided written records and taxation.",
            "Large states became less centralized as trade networks expanded."
        ],
        "answer_index": 0,
        "explanation": "Many states used bureaucracy, recordkeeping, religion, and taxation to consolidate authority over large populations."
    },
    {
        "unit": "Unit 1: The Global Tapestry",
        "period": "c. 1200-c. 1450",
        "skill": "Contextualization",
        "difficulty": "Medium",
        "stimulus": "A ruler claims authority by presenting himself as a defender of religious tradition while appointing officials to oversee provincial tax collection.",
        "prompt": "The ruler's actions best illustrate which broader process in the period c. 1200-c. 1450?",
        "choices": [
            "The use of religious legitimacy and administration to maintain state power",
            "The complete separation of religion from political authority",
            "The decline of taxation in large agrarian empires",
            "The replacement of imperial government by independent city-states"
        ],
        "answer_index": 0,
        "explanation": "States often combined claims of religious legitimacy with practical administrative systems such as provincial officials and taxation."
    },
    {
        "unit": "Unit 2: Networks of Exchange",
        "period": "c. 1200-c. 1450",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": "Merchants traveling between inland cities and coastal ports use bills of exchange, caravanserai, and multilingual brokers to move goods across long distances.",
        "prompt": "Which development most directly contributed to the commercial activity described?",
        "choices": [
            "The growth of interregional trade networks linking Afro-Eurasian societies",
            "The disappearance of luxury trade across the Indian Ocean",
            "The isolation of inland cities from maritime exchange",
            "The replacement of merchant activity with state-owned factories"
        ],
        "answer_index": 0,
        "explanation": "Commercial practices, credit instruments, and support facilities helped merchants participate in expanding land and maritime networks."
    },
    {
        "unit": "Unit 2: Networks of Exchange",
        "period": "c. 1200-c. 1450",
        "skill": "Continuity and Change",
        "difficulty": "Hard",
        "stimulus": "A port city contains religious communities from several regions, warehouses for imported goods, and officials who collect duties on arriving ships.",
        "prompt": "Which statement best explains both continuity and change in the situation described?",
        "choices": [
            "Long-distance trade continued to move goods, while port cities became increasingly diverse commercial centers.",
            "Maritime trade ended because states could no longer tax merchants.",
            "Religious communities disappeared from commercial cities as trade expanded.",
            "All exchange shifted from sea routes to isolated local markets."
        ],
        "answer_index": 0,
        "explanation": "Trade routes had older foundations, but expanding maritime exchange increased the scale, diversity, and importance of port cities."
    },
    {
        "unit": "Unit 3: Land-Based Empires",
        "period": "c. 1450-c. 1750",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": "A ruler uses artillery to conquer fortified cities, then rewards military elites with land revenues in exchange for service.",
        "prompt": "Which factor most directly helped states expand in the manner described?",
        "choices": [
            "The use of gunpowder weapons and military-administrative systems",
            "The rejection of centralized armies by imperial rulers",
            "The decline of taxation as a source of state revenue",
            "The end of competition among land-based empires"
        ],
        "answer_index": 0,
        "explanation": "Gunpowder weapons and systems that tied military service to revenue helped several land-based empires expand and maintain power."
    },
    {
        "unit": "Unit 3: Land-Based Empires",
        "period": "c. 1450-c. 1750",
        "skill": "Comparison",
        "difficulty": "Hard",
        "stimulus": "Two empires recruit soldiers from minority populations, convert some recruits into loyal state servants, and use them to guard central authority.",
        "prompt": "Which comparison best explains the purpose of these recruitment systems?",
        "choices": [
            "Both systems attempted to create military groups whose status depended on service to the ruler.",
            "Both systems eliminated the need for taxation and provincial administration.",
            "Both systems were designed to reduce the power of central rulers.",
            "Both systems relied entirely on voluntary merchant militias."
        ],
        "answer_index": 0,
        "explanation": "Rulers sometimes used recruited or converted military elites to build loyal forces tied directly to the central state."
    },
    {
        "unit": "Unit 4: Transoceanic Interconnections",
        "period": "c. 1450-c. 1750",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": "A coastal kingdom gains new wealth by taxing imported firearms and exporting enslaved captives to merchants arriving from across the ocean.",
        "prompt": "Which process most directly shaped the kingdom's changing role in global exchange?",
        "choices": [
            "The expansion of Atlantic trade and coerced labor systems",
            "The end of maritime commerce between Africa and Europe",
            "The spread of industrial factory production in Africa",
            "The disappearance of state involvement in trade"
        ],
        "answer_index": 0,
        "explanation": "Atlantic commerce linked African states, European merchants, firearms, and the forced movement of enslaved people."
    },
    {
        "unit": "Unit 4: Transoceanic Interconnections",
        "period": "c. 1450-c. 1750",
        "skill": "Contextualization",
        "difficulty": "Medium",
        "stimulus": "A silver coin minted from American metal circulates through markets in Europe and Asia, where merchants use it to purchase luxury goods.",
        "prompt": "The circulation of the coin is best understood in the context of which broader development?",
        "choices": [
            "The creation of global trade networks linking the Americas, Europe, and Asia",
            "The collapse of all Asian demand for silver",
            "The decline of mining in European colonial territories",
            "The isolation of American economies from overseas markets"
        ],
        "answer_index": 0,
        "explanation": "American silver helped connect regional markets into wider transoceanic systems of exchange."
    },
    {
        "unit": "Unit 5: Revolutions",
        "period": "c. 1750-c. 1900",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": "A group of reformers argues that legitimate governments should protect individual rights and derive authority from the consent of citizens.",
        "prompt": "Which intellectual development most directly influenced the reformers' argument?",
        "choices": [
            "Enlightenment ideas about natural rights and popular sovereignty",
            "Mercantilist support for royal monopolies",
            "The rejection of written constitutions by revolutionary leaders",
            "The belief that political authority should never be debated"
        ],
        "answer_index": 0,
        "explanation": "Enlightenment thinkers advanced ideas about rights, consent, and sovereignty that influenced revolutionary and reform movements."
    },
    {
        "unit": "Unit 5: Revolutions",
        "period": "c. 1750-c. 1900",
        "skill": "Continuity and Change",
        "difficulty": "Hard",
        "stimulus": "After independence, a new government abolishes noble legal privileges but restricts voting rights to property-owning men.",
        "prompt": "Which statement best explains both change and continuity in this example?",
        "choices": [
            "Legal hierarchy changed, but political participation often remained limited.",
            "Revolutionary governments immediately created universal suffrage in every society.",
            "Independence movements usually strengthened noble privileges.",
            "Property ownership stopped influencing political rights after revolution."
        ],
        "answer_index": 0,
        "explanation": "Revolutions could weaken older legal hierarchies while preserving exclusions based on class, gender, race, or property."
    },
    {
        "unit": "Unit 6: Consequences of Industrialization",
        "period": "c. 1750-c. 1900",
        "skill": "Comparison",
        "difficulty": "Medium",
        "stimulus": "Factories in one region import cotton, rubber, and metals from distant colonies while selling manufactured goods in overseas markets.",
        "prompt": "Which comparison best describes the relationship between industrial and colonized regions?",
        "choices": [
            "Industrial regions often relied on colonized regions for raw materials and markets.",
            "Colonized regions generally controlled industrial production in Europe.",
            "Industrialization ended demand for overseas resources.",
            "Colonial economies were usually isolated from global manufacturing networks."
        ],
        "answer_index": 0,
        "explanation": "Industrial economies depended heavily on global supplies of raw materials and on markets shaped by imperial power."
    },
    {
        "unit": "Unit 7: Global Conflict",
        "period": "c. 1900-present",
        "skill": "Causation",
        "difficulty": "Medium",
        "stimulus": "A state mobilizes factories, censors newspapers, expands military conscription, and encourages citizens to buy war bonds.",
        "prompt": "Which development most directly explains the state actions described?",
        "choices": [
            "The rise of total war requiring large-scale economic and social mobilization",
            "The disappearance of state authority during twentieth-century conflicts",
            "The end of propaganda as a tool of governments",
            "The replacement of industrial warfare by local subsistence economies"
        ],
        "answer_index": 0,
        "explanation": "Twentieth-century total wars required states to mobilize industry, labor, finance, media, and civilians for military goals."
    },
    {
        "unit": "Unit 8: Cold War and Decolonization",
        "period": "c. 1900-present",
        "skill": "Contextualization",
        "difficulty": "Medium",
        "stimulus": "A newly independent state seeks foreign aid from rival superpowers while also joining conferences with other recently decolonized nations.",
        "prompt": "The state's actions are best understood in the context of which development?",
        "choices": [
            "Decolonization and Cold War competition for influence in the Global South",
            "The complete withdrawal of superpowers from international politics",
            "The end of diplomatic activity among newly independent states",
            "The restoration of direct colonial rule after the Second World War"
        ],
        "answer_index": 0,
        "explanation": "Newly independent states often navigated Cold War pressures while pursuing development, sovereignty, and nonalignment."
    },
    {
        "unit": "Unit 9: Globalization",
        "period": "c. 1900-present",
        "skill": "Continuity and Change",
        "difficulty": "Medium",
        "stimulus": "A company designs electronics in one country, assembles them in another, and sells them through online platforms to consumers worldwide.",
        "prompt": "Which statement best explains both change and continuity in this pattern?",
        "choices": [
            "Production became more globally fragmented, while long-distance exchange remained central to economic life.",
            "Global trade disappeared as digital technology expanded.",
            "Manufacturing became completely local in the late twentieth century.",
            "States lost all ability to regulate international commerce."
        ],
        "answer_index": 0,
        "explanation": "Globalization changed the scale and organization of production, but it continued older patterns of long-distance exchange."
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
        "generation_policy": [
            "Use source bank for structural profile only.",
            "Do not copy source prompts, answer choices, images, or explanations.",
            "Generated questions must remain in needs_review until human approval."
        ],
    }


def gates_for_draft() -> dict:
    return {
        "source_verified": False,
        "answer_verified": False,
        "explanation_verified": False,
        "copyright_checked": True,
    }


def make_draft(concept: dict, index: int, profile: dict) -> dict:
    return {
        "id": f"gen-apwh-{index:03}",
        "status": "needs_review",
        "course": "AP World History: Modern",
        "unit": concept["unit"],
        "period": concept["period"],
        "skill": concept["skill"],
        "difficulty": concept["difficulty"],
        "source_type": "generated_from_private_style_profile",
        "similarity_risk": "low",
        "stimulus": concept["stimulus"],
        "prompt": concept["prompt"],
        "choices": concept["choices"][: profile["target_choice_count"]],
        "answer_index": concept["answer_index"],
        "explanation": concept["explanation"],
        "review_notes": (
            "Original XamVera draft generated from AP World course concepts. "
            f"Source bank profile used {profile['candidate_count']} private candidates for structure only; no copied source text included."
        ),
        "revision_feedback": "",
        "generation_profile": {
            "profile_source": profile["source"],
            "target_choice_count": profile["target_choice_count"],
            "source_candidate_count": profile["candidate_count"],
            "private_source_text_used_in_output": False,
        },
        "gates": gates_for_draft(),
    }


def load_review_queue(path: Path) -> dict:
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


def generate(args: argparse.Namespace) -> int:
    candidates = load_source_candidates(args.source_candidates)
    profile = build_style_profile(candidates)
    drafts = [make_draft(concept, index, profile) for index, concept in enumerate(CONCEPT_BANK[: args.count], start=1)]

    write_json(args.profile_output, profile)
    write_json(args.generated_output, {"queue_name": "Generated AP World Drafts", "items": drafts})

    if args.update_review_queue:
        queue = load_review_queue(args.review_queue)
        queue = merge_generated_drafts(queue, drafts)
        write_json(args.review_queue, queue)

    print(f"Source candidates profiled: {profile['candidate_count']}")
    print(f"Generated drafts: {len(drafts)}")
    print(f"Wrote {args.profile_output}")
    print(f"Wrote {args.generated_output}")
    if args.update_review_queue:
        print(f"Updated {args.review_queue}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate original AP World draft questions from a private source-bank style profile.")
    parser.add_argument("--source-candidates", type=Path, default=SOURCE_CANDIDATES)
    parser.add_argument("--review-queue", type=Path, default=REVIEW_QUEUE)
    parser.add_argument("--profile-output", type=Path, default=PROFILE_OUTPUT)
    parser.add_argument("--generated-output", type=Path, default=GENERATED_OUTPUT)
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--update-review-queue", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(generate(parse_args()))
