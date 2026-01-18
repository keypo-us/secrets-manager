"use client";

import { ReactNode, useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from 'viem/chains';

interface PrivyWrapperProps {
  children: ReactNode;
}

export const PrivyWrapper = ({ children }: PrivyWrapperProps) => {
  // Use useEffect to log when the component mounts
  useEffect(() => {
    console.log("PrivyWrapper loaded with appId:", process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  }, []);

  return (
    <PrivyProvider 
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
    config={{
      defaultChain: baseSepolia,
      supportedChains: [baseSepolia],
      loginMethods: ["email"],
      embeddedWallets: {
        requireUserPasswordOnCreate: false,
        createOnLogin: "users-without-wallets",
        showWalletUIs: false,
      },
      appearance: {
        theme: '#0a0a0a',
        accentColor: '#ffedd5',
        landingHeader: 'Welcome to key manager!',
        loginMessage: 'To get started, please log in',
      },
    }}>
      <>{children}</>
    </PrivyProvider>
  );
};
