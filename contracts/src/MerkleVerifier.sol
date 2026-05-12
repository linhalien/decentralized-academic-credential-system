---- FILE: MerkleVerifier.sol ----

Purpose : Pure Merkle proof verification logic. Stateless library contract.

Functions:
  verify(
    bytes32[] calldata proof,
    bytes32   root,
    bytes32   leaf
  ) public pure → bool
    └─ uses OpenZeppelin MerkleProof.verify() with sorted pair hashing
    └─ sorted pair: if (a < b) hash(a,b) else hash(b,a)

  hashLeaf(
    string calldata courseName,
    string calldata grade,
    bytes32        salt
  ) public pure → bytes32
    └─ returns keccak256(abi.encode(courseName, grade, salt))
    └─ salt prevents brute-force enumeration (from P5)