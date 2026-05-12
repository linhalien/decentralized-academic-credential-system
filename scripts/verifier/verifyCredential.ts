/*
FILE: verifier/verifyCredential.ts
  Input  : proof.json file path, contract address
  Output : VerificationResult { valid, reason, issuerAddress, expiresAt }
  Logic  :
    Step 1 — Signature check (off-chain)
      recovered = ethers.verifyMessage(credentialHash, signature)
      check: recovered === signerAddress

    Step 2 — Issuer check (on-chain)
      call registry.issuers(signerAddress) → must be true

    Step 3 — Revocation check (on-chain)
      call registry.revocations(credentialHash) → must not be revoked

    Step 4 — Expiry check (off-chain)
      check: Date.now() < expiresAt (unix timestamp in bundle)

    Step 5 — Merkle proof check (on-chain)
      for each disclosedCourse:
        leaf = hashLeaf(name, grade, salt)
        call registry.verify(credentialHash, proof, leaf) → must be true

    Step 6 — Return result with all check statuses
    */