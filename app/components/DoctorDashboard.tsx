"use client";
import { FC, useState } from 'react';
import { AttestationService } from '../services/attestation';
import { SYMPTOMS_BITMAP, SIDE_EFFECTS_BITMAP, MEDICATION_RESPONSE } from '../types/medical';
import { useWalletClient } from 'wagmi';
import { wagmiConfig } from '../../config/wagmi-config';
import { getEthersProvider } from '../../config/wagmi-config';

export const DoctorDashboard: FC = () => {
  const { data: walletClient } = useWalletClient();
  const [visitData, setVisitData] = useState({
    patientId: '',
    symptoms: 0,
    diagnosis: '',
    medicationPrescribed: '',
    medicationResponse: 0,
    sideEffects: 0,
    treatmentDuration: 0,
    followUpRequired: false
  });

  const handleCreateVisitRecord = async () => {
    if (!walletClient) return;
    
    const provider = getEthersProvider(wagmiConfig);
    
    const service = new AttestationService(
      process.env.NEXT_PUBLIC_MEDICAL_ATTESTATION_CONTRACT!,
      provider!
    );

    try {
      const attestation = await service.createMedicalVisitAttestation(
        visitData,
        walletClient.account.address,
        visitData.patientId
      );
      
      console.log('Visit record created:', attestation);
      // Reset form
      setVisitData({
        patientId: '',
        symptoms: 0,
        diagnosis: '',
        medicationPrescribed: '',
        medicationResponse: 0,
        sideEffects: 0,
        treatmentDuration: 0,
        followUpRequired: false
      });
    } catch (error) {
      console.error('Failed to create visit record:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create Medical Visit Record</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            className="w-full p-2 border rounded"
            value={visitData.patientId}
            onChange={(e) => setVisitData({...visitData, patientId: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms
          </label>
          <select
            multiple
            className="w-full p-2 border rounded"
            value={[visitData.symptoms.toString()]}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
              const bitmap = selected.reduce((acc, curr) => acc | curr, 0);
              setVisitData({...visitData, symptoms: bitmap});
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnosis
          </label>
          <textarea
            className="w-full p-2 border rounded"
            value={visitData.diagnosis}
            onChange={(e) => setVisitData({...visitData, diagnosis: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prescribed Medication
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={visitData.medicationPrescribed}
            onChange={(e) => setVisitData({...visitData, medicationPrescribed: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Treatment Duration (days)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={visitData.treatmentDuration}
            onChange={(e) => setVisitData({...visitData, treatmentDuration: Number(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Follow-up Required
          </label>
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={visitData.followUpRequired}
            onChange={(e) => setVisitData({...visitData, followUpRequired: e.target.checked})}
          />
        </div>
      </div>

      <button 
        className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={handleCreateVisitRecord}
        disabled={!walletClient}
      >
        {!walletClient ? "Connect Wallet" : "Create Visit Record"}
      </button>
    </div>
  );
};