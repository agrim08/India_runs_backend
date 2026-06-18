# Candidate Schema Documentation

This document describes the schema, data types, nullability, and structures of the candidate dataset used in the Intelligent Candidate Discovery & Ranking project. It is based on the official [candidate_schema.json](file:///c:/Users/jyoti/Desktop/IndiaRunsBE/data/candidate_schema.json) specification and validated against real candidate data in [sample_candidates.json](file:///c:/Users/jyoti/Desktop/IndiaRunsBE/data/sample_candidates.json) and [candidates.jsonl](file:///c:/Users/jyoti/Desktop/IndiaRunsBE/data/candidates.jsonl).

---

## 1. Top-Level Structure

Every candidate record in the dataset is represented as a JSON object containing the following top-level fields:

| Field Name | Data Type | Nullable? | Description |
| :--- | :--- | :--- | :--- |
| `candidate_id` | String | No | Unique identifier matching the pattern `^CAND_[0-9]{7}$` |
| `profile` | Object | No | Basic demographic and professional overview of the candidate |
| `career_history` | Array | No | Professional work experience / career history entries (1 to 10 items) |
| `education` | Array | No | Academic background entries (0 to 5 items) |
| `skills` | Array | No | Technical and soft skills (0 or more items) |
| `certifications` | Array | Yes (Optional) | Professional certifications (0 or more items) |
| `languages` | Array | Yes (Optional) | Languages spoken and proficiency levels (0 or more items) |
| `redrob_signals` | Object | No | Platform engagement and behavioral metrics |

---

## 2. Detailed Structure and Field Definitions

### 2.1 Profile Structure (`profile`)
Provides general information about the candidate's current professional standing.

- **Type**: `object`
- **Nullable**: No
- **Required Fields**: All fields in this object are required.

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `anonymized_name` | String | No | Any non-empty string | `"Ira Vora"` | Anonymized full name of the candidate. |
| `headline` | String | No | Any non-empty string | `"Backend Engineer \| SQL, Spark, Cloud"` | A short, one-line professional headline. |
| `summary` | String | No | Any non-empty string | `"Software / data professional with 6.9 years of experience..."` | Multi-sentence professional summary detailing skills, projects, and goals. |
| `location` | String | No | Any non-empty string | `"Toronto"` | City, state/region of residence. |
| `country` | String | No | Any non-empty string | `"Canada"` | Country of residence. |
| `years_of_experience` | Number (Float) | No | `0.0` to `50.0` | `6.9` | Total years of professional experience. |
| `current_title` | String | No | Any non-empty string | `"Backend Engineer"` | Stated current job title. |
| `current_company` | String | No | Any non-empty string | `"Mindtree"` | Stated current employer company name. |
| `current_company_size`| String (Enum) | No | `"1-10"`, `"11-50"`, `"51-200"`, `"201-500"`, `"501-1000"`, `"1001-5000"`, `"5001-10000"`, `"10001+"` | `"10001+"` | Employee size bracket of the current company. |
| `current_industry` | String | No | Any non-empty string | `"IT Services"` | Industry of the current company. |

---

### 2.2 Career History / Work Experience Structure (`career_history`)
Represents the candidate's detailed professional background. This serves as the primary structure for **Work Experience**.

- **Type**: `array` of objects (1 to 10 items)
- **Nullable**: No
- **Required Fields in Item**: `company`, `title`, `start_date`, `end_date`, `duration_months`, `is_current`, `industry`, `company_size`, `description`

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `company` | String | No | Any non-empty string | `"Mindtree"` | Name of the employer company. |
| `title` | String | No | Any non-empty string | `"Backend Engineer"` | Stated job title for this role. |
| `start_date` | String | No | Date format: `YYYY-MM-DD` | `"2024-03-08"` | Date the candidate started this role. |
| `end_date` | String | **Yes** | Date format: `YYYY-MM-DD` or `null` | `null` (if current) or `"2024-01-08"` | Date the candidate left this role. `null` if it is their current role. |
| `duration_months` | Integer | No | `int >= 0` | `27` | Total duration of the role in months. |
| `is_current` | Boolean | No | `true` or `false` | `true` | Indicates if the candidate is currently employed here. |
| `industry` | String | No | Any non-empty string | `"IT Services"` | Industry of the company. |
| `company_size` | String (Enum) | No | `"1-10"`, `"11-50"`, `"51-200"`, `"201-500"`, `"501-1000"`, `"1001-5000"`, `"5001-10000"`, `"10001+"` | `"10001+"` | Employee size bracket of the company. |
| `description` | String | No | Any non-empty string | `"Implemented streaming data pipelines on Kafka..."` | Multi-sentence description of key responsibilities, achievements, and technologies used. |

---

### 2.3 Education Structure (`education`)
Represents the candidate's academic background.

- **Type**: `array` of objects (0 to 5 items)
- **Nullable**: No (can be an empty array if the candidate has no listed education)
- **Required Fields in Item**: `institution`, `degree`, `field_of_study`, `start_year`, `end_year`

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `institution` | String | No | Any non-empty string | `"Lovely Professional University"` | Name of the academic institution. |
| `degree` | String | No | Any non-empty string | `"B.E."` | Degree earned (e.g., B.E., B.Sc, M.S., Ph.D.). |
| `field_of_study` | String | No | Any non-empty string | `"Computer Science"` | Field or major of study. |
| `start_year` | Integer | No | `1970` to `2030` | `2017` | Academic starting year. |
| `end_year` | Integer | No | `1970` to `2035` | `2020` | Academic graduation/expected completion year. |
| `grade` | String | **Yes** | String or `null` | `"8.24 CGPA"` or `"77%"` or `null` | Grade / GPA / percentage / class awarded. |
| `tier` | String (Enum) | Yes (Optional) | `"tier_1"`, `"tier_2"`, `"tier_3"`, `"tier_4"`, `"unknown"` | `"tier_3"` | Internal institutional prestige tier. |

---

### 2.4 Skills Structure (`skills`)
Details the candidate's technical skills, experience duration, and endorsements.

- **Type**: `array` of objects (0 or more items)
- **Nullable**: No (can be an empty array)
- **Required Fields in Item**: `name`, `proficiency`, `endorsements`

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | String | No | Any non-empty string | `"NLP"` | Name of the skill. |
| `proficiency` | String (Enum) | No | `"beginner"`, `"intermediate"`, `"advanced"`, `"expert"` | `"advanced"` | Stated proficiency level. |
| `endorsements` | Integer | No | `int >= 0` | `37` | Stated number of endorsements received. |
| `duration_months` | Integer | Yes (Optional) | `int >= 0` or missing | `26` | Months the candidate has spent practicing this skill. |

---

### 2.5 Certifications Structure (`certifications`)
Details professional certifications achieved by the candidate.

- **Type**: `array` of objects (0 or more items; optional at top-level)
- **Nullable**: Yes (optional key, can be empty or omitted)
- **Required Fields in Item**: `name`, `issuer`, `year`

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | String | No | Any non-empty string | `"AWS Certified Cloud Practitioner"` | Name of the certification. |
| `issuer` | String | No | Any non-empty string | `"AWS"` | Organization issuing the certification. |
| `year` | Integer | No | Any valid year | `2025` | Year the certification was issued. |

---

### 2.6 Languages Structure (`languages`)
Details the languages spoken by the candidate.

- **Type**: `array` of objects (0 or more items; optional at top-level)
- **Nullable**: Yes (optional key, can be empty or omitted)
- **Required Fields in Item**: `language`, `proficiency`

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `language` | String | No | Any non-empty string | `"English"` | Stated language. |
| `proficiency` | String (Enum) | No | `"basic"`, `"conversational"`, `"professional"`, `"native"` | `"professional"` | Spoken/written proficiency level. |

---

### 2.7 Platform Behavioral Signals Structure (`redrob_signals`)
Contains simulated platform activity and engagement metrics from the Redrob ecosystem.

- **Type**: `object`
- **Nullable**: No
- **Required Fields**: All fields in this object are required.

| Field Name | Data Type | Nullable? | Allowed Values / Constraints | Example | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `profile_completeness_score` | Number | No | `0.0` to `100.0` | `86.9` | Percentage score representing profile completeness. |
| `signup_date` | String | No | Date format: `YYYY-MM-DD` | `"2025-10-16"` | Date candidate registered on the platform. |
| `last_active_date` | String | No | Date format: `YYYY-MM-DD` | `"2026-05-20"` | Date candidate last logged in. |
| `open_to_work_flag` | Boolean | No | `true` or `false` | `true` | Flag showing if candidate is actively seeking work. |
| `profile_views_received_30d` | Integer | No | `int >= 0` | `23` | Number of profile views by recruiters in last 30 days. |
| `applications_submitted_30d` | Integer | No | `int >= 0` | `2` | Number of job applications submitted in last 30 days. |
| `recruiter_response_rate` | Number (Float) | No | `0.0` to `1.0` | `0.34` | Percentage of recruiter messages answered. |
| `avg_response_time_hours` | Number (Float) | No | `num >= 0.0` | `177.8` | Stated average response time to messages in hours. |
| `skill_assessment_scores` | Object | No | Dict: `{string: number}` (0-100) | `{"NLP": 38.8}` | Scores of platform-administered skill tests. |
| `connection_count` | Integer | No | `int >= 0` | `356` | Number of professional connections on the platform. |
| `endorsements_received` | Integer | No | `int >= 0` | `35` | Number of skill endorsements received on the platform. |
| `notice_period_days` | Integer | No | `0` to `180` | `60` | Stated notice period in days. |
| `expected_salary_range_inr_lpa` | Object | No | Required: `min`, `max` (number) | `{"min": 18.7, "max": 36.1}` | Stated expected salary range (INR LPA). |
| `preferred_work_mode` | String (Enum) | No | `"remote"`, `"hybrid"`, `"onsite"`, `"flexible"` | `"onsite"` | Stated preferred work setup. |
| `willing_to_relocate` | Boolean | No | `true` or `false` | `false` | Stated willingness to relocate for a role. |
| `github_activity_score` | Number | No | `-1` or `0` to `100` | `9.2` | Open source activity score. `-1` represents "No GitHub linked". |
| `search_appearance_30d` | Integer | No | `int >= 0` | `249` | Times profile appeared in recruiter searches. |
| `saved_by_recruiters_30d` | Integer | No | `int >= 0` | `4` | Times recruiter bookmarked the profile in last 30d. |
| `interview_completion_rate` | Number (Float) | No | `0.0` to `1.0` | `0.71` | Fraction of scheduled interviews attended. |
| `offer_acceptance_rate` | Number (Float) | No | `-1.0` or `0.0` to `1.0` | `0.58` | Offer acceptance rate. `-1` represents "No history". |
| `verified_email` | Boolean | No | `true` or `false` | `true` | Email verification flag. |
| `verified_phone` | Boolean | No | `true` or `false` | `true` | Phone number verification flag. |
| `linkedin_connected` | Boolean | No | `true` or `false` | `false` | LinkedIn integration flag. |

---

## 3. Special Structures and Mapping

### 3.1 Work Experience Structure
Work experience is not a separate top-level object named `work_experience`. Instead, it is captured within the `career_history` array of objects.
- Each object in the `career_history` array represents a distinct employment role.
- Attributes like `company`, `title`, `start_date`, `end_date`, `duration_months`, `is_current`, `industry`, `company_size`, and `description` provide full structural context for the candidate's work history.
- The `description` field is a free-form text paragraph summarizing the duties, accomplishments, projects, and tech stack utilized in that specific job.

### 3.2 Projects Structure
There is no dedicated `projects` array or object key in this candidate profile schema. Projects are instead represented and embedded contextually across three areas:
1. **Stated Highlights in Profile Summary**: Candidates mention self-guided work, Kaggle participation, or side projects in their `profile.summary` field.
2. **Details in Job Descriptions**: Specific engineering or business projects are listed inline within the `career_history[].description` field of the respective roles.
3. **GitHub Activity Score**: The `redrob_signals.github_activity_score` serves as a quantitative representation of the candidate's project work in open source (e.g., commits, pulls, stars). A score of `-1` indicates that no GitHub account is linked.

---

## 4. Summary of Nullable Fields and Placeholders

The candidate schema is designed to prevent missing keys for critical fields; instead, nullable types or specific numeric placeholders are used to represent missing/not-applicable data:

1. **`career_history[].end_date`**: Stored as a date string `YYYY-MM-DD` or `null`. A `null` value indicates that the candidate is currently working in this role (`is_current: true`).
2. **`education[].grade`**: Stored as a string (representing GPA, percentage, or class) or `null`. A `null` indicates that the candidate did not report their grade.
3. **`redrob_signals.github_activity_score`**: Stored as a float between `-1` and `100`. A placeholder value of `-1` is used to represent "No GitHub account linked".
4. **`redrob_signals.offer_acceptance_rate`**: Stored as a float between `-1.0` and `1.0`. A placeholder value of `-1` is used to represent "No historical offers received on the platform".
5. **`certifications` and `languages` arrays**: These are optional top-level keys. If they are absent from the JSON object or empty arrays, it represents that the candidate has no certified credentials or language listings respectively.
6. **`redrob_signals.skill_assessment_scores`**: Can be an empty dictionary `{}` if no skill assessments have been taken on the platform.

---

## 5. Complete JSON Candidate Profile Example

Below is a complete, syntactically valid JSON example representing a candidate profile conforming to the schema rules:

```json
{
  "candidate_id": "CAND_0000001",
  "profile": {
    "anonymized_name": "Ira Vora",
    "headline": "Backend Engineer | SQL, Spark, Cloud",
    "summary": "Software / data professional with 6.9 years of experience building data pipelines, backend systems, and analytics infrastructure. Toolkit is solid on Python, SQL, Spark, Airflow, and database design. Interested in transitioning toward more AI/ML-focused work.",
    "location": "Toronto",
    "country": "Canada",
    "years_of_experience": 6.9,
    "current_title": "Backend Engineer",
    "current_company": "Mindtree",
    "current_company_size": "10001+",
    "current_industry": "IT Services"
  },
  "career_history": [
    {
      "company": "Mindtree",
      "title": "Backend Engineer",
      "start_date": "2024-03-08",
      "end_date": null,
      "duration_months": 27,
      "is_current": true,
      "industry": "IT Services",
      "company_size": "10001+",
      "description": "Implemented streaming data pipelines on Kafka and Spark Streaming for a real-time user-activity processing platform. Designed the schema-registry integration and watermark state management."
    },
    {
      "company": "Dunder Mifflin",
      "title": "Analytics Engineer",
      "start_date": "2019-07-03",
      "end_date": "2024-01-08",
      "duration_months": 55,
      "is_current": false,
      "industry": "Paper Products",
      "company_size": "201-500",
      "description": "Built and maintained data pipelines on Apache Airflow processing ~500GB of daily transactional data across Snowflake and dbt."
    }
  ],
  "education": [
    {
      "institution": "Lovely Professional University",
      "degree": "B.E.",
      "field_of_study": "Computer Science",
      "start_year": 2017,
      "end_year": 2020,
      "grade": "8.24 CGPA",
      "tier": "tier_3"
    }
  ],
  "skills": [
    {
      "name": "NLP",
      "proficiency": "advanced",
      "endorsements": 37,
      "duration_months": 26
    },
    {
      "name": "SQL",
      "proficiency": "expert",
      "endorsements": 45,
      "duration_months": 80
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Cloud Practitioner",
      "issuer": "AWS",
      "year": 2025
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "professional"
    },
    {
      "language": "Hindi",
      "proficiency": "conversational"
    }
  ],
  "redrob_signals": {
    "profile_completeness_score": 86.9,
    "signup_date": "2025-10-16",
    "last_active_date": "2026-05-20",
    "open_to_work_flag": true,
    "profile_views_received_30d": 23,
    "applications_submitted_30d": 2,
    "recruiter_response_rate": 0.34,
    "avg_response_time_hours": 177.8,
    "skill_assessment_scores": {
      "NLP": 38.8
    },
    "connection_count": 356,
    "endorsements_received": 35,
    "notice_period_days": 60,
    "expected_salary_range_inr_lpa": {
      "min": 18.7,
      "max": 36.1
    },
    "preferred_work_mode": "onsite",
    "willing_to_relocate": false,
    "github_activity_score": 9.2,
    "search_appearance_30d": 249,
    "saved_by_recruiters_30d": 4,
    "interview_completion_rate": 0.71,
    "offer_acceptance_rate": 0.58,
    "verified_email": true,
    "verified_phone": true,
    "linkedin_connected": false
  }
}
```
