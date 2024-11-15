export const MEDICAL_VISIT_SCHEMA = {
    name: "medical_visit_record",
    description: "Medical visit record with symptoms and treatment",
    fields: [
      { name: "patientId", type: "bytes32" },
      { name: "visitTimestamp", type: "uint256" },
      { name: "symptoms", type: "uint256" }, // Using our bitmap
      { name: "diagnosis", type: "string" },
      { name: "medicationPrescribed", type: "string" },
      { name: "medicationResponse", type: "uint8" },
      { name: "sideEffects", type: "uint256" }, // Using our bitmap
      { name: "treatmentDuration", type: "uint256" },
      { name: "followUpRequired", type: "bool" }
    ]
  };