insert into public.courses (id, name, category, exam_format)
values
  ('ap-world-history-modern', 'AP World History: Modern', 'History & Social Science', 'MCQ, SAQ, DBQ, LEQ')
on conflict (id) do update
set name = excluded.name,
    category = excluded.category,
    exam_format = excluded.exam_format;

insert into public.units (id, course_id, unit_name, unit_number)
values
  ('apwh-unit-1', 'ap-world-history-modern', 'The Global Tapestry', 1),
  ('apwh-unit-2', 'ap-world-history-modern', 'Networks of Exchange', 2),
  ('apwh-unit-4', 'ap-world-history-modern', 'Transoceanic Interconnections', 4),
  ('apwh-unit-5', 'ap-world-history-modern', 'Revolutions', 5),
  ('apwh-unit-6', 'ap-world-history-modern', 'Consequences of Industrialization', 6),
  ('apwh-unit-8', 'ap-world-history-modern', 'Cold War and Decolonization', 8)
on conflict (id) do update
set unit_name = excluded.unit_name,
    unit_number = excluded.unit_number;

insert into public.concepts (id, unit_id, concept_name, difficulty, exam_frequency, importance_weight)
values
  ('apwh-state-trade-networks', 'apwh-unit-2', 'State support for interregional trade', 'Medium', 4, 1.15),
  ('apwh-global-silver', 'apwh-unit-4', 'Global circulation of American silver', 'Medium', 5, 1.30),
  ('apwh-industrial-extraction', 'apwh-unit-6', 'Industrialization and imperial extraction', 'Hard', 5, 1.35),
  ('apwh-decolonization-economies', 'apwh-unit-8', 'Political decolonization and economic continuity', 'Medium', 4, 1.20)
on conflict (id) do update
set concept_name = excluded.concept_name,
    difficulty = excluded.difficulty,
    exam_frequency = excluded.exam_frequency,
    importance_weight = excluded.importance_weight;

insert into public.questions (
  id,
  concept_id,
  question_type,
  difficulty,
  source_type,
  stimulus,
  prompt,
  choices,
  correct_answer,
  explanation
)
values
  (
    'xan-apwh-001',
    'apwh-state-trade-networks',
    'Contextualization',
    'Medium',
    'original_seed',
    'A ruler sponsors religious scholars, repairs roads used by merchants, and grants privileges to long-distance trading communities that connect inland cities to ports.',
    'Which broader historical process is best reflected by these actions?',
    '["The decline of state support for commercial exchange","The use of state power to strengthen regional and interregional trade","The replacement of land-based trade by Atlantic maritime routes","The spread of industrial production through imperial charter companies"]'::jsonb,
    'The use of state power to strengthen regional and interregional trade',
    'States often supported trade by protecting routes, standardizing rules, and encouraging merchant activity. Atlantic and industrial patterns belong to later periods.'
  ),
  (
    'xan-apwh-002',
    'apwh-global-silver',
    'Causation',
    'Medium',
    'original_seed',
    'Silver mined in the Americas moved across the Atlantic and Pacific, financing state expansion and linking markets in Europe, the Americas, and Asia.',
    'Which development most directly contributed to the pattern described?',
    '["The growth of transoceanic empires and global maritime commerce","The collapse of all centralized states in East Asia","The end of coerced labor systems in the Americas","The disappearance of luxury-goods trade across Afro-Eurasia"]'::jsonb,
    'The growth of transoceanic empires and global maritime commerce',
    'The Spanish empire, American silver production, and Pacific trade through Manila helped connect regional economies into wider global networks.'
  ),
  (
    'xan-apwh-003',
    'apwh-industrial-extraction',
    'Comparison',
    'Hard',
    'original_seed',
    'Industrial factories concentrated workers, increased demand for raw materials, and encouraged states to invest in railroads, ports, and military power.',
    'Which comparison best describes industrialization in this period?',
    '["Industrialization reduced global economic inequality by eliminating imperial competition.","Industrialization only affected Europe and had no relationship to colonial economies.","Industrialization increased the economic and military power of some states while intensifying extraction from other regions.","Industrialization ended urban growth because most production returned to rural households."]'::jsonb,
    'Industrialization increased the economic and military power of some states while intensifying extraction from other regions.',
    'Industrialization strengthened some states and firms while deepening global demand for labor, land, raw materials, and colonial markets.'
  ),
  (
    'xan-apwh-004',
    'apwh-decolonization-economies',
    'Continuity and Change',
    'Medium',
    'original_seed',
    'After the Second World War, many colonies became independent states, but their governments often still depended on exporting a narrow range of raw materials.',
    'Which statement best explains both change and continuity in the situation described?',
    '["Political sovereignty often changed, while economic relationships shaped by imperialism frequently persisted.","New states usually rejected participation in the global economy entirely.","Imperial borders disappeared immediately after independence.","Former colonies quickly became the dominant industrial powers in every region."]'::jsonb,
    'Political sovereignty often changed, while economic relationships shaped by imperialism frequently persisted.',
    'Decolonization changed formal political control, but many economic patterns from imperial rule continued through trade, debt, and resource dependency.'
  )
on conflict (id) do update
set concept_id = excluded.concept_id,
    question_type = excluded.question_type,
    difficulty = excluded.difficulty,
    source_type = excluded.source_type,
    stimulus = excluded.stimulus,
    prompt = excluded.prompt,
    choices = excluded.choices,
    correct_answer = excluded.correct_answer,
    explanation = excluded.explanation;
