export const IDVS_RUBRIC_TEXT = `
IDVS 2025: Integrated Digital Visibility Standard
Weighting: GEO (40%) / AIO (30%) / SEO (30%)

--- 1. GEO (Generative Engine Optimization) - Max 40 pts ---
Goal: Maximize probability of retrieval and synthesis by LLMs (RAG).
Metrics:
- GEO-1: Information Gain (12 pts). Does it offer unique data, new entities, or original research not found in general consensus?
- GEO-2: Citation Authority (8 pts). Does it reference external authoritative sources/studies?
- GEO-3: Stat Density (8 pts). Are there extractable data tables, percentages, or specific definitions?
- GEO-4: RAG Readability (7 pts). Is the Flesch-Kincaid Grade 8-10? Simple syntax for vector matching.
- GEO-5: Contextual Completeness (5 pts). Semantic coverage of related entities (LSI).

--- 2. AIO (Answer Engine Optimization) - Max 30 pts ---
Goal: Be selected as the Direct Answer / Featured Snippet.
Metrics:
- AIO-1: Snippet Format (10 pts). Direct answer (40-60 words) immediately following a heading.
- AIO-2: Q&A Structure (8 pts). H2/H3 are questions. Follows What/Why/How.
- AIO-3: Conversational Utility (7 pts). Natural flow for text-to-speech. No "see image below" dependencies.
- AIO-4: Fact Verification (5 pts). Consensus-backed claims or clear opinion labeling.

--- 3. SEO (Search Engine Optimization) - Max 30 pts ---
Goal: Discovery layer and Trust signals.
Metrics:
- SEO-1: E-E-A-T Signals (10 pts). Clear author, first-hand experience indicators.
- SEO-2: Schema Potential (8 pts). Is the content structured to support Article, FAQPage, ClaimReview schema?
- SEO-3: Technical/Content Health (7 pts). Logical hierarchy, no keyword stuffing.
- SEO-4: Intent Alignment (5 pts). Matches user intent (Informational vs Transactional).

Grading Scale:
90-100: A+ (Reference Standard)
80-89: A- (High Quality)
70-79: B (Competitive)
< 60: F (Invisible)
`;
