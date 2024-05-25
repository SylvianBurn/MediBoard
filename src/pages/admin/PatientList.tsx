import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../utils/ProtectedRoute";
import { deletePatient, fetchPatientsAsAdmin } from "../../utils/api";
import { drawerWidth } from "../ResponsiveDrawer";
import CreatePatientModal from "../../components/CreatePatientModal";
import EditPatientModal from "../../components/EditPatientModal";
import PatientData from "../../interface/PatientData";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchedPatients, setFetchedPatients] = useState([]);
  const { isAuthenticated, role, signOut } = useAuth();

  useEffect(() => {
    document.title = "Patient List";
    if (!isAuthenticated || role !== "1.0") {
      navigate("/login");
    }
    handleFetchPatients();
  }, []);

  // used to store the DataGrid's pagination infos
  const [pagModel, setPagModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [rowCount, setRowCount] = React.useState(totalRowCount || 0);

  const handleFetchPatients = (name?: string | undefined) => {
    setPatientsLoading(true);
    //fetchPatientsAsAdmin(undefined, undefined, name)
    fetchPatientsAsAdmin(pagModel.page, pagModel.pageSize, name)
      .then((res) => {
        // setRowCount(res.meta.total);
        // setTotalRowCount(res.meta.last_page);
        setPatients(res.data);
      })
      .catch((error) => {
        if (error.response.statusText === "Unauthorized") {
          signOut();
          navigate("/login");
        }
      })
      .finally(() => {
        setPatientsLoading(false);
        transformFetchedPatients();
      });
  };

  // on pagination change, it fetches the user as asked by pagination
  // useEffect(() => {
  //   handleFetchPatients();
  // }, [pagModel]);

  const transformFetchedPatients = () => {
    var tmp: PatientData[] = [];
    const p = patients as PatientData[];
    for (var i = 0; i < patients.length; i++) {
      var newPatient: PatientData = {
        id: p[i].id,
        fullName: p[i].fullName,
        birthDate: p[i].birthDate,
        email: p[i].email,
      };
      tmp.push(newPatient);
    }
    setFetchedPatients(tmp as never[]);
  };

  // on users change it transforms the received user so they can be displayed in the DataGrid
  useEffect(() => {
    transformFetchedPatients();
  }, [patients]);

  // defines the columns of the DataGrid
  const columns = [
    {
      field: "action",
      headerName: "",
      width: 40,
      disableClickEventBubbling: true,
      renderCell: () => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MoreVertIcon />
          </div>
        );
      },
      sortable: false,
      filterable: false,
    },
    { field: "fullName", headerName: "Name", flex: 1 },
    { field: "birthDate", headerName: "Date of birth", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ];

  // stores the values to open the menu the menu or not on the correct row
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // used to open and close the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // used to open and close the patient creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // used to store the infos of the new patient to create
  const [user, setUser] = useState<PatientData>({
    id: 0,
    fullName: "",
    birthDate: "",
    email: "",
  });

  // opens the menu when clicking on the three-dots logo from the column
  const handleClick = (event: any, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  // closes the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // opens the edit modal with the selected patient info
  const handleEdit = () => {
    if (selectedRow) {
      const selRow = selectedRow as PatientData;
      setUser({
        id: selRow.id,
        fullName: selRow.fullName,
        birthDate: selRow.birthDate,
        email: selRow.email,
      });
      setIsEditModalOpen(true);
      handleClose();
    }
  };

  // handles the Delete button click from the selected user menu
  const handleDelete = () => {
    if (selectedRow) {
      setDeleteLoading(true);
      const selRow = selectedRow as PatientData;
      const patientId = selRow.id;
      deletePatient(patientId.toString())
        .then(() => {
          handleClose();
          handleFetchPatients();
        })
        .catch((error) => {
          if (error.response.statusText === "Unauthorized") {
            signOut();
            navigate("/login");
          }
        })
        .finally(() => {
          setDeleteLoading(false);
        });
    }
  };

  const handleAssignDoctorToPatient = () => {
    console.log('oui');
    if (selectedRow) {
      const selRow = selectedRow as PatientData;
      const patientId = selRow.id;
      console.log('blublu');
      navigate(`/admin/patient_assign/${patientId}`);
    }
  };

  const onEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const onCreateModalClose = () => {
    setIsCreateModalOpen(false);
    handleFetchPatients();
  };

  const handleNewUser = () => {
    setIsCreateModalOpen(true);
    return;
  };

  function CustomToolbar() {
    return (
      <>
        {isAuthenticated ? (
          <GridToolbarContainer
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Button
                startIcon={<AddIcon />}
                aria-label="Add a new patient to the system"
                onClick={() => {
                  handleNewUser();
                }}
              >
                Add a new patient
              </Button>
              <GridToolbarFilterButton />
            </div>
            <GridToolbarQuickFilter />
          </GridToolbarContainer>
        ) : null}
      </>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        paddingRight: "2%",
        paddingLeft: "4.5%",
        paddingTop: "72px",
        paddingBottom: "0px",
      }}
    >
      <h1>Patient management</h1>
      <div style={{ height: 600, width: "100%" }}>
        {/* <EditPatientModal
          existingPatient={user}
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          fetchPatients={handleFetchPatients}
        /> */}
        <CreatePatientModal
          isOpen={isCreateModalOpen}
          onClose={onCreateModalClose}
        />
        {fetchedPatients ? (
          <DataGrid
            slots={{
              toolbar: CustomToolbar,
            }}
            rows={fetchedPatients}
            columns={columns}
            onCellClick={(params, event) => {
              if (params.field === "action") {
                handleClick(event, params.row);
              }
            }}
            pageSizeOptions={[5, 10, 20, 50]}
            pagination
            paginationMode="server"
            paginationModel={pagModel}
            onPaginationModelChange={setPagModel}
            rowCount={rowCount}
            loading={patientsLoading}
            autoHeight
            sx={{
              width: "100%",
            }}
          />
        ) : null}
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            borderRadius: "3.121px",
          }}
        >
          <MenuItem
            onClick={handleEdit}
            sx={{
              width: "200px",
            }}
          >
            <Button
              startIcon={<EditIcon />}
              sx={{ textTransform: "capitalize" }}
              aria-label="Edit the selected patient"
            >
              Edit
            </Button>
          </MenuItem>
          <MenuItem
            onClick={handleAssignDoctorToPatient}
            sx={{ width: "200px" }}
          >
            <Button
              startIcon={<AddLinkIcon />}
              sx={{ textTransform: "capitalize" }}
              aria-label="Assign doctors to this patient"
            >
              Assign to a doctor
            </Button>
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{
              width: "200px",
            }}
          >
            <LoadingButton
              startIcon={<DeleteIcon />}
              color="error"
              sx={{ textTransform: "capitalize" }}
              aria-label="Delete the selected patient"
              loading={deleteLoading}
            >
              <span>Delete</span>
            </LoadingButton>
          </MenuItem>
        </Menu>
      </div>
    </Box>
  );
};

export default PatientList;
