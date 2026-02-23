'use client';

import { useEffect } from 'react';

export default function RedirectPage() {
  useEffect(() => {
    // Redirect to main site on port 3000
    window.location.href = 'http://localhost:3000';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Redirecting...</h1>
        <p className="text-muted-foreground">
          If you are not redirected, please visit <a href="http://localhost:3000" className="text-primary underline">localhost:3000</a>
        </p>
      </div>
    </div>
  );
}
