import { FC, useState } from 'react';
import { AttestationService } from '../services/attestation';
import { SYMPTOMS_BITMAP, MEDICATION_RESPONSE } from '../types/medical';
import { getEthersProvider, wagmiConfig } from '../../config/wagmi-config';

export const DoctorVisit: FC = () => {
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
  
  const provider = getEthersProvider(wagmiConfig);

  const handleCreateAttestation = async () => {
    const service = new AttestationService(
      process.env.NEXT_PUBLIC_MEDICAL_ATTESTATION_CONTRACT!,
      provider!
    );

    await service.createMedicalVisitAttestation(
      visitData,
      doctorAddress, // from wallet
      patientAddress // from patient selection
    );
  };

  return (
    <div>
      {/* Visit form fields */}
      <button onClick={handleCreateAttestation}>
        Create Visit Record
      </button>
    </div>
  );
};