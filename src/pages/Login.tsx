import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { loginRequest } from "../utils/api";
import { useAuth } from "../utils/ProtectedRoute";
import LoginIcon from "@mui/icons-material/Login";

const concatStrings = (tab: { message: string }[]) => {
  var strings: string[] = [];

  tab.map((value) => {
    strings.push(value.message);
  });
  return strings;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { authenticateUser } = useAuth();
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const handleLoginRequest = async (email: string, password: string) => {
    // console.log("trying to login with data:", { email, password });
    setErrorMsgs([]);
    setIsLoginLoading(true);
    loginRequest(email, password)
      .then((res) => {
        if (res.status === 200) {
          // console.log("res:", res);
          if (res.data.token) {
            // console.log("token:", res.data.token.token);
            authenticateUser(res.data.token.token, res.data.administrator);
            navigate("/");
          }
        }
      })
      .catch((err) => {
        if (
          err.response.status === 400 &&
          err.response.data.errors[0].message === "Invalid user credentials"
        ) {
          setErrorMsgs(concatStrings(err.response.data.errors));
        } else if (err.response.status === 422) {
          setErrorMsgs(concatStrings(err.response.data.errors));
        } else {
          console.error("an error occured during login attempt:", err);
        }
      })
      .finally(() => {
        setIsLoginLoading(false);
      });
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
              loadingPosition="start"
              startIcon={<LoginIcon />}
            >
              Login
            </LoadingButton>
            {errorMsgs && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "6px",
                }}
              >
                {errorMsgs.map((errorMsg) => {
                  return (
                    <Typography variant="body2" color="error">
                      {errorMsg}
                    </Typography>
                  );
                })}
              </div>
            )}
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
