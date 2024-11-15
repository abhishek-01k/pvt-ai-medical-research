import { ethers } from 'ethers';
import { SignProtocol } from '@sign/sdk';
import { MedicalAttestationContract } from '../types/contracts';

export class AttestationService {
  private contract: MedicalAttestationContract;
  private signProtocol: SignProtocol;

  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(
      contractAddress,
      MedicalAttestationABI,
      provider
    ) as MedicalAttestationContract;
    
    this.signProtocol = new SignProtocol({
      // SIGN Protocol configuration
    });
  }

  async createMedicalAttestation(
    patientData: {
      patientId: string;
      diagnosis: string;
      symptoms: number;
      medicationResponse: number;
    },
    attestor: string
  ) {
    // Create attestation through SIGN Protocol
    const attestation = await this.signProtocol.createAttestation({
      schema: "medical_record_v1",
      attestor,
      data: patientData,
      hooks: [this.contract.address]
    });

    return attestation;
  }

  async verifyAttestation(attestationId: string) {
    const verification = await this.signProtocol.verifyAttestation(attestationId);
    if (verification.isValid) {
      const record = await this.contract.records(verification.schemaId);
      return {
        ...verification,
        medicalRecord: record
      };
    }
    return null;
  }
}