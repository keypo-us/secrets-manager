"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWalletClient } from "./auth/WalletClientProvider";
import { preProcess, encrypt, getDataInfo } from "@keypo/typescript-sdk";
import { getKeyDataByUser } from "../app/utils/key-utils";
import refs from "../../public/refs.json";
import { UploadPopup } from "./popups/upload-popup";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { encryptConfig } from "../app/utils/key-types";

interface KeyData {
  keyIdentifier: string;
  keyContractAddress: string;
  keyName?: string;
  owner?: string;
  id?: string;
  keyCID?: string;
  keyMetadata?: string;
}

interface UploadState {
  form: { name: string; value: string };
  isUploading: boolean;
  showPopup: boolean;
  uploadData: {
    name: string;
    dataIdentifier?: string;
    dataCid?: string;
    dataContractAddress?: string;
  } | null;
  error?: string;
}

export function UploadSecretsTab() {
  const { walletClient, authorization } = useWalletClient();
  const { wallets } = useWallets();
  const { authenticated, login } = usePrivy();
  const userWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const [state, setState] = useState<UploadState>({
    form: { name: "", value: "" },
    isUploading: false,
    showPopup: false,
    uploadData: null,
  });

  // Track pending upload after login
  const pendingUploadRef = useRef<{ name: string; value: string } | null>(null);
  const retryCountRef = useRef(0);

  // Auto-submit after login if there's a pending upload
  useEffect(() => {
    if (authenticated && pendingUploadRef.current && walletClient && authorization) {
      const { name, value } = pendingUploadRef.current;
      pendingUploadRef.current = null;
      retryCountRef.current = 0;
      uploadSecret(name, value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, walletClient, authorization]);

  // Function to handle uploading the secret
  const uploadSecret = async (name: string, value: string) => {
    try {
      setState(prev => ({ ...prev, isUploading: true, showPopup: true, error: undefined }));

      if (!walletClient || !authorization || !userWallet?.address) {
        throw new Error("Wallet client or authorization or user wallet address is not ready.");
      }

      // Check if name already exists
      const existingKeys = await getKeyDataByUser(userWallet?.address);
      console.log("Existing keys:", existingKeys);
      const nameExists = existingKeys.some((key: KeyData) =>
        key.keyName === name &&
        key.owner === "Me"
      );

      if (nameExists) {
        throw new Error(`A secret with the name "${name}" already exists. Please choose a different name.`);
      }

      // 1. Pre-process data
      const { dataOut, metadataOut } = await preProcess(
        value,
        name,
        true,
        { fileUseType: "key" }
      );
      // 3. Encrypt data
      const result = await encrypt(
        dataOut,
        walletClient as any,
        metadataOut,
        authorization,
        encryptConfig,
        true
      );

      // 4. Get data info
      const dataInfo = await getDataInfo(result.dataIdentifier, true, refs.KeypoApiUrl);

      setState(prev => ({
        ...prev,
        uploadData: {
          name,
          dataIdentifier: result.dataIdentifier,
          dataCid: result.dataCID,
          dataContractAddress: dataInfo?.dataContractAddress,
        },
        form: { name: "", value: "" },
      }));
      retryCountRef.current = 0;
    } catch (err) {
      console.error("Upload secret error:", err);

      // Silent retry once on failure (5s delay for Account Abstraction nonce to settle)
      if (retryCountRef.current < 1) {
        retryCountRef.current++;
        console.log("Retrying upload in 5 seconds...");
        setTimeout(() => uploadSecret(name, value), 5000);
        return;
      }

      retryCountRef.current = 0;
      setState(prev => ({
        ...prev,
        showPopup: true,
        error: err instanceof Error ? err.message : "An error occurred while uploading the secret."
      }));
    } finally {
      if (retryCountRef.current === 0) {
        setState(prev => ({ ...prev, isUploading: false }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If not authenticated, trigger login and store pending upload
    if (!authenticated) {
      pendingUploadRef.current = { name: state.form.name, value: state.form.value };
      login();
      return;
    }

    uploadSecret(state.form.name, state.form.value);
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-full px-2">
        <div className="flex items-center gap-2 w-full max-w-2xl">
          <label className="text-primary font-bold text-sm whitespace-nowrap w-40 flex-shrink-0 text-right" htmlFor="secret-name">
            Secret Name
          </label>
          <input
            id="secret-name"
            type="text"
            value={state.form.name}
            onChange={e => setState(prev => ({ ...prev, form: { ...prev.form, name: e.target.value } }))}
            className="px-3 py-2 rounded border border-primary bg-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-grow min-w-0 max-w-full text-sm w-full"
            placeholder="Enter secret name"
            required
          />
        </div>
        <div className="flex items-center gap-2 w-full max-w-2xl">
          <label className="text-primary font-bold text-sm whitespace-nowrap w-40 flex-shrink-0 text-right" htmlFor="secret-value">
            Secret Value
          </label>
          <input
            id="secret-value"
            type="text"
            value={state.form.value}
            onChange={e => setState(prev => ({ ...prev, form: { ...prev.form, value: e.target.value } }))}
            className="px-3 py-2 rounded border border-primary bg-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-grow min-w-0 max-w-full text-sm w-full"
            placeholder="Enter secret value"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded bg-primary text-black font-bold hover:bg-orange-400 transition-colors mx-auto"
        >
          Upload Secret
        </button>
      </form>

      <UploadPopup
        isOpen={state.showPopup}
        onClose={() => setState(prev => ({ ...prev, showPopup: false, uploadData: null, error: undefined }))}
        isUploading={state.isUploading}
        uploadData={state.uploadData || undefined}
        error={state.error}
      />
    </div>
  );
} 