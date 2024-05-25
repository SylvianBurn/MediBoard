import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/ProtectedRoute";
import DoctorData from "../interface/DoctorData";
import DoctorModal from "./DoctorModal";

type EditDoctorModalProps = {
  existingDoctor: DoctorData;
  isOpen: boolean;
  onClose: () => void;
  fetchDoctors: () => void;
};

export default function EditDoctorModal({
  existingDoctor,
  isOpen,
  onClose,
  fetchDoctors,
}: EditDoctorModalProps) {
  const [doctor, setDoctor] = useState<DoctorData>(existingDoctor);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    setDoctor(existingDoctor);
  }, [existingDoctor]);

  // const buildDataObject = () => {
  //   var data: EditUserInterface = {};

  //   if (user.name != existingDoctor.name) {
  //     data.name = user.name;
  //   }
  //   if (user.password != existingDoctor.password) {
  //     data.password = user.password;
  //   }
  //   if (user.tag != existingDoctor.tag) {
  //     data.tag = user.tag;
  //   }
  //   if (user.credits != existingDoctor.credits) {
  //     data.credits = user.credits;
  //   }
  //   return data;
  // };

  function onEditSave() {
    console.log("edit doctor");
    // setLoading(true);
    // const data: EditUserInterface = buildDataObject();
    // editUserDetails(user.id, data, signOut, navigate)
    // .catch((error) => {
    //    if (error.response.statusText === "Unauthorized") {
    //      signOut();
    //      navigate('/login');
    //    }
    // })
    // .finally(() => {
    //   setLoading(false);
    //   fetchDoctors();
    //   onClose();
    // });
  }

  function onEditCancel() {
    onClose();
  }

  return existingDoctor.email == doctor.email ? (
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
        title={"Edit Doctor"}
        onSave={onEditSave}
        onCancel={onEditCancel}
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
        isEdit={true}
      />
    </Modal>
  ) : null;
}
