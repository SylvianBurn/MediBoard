export default interface MedicalRecord {
  id: number;
  patientId: string;
  age: string;
  chestPain: string;
  restingBp: string;
  serumCholestrol: string;
  fastingBloodSugar: string;
  restingElectroRecords: string;
  maxHeartRate: string;
  exerciseAngia: string;
  oldPeak: string;
  slope: string;
  noMajorVessels: string;
  medicalCheckDate: string;
  createdAt: Date;
  updatedAt: Date;
}
