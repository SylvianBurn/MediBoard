import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/ProtectedRoute";
import DoctorHome from "../components/DoctorHome";
import AdminHome from "../components/AdminHome";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("login");
    }
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Container maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              mt: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              rowGap: '30px',
            }}
          >
            <Typography variant="h1">My tools</Typography>
            {
              role === "doctor" ? (
                <DoctorHome />
              ) : null
            }
            {
              role === "admin" ? (
                <AdminHome />
              ) : null
            }
          </Box>
        </Container>
      ) : null}
    </>
  );
};

export default Home;
