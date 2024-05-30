import { Close, Save } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface PatientModalProps {
  title: string;
  fullName: string;
  email: string;
  birthDate: string | undefined;
  loading: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const PatientModal = ({
  title,
  fullName,
  email,
  birthDate,
  loading,
  onFullNameChange,
  onEmailChange,
  onBirthDateChange,
  onSave,
  onCancel,
  isEdit = false,
}: PatientModalProps) => {
  return (
    <div
      style={{
        width: "680px",
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
          color: "rgba(0, 0, 0, 0.87)",
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 400,
        }}
      >
        {title}
      </Typography>
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "#BDBDBD",
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
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "35px",
          paddingLeft: "41px",
          paddingRight: "27px",
        }}
      >
        <div
          style={{
            width: "220px",
          }}
        >
          <TextField
            id="birthDate"
            label="Date of birth"
            hiddenLabel={true}
            type="date"
            sx={{ width: "347px", height: "24px" }}
            onChange={(e) => {
              onBirthDateChange(e.target.value);
            }}
            value={birthDate ?? " "}
          />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "42px",
          paddingLeft: "193px",
          paddingRight: "196px",
        }}
      >
        <div>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<Save />}
            variant="outlined"
            onClick={onSave}
            disabled={fullName === "" || email === ""}
          >
            <span>{title}</span>
          </LoadingButton>
        </div>
        <div>
          <Button
            startIcon={<Close />}
            variant="outlined"
            color="error"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
