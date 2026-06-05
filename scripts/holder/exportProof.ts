import * as fs from "fs";
import * as path from "path";
import {
  DisclosedCourse,
  ProofPackage,
  SignedCredential,
} from "@credchain/shared/types";
import { generateProofFromCourses } from "./generateProof";

export function buildProofPackage(
  signedCredential: SignedCredential,
  disclosedCourses: DisclosedCourse[]
): ProofPackage {
  return {
    credentialHash: signedCredential.bundle.credentialHash,
    signerAddress: signedCredential.signerAddress,
    signature: signedCredential.signature,
    expiresAt: signedCredential.bundle.expiresAt,
    merkleRoot: signedCredential.merkleRoot,
    disclosedCourses,
  };
}

export function exportProof(
  proofPackage: ProofPackage,
  outputPath: string
): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(proofPackage, null, 2));
}

if (require.main === module) {
  const inputPath = process.argv[2];
  const coursesArg = process.argv[3];
  const outputPath = process.argv[4];

  if (!inputPath || !coursesArg || !outputPath) {
    console.error(
      "Usage: ts-node holder/exportProof.ts <signedCredential.json> <course1,course2,...> <output/proof.json>"
    );
    process.exit(1);
  }

  const signedCredential: SignedCredential = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
  );
  const selectedNames = coursesArg.split(",").map((s) => s.trim()).filter(Boolean);
  const disclosedCourses = generateProofFromCourses(
    signedCredential.bundle.courses,
    selectedNames
  );
  const proofPackage = buildProofPackage(signedCredential, disclosedCourses);
  exportProof(proofPackage, outputPath);

  console.log(`Proof exported to ${outputPath}`);
  console.log(`Disclosed ${disclosedCourses.length} course(s): ${selectedNames.join(", ")}`);
}
