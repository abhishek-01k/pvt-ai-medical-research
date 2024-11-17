"use client";
import { useState, useEffect, FC } from "react";
import { AttestationService } from "../services/attestation";
import { useAccount } from "wagmi";
import { MedicalResearch } from "./MedicalResearch";
import { bitmapToText, SYMPTOMS_BITMAP } from "../types/medical";
import { getEthersSigner, wagmiConfig } from "../../config/wagmi-config";
import { getEthersProvider } from "../../config/wagmi-config";

interface Attestation {
  id: string;
  timestamp: number;
  diagnosis: string;
  symptoms: number;
  medicationPrescribed: string;
  treatmentDuration: number;
  isVerified: boolean;
}

export const PatientDashboard: FC = () => {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();
  const provider = getEthersProvider(wagmiConfig);
  useEffect(() => {
    if (address) {
      loadPatientAttestations();
    }
  }, [address]);

  const loadPatientAttestations = async () => {
    if (!address || !provider) return;
    setIsLoading(true);

    const signer = await getEthersSigner(wagmiConfig);

    try {
      const service = new AttestationService(
        process.env.NEXT_PUBLIC_MEDICAL_ATTESTATION_CONTRACT!,
        signer,
      );

      //TODO: @abhishek getPatientAttestations
      const patientAttestations = await service.getPatientAttestations(address);
      setAttestations(patientAttestations);
    } catch (error) {
      console.error("Failed to load attestations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patient Dashboard</h2>
        {!address ? (
          <button className="px-4 py-2 bg-gray-500 text-white rounded">
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => setShowResearchForm(!showResearchForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showResearchForm
              ? "Hide Research Form"
              : "Participate in Research"}
          </button>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Medical Records</h3>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : attestations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No medical records found
          </div>
        ) : (
          <div className="space-y-4">
            {attestations.map((attestation) => (
              <div
                key={attestation.id}
                className="border rounded-lg p-4 bg-white shadow"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>
                      {new Date(
                        attestation.timestamp * 1000,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p>
                      {attestation.isVerified ? (
                        <span className="text-green-500">Verified</span>
                      ) : (
                        <span className="text-yellow-500">Pending</span>
                      )}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p>{attestation.diagnosis}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Symptoms</p>
                    <p>{bitmapToText(attestation.symptoms, SYMPTOMS_BITMAP)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Prescribed Medication
                    </p>
                    <p>{attestation.medicationPrescribed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Treatment Duration</p>
                    <p>{attestation.treatmentDuration} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showResearchForm && (
        <div className="border-t pt-6">
          <MedicalResearch />
        </div>
      )}
    </div>
  );
};
