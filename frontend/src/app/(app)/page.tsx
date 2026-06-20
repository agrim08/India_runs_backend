import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Compass,
  TrendingUp,
  FileSearch2,
  Users2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Search,
      title: 'Semantic Candidate Matching',
      description: 'Go beyond simple keyword matching. Our AI reads between the lines of resumes to evaluate semantic context, domain expertise, and core competencies.',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Sparkles,
      title: 'Hidden Gem Detection',
      description: 'Discover candidates with unconventional career histories or self-taught skills who have a high probability of success based on underlying potential.',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      icon: TrendingUp,
      title: 'Career Trajectory Analysis',
      description: 'Predict career growth potential, promotion likelihood, and role transition feasibility by analyzing millions of professional career paths.',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      icon: FileSearch2,
      title: 'Explainable AI Rankings',
      description: 'Get clear, natural language summaries explaining why a candidate is ranked high or low, eliminating black-box bias in candidate filtering.',
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
  ];

  const stats = [
    { value: '250,000+', label: 'Candidates Analyzed', description: 'Resumes parsed & indexed', icon: Users2, color: 'text-blue-500' },
    { value: '8,420+', label: 'Hidden Gems Detected', description: 'High-potential hires unearthed', icon: Compass, color: 'text-amber-500' },
    { value: '96.4%', label: 'Ranking Accuracy', description: 'Match alignment rate', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 border-b border-border/40 bg-linear-to-b from-muted/50 to-background">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col items-center text-center">
          
          {/* Badge Alert */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Recruiting Engine v1.0
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl leading-tight">
            Next-Gen Candidate Intelligence for{' '}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Smart Recruiters
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Upload candidate resumes and analyze Job Descriptions in seconds. 
            Evaluate talent based on career trajectory, semantic skillset matching, 
            and explainable ranking parameters.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
            <Button nativeButton={false} size="lg" className="w-full sm:w-auto px-8 cursor-pointer rounded-xl font-semibold shadow-lg shadow-primary/25" render={<Link href="/rank" className="flex items-center gap-2" />}>
              Start Ranking <ArrowRight className="h-4 w-4" />
            </Button>
            <Button nativeButton={false} size="lg" variant="outline" className="w-full sm:w-auto px-8 cursor-pointer rounded-xl font-semibold border-border/60 hover:bg-muted" render={<Link href="/jd-analysis" />}>
              Analyze JD
            </Button>
          </div>

          {/* Abstract Screen Mockup Preview */}
          <div className="mt-16 w-full max-w-5xl rounded-2xl border border-border/40 bg-card p-2 shadow-2xl shadow-primary/5">
            <div className="rounded-xl border border-border/40 bg-background/50 overflow-hidden flex flex-col">
              {/* Mock Window Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-4 py-0.5 rounded-md border border-border/40">
                  app.talentintel.ai/rank-candidates
                </div>
                <div className="w-12" />
              </div>
              {/* Mock Dashboard Layout */}
              <div className="p-6 grid md:grid-cols-3 gap-6 bg-linear-to-b from-background to-muted/20 text-left">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-foreground/15 rounded-md" />
                      <div className="h-3 w-40 bg-muted-foreground/15 rounded-md" />
                    </div>
                    <div className="h-7 w-20 bg-primary/10 border border-primary/20 rounded-lg" />
                  </div>
                  {/* Candidate List Mocks */}
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-3 border border-border/30 bg-card rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
                            C{item}
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-32 bg-foreground/15 rounded-sm" />
                            <div className="h-2.5 w-48 bg-muted-foreground/15 rounded-sm" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${95 - item * 8}%` }} />
                          </div>
                          <div className="text-xs font-bold text-right w-8">{95 - item * 8}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right JD Analysis Sidebar Mock */}
                <div className="border border-border/40 rounded-xl bg-card/60 p-4 space-y-4">
                  <div className="h-4 w-24 bg-foreground/15 rounded-md" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-muted-foreground/15 rounded-sm" />
                    <div className="h-2.5 w-full bg-muted-foreground/15 rounded-sm" />
                    <div className="h-2.5 w-3/4 bg-muted-foreground/15 rounded-sm" />
                  </div>
                  <div className="border-t border-border/40 pt-3 space-y-3">
                    <div className="h-3 w-16 bg-foreground/15 rounded-sm" />
                    <div className="flex flex-wrap gap-1.5">
                      <div className="h-5 w-16 bg-blue-500/10 rounded-md border border-blue-500/20" />
                      <div className="h-5 w-20 bg-emerald-500/10 rounded-md border border-emerald-500/20" />
                      <div className="h-5 w-12 bg-violet-500/10 rounded-md border border-violet-500/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 md:py-28 border-b border-border/40 bg-card/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Deep Candidate Analysis Features
            </h2>
            <p className="mt-4 text-muted-foreground">
              Evaluate candidates using state-of-the-art career trajectory neural architectures 
              and natural language explainability indexes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl border border-border/40 bg-card hover:shadow-lg transition-all duration-300 flex items-start gap-5 group"
                >
                  <div className={`p-3.5 rounded-xl ${feature.color} shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/40 bg-card p-8 text-center flex flex-col items-center justify-between shadow-xs"
                >
                  <div className={`p-3 rounded-full bg-muted ${stat.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold tracking-tight">{stat.value}</div>
                    <div className="text-sm font-semibold text-foreground mt-2">{stat.label}</div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-12 bg-background">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">TalentIntel AI</span>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p className="text-xs text-muted-foreground">
              Built by <span className="font-semibold text-foreground">Team TalentIntel</span> for the AI Recruiter Challenge.
            </p>
            <p className="text-[10px] text-muted-foreground">
              © 2026 Hackathon Project. All rights reserved. Candidate Intelligence Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
