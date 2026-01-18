"use client";

import React from "react";
import { HudFrame } from "../hud-frame";

interface HowItWorksPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksPopup({ isOpen, onClose }: HowItWorksPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <HudFrame className="max-w-md">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-primary text-center">How It Works</h2>
          <p className="text-foreground text-sm leading-relaxed">
            This is a serverless secret sharing app built with the Keypo SDK. It uses smart contracts as access control policies (i.e. who can access what secrets) and a distributed key management network for enforcing those policies.
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 rounded bg-primary text-black font-bold hover:bg-orange-400 transition-colors self-center"
          >
            Close
          </button>
        </div>
      </HudFrame>
    </div>
  );
}
