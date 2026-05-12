/*
UniversityPage.tsx  (Issue flow)
  UI elements:
    - Form: student name, student ID, graduation year
    - Dynamic course list: add/remove (course name, grade) pairs
    - "Issue Credential" button
  On submit:
    1. Call buildCredential() from lib/credential.ts
    2. Call buildMerkleTree() from lib/merkle.ts → get root
    3. Sign bundle with connected wallet (university role)
    4. Call registry.anchor() via wagmi writeContract hook
    5. Display: credentialHash, merkleRoot, download JSON button
    */