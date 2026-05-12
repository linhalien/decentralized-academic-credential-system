/*
FILE: holder/buildMerkleTree.ts
  Input  : courses[] = [{ name, grade }], salts[] (random bytes32 per leaf)
  Output : StandardMerkleTree object + leafData[]
  Logic  :
    1. Generate one random salt per course (crypto.randomBytes(32))
    2. Encode each leaf: keccak256(abi.encode(courseName, grade, salt))
    3. Build tree using @openzeppelin/merkle-tree StandardMerkleTree.of()
       → library handles leaf sorting + internal hash computation
    4. Return { tree, root, leafData }
  Note   : Root from this function must match what issuer anchors on-chain
  Ref    : P5 — salted leaf design for brute-force resistance
*/