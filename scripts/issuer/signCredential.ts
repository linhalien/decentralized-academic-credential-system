/*
FILE: issuer/signCredential.ts
  Input  : CredentialBundle, university wallet (ethers.Wallet)
  Output : SignedCredential { bundle, signature: { r, s, v }, signerAddress }
  Logic  :
    1. Hash the bundle: msgHash = ethers.hashMessage(credentialHash)
    2. Sign with wallet.signMessage() → uses RFC 6979 deterministic nonce
       (addresses weak-randomness vulnerability identified in P4)
    3. Attach (r, s, v) to the bundle
  Note   : Private key loaded from .env — NEVER hardcoded
*/