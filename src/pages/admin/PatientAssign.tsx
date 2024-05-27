import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/ProtectedRoute";
import { drawerWidth } from "../ResponsiveDrawer";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DoctorData from "../../interface/DoctorData";
import SearchField from "../../components/SearchField";
import { LoadingButton } from "@mui/lab";
import { assignPatientToDoctor } from "../../utils/api";

const PatientAssign = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, signOut } = useAuth();
  const { state } = useLocation();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | undefined>(
    undefined
  );
  const [onAssignLoading, setOnAssignLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      signOut();
      navigate("/login");
    }
    if (role !== "1.0") {
      navigate("/");
    }
  }, [isAuthenticated, role]);

  const handleAssignmentToDoctor = () => {
    if (selectedDoctor) {
      setOnAssignLoading(true);
      assignPatientToDoctor(selectedDoctor!.id.toString(), state.id.toString())
        .then((res) => {
          console.log("assign res:", res);
        })
        .finally(() => {
          setOnAssignLoading(false);
        });
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 5,
            width: `calc(100% - ${drawerWidth}px)`,
            padding: "2%",
            // paddingLeft: "4.5%",
            // paddingTop: "72px",
            // paddingBottom: "0px",
          }}
        >
          <h1>Assign a doctor to patient {state.fullName}</h1>
          <SearchField
            selectedDoctor={selectedDoctor}
            setSelectedDoctor={setSelectedDoctor}
          />
          {selectedDoctor ? (
            <Typography variant="body1">
              You are about to assign patient <strong>{state.fullName}</strong>{" "}
              with id {state.id} to doctor{" "}
              <strong>{selectedDoctor.fullName}</strong> with id{" "}
              {selectedDoctor.id}
            </Typography>
          ) : (
            <Typography variant="body1" color="error">
              Please select a doctor to assign to this patient
            </Typography>
          )}
          <LoadingButton
            disabled={!selectedDoctor}
            variant="outlined"
            onClick={handleAssignmentToDoctor}
            sx={{
              width: "50%",
            }}
          >
            <span>Assign</span>
          </LoadingButton>
        </Box>
      ) : null}
    </>
  );
};

export default PatientAssign;
