"use client";

import { type FC, useState } from "react";
import {
  NadaValue,
  NadaValues,
  NamedValue,
  PartyName,
  ProgramBindings,
  ProgramId,
} from "@nillion/client-core";
import { useNilCompute, useNillion } from "@nillion/client-react-hooks";
import { 
  SYMPTOMS_BITMAP, 
  SIDE_EFFECTS_BITMAP, 
  MEDICATION_RESPONSE, 
  bitmapToText 
} from '../types/medical';
import { AttestationVerifier } from '../components/AttestationVerifier';

export const MedicalResearch: FC = () => {
  const { client } = useNillion();
  const nilCompute = useNilCompute();
  const [programId, setProgramId] = useState<ProgramId | string>("");
  
  // Patient inputs
  const [age, setAge] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [medicationResponse, setMedicationResponse] = useState<string>("");
  const [sideEffects, setSideEffects] = useState<string>("");
  const [treatmentDuration, setTreatmentDuration] = useState<string>("");

  // Researcher inputs
  const [targetSymptoms, setTargetSymptoms] = useState<string>("");
  const [minDuration, setMinDuration] = useState<string>("");
  const [ageGroupMin, setAgeGroupMin] = useState<string>("");
  const [ageGroupMax, setAgeGroupMax] = useState<string>("");

  const [verifiedAttestations, setVerifiedAttestations] = useState<any[]>([]);

  const handleCompute = async () => {
    if (verifiedAttestations.length === 0) {
      alert("Please verify medical records first");
      return;
    }

    if (!programId) throw new Error("compute: program id required");

    const bindings = ProgramBindings.create(programId)
      .addInputParty(PartyName.parse("Party1"), client.partyId)
      .addInputParty(PartyName.parse("Party2"), client.partyId)
      .addOutputParty(PartyName.parse("Party1"), client.partyId)
      .addOutputParty(PartyName.parse("Party2"), client.partyId)
      .addOutputParty(PartyName.parse("Party3"), client.partyId);

    const values = NadaValues.create()
      // Patient inputs
      .insert(NamedValue.parse("age"), NadaValue.createSecretInteger(Number(age) || 0))
      .insert(NamedValue.parse("symptoms_bitmap"), NadaValue.createSecretInteger(Number(symptoms) || 0))
      .insert(NamedValue.parse("medication_response"), NadaValue.createSecretInteger(Number(medicationResponse) || 0))
      .insert(NamedValue.parse("side_effects_bitmap"), NadaValue.createSecretInteger(Number(sideEffects) || 0))
      .insert(NamedValue.parse("treatment_duration"), NadaValue.createSecretInteger(Number(treatmentDuration) || 0))
      // Researcher inputs
      .insert(NamedValue.parse("target_symptoms"), NadaValue.createSecretInteger(Number(targetSymptoms) || 0))
      .insert(NamedValue.parse("min_duration"), NadaValue.createSecretInteger(Number(minDuration) || 0))
      .insert(NamedValue.parse("age_group_min"), NadaValue.createSecretInteger(Number(ageGroupMin) || 0))
      .insert(NamedValue.parse("age_group_max"), NadaValue.createSecretInteger(Number(ageGroupMax) || 0));

    nilCompute.execute({ bindings, values });
  };

  const BitmapHelper: FC<{ bitmap: Record<string, number> }> = ({ bitmap }) => {
    return (
      <div className="text-xs text-gray-600 mb-2">
        {Object.entries(bitmap).map(([key, value]) => (
          <div key={key}>
            {key.toLowerCase().replace('_', ' ')} ({value})
          </div>
        ))}
        <div className="mt-1 italic">Add values together for multiple selections</div>
      </div>
    );
  };

  return (
    <div className="border border-gray-400 rounded-lg p-4 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Medical Research Program</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Patient Inputs</h3>
          <input
            type="number"
            placeholder="Age"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <div>
            <input
              type="number"
              placeholder="Symptoms Bitmap"
              className="w-full p-2 mb-1 border border-gray-300 rounded text-black"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <BitmapHelper bitmap={SYMPTOMS_BITMAP} />
            {symptoms && (
              <div className="text-sm text-gray-600 mb-2">
                Selected: {bitmapToText(Number(symptoms), SYMPTOMS_BITMAP)}
              </div>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Medication Response (0-5)"
              className="w-full p-2 mb-1 border border-gray-300 rounded text-black"
              value={medicationResponse}
              onChange={(e) => setMedicationResponse(e.target.value)}
            />
            <div className="text-xs text-gray-600 mb-2">
              {Object.entries(MEDICATION_RESPONSE).map(([key, value]) => (
                <div key={key}>
                  {value}: {key.toLowerCase().replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>
          <div>
            <input
              type="number"
              placeholder="Side Effects Bitmap"
              className="w-full p-2 mb-1 border border-gray-300 rounded text-black"
              value={sideEffects}
              onChange={(e) => setSideEffects(e.target.value)}
            />
            <BitmapHelper bitmap={SIDE_EFFECTS_BITMAP} />
            {sideEffects && (
              <div className="text-sm text-gray-600 mb-2">
                Selected: {bitmapToText(Number(sideEffects), SIDE_EFFECTS_BITMAP)}
              </div>
            )}
          </div>
          <input
            type="number"
            placeholder="Treatment Duration"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={treatmentDuration}
            onChange={(e) => setTreatmentDuration(e.target.value)}
          />
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Researcher Inputs</h3>
          <input
            type="number"
            placeholder="Target Symptoms"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={targetSymptoms}
            onChange={(e) => setTargetSymptoms(e.target.value)}
          />
          <input
            type="number"
            placeholder="Minimum Duration"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={minDuration}
            onChange={(e) => setMinDuration(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age Group Minimum"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={ageGroupMin}
            onChange={(e) => setAgeGroupMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age Group Maximum"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={ageGroupMax}
            onChange={(e) => setAgeGroupMax(e.target.value)}
          />
        </div>
      </div>

      <input
        className="w-full p-2 my-4 border border-gray-300 rounded text-black"
        placeholder="Program id"
        value={programId}
        onChange={(e) => setProgramId(e.target.value)}
      />

      <button
        className={`w-full px-4 py-2 border rounded text-black ${
          nilCompute.isLoading ? "opacity-50 cursor-not-allowed bg-gray-200" : "bg-white hover:bg-gray-100"
        }`}
        onClick={handleCompute}
        disabled={nilCompute.isLoading}
      >
        {nilCompute.isLoading ? (
          <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        ) : (
          "Compute Results"
        )}
      </button>

      <div className="mt-4">
        <h3 className="font-bold mb-2">Status</h3>
        <p>Computation Status: {nilCompute.status}</p>
        {nilCompute.isSuccess && (
          <p>Computation ID: {nilCompute.data}</p>
        )}
      </div>

      <AttestationVerifier onVerifiedData={(data) => {
        setVerifiedAttestations([...verifiedAttestations, data]);
        // Auto-fill form fields from attestation
        setSymptoms(data.symptoms);
        setMedicationResponse(data.medicationResponse);
        // etc...
      }} />
    </div>
  );
};