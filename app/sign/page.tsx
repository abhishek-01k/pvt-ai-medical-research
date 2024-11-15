"use client";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import React from "react";

const SignPage = () => {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
  });

  const schemaId = "0x405";

  const handleGetSchema = async () => {
    try {
      const res = await client.getSchema(schemaId);
      console.log("Res", res);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleCreateAttestation = async () => {
    const data = {
      threshold: 1,
    };

    const attestationId = await client.createAttestation({
      schemaId,
      data,
      indexingValue: "xxx",
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
