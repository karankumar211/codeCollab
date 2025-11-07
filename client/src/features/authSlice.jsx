import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../api/Api";
const token = localStorage.getItem("token");
const initialState = {
  user: null,
  token: token,
  isAuthenticated: token ? true : false,
};

// This thunk looks perfect.
const getUser = createAsyncThunk("auth/getUser", async (_, { getState }) => {
  const token = getState().auth.token;
  if (!token) {
    return null;
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/user/me`, config);
  return response.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // --- FIX ---
      // Only set the token if it actually exists in the payload
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
        state.token = action.payload.token;
      }
      state.isAuthenticated = true;
      state.user = { username: action.payload.username };
    },
    registerSuccess: (state, action) => {
      // --- FIX ---
      // Also add the check here
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
        state.token = action.payload.token;
      }
      state.isAuthenticated = true;
      state.user = { username: action.payload.username };
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  // This extraReducers logic is perfect.
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    });
  },
});

export const { loginSuccess, registerSuccess, logout } = authSlice.actions;
export { getUser };
export default authSlice.reducer;
