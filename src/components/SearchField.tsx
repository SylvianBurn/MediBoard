import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import DoctorData from "../interface/DoctorData";
import { useState, useEffect, Fragment } from "react";
import { fetchDoctorsAsAdmin } from "../utils/api";

type SearchFieldProps = {
  selectedDoctor: DoctorData | undefined;
  setSelectedDoctor: React.Dispatch<React.SetStateAction<DoctorData | undefined>>;
};

const SearchField = ({selectedDoctor, setSelectedDoctor}: SearchFieldProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly DoctorData[]>([]);
  // const [nameSearch, setNameSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchDoctors = (name?: string | undefined) => {
    setLoading(true);
    fetchDoctorsAsAdmin(undefined, undefined, name)
      .then((res) => {
        setOptions(res.data);
      })
      .finally(() => {
        setLoading(false);
        // transformFetchedDoctors();
      });
  };

  useEffect(() => {
    handleFetchDoctors();
  }, []);

  return (
    <Autocomplete
      sx={{ width: '400px' }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
      getOptionLabel={(option) => option.fullName}
      getOptionKey={(option) => option.id}
      options={options}
      loading={loading}
      noOptionsText="No corresponding doctors were found in our system"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Doctors"
        />
      )}
      onChange={(e, v) => {
        console.log('onChange doctor:', v);
        setSelectedDoctor(v !== null ? v : undefined);
      }}
    />
  );
};

export default SearchField;