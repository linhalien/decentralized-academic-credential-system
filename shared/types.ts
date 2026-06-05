export interface Course {
  name: string;
  grade: string;
  salt: string;
}

export interface CredentialBundle {
  studentName: string;
  studentId: string;
  university: string;
  graduationDate: string;
  expiresAt: number;
  courses: Course[];
  credentialHash: string;
}

export interface SignedCredential {
  bundle: CredentialBundle;
  signature: string;
  signerAddress: string;
  merkleRoot: string;
}

export interface DisclosedCourse {
  name: string;
  grade: string;
  salt: string;
  proof: string[];
}

export interface ProofPackage {
  credentialHash: string;
  signerAddress: string;
  signature: string;
  expiresAt: number;
  merkleRoot: string;
  disclosedCourses: DisclosedCourse[];
}

export interface VerificationResult {
  valid: boolean;
  signatureValid: boolean;
  issuerAuthorized: boolean;
  notRevoked: boolean;
  notExpired: boolean;
  merkleProofsValid: boolean;
  reason: string;
  issuerAddress: string;
  expiresAt: number;
}
