import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

type SearchFieldProps = {
  options: readonly any[];
  setSelected: React.Dispatch<React.SetStateAction<any | undefined>>;
  label: string;
  isOptionLoading: boolean;
};

const SearchField = ({options, setSelected, label, isOptionLoading}: SearchFieldProps) => {
  const [open, setOpen] = useState(false);

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
      loading={isOptionLoading}
      noOptionsText={`No corresponding ${label.toLowerCase()} were found in our system`}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
        />
      )}
      onChange={(_e, v) => {
        console.log('onChange:', v);
        setSelected(v !== null ? v : undefined);
      }}
    />
  );
};

export default SearchField;