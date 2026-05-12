---- FILE: CredentialRegistry.sol ----

Purpose  : Central on-chain registry. Three mappings, three roles.
Inherits : OpenZeppelin Ownable, AccessControl

State variables:
  mapping(address => bool)   public issuers
    └─ tracks authorized university wallet addresses

  mapping(bytes32 => bytes32) public merkleRoots
    └─ credentialHash => merkleRoot
    └─ set when a credential is anchored by an issuer

  mapping(bytes32 => Revocation) public revocations
    └─ credentialHash => Revocation { bool revoked, uint256 revokedAt }
    └─ timestamped revocation (advance over P6 boolean-only flag)

Structs:
  struct Revocation {
    bool      revoked
    uint256   revokedAt    ← block.timestamp at time of revocation
  }

Events:
  IssuerAdded(address indexed issuer)
  IssuerRemoved(address indexed issuer)
  CredentialAnchored(bytes32 indexed credentialHash, bytes32 merkleRoot, address indexed issuer)
  CredentialRevoked(bytes32 indexed credentialHash, uint256 revokedAt)

Modifiers:
  onlyOwner()    ← inherited from Ownable
  onlyIssuer()   ← checks issuers[msg.sender] == true

Functions:
  addIssuer(address uni)         onlyOwner   → issuers[uni] = true
  removeIssuer(address uni)      onlyOwner   → issuers[uni] = false
  
  anchor(
    bytes32 credentialHash,
    bytes32 merkleRoot
  )                              onlyIssuer  → stores root, emits event

  revoke(bytes32 credentialHash) onlyOwner   → stores revocation with timestamp

  isValidAt(
    bytes32 credentialHash,
    uint256 timestamp
  ) view → bool
    └─ returns true if credential was NOT revoked before the given timestamp
    └─ enables checking "was this degree valid when I hired them in 2023?"

  verify(
    bytes32 credentialHash,
    bytes32[] calldata proof,
    bytes32 leaf
  ) external view → bool
    └─ checks: not revoked + not expired + root exists + MerkleProof.verify()
    └─ calls MerkleVerifier.verify() internally

