'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  currentRole: string;
  experience: string;
  matchScore: number;
  matchReason: string;
  skills: string[];
  status: 'highly-recommended' | 'recommended' | 'hidden-gem' | 'underqualified';
}

const mockCandidates: Candidate[] = [
  {
    id: 'CAND-01',
    name: 'Aishwarya Sen',
    currentRole: 'Senior Software Engineer',
    experience: '6 years',
    matchScore: 97,
    matchReason: 'Perfect technical stack alignment. Led transition to microservices and has deep Golang/React domain expertise.',
    skills: ['Golang', 'React', 'Kubernetes', 'REST APIs'],
    status: 'highly-recommended',
  },
  {
    id: 'CAND-02',
    name: 'Rahul Sharma',
    currentRole: 'Backend Engineer',
    experience: '4 years',
    matchScore: 92,
    matchReason: 'Strong systems background and database tuning experience. Ex-Amazon with strong distributed systems design foundations.',
    skills: ['Golang', 'PostgreSQL', 'Redis', 'Docker'],
    status: 'highly-recommended',
  },
  {
    id: 'CAND-03',
    name: 'Priyanka Patel',
    currentRole: 'Full Stack Consultant',
    experience: '3 years',
    matchScore: 89,
    matchReason: 'Classified as a Hidden Gem. Though her title is Consultant, her actual projects exhibit senior-level architectural design in cloud systems.',
    skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
    status: 'hidden-gem',
  },
  {
    id: 'CAND-04',
    name: 'Vikram Singh',
    currentRole: 'Software Developer',
    experience: '5 years',
    matchScore: 81,
    matchReason: 'Solid developer, but lacks Golang production experience. Strong in Python and willing to pivot.',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    status: 'recommended',
  },
  {
    id: 'CAND-05',
    name: 'Neha Gupta',
    currentRole: 'QA Automation Engineer',
    experience: '3 years',
    matchScore: 48,
    matchReason: 'Primarily automation and testing background. Insufficient software design and system engineering alignment.',
    skills: ['Python', 'Selenium', 'CI/CD', 'Jest'],
    status: 'underqualified',
  },
];

export default function RankPage() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'gems' | 'recommended'>('all');

  const filteredCandidates = mockCandidates.filter((cand) => {
    const matchesSearch = cand.name.toLowerCase().includes(search.toLowerCase()) || 
                          cand.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'gems') return matchesSearch && cand.status === 'hidden-gem';
    if (filter === 'recommended') return matchesSearch && (cand.status === 'highly-recommended' || cand.status === 'recommended');
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Rank Candidates
          </h1>
          <p className="text-muted-foreground text-sm">
            Review AI-ranked candidates for your active job descriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="cursor-pointer">Upload Resumes</Button>
          <Button className="cursor-pointer flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Run Ranking Engine
          </Button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/45 border border-border/40 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border/60 hover:border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-hidden focus:border-primary"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
            className="cursor-pointer text-xs rounded-lg"
          >
            All Candidates
          </Button>
          <Button
            variant={filter === 'recommended' ? 'default' : 'outline'}
            onClick={() => setFilter('recommended')}
            size="sm"
            className="cursor-pointer text-xs rounded-lg"
          >
            Recommended
          </Button>
          <Button
            variant={filter === 'gems' ? 'default' : 'outline'}
            onClick={() => setFilter('gems')}
            size="sm"
            className="cursor-pointer text-xs rounded-lg flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3 text-amber-500" /> Hidden Gems
          </Button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="border border-border/40 rounded-xl bg-card/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="p-4">Rank & Candidate</th>
                <th className="p-4">Match Score</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {filteredCandidates.map((cand, index) => {
                const getStatusStyle = (status: string) => {
                  switch (status) {
                    case 'highly-recommended':
                      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                    case 'recommended':
                      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
                    case 'hidden-gem':
                      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                    default:
                      return 'bg-muted text-muted-foreground border-border/40';
                  }
                };

                const getStatusText = (status: string) => {
                  if (status === 'highly-recommended') return 'Highly Recommended';
                  if (status === 'recommended') return 'Recommended';
                  if (status === 'hidden-gem') return '💎 Hidden Gem';
                  return 'Underqualified';
                };

                return (
                  <tr key={cand.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-base text-muted-foreground w-6 text-center">
                          #{index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{cand.name}</span>
                          <span className="text-xs text-muted-foreground">{cand.currentRole} • {cand.experience}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cand.matchScore >= 90 ? 'bg-emerald-500' : cand.matchScore >= 80 ? 'bg-blue-500' : 'bg-muted-foreground/45'
                            }`}
                            style={{ width: `${cand.matchScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-sm">{cand.matchScore}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {cand.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-border/60 bg-muted/30 text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(cand.status)}`}>
                        {getStatusText(cand.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="cursor-pointer group-hover:bg-muted text-xs h-7 rounded-lg">
                        Details <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 opacity-40" />
                      <p className="text-sm font-semibold">No candidates found matching the criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
