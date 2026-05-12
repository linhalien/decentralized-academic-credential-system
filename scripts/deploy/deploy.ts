/*
FILE: deploy/deploy.ts
  1. Deploy MerkleVerifier.sol
  2. Deploy CredentialRegistry.sol (passing MerkleVerifier address)
  3. Write deployed addresses to shared/constants.ts
  4. Verify on Etherscan (Sepolia) if --network sepolia flag
  */