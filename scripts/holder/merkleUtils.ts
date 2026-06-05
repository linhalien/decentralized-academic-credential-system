import { ethers } from "ethers";

const LEAF_TYPES = ["string", "string", "bytes32"] as const;

/** Inner leaf hash: keccak256(abi.encode(courseName, grade, salt)) — matches MerkleVerifier.hashLeaf */
export function hashLeaf(courseName: string, grade: string, salt: string): string {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(LEAF_TYPES, [courseName, grade, salt])
  );
}

/** Tree leaf node hash used by StandardMerkleTree and MerkleProof.verify */
export function standardTreeLeaf(courseName: string, grade: string, salt: string): string {
  return ethers.keccak256(hashLeaf(courseName, grade, salt));
}
