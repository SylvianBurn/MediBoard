import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type HomeToolProps = {
  label: string;
  link: string;
};

const HomeTool = ({ label, link }: HomeToolProps) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
        width: "500px",
        height: "200px",
        boxShadow: "0px 0px 17.5px -2px #3E5F90",
      }}
      onClick={() => {
        navigate(link);
      }}
    >
      <Typography variant="h3">{label}</Typography>
    </div>
  );
};

export default HomeTool;
