export default interface DoctorData {
  id: number;
  fullName: string;
  email: string;
  role: string | "admin" | "doctor" | "staff";
}
