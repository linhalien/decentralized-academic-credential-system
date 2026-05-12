/*
FILE: holder/exportProof.ts
  Input  : ProofPackage, SignedCredential
  Output : proof.json file (shareable with verifier)
  Schema : {
    credentialHash, signerAddress, signature,
    expiresAt, merkleRoot,
    disclosedCourses: [{ name, grade, salt, proof[] }]
  }
*/