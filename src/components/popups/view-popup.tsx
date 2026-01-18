"use client";

import React, { useState } from "react";
import { HudFrame } from "../hud-frame";

interface ViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isRetrieving: boolean;
  secretValue?: string;
  error?: string;
}

export function ViewPopup({ isOpen, onClose, isRetrieving, secretValue, error }: ViewPopupProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (secretValue) {
      navigator.clipboard.writeText(secretValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <HudFrame className="w-full max-w-2xl mx-4">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-primary hover:text-foreground"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            {isRetrieving && (
              <div className="space-y-4">
                <h3 className="text-primary font-bold text-lg">Retrieving secret</h3>
                <div className="dot-ellipsis">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
            
            {!isRetrieving && secretValue && (
              <div className="space-y-4">
                <h3 className="text-green-400 font-bold text-lg">Retrieved successful!</h3>
                <div className="bg-gray-900 border border-primary rounded p-4">
                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-foreground font-mono text-sm break-all">{secretValue}</p>
                    <button
                      className="p-1 rounded hover:bg-primary/20 transition-colors"
                      onClick={handleCopy}
                      title={copied ? 'Copied!' : 'Copy Secret Value'}
                      aria-label="Copy Secret Value"
                    >
                      {copied ? (
                        <span className="text-primary text-xs font-bold">Copied!</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                          <rect x="8" y="8" width="8" height="12" rx="2" className="fill-background" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!isRetrieving && error && (
              <div className="space-y-4">
                <h3 className="text-red-400 font-bold text-lg">Error</h3>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </HudFrame>
    </div>
  );
} 