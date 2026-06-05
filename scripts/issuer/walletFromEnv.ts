import { ethers } from "ethers";

export function walletFromEnv(provider: ethers.Provider): ethers.Wallet {
  const privateKey = process.env.UNIVERSITY_PRIVATE_KEY?.trim();
  if (!privateKey) {
    throw new Error("UNIVERSITY_PRIVATE_KEY is not set in scripts/.env");
  }

  const hex = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(
      "UNIVERSITY_PRIVATE_KEY must be 64 hex characters (32 bytes). " +
        "You may have pasted a wallet address instead of the full private key."
    );
  }

  return new ethers.Wallet(privateKey, provider);
}
