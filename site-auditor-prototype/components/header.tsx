'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Site Auditor
            </h1>
          </div>
          <p className="text-xs text-muted-foreground/80">AI-powered analysis engine</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg hover:bg-primary/10 transition-all duration-200 text-foreground/70 hover:text-foreground"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 transition-transform hover:rotate-90" />
          ) : (
            <Moon className="w-5 h-5 transition-transform hover:-rotate-90" />
          )}
        </button>
      </div>
    </header>
  );
}
