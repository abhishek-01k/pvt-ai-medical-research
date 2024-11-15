// @kamal I have added the bitmap schema for the symptoms and side effects.
// this is to make it easier to parse the data from the UI.
export const SYMPTOMS_BITMAP = {
    FEVER: 1,        // 0001
    HEADACHE: 2,     // 0010
    FATIGUE: 4,      // 0100
    NAUSEA: 8,       // 1000
    COUGH: 16,       // 10000
    DIZZINESS: 32,   // 100000
  } as const;
  
  export const SIDE_EFFECTS_BITMAP = {
    DROWSINESS: 1,    // 0001
    DIZZINESS: 2,     // 0010
    NAUSEA: 4,        // 0100
    RASH: 8,          // 1000
    HEADACHE: 16,     // 10000
    INSOMNIA: 32,     // 100000
  } as const;
  
  export const MEDICATION_RESPONSE = {
    NO_EFFECT: 0,
    SLIGHT_IMPROVEMENT: 1,
    MODERATE_IMPROVEMENT: 2,
    GOOD_IMPROVEMENT: 3,
    SIGNIFICANT_IMPROVEMENT: 4,
    COMPLETE_RECOVERY: 5,
  } as const;
  
  // Helper function to convert bitmap object to readable text
  export const bitmapToText = (value: number, schema: Record<string, number>): string => {
    const symptoms: string[] = [];
    Object.entries(schema).forEach(([name, bit]) => {
      if ((value & bit) === bit) {
        symptoms.push(name.toLowerCase().replace('_', ' '));
      }
    });
    return symptoms.join(', ');
  };