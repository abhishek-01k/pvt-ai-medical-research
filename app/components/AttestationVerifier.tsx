"use client";

import { type FC, useState } from "react";
import { AttestationService } from "../services/attestation";
import { useNillion } from "@nillion/client-react-hooks";
import { SYMPTOMS_BITMAP } from "../types/medical";

export const AttestationVerifier: FC<{
  onVerifiedData: (data: any) => void;
}> = ({ onVerifiedData }) => {
  const [attestationId, setAttestationId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { client } = useNillion();

  const handleVerification = async () => {
    setIsVerifying(true);
    try {
      const service = new AttestationService(
        process.env.NEXT_PUBLIC_MEDICAL_ATTESTATION_CONTRACT!,
        provider
      );

      const result = await service.verifyAttestation(attestationId);
      if (result) {
        onVerifiedData(result);
      }
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="border border-gray-400 rounded-lg p-4 w-full">
      <h3 className="text-xl font-bold mb-4">Verify Medical Attestation</h3>
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        placeholder="Attestation ID"
        value={attestationId}
        onChange={(e) => setAttestationId(e.target.value)}
      />
      <button
        className={`w-full px-4 py-2 border rounded ${
          isVerifying ? "bg-gray-200" : "bg-blue-500 text-white"
        }`}
        onClick={handleVerification}
        disabled={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify Attestation"}
      </button>
    </div>
  );
};