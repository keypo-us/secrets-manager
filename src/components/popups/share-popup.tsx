"use client";

import React, { useState } from "react";
import { HudFrame } from "../hud-frame";
import validator from "email-validator";

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (address: string) => void;
  isSharing: boolean;
  shareSuccess?: boolean;
  error?: string;
  selectedKey?: {
    keyName?: string;
    keyIdentifier?: string;
  };
  onListUsers: () => void;
  sharedUsers: string[];
  isLoadingUsers?: boolean;
}

export function SharePopup({
  isOpen,
  onClose,
  onShare,
  isSharing,
  shareSuccess,
  error,
  selectedKey,
  onListUsers,
  sharedUsers,
  isLoadingUsers = false,
}: SharePopupProps) {
  const [state, setState] = useState({
    address: "",
    isDropdownOpen: false,
    searchQuery: "",
    validationError: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = state.address.trim();
    
    // Clear previous validation error
    setState(s => ({ ...s, validationError: "" }));
    
    // Validate email format
    if (!validator.validate(email)) {
      setState(s => ({ ...s, validationError: "Please enter a valid email address." }));
      return;
    }
    
    // Check if email is already shared
    if (sharedUsers.some(userEmail => userEmail.toLowerCase() === email.toLowerCase())) {
      setState(s => ({ ...s, validationError: "This email address already has access to this secret." }));
      return;
    }
    
    if (email) {
      onShare(email);
      setState((s) => ({ ...s, address: "", validationError: "" })); // Reset the input after submission
    }
  };

  const handleToggleDropdown = () => {
    if (!state.isDropdownOpen) {
      onListUsers();
    }
    setState((s) => ({ ...s, isDropdownOpen: !s.isDropdownOpen, searchQuery: "" }));
  };

  const filteredUsers = sharedUsers.filter((email) =>
    email.toLowerCase().includes(state.searchQuery.toLowerCase())
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
            {!isSharing && !shareSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-primary font-bold text-lg">Share Secret</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Name:</span>
                    <span className="text-foreground">{selectedKey?.keyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Data ID:</span>
                    <span className="text-foreground font-mono">{selectedKey?.keyIdentifier}</span>
                  </div>
                  
                  <div className="relative mt-4">
                    <button
                      type="button"
                      onClick={handleToggleDropdown}
                      className="w-full px-3 py-2 text-left rounded border border-primary bg-black text-primary hover:text-foreground transition-colors flex items-center justify-between"
                    >
                      <span>
                        {isLoadingUsers ? (
                          <span className="flex items-center gap-2">
                            Loading users
                            <span className="dot-ellipsis">
                              <span>.</span>
                              <span>.</span>
                              <span>.</span>
                            </span>
                          </span>
                        ) : (
                          "Users with access"
                        )}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-4 h-4 transition-transform ${state.isDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {state.isDropdownOpen && (
                      <div className="absolute w-full mt-1 bg-black border border-primary rounded shadow-lg z-10">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={state.searchQuery}
                            onChange={(e) => setState({ ...state, searchQuery: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 rounded border border-primary bg-black text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {isLoadingUsers ? (
                            <div className="px-3 py-2 text-foreground text-sm">
                              Loading users
                              <span className="dot-ellipsis">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                              </span>
                            </div>
                          ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((email, index) => (
                              <div key={index} className="px-3 py-2 text-foreground hover:bg-primary/20">
                                {email}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-foreground text-sm">
                              {sharedUsers.length === 0 ? 'No other users have access.' : 'No matching users found.'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <input
                      type="text"
                      value={state.address}
                      onChange={(e) => setState({ ...state, address: e.target.value, validationError: "" })}
                      className={`w-full px-3 py-2 rounded border bg-black text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        state.validationError ? 'border-red-400' : 'border-primary'
                      }`}
                      placeholder="Enter email address"
                      required
                    />
                    {state.validationError && (
                      <p className="text-red-400 text-xs mt-1">{state.validationError}</p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-orange-400 transition-colors text-sm"
                >
                  Share
                </button>
              </form>
            )}
            
            {isSharing && (
              <div className="space-y-4">
                <h3 className="text-primary font-bold text-lg">Sharing secret</h3>
                <div className="dot-ellipsis">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
            
            {!isSharing && shareSuccess && (
              <div className="space-y-4">
                <h3 className="text-green-400 font-bold text-lg">Share successful!</h3>
                <p className="text-foreground text-sm">The secret has been shared successfully.</p>
              </div>
            )}
            
            {!isSharing && error && (
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