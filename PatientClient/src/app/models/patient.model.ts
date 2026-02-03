export interface Patient {
    id?: number;
    patientNo?: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    suffixName?: string | null;
    birthDate: string;
    gender: 'Male' | 'Female' | 'Other';
    initialDiagnosis: string;
  }
  