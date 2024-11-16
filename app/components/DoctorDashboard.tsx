"use client";
import { FC, useState } from "react";
import { AttestationService } from "../services/attestation";
import { SYMPTOMS_BITMAP } from "../types/medical";
import { useAccount } from "wagmi";
import { getEthersSigner, wagmiConfig } from "../../config/wagmi-config";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import WorldcoinVerification from "./WorldcoinVerification";

export const DoctorDashboard: FC = () => {
  const { address } = useAccount();
  const [visitData, setVisitData] = useState({
    patientId: "",
    symptoms: 0,
    diagnosis: "",
    medicationPrescribed: "",
    medicationResponse: 0,
    sideEffects: 0,
    treatmentDuration: 0,
    followUpRequired: false,
    visitTimestamp: 0,
  });

  const handleCreateVisitRecord = async () => {
    if (!address) return;

    console.log("Creating attestation", visitData)

    const signer = await getEthersSigner(wagmiConfig);

    const service = new AttestationService(
      process.env.NEXT_PUBLIC_MEDICAL_ATTESTATION_CONTRACT!,
      signer,
    );

    // Example data
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

    const schema = await service.getSchema()
    console.log("Schema >>>", schema);
    console.log("Data", data);



    try {
      const attestation = await service.createMedicalVisitAttestation(
        visitData,
        address,
      );

      console.log("Visit record created:", attestation);
      // Reset form
      setVisitData({
        patientId: "",
        symptoms: 0,
        diagnosis: "",
        medicationPrescribed: "",
        medicationResponse: 0,
        sideEffects: 0,
        treatmentDuration: 0,
        followUpRequired: false,
        visitTimestamp: 0,
      });
    } catch (error) {
      console.error("Failed to create visit record:", error);
    }
  };

  const handleVerifyDoc = async (data: any) => {
    console.log("Data", data);
    if (data) {
      handleCreateVisitRecord();
    } else {
      alert('Identity not verified, Please verify')
    }

  }

  return (
    <Card className="p-6 max-w-2xl mx-auto flex flex-col justify-center rounded-lg shadow mt-12">
      <h2 className="text-2xl font-bold mb-6">Create Medical Visit Record</h2>

      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium  mb-1">
            Patient Address
          </Label>
          <Input
            type="text"
            placeholder="0x..."
            className="w-full p-2 border rounded"
            value={visitData.patientId}
            onChange={(e) =>
              setVisitData({ ...visitData, patientId: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Symptoms
          </Label>
          {/* Container to display selected symptoms */}
          <div className="mb-2">
            {Object.entries(SYMPTOMS_BITMAP).filter(([_, value]) =>
              (visitData.symptoms & value) === value // Check if the symptom is selected
            ).map(([symptom]) => (
              <span key={symptom} className="inline-block bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-sm mr-2">
                {symptom}
              </span>
            ))}
          </div>
          <select
            multiple
            className="w-full p-2 border rounded"
            value={Array.from(Object.entries(SYMPTOMS_BITMAP).filter(([_, value]) =>
              (visitData.symptoms & value) === value // Check if the symptom is selected
            ).map(([_, value]) => value.toString()))} // Convert selected values to strings
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) => Number(option.value));
              const newSymptoms = selected.reduce((acc, curr) => acc ^ curr, visitData.symptoms); // Toggle selection
              setVisitData({ ...visitData, symptoms: newSymptoms });
            }}
          >
            {Object.entries(SYMPTOMS_BITMAP).map(([symptom, value]) => (
              <option key={value} value={value}>
                {symptom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Diagnosis
          </Label>
          <Textarea
            className="w-full p-2 border rounded"
            value={visitData.diagnosis}
            onChange={(e) =>
              setVisitData({ ...visitData, diagnosis: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="block text-sm font-medium  mb-1">
            Prescribed Medication
          </Label>
          <Input
            type="text"
            className="w-full p-2 border rounded"
            value={visitData.medicationPrescribed}
            onChange={(e) =>
              setVisitData({
                ...visitData,
                medicationPrescribed: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label className="block text-sm font-medium  mb-1">
            Treatment Duration (days)
          </Label>
          <Input
            type="number"
            className="w-full p-2 border rounded"
            value={visitData.treatmentDuration}
            onChange={(e) =>
              setVisitData({
                ...visitData,
                treatmentDuration: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="flex flex-row gap-2">
          <Checkbox
            className="rounded border-gray-300"
            checked={visitData.followUpRequired}
            onCheckedChange={(checked) => {
              setVisitData({ ...visitData, followUpRequired: checked as boolean })
            }}
          />
          <Label className="block text-sm font-medium  mb-1">
            Follow-up Required
          </Label>

        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-center">
        <Button
          className=" bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleCreateVisitRecord}
          disabled={!address}
        >
          {!address ? "Connect Wallet" : "Create Visit Record"}
        </Button>

        <WorldcoinVerification title="Verify Identity" onSuccess={handleVerifyDoc} />

      </div>
    </Card>
  );
};
