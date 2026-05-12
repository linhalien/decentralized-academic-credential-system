/*
FILE: issuer/buildCredential.ts
  Input  : student name, student ID, graduation date, courses[]
  Output : CredentialBundle object (see Data Structures section)
  Logic  :
    1. Validate all fields
    2. Add expiry date (graduation date + 50 years, encoded as unix timestamp)
    3. Compute credentialHash = keccak256(JSON.stringify(bundle))
    4. Return bundle (unsigned)
*/