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
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../utils/ProtectedRoute";
import { drawerWidth } from "../ResponsiveDrawer";
import DoctorData from "../../interface/DoctorData";
import { fetchDoctorsAsAdmin } from "../../utils/api";
// import CreateDoctorModal from "../../components/CreateDoctorModal";
// import EditDoctorModal from "../../components/EditDoctorModal";
// import { deleteUser, fetchUsers } from "../service/api";

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchedDoctors, setFetchedDoctors] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Doctor List";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);

  // used to store the DataGrid's pagination infos
  const [pagModel, setPagModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [rowCount, setRowCount] = React.useState(totalRowCount || 0);

  const handleFetchDoctors = (name?: string | undefined) => {
    setDoctorsLoading(true);
    fetchDoctorsAsAdmin(pagModel.page, pagModel.pageSize, name)
      .then((res) => {
        console.log("fetchDoctors:", res);
        // setRowCount(res.meta.total);
        // setTotalRowCount(res.meta.last_page);
        setDoctors(res.data);
      })
      .finally(() => {
        setDoctorsLoading(false);
        transformFetchedDoctors();
      });
  };

  // on pagination change, it fetches the user as asked by pagination
  useEffect(() => {
    handleFetchDoctors();
  }, [pagModel]);

  const transformFetchedDoctors = () => {
    var tmp: DoctorData[] = [];
    const d = doctors as DoctorData[];
    for (var i = 0; i < doctors.length; i++) {
      var newDoctor: DoctorData = {
        id: d[i].id,
        fullName: d[i].fullName,
        email: d[i].email,
      };

      if (d[i].role) {
        newDoctor.role = d[i].role;
      }
      tmp.push(newDoctor);
    }
    setFetchedDoctors(tmp as never[]);
  };

  // on users change it transforms the received user so they can be displayed in the DataGrid
  useEffect(() => {
    transformFetchedDoctors();
  }, [doctors]);

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
              height: '100%',
              width: '100%',
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
    { field: "role", headerName: "Role", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ];

  // stores the values to open the menu the menu or not on the correct row
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // used to open and close the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // used to open and close the doctor creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // used to store the infos of the new doctor to create
  const [user, setUser] = useState<DoctorData>({
    id: 0,
    fullName: "",
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

  // opens the edit modal with the selected doctor info
  const handleEdit = () => {
    if (selectedRow) {
      const selRow = selectedRow as DoctorData;
      setUser({
        id: selRow.id,
        fullName: selRow.fullName,
        role: selRow.role,
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
      const selRow = selectedRow as DoctorData;
      const doctorId = selRow.id;
      // deleteDoctor(doctorId, signOut, navigate).then(() => {
      //   handleClose();
      //   handleFetchDoctors();
      // });
      setDeleteLoading(false);
    }
  };

  const onEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const onCreateModalClose = () => {
    setIsCreateModalOpen(false);
    handleFetchDoctors();
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
                aria-label="Add a new doctor to the system"
                onClick={() => {
                  handleNewUser();
                }}
              >
                Add a new doctor
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
      <h1>Doctor management</h1>
      <div style={{ height: 600, width: "100%" }}>
        {/* <EditDoctorModal
            existingDoctor={user}
            isOpen={isEditModalOpen}
            onClose={onEditModalClose}
            fetchDoctors={handleFetchDoctors}
          />
          <CreateDoctorModal
            isOpen={isCreateModalOpen}
            onClose={onCreateModalClose}
          /> */}
        {fetchedDoctors ? (
          <DataGrid
            slots={{
              toolbar: CustomToolbar,
            }}
            rows={fetchedDoctors}
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
            loading={doctorsLoading}
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
              width: "170px",
            }}
          >
            <Button
              startIcon={<EditIcon />}
              sx={{ textTransform: "capitalize" }}
              aria-label="Edit the selected doctor"
            >
              Edit
            </Button>
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{
              width: "170px",
            }}
          >
            <LoadingButton
              startIcon={<DeleteIcon />}
              color="error"
              sx={{ textTransform: "capitalize" }}
              aria-label="Delete the selected doctor"
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

export default DoctorList;
