import { Close, Save } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface DoctorModalProps {
  title: string;
  fullName: string;
  email: string;
  role: string;
  loading: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const DoctorModal = ({
  title,
  fullName,
  email,
  role,
  loading,
  onFullNameChange,
  onEmailChange,
  onRoleChange,
  onSave,
  onCancel,
  isEdit = false,
}: DoctorModalProps) => {
  const handleChangeLocalRole = (e: SelectChangeEvent) => {
    const value = e.target.value;
    onRoleChange(value);
  };

  return (
    <div
      style={{
        width: "680px",
        // height: "465px",
        // display: "flex",
        // flexDirection: "column",
        // rowGap: "20px",
        flexShrink: 0,
        borderRadius: "30px",
        background: "#FFF",
        boxShadow: "0px 0px 17.5px -2px #3E5F90",
        padding: "10px",
      }}
    >
      <Typography
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "31px",
          marginLeft: "47px",
          height: "37px",
          color: "rgba(0, 0, 0, 0.87)",
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 400,
          // lineHeight: "116.7%",
        }}
      >
        {title}
      </Typography>
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "#BDBDBD",
          // marginLeft: "47px",
        }}
      ></div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "30px",
          paddingLeft: "41px",
          paddingRight: "27px",
          height: "91px",
          // height: '100%',
        }}
      >
        <TextField
          id="fullName"
          label="Full Name"
          sx={{ width: "220px", height: "24px" }}
          onChange={(e) => {
            onFullNameChange(e.target.value);
          }}
          value={fullName}
        />
        <TextField
          id="email"
          label="Email"
          sx={{ width: "347px", height: "24px" }}
          onChange={(e) => {
            onEmailChange(e.target.value);
          }}
          value={email}
          disabled={isEdit}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          height: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "35px",
          paddingLeft: "41px",
          paddingRight: "27px",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="tag-select-label">Role</InputLabel>
          <Select
            labelId="tag-select-label"
            id="tag-select"
            value={role}
            label="Tag"
            onChange={handleChangeLocalRole}
          >
            <MenuItem value={"doctor"}>Doctor</MenuItem>
            <MenuItem value={"staff"}>Medical Staff</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "52px",
          paddingBottom: "10px",
          columnGap: "10px",
        }}
      >
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<Save />}
          variant="outlined"
          onClick={onSave}
          disabled={fullName === "" || email === ""}
          fullWidth
        >
          <span>{title}</span>
        </LoadingButton>
        <Button
          startIcon={<Close />}
          variant="outlined"
          color="error"
          onClick={onCancel}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DoctorModal;
