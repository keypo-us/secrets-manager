import React from "react";
import { disconnectWeb3 } from "@lit-protocol/auth-browser";
import { usePrivy } from "@privy-io/react-auth";
import { ExportWalletButton } from "./export-wallet-button";

export function ConnectWalletButton({ className = "" }: { className?: string }) {
  const { ready, authenticated, login, logout, user } = usePrivy();

  // Wait until the Privy client is ready before taking any actions
  if (!ready) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {authenticated ? (
        <>
          <div
            className="w-full px-4 py-2 rounded-md text-primary font-bold tracking-wider overflow-hidden text-ellipsis whitespace-nowrap text-center select-text"
            title={user?.email?.address || "Connected"}
            style={{ maxWidth: '100%' }}
          >
            {user?.email?.address || "Connected"}
          </div>
          <ExportWalletButton />
          <button
            onClick={async () => {
              disconnectWeb3();
              await logout();
            }}
            className="w-full px-4 py-2 rounded-md text-primary font-bold tracking-wider border-none bg-transparent cursor-pointer hover:text-foreground focus:outline-none"
          >
            Log Out
          </button>
        </>
      ) : (
        <button
          onClick={login}
          className="w-full px-4 py-2 rounded bg-primary text-black font-bold tracking-wider hover:bg-orange-400 transition-colors"
        >
          Sign In / Sign Up
        </button>
      )}
    </div>
  );
}
