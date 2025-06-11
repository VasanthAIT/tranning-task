import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Link,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/slice/authSlice";
import { RootState, AppDispatch } from "../store/store";
import "./Login.css";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) {
      return;
    }

    dispatch(loginUser({ username, password }))
      .unwrap()
      .then(() => {
        navigate("/table");
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  const isUsernameValid = () => {
    if (!touched.username) return true;
    return form.username.trim().length > 0;
  };

  const isPasswordValid = () => {
    if (!touched.password) return true;
    return form.password.length >= 6;
  };

  return (
    <div className="login-container">
      <Paper
        elevation={3}
        className="login-card"
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" className="login-title">
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          margin="normal"
          required
          error={touched.username && !isUsernameValid()}
          helperText={
            touched.username && !isUsernameValid()
              ? "Please enter your username"
              : ""
          }
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          margin="normal"
          required
          error={touched.password && !isPasswordValid()}
          helperText={
            touched.password && !isPasswordValid()
              ? "Password must be at least 6 characters"
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" mt={1} textAlign="center">
            Invalid credentials
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          className="login-button"
          type="submit"
          disabled={loading || !isUsernameValid() || !isPasswordValid()}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </Button>

        <Typography variant="body2" align="center" mt={2}>
          You don&apos;t have an account?
          <Link href="/register" className="register-link">
            Register here
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
