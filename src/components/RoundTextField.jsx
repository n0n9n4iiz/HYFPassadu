import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
export const RoundTextField = ({ width, className, value,setValue, onChange }) => {
  const [w, setW] = useState(width);
  return (
    <TextField
      className={className}
      placeholder="ค้นหา..."
      onFocus={() => setW("90%")}
      onBlur={() => setW(width)}
      sx={{
        borderRadius: "50px",
        width: w,
        transition: "width 0.3s ease",
        backgroundColor: "white",
        "& .MuiOutlinedInput-root, & .MuiInputBase-input": {
          borderRadius: "50px",
        },
        "& .MuiInputBase-input": {
          padding: "12px",
        },
      }}
      value={value}
      onChange={onChange}
      slotProps={{
        input: {
          endAdornment: (
            <>
              <InputAdornment position="end">
                {value != "" && (
                  <IconButton onClick={()=>setValue("")}>
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            </>
          ),
        },
      }}
    ></TextField>
  );
};
