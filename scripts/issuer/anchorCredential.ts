/*
FILE: issuer/anchorCredential.ts
  Input  : SignedCredential, MerkleRoot (bytes32), contract address
  Output : transaction receipt
  Logic  :
    1. Connect to CredentialRegistry contract via ethers.js
    2. Call registry.anchor(credentialHash, merkleRoot)
    3. Log tx hash and block number
    4. Save anchored credential to /data/issued/{studentId}.json
*/