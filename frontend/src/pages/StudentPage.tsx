/*
StudentPage.tsx  (Selective proof flow)
  UI elements:
    - Upload issued credential JSON
    - Checkbox list of courses in the credential
    - "Generate Proof" button
  On submit:
    1. Rebuild Merkle tree from uploaded credential
    2. Call generateProof() for checked courses only
    3. Build proof.json via exportProof()
    4. Download proof.json button
    */