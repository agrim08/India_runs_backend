'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User, Settings, LogOut, BrainCircuit, Trophy, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Rank Candidates', href: '/rank', icon: Trophy },
  { label: 'JD Analysis', href: '/jd-analysis', icon: FileText },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              TalentIntel AI
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-muted text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* User Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg cursor-pointer border border-border/40 hover:bg-muted" />}>
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">User menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Recruiter Portal
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-border/40" />
              <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors cursor-pointer hover:bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors cursor-pointer hover:bg-muted">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Billing & API
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border/40" />
              <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors cursor-pointer">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Sheet Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden w-8 h-8 rounded-lg border border-border/40 cursor-pointer hover:bg-muted" />}>
              <Menu className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 rounded-r-2xl border-r border-border/40 flex flex-col justify-between">
              <div>
                <SheetHeader className="p-6 border-b border-border/40">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <BrainCircuit className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-base">TalentIntel AI</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-muted text-foreground font-semibold'
                              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : ''}`} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
              
              <div className="p-4 border-t border-border/40 bg-muted/20">
                <div className="flex items-center gap-3 px-2 py-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border/40 text-muted-foreground">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate">AI recruiter</span>
                    <span className="text-[10px] text-muted-foreground truncate">recruiter@talentintel.ai</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
