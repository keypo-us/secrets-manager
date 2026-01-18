import React from "react";
import { HudFrame } from "../hud-frame";

export type KeyInfo = {
  keyName?: string;
  keyIdentifier?: string;
  keyCID?: string;
  keyContractAddress?: string;
  owner?: string;
};

interface InfoPopupProps {
  open: boolean;
  onClose: () => void;
  keyData: KeyInfo;
}

export function InfoPopup({ open, onClose, keyData }: InfoPopupProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!open) return null;

  const handleCopy = (value?: string, field?: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field || null);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const entries = [
    { label: "Key Name", value: keyData.keyName, field: "keyName" },
    { label: "Key ID", value: keyData.keyIdentifier, field: "keyIdentifier" },
    { label: "Key Storage Location (IPFS CID)", value: keyData.keyCID, field: "keyCID" },
    { label: "Key Contract Address", value: keyData.keyContractAddress, field: "keyContractAddress" },
    { label: "Key Owner", value: keyData.owner, field: "owner" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <HudFrame className="relative min-w-[700px] max-w-4xl w-full py-8">
        <button
          className="absolute top-4 right-4 text-primary text-3xl font-bold hover:text-foreground focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col gap-4 text-xs">
          {entries.map(({ label, value, field }) => (
            <div key={field} className="flex items-center gap-2">
              <span className="font-bold text-primary w-48 flex-shrink-0 text-xs">{label}:</span>
              <span className="truncate text-foreground flex-1 text-xs">{value || <span className="text-muted text-xs">N/A</span>}</span>
              {value && (
                <button
                  className="p-1 rounded hover:bg-primary/20 transition-colors"
                  onClick={() => handleCopy(value, field)}
                  title={copiedField === field ? 'Copied!' : `Copy ${label}`}
                  aria-label={`Copy ${label}`}
                >
                  {copiedField === field ? (
                    <span className="text-primary text-xs font-bold">Copied!</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                      <rect x="8" y="8" width="8" height="12" rx="2" className="fill-background" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </HudFrame>
    </div>
  );
} 