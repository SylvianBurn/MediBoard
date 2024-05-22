import UserModal from "./PatientModal";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PatientData from "../interface/PatientData";
import { useAuth } from "../utils/ProtectedRoute";

type EditPatientModalProps = {
  existingPatient: PatientData;
  isOpen: boolean;
  onClose: () => void;
  fetchPatients: () => void;
};

export default function EditPatientModal({
  existingPatient,
  isOpen,
  onClose,
  fetchPatients,
}: EditPatientModalProps) {
  const [patient, setPatient] = useState<PatientData>(existingPatient);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    setPatient(existingPatient);
  }, [existingPatient]);

  // const buildDataObject = () => {
  //   var data: EditUserInterface = {};

  //   if (user.name != existingPatient.name) {
  //     data.name = user.name;
  //   }
  //   if (user.password != existingPatient.password) {
  //     data.password = user.password;
  //   }
  //   if (user.tag != existingPatient.tag) {
  //     data.tag = user.tag;
  //   }
  //   if (user.credits != existingPatient.credits) {
  //     data.credits = user.credits;
  //   }
  //   return data;
  // };

  function onEditSave() {
    console.log("edit patient");
    // setLoading(true);
    // const data: EditUserInterface = buildDataObject();
    // editUserDetails(user.id, data, signOut, navigate).finally(() => {
    //   setLoading(false);
    //   fetchPatients();
    //   onClose();
    // });
  }

  function onEditCancel() {
    onClose();
  }

  return existingPatient.email == patient.email ? (
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
        title={"Edit Patient"}
        onSave={onEditSave}
        onCancel={onEditCancel}
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
        isEdit={true}
      />
    </Modal>
  ) : null;
}
