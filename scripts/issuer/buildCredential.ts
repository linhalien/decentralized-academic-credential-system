import * as fs from "fs";
import * as path from "path";
import { ethers } from "ethers";
import { Course, CredentialBundle } from "@credchain/shared/types";

export interface BuildCredentialInput {
  studentName: string;
  studentId: string;
  university: string;
  graduationDate: string;
  courses: { name: string; grade: string }[];
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = sortObjectKeys(obj[key]);
    }
    return sorted;
  }
  return value;
}

export function computeCredentialHash(
  bundle: Omit<CredentialBundle, "credentialHash">
): string {
  const json = JSON.stringify(sortObjectKeys(bundle));
  return ethers.keccak256(ethers.toUtf8Bytes(json));
}

function validateInput(input: BuildCredentialInput): void {
  const required = ["studentName", "studentId", "university", "graduationDate"] as const;
  for (const field of required) {
    if (!input[field]?.trim()) {
      throw new Error(`Missing or empty field: ${field}`);
    }
  }
  if (!Array.isArray(input.courses) || input.courses.length === 0) {
    throw new Error("At least one course is required");
  }
  if (Number.isNaN(Date.parse(input.graduationDate))) {
    throw new Error(`Invalid graduationDate: ${input.graduationDate}`);
  }
  for (const course of input.courses) {
    if (!course.name?.trim() || !course.grade?.trim()) {
      throw new Error("Each course must have a name and grade");
    }
  }
}

function computeExpiry(graduationDate: string): number {
  const expires = new Date(graduationDate);
  expires.setUTCFullYear(expires.getUTCFullYear() + 50);
  return Math.floor(expires.getTime() / 1000);
}

export function buildCredential(input: BuildCredentialInput): CredentialBundle {
  validateInput(input);

  const courses: Course[] = input.courses.map((c) => ({
    name: c.name.trim(),
    grade: c.grade.trim(),
    salt: ethers.ZeroHash,
  }));

  const bundleWithoutHash: Omit<CredentialBundle, "credentialHash"> = {
    studentName: input.studentName.trim(),
    studentId: input.studentId.trim(),
    university: input.university.trim(),
    graduationDate: input.graduationDate.trim(),
    expiresAt: computeExpiry(input.graduationDate),
    courses,
  };

  return {
    ...bundleWithoutHash,
    credentialHash: computeCredentialHash(bundleWithoutHash),
  };
}

if (require.main === module) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath || !outputPath) {
    console.error(
      "Usage: ts-node issuer/buildCredential.ts <student-input.json> <output.json>"
    );
    process.exit(1);
  }

  const input: BuildCredentialInput = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const bundle = buildCredential(input);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2));
  console.log(`Credential built for ${bundle.studentId}`);
  console.log(`credentialHash: ${bundle.credentialHash}`);
  console.log(`expiresAt: ${bundle.expiresAt}`);
  console.log(`Written to ${outputPath}`);
}
