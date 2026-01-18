"use client";

import React from "react";
import { HudFrame } from "../hud-frame";

interface UploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isUploading: boolean;
  error?: string;
  uploadData?: {
    name: string;
    dataIdentifier?: string;
    dataCid?: string;
    dataContractAddress?: string;
  };
}

export function UploadPopup({ isOpen, onClose, isUploading, uploadData, error }: UploadPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <HudFrame>
        <div className="relative p-6 w-[800px]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-primary hover:text-orange-400 transition-colors text-xl"
          >
            ✕
          </button>
          
          <div className="mt-4">
            {isUploading ? (
              <div className="flex items-center justify-center">
                <span className="text-primary text-base">Uploading Secret</span>
                <span className="text-primary ml-1 text-base">
                  <span className="animate-[dots_1s_infinite]">.</span>
                  <span className="animate-[dots_1s_infinite]" style={{ animationDelay: '0.33s' }}>.</span>
                  <span className="animate-[dots_1s_infinite]" style={{ animationDelay: '0.66s' }}>.</span>
                </span>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="text-red-500 text-base font-bold mb-2">Error</div>
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            ) : uploadData ? (
              <div className="space-y-4">
                <div className="text-center text-base font-bold text-green-500">Upload successful!</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary whitespace-nowrap">Name:</span>
                    <span className="text-foreground">{uploadData.name}</span>
                  </div>
                  {uploadData.dataIdentifier && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary whitespace-nowrap">Data ID:</span>
                      <span className="text-foreground font-mono">{uploadData.dataIdentifier}</span>
                    </div>
                  )}
                  {uploadData.dataCid && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary whitespace-nowrap">Data Location:</span>
                      <span className="text-foreground font-mono">{uploadData.dataCid}</span>
                    </div>
                  )}
                  {uploadData.dataContractAddress && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary whitespace-nowrap">Data Smart Contract Address:</span>
                      <span className="text-foreground font-mono">{uploadData.dataContractAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </HudFrame>
    </div>
  );
} 