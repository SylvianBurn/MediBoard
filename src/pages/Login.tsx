import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import { loginRequest } from "../utils/api";
import { Role, useAuth } from '../utils/ProtectedRoute';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const ax = axios.create();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const {authenticateUser} = useAuth();

  // ax.defaults.headers.post["Access-Control-Allow-Origin"] =
  //   "http://localhost:3336";

  const handleLoginRequest = async (email: string, password: string) => {
    console.log("trying to login with data:", { email, password });
    try {
      setIsLoginLoading(true);
      const res = await loginRequest(email, password);
      setIsLoginLoading(false);
      if (res.status === 200) {
        console.log("res:", res);
        if (res.data.token) {
          console.log("token:", res.data.token.token);
          authenticateUser(res.data.token.token, Role.admin);
          // localStorage.setItem("token", res.data.token.token);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during login attempt:", error);
    }
  };

  const handleLogin = () => {
    handleLoginRequest(email, password);
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
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <LoadingButton
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              loading={isLoginLoading}
              loadingPosition='start'
              startIcon={<LoginIcon />}
            >
              Login
            </LoadingButton>
            {/* <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
