import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWalletClient } from "./auth/WalletClientProvider";
import { getKeyDataByUser } from "../app/utils/key-utils";
import { InfoPopup } from "./popups/info-popup";
import { ViewPopup } from "./popups/view-popup";
import { DeletePopup } from "./popups/delete-popup";
import { UpdatePopup } from "./popups/update-popup";
import { SharePopup } from "./popups/share-popup";
import { decrypt, deleteData, postProcess, encrypt, preProcess, shareData, getDataInfo } from "@keypo/typescript-sdk";
import { decryptConfig, encryptConfig, deleteConfig, shareConfig } from "../app/utils/key-types";
import refs from "../../public/refs.json";
import { ethers } from "ethers";

// Utility to truncate a string
function truncate(str?: string, len = 15) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

type KeyData = {
  keyName?: string;
  keyIdentifier?: string;
  owner?: string;
  ownerAddress?: string;
};

export function ManageSecretsTab() {
  const { user, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const userWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const { walletClient, authorization } = useWalletClient();
  const [state, setState] = useState({
    data: null as KeyData[] | null,
    loading: false,
    error: null as string | null,
    copied: { idx: -1, field: '' } as { idx: number; field: string },
    popupOpen: false,
    popupData: null as KeyData | null,
    menuOpen: null as { idx: number, direction: 'up' | 'down' } | null,
    ethersProvider: null as ethers.providers.Web3Provider | null,
    ethersSigner: null as ethers.Signer | null,
    viewPopupOpen: false,
    isRetrieving: false,
    secretValue: null as string | null,
    viewError: null as string | null,
    deletePopupOpen: false,
    isDeleting: false,
    deleteSuccess: false,
    deleteError: null as string | null,
    updatePopupOpen: false,
    isUpdating: false,
    updateSuccess: false,
    updateError: null as string | null,
    selectedKey: null as KeyData | null,
    currentValue: null as string | null,
    isRetrievingCurrentValue: false,
    sharePopupOpen: false,
    isSharing: false,
    shareSuccess: false,
    shareError: null as string | null,
    sharedUsers: [] as string[],
    isLoadingUsers: false,
  });

  useEffect(() => {
    const setupProvider = async () => {
      if (userWallet) {
        const privyProvider = await userWallet.getEthereumProvider();
        const ethersProvider = new ethers.providers.Web3Provider(privyProvider);
        const ethersSigner = ethersProvider.getSigner();
        setState(s => ({ ...s, ethersProvider, ethersSigner }));
      }
    };
    setupProvider();
  }, [userWallet]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.wallet?.address) return;
      setState(s => ({ ...s, loading: true, error: null, popupOpen: false, popupData: null }));
      try {
        const result = await getKeyDataByUser(user.wallet.address);
        setState(s => ({ ...s, data: result, loading: false }));
      } catch {
        setState(s => ({ ...s, error: "Failed to fetch key data", loading: false }));
      }
    };
    fetchData();
  }, [user?.wallet?.address]);

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>, idx: number) => {
    if (state.menuOpen?.idx === idx) {
      setState(s => ({ ...s, menuOpen: null }));
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 125; // Estimated height of the menu in pixels

    const hasSpaceAbove = buttonRect.top > menuHeight;
    const direction = hasSpaceAbove ? 'up' : 'down';

    setState(s => ({ ...s, menuOpen: { idx, direction } }));
  };

  const handleCopy = (text: string, idx: number, field: string) => {
    navigator.clipboard.writeText(text);
    setState(s => ({ ...s, copied: { idx, field } }));
    setTimeout(() => setState(s => ({ ...s, copied: { idx: -1, field: '' } })), 1200);
  };

  const handleView = async (row: KeyData) => {
    console.log('View key:', row);
    if (!walletClient || !row.keyIdentifier) return;
    
    setState(s => ({ 
      ...s, 
      viewPopupOpen: true, 
      isRetrieving: true, 
      secretValue: null, 
      viewError: null 
    }));
    
    try {
      // TODO: Decrypt data
      const result = await decrypt(
        row.keyIdentifier,
        walletClient,
        decryptConfig,
        true,
      );
      console.log('Decrypted data:', result);
      // TODO: Post-process data
      const decryptedDataString = postProcess(result.decryptedData, result.metadata);
      console.log('Decrypted data string:', decryptedDataString);
      
      setState(s => ({ 
        ...s, 
        isRetrieving: false, 
        secretValue: String(decryptedDataString) 
      }));
    } catch (err) {
      console.error('Decrypt error:', err);
      setState(s => ({ 
        ...s, 
        isRetrieving: false, 
        viewError: err instanceof Error ? err.message : "An error occurred while retrieving the secret." 
      }));
    }
  };

  const handleDelete = (row: KeyData) => {
    setState(s => ({ ...s, deletePopupOpen: true, selectedKey: row }));
  };

  const handleConfirmDelete = async () => {
    if (!walletClient || !authorization || !state.selectedKey?.keyIdentifier) return;
    
    setState(s => ({ 
      ...s, 
      isDeleting: true, 
      deleteSuccess: false,
      deleteError: null 
    }));
    
    try {

      await deleteData(
        state.selectedKey.keyIdentifier,
        walletClient as any,
        authorization as any,
        deleteConfig,
        true,
      );
      
      setState(s => ({ 
        ...s, 
        isDeleting: false, 
        deleteSuccess: true,
        data: s.data?.filter(item => item.keyIdentifier !== state.selectedKey?.keyIdentifier) || null
      }));

    } catch (err) {
      console.error('Delete error:', err);
      setState(s => ({ 
        ...s, 
        isDeleting: false, 
        deleteError: err instanceof Error ? err.message : "An error occurred while deleting the secret." 
      }));
    }
  };

  const handleOpenUpdate = async (row: KeyData) => {
    console.log('Open update for key:', row);
    if (!walletClient || !row.keyIdentifier) return;
    
    setState(s => ({ 
      ...s, 
      updatePopupOpen: true, 
      selectedKey: row,
      currentValue: null,
      updateError: null,
      isRetrievingCurrentValue: true
    }));
    
    try {
      const result = await decrypt(row.keyIdentifier, walletClient, decryptConfig, true);
      const decryptedDataString = postProcess(result.decryptedData, result.metadata);
      setState(s => ({ ...s, currentValue: String(decryptedDataString), isRetrievingCurrentValue: false }));
    } catch (err) {
      console.error('Error getting current value:', err);
      setState(s => ({ 
        ...s, 
        currentValue: "[Error retrieving current value]",
        updateError: err instanceof Error ? err.message : "An error occurred while retrieving the current value.",
        isRetrievingCurrentValue: false
      }));
    }
  };

  const handleUpdate = async (value: string, key: KeyData) => {
    console.log('Update value:', value);
    console.log('Update key:', key);
    if (!walletClient || !authorization || !key.keyIdentifier || !key.keyName) {
      setState(s => ({ 
        ...s, 
        updateError: "Wallet client or authorization or key identifier or key name is not ready." 
      }));
      return;
    }

    setState(s => ({ 
      ...s, 
      isUpdating: true, 
      updateSuccess: false,
      updateError: null 
    }));

    try {
      // 1. Get previous holders
      const dataInfo = await getDataInfo(key.keyIdentifier, true, refs.KeypoApiUrl);
      const previousHoldersAddresses = dataInfo?.users || [];
      console.log('Previous holders addresses:', previousHoldersAddresses);

      // 2. Delete old key
      await deleteData(
        key.keyIdentifier,
        walletClient as any,
        authorization as any,
        deleteConfig,
        true,
      );
      console.log('Deleted old key');

      // 3. Create new key
      const { dataOut, metadataOut } = await preProcess(
        value,
        key.keyName,
        true,
        { fileUseType: "key" }
      );
      console.log('Pre-processed data');
      const result = await encrypt(
        dataOut,
        walletClient as any,
        metadataOut,
        authorization,
        encryptConfig,
        true
      );
      console.log('New key:', result);

      // 4. Share with previous holders if there are any
      if (previousHoldersAddresses.length > 0) {
        console.log('Sharing with previous holders');
        await shareData(
          result.dataIdentifier,
          walletClient as any,
          previousHoldersAddresses,
          shareConfig,
          authorization as any,
          true,
        );
      }
      console.log('Shared with previous holders');

      // 5. refresh data
      const updatedSelectedKey = {
        ...key,
        keyIdentifier: result.dataIdentifier
      };

      setState(s => {
        const updatedData = s.data?.map((item: KeyData) => 
          item.keyIdentifier === key.keyIdentifier 
            ? { ...item, keyIdentifier: result.dataIdentifier }
            : item
        ) || null;

        return {
          ...s,
          isUpdating: false,
          updateSuccess: true,
          data: updatedData,
          selectedKey: updatedSelectedKey,
          currentValue: value
        };
      });
    } catch (err) {
      console.error('Error updating key:', err);
      setState(s => ({ 
        ...s, 
        isUpdating: false,
        updateError: err instanceof Error ? err.message : "An error occurred while updating the key."
      }));
    }
  };

  const handleShare = async (address: string, dataIdentifier: string) => {
    if (!walletClient || !authorization || !dataIdentifier) {
      setState(s => ({ 
        ...s, 
        shareError: "Wallet client or authorization or key identifier is not ready." 
      }));
      return;
    }
    
    setState(s => ({ ...s, isSharing: true, shareSuccess: false, shareError: null }));

    try {
      let walletAddress = '';
      const checkEmail = await fetch('/api/getEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: address })
      });
      const checkEmailData = await checkEmail.json();
      console.log('getEmail API response:', checkEmailData);

      if (checkEmailData.walletAddress) {
        walletAddress = checkEmailData.walletAddress;
        console.log('Wallet address (from getEmail):', walletAddress);
      } else {
        console.log("Trying to pregenerate wallet for email:", address);
        const pregenerate = await fetch('/api/preGenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: address })
        });
        const pregenerateData = await pregenerate.json();
        console.log('pregenerate API response:', pregenerateData);

        const walletAccount = pregenerateData.user?.linked_accounts?.find(
          (acc: any) => acc.type === 'wallet' && acc.chain_type === 'ethereum'
        );
        if (walletAccount?.address) {
            walletAddress = walletAccount.address;
            console.log('Wallet address (from pregenerate):', walletAddress);
        }
      }

      if (!walletAddress) {
          throw new Error("Could not find or create a wallet for the provided email.");
      }
      
      console.log('Sharing with wallet address:', walletAddress);
      console.log('Data identifier:', dataIdentifier);

      await shareData(
        dataIdentifier,
        walletClient as any,
        [walletAddress],
        shareConfig,
        authorization as any,
        true,
      );

      setState(s => ({ 
        ...s, 
        isSharing: false, 
        shareSuccess: true 
      }));
    } catch (err) {
      console.error('Share error:', err);
      setState(s => ({ 
        ...s, 
        isSharing: false,
        shareError: err instanceof Error ? err.message : "An error occurred while sharing the key."
      }));
    }
  };

  const handleListUsers = async (dataIdentifier: string) => {
    if (state.isLoadingUsers) return;

    setState(s => ({ ...s, isLoadingUsers: true }));

    try {
      const dataInfo = await getDataInfo(dataIdentifier, true, refs.KeypoApiUrl);
      const currentHoldersAddresses = dataInfo?.users || [];
      console.log('Current holders addresses:', currentHoldersAddresses);
      const emailHolders: string[] = [];
      for (const address of currentHoldersAddresses) {
        const res = await fetch('/api/getWallets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });
        const data = await res.json();
        const emailAccount = data.linked_accounts?.find(
          (acc: any) => acc.type === 'email'
        );
        if (emailAccount) {
          emailHolders.push(emailAccount.address);
        }
        else {
          emailHolders.push(address);
        }
      }
      setState(s => ({
        ...s,
        sharedUsers: emailHolders,
        isLoadingUsers: false,
      }));
    } catch (err) {
      console.error('Error calling getWallets API:', err);
      setState(s => ({
        ...s,
        isLoadingUsers: false,
      }));
    }
  };

  const checkOwnership = (key: KeyData) => {
    return key.ownerAddress?.toLowerCase() === user?.wallet?.address?.toLowerCase();
  };

  // Show login button for unauthenticated users
  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <button
          onClick={login}
          className="px-6 py-3 rounded bg-primary text-black font-bold hover:bg-orange-400 transition-colors"
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  if (state.loading) return (
    <div className="flex items-center h-full w-full justify-center">
      Loading
      <span className="dot-ellipsis">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  );
  if (state.error) return <div>{state.error}</div>;
  if (!state.data || state.data.length === 0) return <div>No data found.</div>;

  const CopyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
      <rect x="8" y="8" width="8" height="12" rx="2" className="fill-background" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
    </svg>
  );

  return (
    <>
      <div className="flex-1 w-full h-full min-h-0 overflow-auto">
        <table className="w-full border-collapse text-xs table-fixed relative">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="bg-background text-primary">
              <th className="px-4 py-2 border-b border-r border-primary text-left align-middle w-1/3">Key Name</th>
              <th className="px-4 py-2 border-b border-r border-primary text-left align-middle w-1/3">Key ID</th>
              <th className="px-4 py-2 border-b border-r border-primary text-left align-middle w-1/4">Key Owner</th>
              <th className="px-2 py-2 border-b border-r border-primary text-left align-middle w-20">More Info</th>
              <th className="px-2 py-2 border-b border-primary text-left align-middle w-20">Manage Key</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((row: KeyData, idx: number) => {
              const isOwner = checkOwnership(row);
              return (
                <tr key={idx} className="border-b border-orange-300 hover:bg-muted/30">
                  <td className="px-4 py-2 border-r border-primary text-left align-middle w-1/3">
                    <div className="flex flex-row items-center gap-2 min-w-0">
                      <span className="truncate overflow-hidden whitespace-nowrap align-middle">{row.keyName}</span>
                      {row.keyName && (
                        <button
                          className="p-1 rounded hover:bg-primary/20 transition-colors align-middle"
                          onClick={() => handleCopy(row.keyName || '', idx, 'keyName')}
                          title={state.copied.idx === idx && state.copied.field === 'keyName' ? 'Copied!' : 'Copy Key Name'}
                          aria-label="Copy Key Name"
                        >
                          {state.copied.idx === idx && state.copied.field === 'keyName' ? (
                            <span className="text-primary text-xs font-bold">Copied!</span>
                          ) : CopyIcon}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-r border-primary text-left align-middle w-1/3">
                    <div className="flex flex-row items-center gap-2 min-w-0">
                      <span className="truncate overflow-hidden whitespace-nowrap align-middle max-w-xs">{truncate(row.keyIdentifier, 30)}</span>
                      {row.keyIdentifier && (
                        <button
                          className="p-1 rounded hover:bg-primary/20 transition-colors align-middle"
                          onClick={() => handleCopy(row.keyIdentifier || '', idx, 'keyIdentifier')}
                          title={state.copied.idx === idx && state.copied.field === 'keyIdentifier' ? 'Copied!' : 'Copy Key Identifier'}
                          aria-label="Copy Key Identifier"
                        >
                          {state.copied.idx === idx && state.copied.field === 'keyIdentifier' ? (
                            <span className="text-primary text-xs font-bold">Copied!</span>
                          ) : CopyIcon}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-r border-primary text-left align-middle w-1/4">
                    <div className="flex flex-row items-center gap-2 min-w-0">
                      <span className="truncate overflow-hidden whitespace-nowrap align-middle">{row.owner}</span>
                      {row.owner && (
                        <button
                          className="p-1 rounded hover:bg-primary/20 transition-colors align-middle"
                          onClick={() => handleCopy(row.owner || '', idx, 'owner')}
                          title={state.copied.idx === idx && state.copied.field === 'owner' ? 'Copied!' : 'Copy Key Owner'}
                          aria-label="Copy Key Owner"
                        >
                          {state.copied.idx === idx && state.copied.field === 'owner' ? (
                            <span className="text-primary text-xs font-bold">Copied!</span>
                          ) : CopyIcon}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 border-r border-primary text-center align-middle w-20">
                    <button
                      className="text-primary hover:text-foreground font-bold text-lg"
                      onClick={() => setState(s => ({ ...s, popupOpen: true, popupData: row }))}
                      aria-label="Show More Info"
                    >
                      ...
                    </button>
                  </td>
                  <td className="px-2 py-2 text-center align-middle w-20 relative">
                    <div className="relative inline-block text-left">
                      <button
                        className="text-primary hover:text-foreground font-bold text-lg px-2 py-1 rounded"
                        onClick={(e) => handleMenuToggle(e, idx)}
                        aria-label="Manage Key Menu"
                      >
                        ...
                      </button>
                      {state.menuOpen?.idx === idx && (
                        <div className={`absolute right-0 w-28 bg-black border border-primary rounded shadow-lg z-10 ${state.menuOpen.direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-2'}`}>
                          <button className="block w-full text-left px-4 py-2 hover:bg-primary/20 text-primary" onClick={() => { setState(s => ({ ...s, menuOpen: null })); handleView(row); }}>View</button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-primary/20 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => { setState(s => ({ ...s, menuOpen: null })); handleOpenUpdate(row); }}
                            disabled={!isOwner}
                            title={!isOwner ? "You are not the owner of this key" : ""}
                          >
                            Update
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-primary/20 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => { setState(s => ({ ...s, menuOpen: null, sharePopupOpen: true, selectedKey: row })); }}
                            disabled={!isOwner}
                            title={!isOwner ? "You are not the owner of this key" : ""}
                          >
                            Share
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-primary/20 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => { setState(s => ({ ...s, menuOpen: null })); handleDelete(row); }}
                            disabled={!isOwner}
                            title={!isOwner ? "You are not the owner of this key" : ""}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <InfoPopup open={state.popupOpen} onClose={() => setState(s => ({ ...s, popupOpen: false }))} keyData={state.popupData || {}} />
      <ViewPopup
        isOpen={state.viewPopupOpen}
        onClose={() => setState(s => ({ 
          ...s, 
          viewPopupOpen: false, 
          secretValue: null, 
          viewError: null 
        }))}
        isRetrieving={state.isRetrieving}
        secretValue={state.secretValue || undefined}
        error={state.viewError || undefined}
      />
      <DeletePopup
        isOpen={state.deletePopupOpen}
        onClose={() => setState(s => ({ 
          ...s, 
          deletePopupOpen: false, 
          deleteSuccess: false, 
          deleteError: null 
        }))}
        onConfirm={handleConfirmDelete}
        isDeleting={state.isDeleting}
        deleteSuccess={state.deleteSuccess}
        error={state.deleteError || undefined}
      />
      <UpdatePopup
        isOpen={state.updatePopupOpen}
        onClose={() => setState(s => ({ 
          ...s, 
          updatePopupOpen: false, 
          updateSuccess: false, 
          updateError: null,
          selectedKey: null,
          currentValue: null,
          isRetrievingCurrentValue: false
        }))}
        onUpdate={handleUpdate}
        isUpdating={state.isUpdating}
        updateSuccess={state.updateSuccess}
        error={state.updateError || undefined}
        selectedKey={state.selectedKey!}
        currentValue={state.currentValue || ''}
        isRetrievingCurrentValue={state.isRetrievingCurrentValue}
      />
      <SharePopup
        isOpen={state.sharePopupOpen}
        onClose={() => setState(s => ({ 
          ...s, 
          sharePopupOpen: false, 
          shareSuccess: false, 
          shareError: null,
          selectedKey: null,
          sharedUsers: [],
        }))}
        onShare={(address) => handleShare(address, state.selectedKey!.keyIdentifier!)}
        isSharing={state.isSharing}
        shareSuccess={state.shareSuccess}
        error={state.shareError || undefined}
        selectedKey={state.selectedKey!}
        onListUsers={() => handleListUsers(state.selectedKey!.keyIdentifier!)}
        sharedUsers={state.sharedUsers}
        isLoadingUsers={state.isLoadingUsers}
      />
    </>
  );
}
 