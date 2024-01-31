import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const normalFastingMin = 4;
  const normalFastingMax = 6;
  const normalPostMealMax = 7.8;

  const preDiabetesFastingMin = 6.1;
  const preDiabetesFastingMax = 6.9;
  const preDiabetesPostMealMin = 7.8;
  const preDiabetesPostMealMax = 11.1;

  const diabetesFastingMin = 7;
  const diabetesPostMealMin = 11.1;

  const bsg = [
    5.1, 5.3, 5.2, 4.9, 5.5, 6.3, 7.1, 7.6, 7.4, 7.3, 7.0, 6.5, 6.0, 5.5, 5.2,
    5.3,
  ];

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      console.log("No token found.. Redirecting to Login page");
      navigate("login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("login");
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Home</Typography>
          <Box
            sx={{
              mt: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography>Blood Glusoce Line Chart</Typography>
            <Box sx={{ mt: 3, border: 1, borderRadius: 4 }}>
              <LineChart
                series={[
                  {
                    data: bsg,
                  },
                ]}
                width={500}
                height={300}
              />
            </Box>
            <Button variant="contained" sx={{mt: 3, mb: 2}} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
