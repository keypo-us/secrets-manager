import { type DecryptConfig, type EncryptConfig, type DeleteConfig, type ShareConfig } from "@keypo/typescript-sdk";
import refs from "../../../public/refs.json";

const ONE_HOUR_FROM_NOW = new Date(
    Date.now() + 1000 * 60 * 60,
  ).toISOString();
  const apiUrl = refs.KeypoApiUrl;
  const permissionsValidatorAddress = refs.DefaultValidationContractAddress;
  const permissionsRegistryContractAddress = refs.RegistryContractAddress;
  const bundlerRpcUrl = process.env.NEXT_PUBLIC_BUNDLER_RPC_URL || "";

export const decryptConfig: DecryptConfig = {
    registryContractAddress: permissionsRegistryContractAddress,
    chain: refs.Chain,
    expiration: ONE_HOUR_FROM_NOW,
    apiUrl: apiUrl,
  };

  export const encryptConfig: EncryptConfig = {
    apiUrl: apiUrl || "",
    validatorAddress: permissionsValidatorAddress || "",
    registryContractAddress: permissionsRegistryContractAddress || "",
    bundlerRpcUrl: bundlerRpcUrl || "",
};

export const deleteConfig: DeleteConfig = {
    permissionsRegistryContractAddress: permissionsRegistryContractAddress,
    bundlerRpcUrl: bundlerRpcUrl,
  };

export const shareConfig: ShareConfig = {
    permissionsRegistryContractAddress: permissionsRegistryContractAddress,
    bundlerRpcUrl: bundlerRpcUrl,
  };