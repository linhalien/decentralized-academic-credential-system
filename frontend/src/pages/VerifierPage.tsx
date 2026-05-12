/*
VerifierPage.tsx  (Verification flow)
  UI elements:
    - Upload proof.json
    - "Verify" button
    - Result panel: green/red status per check step
  On submit:
    1. Run all 6 verification steps
    2. Display each step result: Signature ✓, Issuer ✓, Not Revoked ✓, etc.
    3. Show disclosed courses table
    */