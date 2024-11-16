import { ethers } from "ethers";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { MedicalAttestationContract } from "../types/contracts";
import { MedicalAttestationABI } from "../../config/ABI";

export class AttestationService {
  private contract: MedicalAttestationContract;
  private signProtocol: SignProtocolClient;
  private schemaId = "0x456";

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      contractAddress,
      MedicalAttestationABI,
      signer,
    ) as unknown as MedicalAttestationContract;

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

  async getSchema() {
    const schema = await this.signProtocol.getSchema(this.schemaId);
    console.log("Schema", schema);
    return schema;
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
    console.log("Contract", this.contract);

    const attestation = await this.signProtocol.createAttestation({
      schemaId: this.schemaId,
      data: visitData,
      indexingValue: `${doctorAddress}-${visitData.visitTimestamp}`,
    });

    console.log("Attestaion >>>", attestation);

    return attestation;
  }

  async getPatientAttestations(address: string) {
    if (address) {
      const res = await this.contract.getPatientVisits(address);
      console.log("Res", res);
      return res;
    } else {
      return null;
    }
  }
}
