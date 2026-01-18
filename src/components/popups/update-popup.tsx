"use client";

import React, { useState } from "react";
import { HudFrame } from "../hud-frame";

type KeyData = {
  keyName?: string;
  keyIdentifier?: string;
  owner?: string;
};

interface UpdatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (value: string, key: KeyData) => Promise<void>;
  isUpdating: boolean;
  updateSuccess?: boolean;
  error?: string;
  selectedKey: KeyData;
  currentValue?: string;
  isRetrievingCurrentValue?: boolean;
}

export function UpdatePopup({ isOpen, onClose, onUpdate, isUpdating, updateSuccess, error, selectedKey, currentValue, isRetrievingCurrentValue }: UpdatePopupProps) {
  const [newValue, setNewValue] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newValue.trim()) {
      await onUpdate(newValue.trim(), selectedKey);
      setNewValue(""); // Reset the input after successful update
    }
  };

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 1200);
  };

  const CopyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
      <rect x="8" y="8" width="8" height="12" rx="2" className="fill-background" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <HudFrame className="w-full max-w-4xl mx-4">
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
            {!isUpdating && !updateSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-primary font-bold text-lg">Update Secret</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Name:</span>
                    <span className="text-foreground">{selectedKey.keyName}</span>
                    {selectedKey.keyName && (
                      <button
                        className="p-1 rounded hover:bg-primary/20 transition-colors"
                        onClick={() => handleCopy(selectedKey.keyName!, "keyName")}
                        title={copied === "keyName" ? "Copied!" : "Copy Key Name"}
                        aria-label="Copy Key Name"
                        type="button"
                      >
                        {copied === "keyName" ? (
                          <span className="text-primary text-xs font-bold">Copied!</span>
                        ) : CopyIcon}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Data ID:</span>
                    <span className="text-foreground font-mono">{selectedKey.keyIdentifier}</span>
                    {selectedKey.keyIdentifier && (
                      <button
                        className="p-1 rounded hover:bg-primary/20 transition-colors"
                        onClick={() => handleCopy(selectedKey.keyIdentifier!, "keyIdentifier")}
                        title={copied === "keyIdentifier" ? "Copied!" : "Copy Data ID"}
                        aria-label="Copy Data ID"
                        type="button"
                      >
                        {copied === "keyIdentifier" ? (
                          <span className="text-primary text-xs font-bold">Copied!</span>
                        ) : CopyIcon}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Current Value:</span>
                    {isRetrievingCurrentValue ? (
                      <div className="flex items-center">
                        <span className="text-foreground font-mono">retrieving key</span>
                        <div className="dot-ellipsis">
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-foreground font-mono">{currentValue || "[Placeholder - Current Value]"}</span>
                        {currentValue && (
                          <button
                            className="p-1 rounded hover:bg-primary/20 transition-colors"
                            onClick={() => handleCopy(currentValue, "currentValue")}
                            title={copied === "currentValue" ? "Copied!" : "Copy Current Value"}
                            aria-label="Copy Current Value"
                            type="button"
                          >
                            {copied === "currentValue" ? (
                              <span className="text-primary text-xs font-bold">Copied!</span>
                            ) : CopyIcon}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-primary bg-black text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter new value"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-orange-400 transition-colors"
                >
                  Update
                </button>
              </form>
            )}
            
            {isUpdating && (
              <div className="space-y-4">
                <h3 className="text-primary font-bold text-lg">Update in progress</h3>
                <div className="dot-ellipsis">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
            
            {!isUpdating && updateSuccess && (
              <div className="space-y-4">
                <h3 className="text-green-400 font-bold text-lg">Update complete!</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Name:</span>
                    <span className="text-foreground">{selectedKey.keyName}</span>
                    {selectedKey.keyName && (
                      <button
                        className="p-1 rounded hover:bg-primary/20 transition-colors"
                        onClick={() => handleCopy(selectedKey.keyName!, "keyName")}
                        title={copied === "keyName" ? "Copied!" : "Copy Key Name"}
                        aria-label="Copy Key Name"
                        type="button"
                      >
                        {copied === "keyName" ? (
                          <span className="text-primary text-xs font-bold">Copied!</span>
                        ) : CopyIcon}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Data ID:</span>
                    <span className="text-foreground font-mono">{selectedKey.keyIdentifier}</span>
                    {selectedKey.keyIdentifier && (
                      <button
                        className="p-1 rounded hover:bg-primary/20 transition-colors"
                        onClick={() => handleCopy(selectedKey.keyIdentifier!, "keyIdentifier")}
                        title={copied === "keyIdentifier" ? "Copied!" : "Copy Data ID"}
                        aria-label="Copy Data ID"
                        type="button"
                      >
                        {copied === "keyIdentifier" ? (
                          <span className="text-primary text-xs font-bold">Copied!</span>
                        ) : CopyIcon}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">New Value:</span>
                    <span className="text-foreground font-mono">{currentValue}</span>
                    {currentValue && (
                      <button
                        className="p-1 rounded hover:bg-primary/20 transition-colors"
                        onClick={() => handleCopy(currentValue, "currentValue")}
                        title={copied === "currentValue" ? "Copied!" : "Copy New Value"}
                        aria-label="Copy New Value"
                        type="button"
                      >
                        {copied === "currentValue" ? (
                          <span className="text-primary text-xs font-bold">Copied!</span>
                        ) : CopyIcon}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {!isUpdating && error && (
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