Removes the unsupported & operator
Uses nested .if_else() calls to implement logical AND
Maintains the same logical behavior where both conditions must be true
The pattern is essentially:
If first condition is true, check second condition
If second condition is true, return 1, else return 0
If first condition is false, return 0


Yes, creating a custom smart contract for medical attestations that hooks into SIGN Protocol's attestation system would provide better verification and control.


Add the AttestationVerifier component before the compute section and modify the handleCompute function to only work with verified data.

This implementation:
Uses SIGN Protocol's hook system to verify attestations
Stores verified medical records on-chain
Ensures only authorized medical professionals can create attestations
Provides a complete audit trail of medical records
Integrates with Nillion's secure computation

