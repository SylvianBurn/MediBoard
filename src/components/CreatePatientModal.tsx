import UserModal from "./PatientModal";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../utils/api";
import PatientData from "../interface/PatientData";
import { useAuth } from "../utils/ProtectedRoute";

type CreatePatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePatientModal({
  isOpen,
  onClose,
}: CreatePatientModalProps) {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientData>({
    id: 0,
    fullName: "",
    email: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  // sets user data to default value on start
  // useEffect(() => {
  //   setPatient({
  //     id: 0,
  //     fullName: "",
  //     email: "",
  //     birthDate: "",
  //   });
  // }, []);

  const onCreateSave = () => {
    setLoading(true);
    console.log('patient to create:', patient);
    createPatient(patient.fullName, patient.email, patient.birthDate)
      .then(() => {
        onClose();
        setPatient({ id: 0, fullName: "", email: "", birthDate: "" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateCancel = () => {
    setPatient({
      id: 0,
      fullName: "",
      email: "",
      birthDate: "",
    });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UserModal
        title={"Add Patient"}
        onSave={onCreateSave}
        onCancel={onCreateCancel}
        fullName={patient.fullName}
        email={patient.email}
        birthDate={patient.birthDate}
        loading={loading}
        onFullNameChange={(value: string) =>
          setPatient((prevPatient) => ({ ...prevPatient, fullName: value }))
        }
        onEmailChange={(value: string) =>
          setPatient((prevPatient) => ({ ...prevPatient, email: value }))
        }
        onBirthDateChange={(value: string) =>
          setPatient((prevPatient) => ({ ...prevPatient, birthDate: value }))
        }
      />
    </Modal>
  );
}
