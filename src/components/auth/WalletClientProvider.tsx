"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePrivy, useSignAuthorization, useWallets } from "@privy-io/react-auth";
import { getWalletClientAndAuthorization } from "../../app/utils/wallet-utils";

export const WalletClientContext = createContext({
  walletClient: null,
  authorization: null,
});

export const useWalletClient = () => useContext(WalletClientContext);

export const WalletClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { wallets } = useWallets();
  const { authenticated } = usePrivy();
  const userWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const [state, setState] = useState<{
    walletClient: any | null;
    authorization: any | null;
  }>({ walletClient: null, authorization: null });
  const { signAuthorization } = useSignAuthorization();

  useEffect(() => {
    console.log("WalletClientProvider: fetchData", authenticated, userWallet);
    const fetchData = async () => {
      if (authenticated && userWallet) {
        try {
          const result = await getWalletClientAndAuthorization(userWallet, signAuthorization);
          setState({ walletClient: result.walletClient, authorization: result.authorization });
          console.log("WalletClientProvider: set walletClient and authorization", result);
        } catch (err) {
          console.error("WalletClientProvider: error in getWalletClientAndAuthorization", err);
        }
      } else {
        setState({ walletClient: null, authorization: null });
        console.log("WalletClientProvider: reset walletClient and authorization to null");
      }
    };
    fetchData();
  }, [authenticated, userWallet, signAuthorization]);

  return (
    <WalletClientContext.Provider value={state}>
      {children}
    </WalletClientContext.Provider>
  );
}; 