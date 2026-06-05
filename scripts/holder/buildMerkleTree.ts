import { randomBytes } from "crypto";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { Course } from "@credchain/shared/types";
import { ethers } from "ethers";

export interface MerkleTreeResult {
  tree: StandardMerkleTree<[string, string, string]>;
  root: string;
  courses: Course[];
}

export function buildMerkleTree(
  courses: { name: string; grade: string; salt?: string }[]
): MerkleTreeResult {
  if (courses.length === 0) {
    throw new Error("At least one course is required to build a Merkle tree");
  }

  const coursesWithSalts: Course[] = courses.map((course) => {
  const isPlaceholder = !course.salt || course.salt === "0x0000000000000000000000000000000000000000000000000000000000000000";
  
  return {
    name: course.name,
    grade: course.grade,
    salt: isPlaceholder ? ethers.hexlify(randomBytes(32)) : (course.salt as string),
  };
});

  const rows: [string, string, string][] = coursesWithSalts.map((c) => [
    c.name,
    c.grade,
    c.salt,
  ]);

  const tree = StandardMerkleTree.of(rows, ["string", "string", "bytes32"]);
  const root = tree.root;

  return { tree, root, courses: coursesWithSalts };
}

if (require.main === module) {
  const fs = require("fs");
  const path = require("path");

  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: ts-node holder/buildMerkleTree.ts <credential.json>");
    process.exit(1);
  }

  const credential = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const courses = credential.bundle?.courses ?? credential.courses;
  if (!Array.isArray(courses)) {
    console.error("Credential must contain a courses array");
    process.exit(1);
  }

  const { root, courses: saltedCourses } = buildMerkleTree(courses);

  if (credential.bundle) {
    credential.bundle.courses = saltedCourses;
  } else {
    credential.courses = saltedCourses;
  }
  credential.merkleRoot = root;

  const outPath = process.argv[3] ?? inputPath;
  fs.writeFileSync(outPath, JSON.stringify(credential, null, 2));
  console.log(`Merkle root: ${root}`);
  console.log(`Updated credential written to ${outPath}`);
}
