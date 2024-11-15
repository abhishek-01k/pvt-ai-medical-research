export interface MedicalAttestationContract {
    beforeAttestation: (
      attestor: string,
      schemaId: string,
      data: string
    ) => Promise<boolean>;
    
    afterAttestation: (
      attestationId: string,
      schemaId: string
    ) => Promise<void>;
    
    records: (schemaId: string) => Promise<{
      patientId: string;
      timestamp: number;
      diagnosisHash: string;
      isVerified: boolean;
    }>;
  }