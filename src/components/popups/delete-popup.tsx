"use client";

import React, { useEffect, useRef } from "react";
import { HudFrame } from "../hud-frame";

interface DeletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  deleteSuccess?: boolean;
  error?: string;
}

export function DeletePopup({ isOpen, onClose, onConfirm, isDeleting, deleteSuccess, error }: DeletePopupProps) {
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the delete button when the popup opens
    if (isOpen && !isDeleting && !deleteSuccess && !error) {
      deleteButtonRef.current?.focus();
    }
  }, [isOpen, isDeleting, deleteSuccess, error]);

  if (!isOpen) return null;

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
            {!isDeleting && !deleteSuccess && !error && (
              <div className="space-y-4">
                <h3 className="text-yellow-400 font-bold text-lg">Warning: delete is non-reversible</h3>
                <button
                  ref={deleteButtonRef}
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Delete
                </button>
              </div>
            )}
            
            {isDeleting && (
              <div className="space-y-4">
                <h3 className="text-primary font-bold text-lg">Deleting secret</h3>
                <div className="dot-ellipsis">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
            
            {!isDeleting && deleteSuccess && (
              <div className="space-y-4">
                <h3 className="text-green-400 font-bold text-lg">Delete successful!</h3>
                <p className="text-foreground text-sm">The secret has been deleted.</p>
              </div>
            )}
            
            {!isDeleting && error && (
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