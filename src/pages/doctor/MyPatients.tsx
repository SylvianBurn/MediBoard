import { useEffect, useState } from "react";
import { useAuth } from "../../utils/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { fetchPatientsAsDoctor } from "../../utils/api";
import PatientData from "../../interface/PatientData";
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
import { drawerWidth } from "../ResponsiveDrawer";
import { Box } from "@mui/material";

const MyPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const { isAuthenticated, role, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // used to store the DataGrid's pagination infos
  const [pagModel, setPagModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [rowCount, setRowCount] = useState(totalRowCount || 0);

  useEffect(() => {
    document.title = "My Patient";
    if (!isAuthenticated || role !== "0.0") {
      navigate("/login");
    }
    handleFetchMyPatients();
  }, []);

  const handleFetchMyPatients = (name?: string | undefined) => {
    setPatientsLoading(true);
    fetchPatientsAsDoctor()
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
      });
  };

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

  // opens the menu when clicking on the three-dots logo from the column
  const handleClick = (event: any, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  // closes the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isAuthenticated ? (
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
          <h1>Manage my patients</h1>
          <div style={{ height: 600, width: "100%" }}>
            {/* <EditPatientModal
      existingPatient={patient}
      isOpen={isEditModalOpen}
      onClose={onEditModalClose}
      fetchPatients={handleFetchPatients}
    /> */}
            {/* <CreatePatientModal
              isOpen={isCreateModalOpen}
              onClose={onCreateModalClose}
            /> */}
            {patients ? (
              <DataGrid
                // slots={{
                //   toolbar: CustomToolbar,
                // }}
                rows={patients}
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
            {/* <Menu
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
            </Menu> */}
          </div>
        </Box>
      ) : null}
    </>
  );
};

export default MyPatients;
