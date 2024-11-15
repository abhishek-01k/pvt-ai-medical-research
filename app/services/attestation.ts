import { ethers } from 'ethers';
import { EvmChains, SignProtocolClient, SpMode } from '@ethsign/sp-sdk';
import { MedicalAttestationContract } from '../types/contracts';
import { MEDICAL_VISIT_SCHEMA } from '../types/attestationSchema';

export class AttestationService {
  private contract: MedicalAttestationContract;
  private signProtocol: SignProtocolClient;

  //TODO: @abhishek fix this
  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(
      contractAddress,
      MedicalAttestationABI,
      provider
    ) as MedicalAttestationContract;
    
    this.signProtocol = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
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

  async createMedicalVisitAttestation(
    visitData: {
      patientId: string;
      symptoms: number;
      diagnosis: string;
      medicationPrescribed: string;
      medicationResponse: number;
      sideEffects: number;
      treatmentDuration: number;
      followUpRequired: boolean;
    },
    doctorAddress: string,
    patientAddress: string
  ) {
    const attestation = await this.signProtocol.createAttestation({
      schema: MEDICAL_VISIT_SCHEMA.name,
      attestor: doctorAddress,
      data: visitData,
      hooks: [this.contract.address],
      extraData: ethers.utils.defaultAbiCoder.encode(['address'], [patientAddress])
    });

    return attestation;
  }
}