/*
---- FILE: types.ts ----

interface Course {
  name  : string
  grade : string        ← "A", "B+", "C", etc.
  salt  : string        ← hex bytes32 (random, per course)
}

interface CredentialBundle {
  studentName   : string
  studentId     : string
  university    : string
  graduationDate: string    ← ISO date string
  expiresAt     : number    ← unix timestamp (graduation + 50 years)
  courses       : Course[]
  credentialHash: string    ← keccak256 of this bundle (without hash field)
}

interface SignedCredential {
  bundle       : CredentialBundle
  signature    : string    ← ethers.js compact signature hex
  signerAddress: string    ← university wallet address
  merkleRoot   : string    ← bytes32 hex
}

interface ProofPackage {
  credentialHash  : string
  signerAddress   : string
  signature       : string
  expiresAt       : number
  merkleRoot      : string
  disclosedCourses: DisclosedCourse[]
}

interface DisclosedCourse {
  name  : string
  grade : string
  salt  : string
  proof : string[]    ← sibling hashes from root to leaf
}

interface VerificationResult {
  valid           : boolean
  signatureValid  : boolean
  issuerAuthorized: boolean
  notRevoked      : boolean
  notExpired      : boolean
  merkleProofsValid: boolean
  reason          : string    ← human-readable failure reason if any
  issuerAddress   : string
  expiresAt       : number
}
  */