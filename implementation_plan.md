# Frontend Implementation Plan (Days 5, 7, 9, & 10)

We have successfully completed all Backend (BE) work for Developer B! However, looking at the PRD, Developer B is also responsible for building several critical Frontend (FE) React components to complete the pipeline:

- **Day 5:** `Dashboard`, `Ranking Table`
- **Day 7:** `comparison_page.tsx`
- **Day 9:** `funnel_visualization.tsx`
- **Day 10:** UI Polish, Demo Flow, Animations

Since there is no frontend directory yet, we need to initialize the React application and build out these stunning UI components so the judges have something beautiful to interact with.

## User Review Required
> [!IMPORTANT]
> **Frontend Framework Choice:** 
> I propose initializing a fresh **Vite + React (TypeScript)** project in a new `frontend/` directory. Vite is blazing fast and perfect for hackathons. We will use **TailwindCSS** for rapid styling, and **Framer Motion** for the Day 10 "Animations" requirement. 
> 
> *Do you approve of Vite + React + Tailwind? Or would you prefer Next.js?*

## Proposed Changes

### 1. Initialize Frontend Repository
#### [NEW] `frontend/` (Vite React App)
- Run `npx -y create-vite@latest frontend --template react-ts` to bootstrap the app.
- Install TailwindCSS and Framer Motion.
- Connect it to our existing FastAPI backend (`http://localhost:8000`).

### 2. Build the Dashboard (Day 5)
#### [NEW] `frontend/src/pages/Dashboard.tsx`
- The main recruiter view.
- A split layout showing the "Top 7 Best Fits" and "18 Considered Candidates".
- Includes the `RankingTable` component to display Semantic vs Domain scores.

### 3. Build the Candidate Comparison (Day 7)
#### [NEW] `frontend/src/pages/ComparisonPage.tsx`
- A side-by-side view where a recruiter selects two candidates and hits "Compare".
- Will cleanly render the Strengths/Weaknesses matrix returned by our `comparison_engine.py`.

### 4. Build the Hiring Funnel Visualization (Day 9)
#### [NEW] `frontend/src/components/FunnelVisualization.tsx`
- A dynamic, animated SVG or CSS funnel showing the drop-off from "5000 Total -> 25 Semantic Matches -> Top 7 Best Fits". This satisfies the Day 9 PRD requirement.

### 5. Polish & Animations (Day 10)
#### [MODIFY] `frontend/src/index.css`
- Apply dark-mode glassmorphism and modern gradient styling to make it look like a premium, Tier-1 product.
- Add Framer Motion micro-interactions (hover effects, page transitions).

## Verification Plan
1. Start the Vite dev server (`npm run dev`).
2. Verify the Funnel renders correctly.
3. Ensure the Dashboard can successfully hit our FastAPI `/api/jd/match` route and display the candidates.
