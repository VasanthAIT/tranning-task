import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  loading: false,
  error: null,
};

const getErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (Array.isArray(message)) return message.join(", ");
    return message || err.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred";
};

export const registerUser = createAsyncThunk<
  AuthResponse,
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      "http://localhost:3000/auth/register",
      userData,
    );
    return response.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      "http://localhost:3000/auth/login",
      formData,
    );
    return response.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;
