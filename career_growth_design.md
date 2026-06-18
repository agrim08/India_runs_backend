# Career Trajectory Score Design

This document details the design, mathematical formulation, edge cases, and pseudocode for the **Career Trajectory Score (CTS)** system. The CTS evaluates a candidate's professional trajectory based on their career history, measuring dimensions of growth, consistency, and leadership.

---

## 1. Core Dimensions

The Career Trajectory Score evaluates five dimensions of a candidate's professional history:

1. **Promotions**: Advancement in title/rank within the same organization.
2. **Role Progression**: Evolution towards higher technical complexity and strategic functions.
3. **Seniority Increase**: The velocity of career level growth over time.
4. **Leadership Growth**: Acquisition of management, mentoring, and system-wide technical responsibilities.
5. **Career Consistency**: Continuity of employment and stability of role tenures (avoiding stagnation and job-hopping).

---

## 2. Seniority & Complexity Classification Mappings

To enable algorithmic evaluation, raw job titles must be mapped to levels of **Seniority** and **Role Complexity** using rule-based parsing or semantic keyword matching.

### 2.1 Seniority Levels ($SL$)
Each job title is mapped to a Seniority Level on a scale of `0` to `5`:

| Level | Classification | Keywords / Examples |
| :--- | :--- | :--- |
| **0** | Intern / Trainee | Intern, Trainee, Co-op, Apprentice |
| **1** | Junior / Associate | Junior, Jr, Associate, Analyst (Entry), L1, Assistant |
| **2** | Mid-level | Engineer, Developer, Specialist, Analyst, Consultant, L2 |
| **3** | Senior | Senior, Sr, L3, Specialist (Senior) |
| **4** | Lead / Principal / Manager | Tech Lead, Lead, Staff, Principal, Manager, Supervisor |
| **5** | Executive / Director / VP | Director, VP, Vice President, CTO, CXO, Architect (Chief), Founder |

### 2.2 Role Complexity Levels ($CL$)
Job functions are mapped to a Functional Complexity score on a scale of `1` to `4`:

| Level | Classification | Domain Keywords / Examples |
| :--- | :--- | :--- |
| **1** | Operations / Support | Customer Support, Operations, Admin, IT Helpdesk, Customer Success |
| **2** | Execution / Front-Facing | Frontend Developer, QA Engineer, Designer, UI/UX, Writer |
| **3** | Systems / Core Backend | Backend Engineer, Fullstack, DevOps, Systems, Infrastructure, Cloud |
| **4** | Advanced Tech / Architecture | ML Engineer, AI Specialist, Data Scientist, Solutions Architect, NLP |

---

## 3. Scoring Formulas

The final Career Trajectory Score ($CTS$) is a weighted sum of the five dimension scores, normalized to a range of `[0, 100]`:

$$CTS = w_1 S_{\text{promotions}} + w_2 S_{\text{progression}} + w_3 S_{\text{seniority}} + w_4 S_{\text{leadership}} + w_5 S_{\text{consistency}}$$

**Default Weights**:
$$w_1 = 0.20, \quad w_2 = 0.20, \quad w_3 = 0.20, \quad w_4 = 0.20, \quad w_5 = 0.20$$

---

### 3.1 Promotions Score ($S_{\text{promotions}}$)
Evaluates internal growth within a single company.
- A **promotion** is defined as an adjacent pair of roles $(role_i, role_{i+1})$ in chronological order where:
  $$\text{company}_i = \text{company}_{i+1} \quad \land \quad SL_{i+1} > SL_i$$
- **Formula**:
  Let $P$ be the count of promotions across the candidate's career.
  $$S_{\text{promotions}} = \min(P \times 25, 100)$$
  *(4 promotions max out this score at 100).*

---

### 3.2 Role Progression Score ($S_{\text{progression}}$)
Measures shift towards more complex domains and technologies.
- Let $CL_{\text{latest}}$ be the complexity of the current/latest role.
- Let $CL_{\text{initial}}$ be the complexity of the earliest/first professional role.
- **Formula**:
  - If $CL_{\text{initial}} \ge 3$ and $CL_{\text{latest}} \ge 3$ (highly complex careers from start to end):
    $$S_{\text{progression}} = 90$$
  - Else:
    $$S_{\text{progression}} = \text{clip}(50 + (CL_{\text{latest}} - CL_{\text{initial}}) \times 15, 0, 100)$$

---

### 3.3 Seniority Increase Score ($S_{\text{seniority}}$)
Measures the velocity of career growth relative to total years of experience ($YoE$).
- Let $\Delta SL = SL_{\text{latest}} - SL_{\text{earliest}}$.
- Seniority Velocity ($V$) is defined as:
  $$V = \frac{\Delta SL}{\max(YoE, 1.0)}$$
- **Target Velocity**: $0.25$ levels per year (i.e., reaching Senior (level 3) from Entry (level 1) in 8 years).
- **Formula**:
  - If $\Delta SL \ge 0$:
    - If the candidate started at high seniority ($SL_{\text{earliest}} \ge 3$) and maintained it ($SL_{\text{latest}} \ge 3$):
      $$S_{\text{seniority}} = 90$$
    - Else:
      $$S_{\text{seniority}} = \min\left(\left(\frac{V}{0.25}\right) \times 50 + 50, 100\right)$$
  - If $\Delta SL < 0$ (demotion in seniority):
    $$S_{\text{seniority}} = \max(0, 50 + \Delta SL \times 25)$$

---

### 3.4 Leadership Growth Score ($S_{\text{leadership}}$)
Evaluates cumulative time spent and level of responsibility in leadership roles.
- Let $LC_{\text{role}}$ be the leadership coefficient for a role:
  - **Executive / Director ($SL=5$)**: $LC = 1.0$
  - **Lead / Manager ($SL=4$)**: $LC = 0.6$
  - **Senior ($SL=3$) with leadership duties in description**: $LC = 0.3$
  - **Other roles**: $LC = 0.0$
- Cumulative Leadership Index ($CLI$):
  $$CLI = \sum_{\text{roles}} \left(LC_{\text{role}} \times \frac{\text{duration\_months}_{\text{role}}}{12}\right)$$
- **Formula**:
  $$S_{\text{leadership}} = \min(CLI \times 20, 100)$$
  *(Requires 5 years of Manager level or 8.3 years of Senior Leadership to hit 100).*

---

### 3.5 Career Consistency Score ($S_{\text{consistency}}$)
Assesses employment stability, job-hopping tendencies, and career gaps.
- Let $P_{\text{hop}}$ be the job-hopping penalty:
  - Add $15$ points for each non-current role with $\text{duration\_months} < 12$.
- Let $P_{\text{gap}}$ be the career gap penalty:
  - For each gap between consecutive roles $role_i$ and $role_{i+1}$ where $\text{gap\_months} > 3$ months:
    $$\text{penalty} = (\text{gap\_months} - 3) \times 10$$
  - Sum all gap penalties to get $P_{\text{gap}}$.
- Let $P_{\text{stag}}$ be the career stagnation penalty:
  - If $YoE \ge 8$ and $SL_{\text{latest}} \le 2$ (stayed at or below mid-level for 8+ years):
    $$P_{\text{stag}} = 20$$
- **Formula**:
  $$S_{\text{consistency}} = \max(0, 100 - P_{\text{hop}} - P_{\text{gap}} - P_{\text{stag}})$$

---

## 4. Scoring Examples

### Example A: Fast-track Backend Engineer (Ideal Case)
- **Profile**: 7 Years of Experience
- **Roles**:
  1. Junior Developer at Mindtree (24 months, $SL=1$, $CL=2$)
  2. Software Engineer at Mindtree (24 months, $SL=2$, $CL=3$) $\rightarrow$ **Promotion**
  3. Senior Backend Engineer at Wipro (24 months, $SL=3$, $CL=3$)
  4. Tech Lead at Wipro (12 months, $SL=4$, $CL=3$, currently active) $\rightarrow$ **Promotion**
- **Calculations**:
  - $P = 2$ promotions $\rightarrow$ $S_{\text{promotions}} = 2 \times 25 = 50$
  - Progression: $CL_{\text{initial}} = 2$, $CL_{\text{latest}} = 3$ $\rightarrow$ $S_{\text{progression}} = 50 + (3-2) \times 15 = 65$
  - Seniority: $\Delta SL = 4 - 1 = 3$. $YoE = 7.0$. Velocity $V = 3/7 = 0.43$. $S_{\text{seniority}} = \min((0.43/0.25) \times 50 + 50, 100) = 100$
  - Leadership: Tech Lead role (12 months, $LC=0.6$) $\rightarrow$ $CLI = 0.6 \times 1.0 = 0.6$. $S_{\text{leadership}} = 0.6 \times 20 = 12$
  - Consistency: No short tenures, no gaps, no stagnation $\rightarrow$ $S_{\text{consistency}} = 100$
- **Final CTS**:
  $$CTS = (50 \times 0.2) + (65 \times 0.2) + (100 \times 0.2) + (12 \times 0.2) + (100 \times 0.2) = 65.4$$

### Example B: Chronically Job-Hopping Support Agent (Low Case)
- **Profile**: 4 Years of Experience
- **Roles**:
  1. Support Agent at Co-A (6 months, $SL=1$, $CL=1$)
  2. Support Agent at Co-B (8 months, $SL=1$, $CL=1$) $\rightarrow$ *Gap of 4 months*
  3. Customer Success at Co-C (10 months, $SL=2$, $CL=1$)
- **Calculations**:
  - $P = 0$ promotions $\rightarrow$ $S_{\text{promotions}} = 0$
  - Progression: $CL_{\text{initial}} = 1$, $CL_{\text{latest}} = 1$ $\rightarrow$ $S_{\text{progression}} = 50$
  - Seniority: $\Delta SL = 2 - 1 = 1$. $YoE = 4.0$. $V = 1/4 = 0.25$. $S_{\text{seniority}} = (0.25/0.25) \times 50 + 50 = 100$
  - Leadership: No leadership roles $\rightarrow$ $S_{\text{leadership}} = 0$
  - Consistency:
    - Job-hopping: 2 completed roles under 12 months $\rightarrow$ $P_{\text{hop}} = 30$
    - Gaps: 1 gap of 4 months $\rightarrow$ $P_{\text{gap}} = (4 - 3) \times 10 = 10$
    - $S_{\text{consistency}} = 100 - 30 - 10 = 60$
- **Final CTS**:
  $$CTS = (0 \times 0.2) + (50 \times 0.2) + (100 \times 0.2) + (0 \times 0.2) + (60 \times 0.2) = 42.0$$

---

## 5. Edge Cases & Mitigation Strategies

| Edge Case | Description | Algorithmic Mitigation Strategy |
| :--- | :--- | :--- |
| **High Starting Seniority** | Founders, Architects, or senior hires starting at Level $\ge 4$ would have $\Delta SL \approx 0$ (velocity $= 0$). | If $SL_{\text{earliest}} \ge 3$ and $SL_{\text{latest}} \ge 3$, bypass standard velocity calculation and assign a default high score ($S_{\text{seniority}} = 90$, $S_{\text{progression}} = 90$). |
| **Short Stints in Current Role** | A candidate recently started a new role (e.g., 2 months in) which would trigger a job-hopping penalty. | Exclude the currently active role ($is\_current = true$) from the job-hopping check unless the candidate has history of consecutive short stints. |
| **Career Re-entry Gaps** | Extended leave (maternity, health, sabbatical) falsely penalizes career stability. | Caps maximum gap penalty at $40$ points so a single long break does not completely tank the consistency score. |
| **Contracting / Consulting** | Freelancers often change roles every 3–6 months legitimately. | If the `industry` is marked as "Staffing/Recruiting" or descriptions contain keywords like "Contractor", "Consultant", or "Freelance", half the job-hopping penalty. |
| **Ambiguous Title Names** | Custom company titles (e.g., "Rockstar ninja developer") disrupt keyword parser. | Default to Mid-Level ($SL=2$, $CL=3$) if no matching keywords are found in the title, and parse descriptions to adjust. |

---

## 6. Implementation Pseudocode

```python
def calculate_career_trajectory_score(career_history, total_yoe):
    # Sort roles chronologically
    roles = sorted(career_history, key=lambda x: x['start_date'])
    N = len(roles)
    if N == 0:
        return 0.0

    # 1. Map Seniority and Complexity
    for r in roles:
        r['sl'] = parse_seniority_level(r['title'])
        r['cl'] = parse_role_complexity(r['title'])
        r['has_lead_keywords'] = check_leadership_keywords(r['title'], r['description'])

    # --- 2. Calculate S_promotions ---
    promo_count = 0
    for i in range(N - 1):
        if roles[i]['company'] == roles[i+1]['company']:
            if roles[i+1]['sl'] > roles[i]['sl']:
                promo_count += 1
    s_promotions = min(promo_count * 25, 100)

    # --- 3. Calculate S_progression ---
    cl_initial = roles[0]['cl']
    cl_latest = roles[-1]['cl']
    if cl_initial >= 3 and cl_latest >= 3:
        s_progression = 90
    else:
        diff = cl_latest - cl_initial
        s_progression = clip(50 + diff * 15, 0, 100)

    # --- 4. Calculate S_seniority ---
    sl_initial = roles[0]['sl']
    sl_latest = roles[-1]['sl']
    delta_sl = sl_latest - sl_initial
    
    if delta_sl >= 0:
        if sl_initial >= 3 and sl_latest >= 3:
            s_seniority = 90
        else:
            velocity = delta_sl / max(total_yoe, 1.0)
            s_seniority = min((velocity / 0.25) * 50 + 50, 100)
    else:
        s_seniority = max(0, 50 + delta_sl * 25)

    # --- 5. Calculate S_leadership ---
    cli = 0.0
    for r in roles:
        lc = 0.0
        if r['sl'] == 5:
            lc = 1.0
        elif r['sl'] == 4:
            lc = 0.6
        elif r['sl'] == 3 and r['has_lead_keywords']:
            lc = 0.3
        
        duration_years = r['duration_months'] / 12.0
        cli += lc * duration_years
    s_leadership = min(cli * 20, 100)

    # --- 6. Calculate S_consistency ---
    p_hop = 0
    p_gap = 0
    p_stag = 0

    # Job-hopping
    for i, r in enumerate(roles):
        # Exclude active roles
        if not r['is_current'] and r['duration_months'] < 12:
            p_hop += 15

    # Gaps
    for i in range(N - 1):
        gap = calculate_month_gap(roles[i]['end_date'], roles[i+1]['start_date'])
        if gap > 3:
            p_gap += (gap - 3) * 10
    p_gap = min(p_gap, 40) # cap gap penalty

    # Stagnation
    if total_yoe >= 8 and sl_latest <= 2:
        p_stag = 20

    s_consistency = max(0, 100 - p_hop - p_gap - p_stag)

    # --- 7. Final Weighted CTS ---
    weights = [0.2, 0.2, 0.2, 0.2, 0.2]
    scores = [s_promotions, s_progression, s_seniority, s_leadership, s_consistency]
    
    cts = sum(s * w for s, w in zip(scores, weights))
    return round(cts, 2)
```
