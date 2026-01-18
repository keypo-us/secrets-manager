import { list } from "@keypo/typescript-sdk";
import refs from "../../../public/refs.json";

export const getKeyDataByUser = async (
    minterAddress: string
  ): Promise<
    {
      keyIdentifier: string;
      keyContractAddress: string;
      id?: string;
      keyCID?: string;
      keyName?: string;
      keyMetadata?: string;
    }[]
  > => {
    const dataInfoMap = await list(minterAddress, true, refs.KeypoApiUrl);
    console.log("getKeyDataByUser dataInfoMap", dataInfoMap);
    const keyList = Object.values(dataInfoMap)
      .filter((file: any) => {
        try {
          const userMeta = file.dataMetadata?.userMetaData ? JSON.parse(file.dataMetadata.userMetaData) : null;
          return userMeta && userMeta.fileUseType === "key";
        } catch {
          return false;
        }
      })
      .map((file: any) => ({
        keyIdentifier: file.dataIdentifier,
        keyContractAddress: file.dataContractAddress,
        keyCID: file.cid,
        keyName: file.dataMetadata.name,
        owner: file.owner,
        ownerAddress: file.owner,
      }));
    console.log("getKeyDataByUser keyList", keyList);
    console.log("HELLO!");

    // Replace owner with email or 'Me' if applicable
    const updatedKeyList = await Promise.all(
      keyList.map(async (key) => {
        if (!key.owner) {
          return { ...key, owner: 'Unknown Owner' };
        }
        if (key.owner?.toLowerCase() === minterAddress.toLowerCase()) {
          return { ...key, owner: 'Me' };
        }
        try {
          console.log('Calling /api/getWallets for owner:', key.owner);
          const res = await fetch('/api/getWallets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: key.owner }),
          });
          const data = await res.json();
          console.log('Response body:', data);
          const emailAccount = data.linked_accounts?.find(
            (acc: { type: string; address: string }) => acc.type === 'email'
          );
          if (emailAccount) {
            return { ...key, owner: emailAccount.address };
          }
        } catch (err) {
          console.log('Error calling /api/getWallets:', err);
        }
        return key;
      })
    );
    return updatedKeyList;
  };