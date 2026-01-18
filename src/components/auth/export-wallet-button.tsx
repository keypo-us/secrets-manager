import React from "react";
import { usePrivy } from "@privy-io/react-auth";

export function ExportWalletButton() {
  const { ready, authenticated, exportWallet } = usePrivy();
  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;

  return (
    <button
      onClick={exportWallet}
      disabled={!isAuthenticated}
      className="w-full px-4 py-2 rounded-md text-primary font-bold tracking-wider border-none bg-transparent cursor-pointer hover:text-foreground focus:outline-none disabled:opacity-50"
    >
      Export private key
    </button>
  );
} 