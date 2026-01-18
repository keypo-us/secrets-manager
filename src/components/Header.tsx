"use client";

import React, { useState } from "react";
import { HowItWorksPopup } from "./popups/how-it-works-popup";

type HeaderProps = {
  children?: React.ReactNode;
  bottom?: React.ReactNode;
};

export function Header({ children, bottom }: HeaderProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <aside
      className="w-72 min-h-screen border-r border-primary bg-background flex flex-col items-center py-8 px-4 box-border"
    >
      <div className="text-3xl font-bold text-primary mb-2 tracking-tighter text-center">.ENV MANAGER</div>
      <div className="mb-2 text-xs text-foreground/60 tracking-wide">
        Built with{' '}
        <a
          href="https://www.keypo.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Keypo
        </a>
      </div>
      <button
        onClick={() => setShowHowItWorks(true)}
        className="mb-8 text-xs text-primary hover:underline cursor-pointer bg-transparent border-none"
      >
        How It Works
      </button>
      <HowItWorksPopup isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <nav className="flex flex-col gap-4 w-full flex-1">
        {children}
      </nav>
      {bottom && <div className="mt-8 w-full flex justify-center">{bottom}</div>}
    </aside>
  );
} 