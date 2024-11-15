const service = new AttestationService(
    process.env.NEXT_PUBLIC_MEDICAL_ATTESTATION_CONTRACT!,
    walletClient.provider
  );