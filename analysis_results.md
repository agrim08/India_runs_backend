# TalentIntel AI Pipeline: Opportunities & Trade-offs

After reviewing the 5 core AI components (`jd_parser`, `retrieval_engine`, `recruiter_copilot`, `risk_analysis`, and `comparison_engine`), there is significant room to improve accuracy and reasoning through both **Prompt Engineering** and **Pipeline Architecture**.

Here is an analysis of what can be improved, what should stay the same, and the associated trade-offs.

---

## 1. Candidate Ranking Engine
**Current State**: Generates a naive semantic search string (`"Role: X, Domain: Y, Skills: Z"`) to fetch the Top 25 from the database, then calculates a hybrid score based on heuristics.
* **Pipeline Improvement**: The semantic search query is too rigid. Instead of concatenating fields, use an LLM step to translate the JD into an optimized "vector search query" that emphasizes semantic intent. Furthermore, hard filters (like `min_experience`) MUST be pushed down to the database level (Supabase RPC) *before* vector search to prevent retrieving highly relevant junior candidates for senior roles.
* **Trade-off**: Adding an LLM step before vector search increases latency by ~1 second.

## 2. Interview Copilot & Risk Analysis
**Current State**: Both services dump the raw `candidate_profile` JSON directly into the Gemini prompt. 
* **Prompt Improvement**: LLMs perform noticeably worse when reading raw JSON containing boilerplate keys, UUIDs, and deep nesting. The pipeline should use a **Markdown Synthesizer** to convert the JSON into clean, readable text before injecting it into the prompt.
* **Prompt Improvement (Risk Analysis)**: The prompt asks the AI to look for "large employment gaps" but doesn't define what that means. Prompt engineering should inject specific heuristics (e.g., *"Flag employment gaps exceeding 6 months"*).
* **Trade-off**: Writing a synthesizer requires maintenance if the database schema changes, but heavily reduces token usage and improves AI reasoning capability.

## 3. Comparison Engine
**Current State**: Dumps a list of raw candidate JSONs and asks the model to pick a winner.
* **Pipeline Risk**: This is highly susceptible to the **"Lost in the Middle"** phenomenon. If you feed an LLM 3 massive candidate JSON profiles, it tends to hyper-focus on the first and last candidate and hallucinate details about the second candidate.
* **Pipeline Improvement**: Condense the candidate profiles before comparing. Instead of sending their entire career history, send a pre-computed "Candidate Brief" (Name, Years of Exp, Top 5 Skills, Missing Skills). 
* **Trade-off**: Pre-condensing data means the Comparison Engine might miss a nuanced detail hidden deep in a candidate's 10-year-old job stint, but it massively increases the stability and fairness of the comparison.

## 4. Job Description Analysis
**Current State**: A zero-shot prompt that extracts fields into a rigid schema.
* **What shouldn't change**: We already implemented `response_schema` to force standard JSON outputs, which fixed the recent crashing bugs. This structural approach is solid.
* **Prompt Improvement**: Implement **Few-Shot Prompting**. Giving the AI 1 or 2 examples of a messy JD and the expected clean output schema will dramatically improve its ability to extract "Nice to have" vs "Required" skills correctly. 

## Conclusion
Yes, the system can absolutely be upgraded. The highest ROI changes would be:
1. **Stop feeding raw JSON to the models**—switch to condensed Markdown injection.
2. **Add concrete definitions to prompts** (e.g., defining exactly what a "Risk" is).
3. **Move deterministic filters to the Database** to let the AI focus purely on semantic matching. 
