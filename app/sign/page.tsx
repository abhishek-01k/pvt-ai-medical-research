"use client";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import React from "react";
import { useAccount } from "wagmi";

const SignPage = () => {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
  });

  const { address } = useAccount();
  const schemaId = "0x456";

  const handleGetSchema = async () => {
    try {
      const res = await client.getSchema(schemaId);
      console.log("Res", res);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleCreateAttestation = async () => {
    const timestamp = new Date().getTime();
    const data = {
      patientId:
        "0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1",
      visitTimestamp: 1731456000, // Future timestamp (Nov 12, 2024, 00:00:00 UTC)
      symptoms: 3, // Represents an encoded or categorical value for symptoms
      diagnosis: "Common Cold",
      medicationPrescribed: "Paracetamol 500mg",
      medicationResponse: 1, // Represents a response code, e.g., 1 = Good
      sideEffects: 0, // Represents no side effects
      treatmentDuration: 7, // 7 days
      followUpRequired: true,
    };

    const attestationId = await client.createAttestation({
      schemaId,
      data,
      attester: "0x9452BCAf507CD6547574b78B810a723d8868C85a",
      indexingValue: `xxx`,
    });
    console.log("attestationId", attestationId);
  };

  const handleGetAttestation = async () => {
    const res = await client.getAttestation("0xb67");
    console.log("Res", res);
  };

  return (
    <div className="flex gap-4">
      <button className="border p-2 " onClick={handleCreateAttestation}>
        Create attestation
      </button>
      <button className="border p-2 " onClick={handleGetSchema}>
        Get Schema
      </button>
      <button className="border p-2 " onClick={handleGetAttestation}>
        Get Attestation
      </button>
    </div>
  );
};

export default SignPage;
