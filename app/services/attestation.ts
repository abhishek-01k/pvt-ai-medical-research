import { ethers } from "ethers";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { MedicalAttestationContract } from "../types/contracts";

export class AttestationService {
  private contract: MedicalAttestationContract;
  private signProtocol: SignProtocolClient;
  private schemaId = "0x42f";

  //TODO: @abhishek fix this
  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(
      contractAddress,
      MedicalAttestationABI,
      provider,
    ) as MedicalAttestationContract;

    this.signProtocol = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
    });
  }

  async createMedicalAttestation(
    patientData: {
      patientId: string;
      visitTimestamp: number;
      diagnosis: string;
      symptoms: number;
      medicationResponse: number;
      medicationPrescribed: string;
      sideEffects: number;
      treatmentDuration: number;
      followUpRequired: boolean;
    },
    address: `0x${string}`,
  ) {
    // Create attestation through SIGN Protocol
    const attestation = await this.signProtocol.createAttestation({
      schemaId: this.schemaId,
      data: patientData,
      attester: address,
      indexingValue: `${address}-${patientData.visitTimestamp}`,
    });

    return attestation;
  }

  async verifyAttestation(attestationId: string) {
    const attestation = await this.signProtocol.getAttestation(attestationId);
    if (attestation) {
      const record = await this.contract.records(attestation.schemaId);
      return {
        ...attestation,
        medicalRecord: record,
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
      visitTimestamp: number;
    },
    doctorAddress: `0x${string}`,
  ) {
    const attestation = await this.signProtocol.createAttestation({
      schemaId: this.schemaId,
      data: visitData,
      attester: doctorAddress,
      indexingValue: `${doctorAddress}-${visitData.visitTimestamp}`,
    });

    return attestation;
  }
}
