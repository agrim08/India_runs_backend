'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Play, FileText, CheckCircle2, BadgeAlert } from 'lucide-react';

export default function JdAnalysisPage() {
  const [jdText, setJdText] = React.useState(
    `We are looking for a Senior Software Engineer with 5+ years of experience in Golang and React. The candidate must be comfortable building RESTful APIs, working with Docker/Kubernetes, and managing PostgreSQL databases. Experience with microservice architectures and AWS is a major plus.`
  );
  const [analyzed, setAnalyzed] = React.useState(false);

  const skillsExtracted = ['Golang (Core)', 'React.js (Core)', 'REST APIs (Core)', 'Docker', 'Kubernetes', 'PostgreSQL', 'Microservices (Optional)', 'AWS (Optional)'];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            JD Analysis
          </h1>
          <p className="text-muted-foreground text-sm">
            Analyze your job descriptions to extract semantic skills, filter criteria, and role complexity.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Input area */}
        <div className="md:col-span-2 space-y-4">
          <div className="border border-border/40 bg-card/45 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Input Job Description
            </h2>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-semibold">Job Title</label>
              <input
                type="text"
                defaultValue="Senior Golang / React Developer"
                className="w-full bg-background border border-border/60 hover:border-border rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-semibold">Paste JD Content</label>
              <textarea
                rows={8}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full bg-background border border-border/60 hover:border-border rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-hidden focus:border-primary resize-y"
                placeholder="Paste the job description text here..."
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setAnalyzed(true)}
                className="cursor-pointer flex items-center gap-1.5 font-semibold"
              >
                <BrainCircuit className="h-4 w-4" /> Analyze Job Description
              </Button>
            </div>
          </div>
        </div>

        {/* Right Help / Status Sidebar */}
        <div className="border border-border/40 bg-card/30 rounded-xl p-6 h-fit space-y-6">
          <h3 className="text-sm font-bold text-foreground">JD Best Practices</h3>
          <ul className="space-y-4 text-xs leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Ensure you split core and optional tech skills to let AI rank candidates accurately.</span>
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Specify exact years of experience ranges to calibrate the trajectory predictor.</span>
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Write short, clear responsibilities to enable clean semantic embedding matches.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* JD Analysis Results Mock */}
      {analyzed && (
        <div className="border border-border/40 bg-card/45 p-6 rounded-xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="border-b border-border/40 pb-4">
            <h2 className="text-lg font-bold">Analysis Results & Extracted Schema</h2>
            <p className="text-xs text-muted-foreground">AI has converted your unstructured JD into a structured ranking schema.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Extracted skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground tracking-wider uppercase">Extracted Skillsets</h3>
              <div className="flex flex-wrap gap-1.5">
                {skillsExtracted.map((skill) => (
                  <span
                    key={skill}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                      skill.includes('Core')
                        ? 'bg-primary/5 text-primary border-primary/20'
                        : 'bg-muted text-muted-foreground border-border/60'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Insights & Alerts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground tracking-wider uppercase">AI Calibration Insights</h3>
              <div className="space-y-2">
                <div className="p-3 border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 rounded-lg text-xs flex gap-2">
                  <BadgeAlert className="h-4 w-4 shrink-0" />
                  <span>Market calibration: Senior roles requiring Golang & React are in high demand. Expect fewer highly-aligned candidates.</span>
                </div>
                <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Experience requirement of 5+ years matches standard senior level tags in our model database.</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground tracking-wider uppercase">Actions</h3>
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground leading-normal">
                  Your Job Description is optimized. You can now upload candidate profiles to rank them against this JD.
                </p>
                <Button className="w-full cursor-pointer flex items-center justify-center gap-1.5 h-8 text-xs font-semibold rounded-lg">
                  <Play className="h-3 w-3 fill-current" /> Proceed to Candidate Ranking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
