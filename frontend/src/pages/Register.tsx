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
import { registerUser } from "../store/slice/authSlice";
import { RootState, AppDispatch } from "../store/store";
import "./Register.css";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    const { username, email, password } = form;

    if (!username || !email || !password) {
      alert("All fields are required.");
      return;
    }

    dispatch(registerUser({ username, email, password }))
      .unwrap()
      .then(() => {
        alert("Registered successfully! You can now login.");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
      });
  };

  return (
    <div className="register-container">
      <Paper elevation={3} className="register-card">
        <Typography variant="h4" className="register-title">
          Register
        </Typography>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          required
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
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="outlined"
          className="register-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "REGISTER"}
        </Button>

        <Typography variant="body2" align="center" mt={2}>
          Do You Have an Account?{" "}
          <Link href="/login" className="login-link">
            Login
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Register;
