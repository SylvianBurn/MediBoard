import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/ProtectedRoute";
import { drawerWidth } from "../ResponsiveDrawer";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchField from "../../components/SearchField";
import { LoadingButton } from "@mui/lab";
import {
  assignPatientToDoctor,
  deassignPatientToDoctor,
  fetchDoctorsAssignedPatient,
  fetchPatientsAsAdmin,
} from "../../utils/api";
import PatientData from "../../interface/PatientData";
import AddLinkIcon from "@mui/icons-material/AddLink";

const DoctorAssign = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, signOut } = useAuth();
  const { state } = useLocation();
  const [selectedPatient, setSelectedPatient] = useState<
    PatientData | undefined
  >(undefined);
  const [onAssignLoading, setOnAssignLoading] = useState(false);
  const [options, setOptions] = useState<readonly any[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [assignedPatients, setAssignedPatients] = useState<PatientData[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      signOut();
      navigate("/login");
    }
    if (role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, role]);

  const handleFetchPatients = (name?: string | undefined) => {
    setOptionsLoading(true);
    fetchPatientsAsAdmin(undefined, undefined, name)
      .then((res) => {
        setOptions(res.data);
      })
      .catch((error) => {
        if (error.response.statusText === "Unauthorized") {
          signOut();
          navigate("/login");
        }
      })
      .finally(() => {
        setOptionsLoading(false);
      });
  };

  const handleFetchAssignedPatient = () => {
    if (state && state.id) {
      fetchDoctorsAssignedPatient(state.id).then((res) => {
        console.log("assignedPatients:", res);
        setAssignedPatients(res.data);
      });
    }
  };

  useEffect(() => {
    handleFetchPatients();
    handleFetchAssignedPatient();
  }, []);

  const handleAssignmentToPatient = () => {
    if (selectedPatient) {
      setOnAssignLoading(true);
      assignPatientToDoctor(state.id.toString(), selectedPatient!.id.toString())
        .then((res) => {
          console.log("assign res:", res);
          handleFetchAssignedPatient();
        })
        .catch((error) => {
          if (error.response.statusText === "Unauthorized") {
            signOut();
            navigate("/login");
          }
        })
        .finally(() => {
          setOnAssignLoading(false);
        });
    }
  };

  const handleUnassign = (patientId: number) => {
    deassignPatientToDoctor(state.id, patientId.toString()).then((res) => {
      console.log("deassignRes:", res);
      handleFetchAssignedPatient();
    });
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
          <h1>Assign a patient to doctor {state.fullName}</h1>
          {assignedPatients.length > 0 ? (
            <>
              <Typography variant="h5">Your patients:</Typography>
              <Stack direction="row" spacing={1}>
                {assignedPatients.map((pat) => {
                  return (
                    <Chip
                      label={pat.fullName}
                      variant="outlined"
                      onDelete={() => {
                        handleUnassign(pat.id);
                      }}
                    />
                  );
                })}
              </Stack>
              <div
                style={{
                  height: "1px",
                  width: "50%",
                  border: "1px solid black",
                  borderRadius: '5px',
                }}
              ></div>
            </>
          ) : null}
          <SearchField
            label="Patients"
            options={options}
            setSelected={setSelectedPatient}
            isOptionLoading={optionsLoading}
          />
          {selectedPatient ? (
            <Typography variant="body1">
              You are about to assign doctor <strong>{state.fullName}</strong>{" "}
              with id {state.id} to patient{" "}
              <strong>{selectedPatient.fullName}</strong> with id{" "}
              {selectedPatient.id}
            </Typography>
          ) : (
            <Typography variant="body1" color="error">
              Please select a to assign to this doctor
            </Typography>
          )}
          <LoadingButton
            disabled={!selectedPatient}
            variant="outlined"
            onClick={handleAssignmentToPatient}
            sx={{
              width: "50%",
            }}
            loading={onAssignLoading}
            loadingPosition="start"
            startIcon={<AddLinkIcon />}
          >
            <span>Assign</span>
          </LoadingButton>
        </Box>
      ) : null}
    </>
  );
};

export default DoctorAssign;
