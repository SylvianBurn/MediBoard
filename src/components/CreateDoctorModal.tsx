import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/ProtectedRoute";
import DoctorData from "../interface/DoctorData";
import { createDoctor } from "../utils/api";
import DoctorModal from "./DoctorModal";

type CreateDoctorModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateDoctorModal({
  isOpen,
  onClose,
}: CreateDoctorModalProps) {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorData>({
    id: 0,
    fullName: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  // sets user data to default value on start
  // useEffect(() => {
  //   setDoctor({
  //     id: 0,
  //     fullName: "",
  //     email: "",
  //     birthDate: "",
  //   });
  // }, []);

  const onCreateSave = () => {
    setLoading(true);
    console.log("doctor to create:", doctor);
    createDoctor(doctor.fullName, doctor.email, doctor.role)
      .then(() => {
        onClose();
        setDoctor({ id: 0, fullName: "", email: "", role: "" });
      })
      .catch((error) => {
        if (error.response.statusText === "Unauthorized") {
          signOut();
          navigate("/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateCancel = () => {
    setDoctor({
      id: 0,
      fullName: "",
      email: "",
      role: "",
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
      <DoctorModal
        title={"Add a Doctor"}
        onSave={onCreateSave}
        onCancel={onCreateCancel}
        fullName={doctor.fullName}
        email={doctor.email}
        role={doctor.role}
        loading={loading}
        onFullNameChange={(value: string) =>
          setDoctor((prevDoctor) => ({ ...prevDoctor, fullName: value }))
        }
        onEmailChange={(value: string) =>
          setDoctor((prevDoctor) => ({ ...prevDoctor, email: value }))
        }
        onRoleChange={(value: string) =>
          setDoctor((prevDoctor) => ({ ...prevDoctor, role: value }))
        }
      />
    </Modal>
  );
}
