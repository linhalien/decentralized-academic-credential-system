/*
FILE: holder/generateProof.ts
  Input  : tree (StandardMerkleTree), selectedCourseNames[]
  Output : ProofPackage { leafValues[], proof[][], root }
  Logic  :
    1. Find leaf indices for selected courses
    2. For each selected leaf: tree.getProof(leafIndex) → sibling hashes
    3. Bundle: revealed (courseName, grade, salt) + proof path per leaf
    4. Verifier can re-hash each leaf and verify path independently
  Note   : Unrevealed leaves remain private — only their hashes exist in tree
  */