import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../api/Api";
// fetching the spaces from api
const initialState = {
  spaces: [],
  loading: false,
  error: null,
  inviteLoading: false,
  inviteError: null,
  inviteSuccess: null,
};

export const getSpaces = createAsyncThunk(
  "spaces/getSpaces",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_BASE_URL}/spaces/getSpace`, config);
    return response.data.spaces; // This becomes the action.payload
  }
);

export const inviteUser = createAsyncThunk(
  "spaces/inviteUser",
  async ({ spaceId, email }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_BASE_URL}/spaces/${spaceId}/invite`,
        { email },
        config
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const spaceSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {
    clearInviteStatus: (state) => {
      state.inviteLoading = false;
      state.inviteError = null;
      state.inviteSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.spaces = action.payload;
      })
      .addCase(getSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(inviteUser.pending, (state) => {
        state.inviteLoading = true;
        state.inviteError = null;
        state.inviteSuccess = null;
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.inviteLoading = false;
        state.inviteSuccess = action.payload.message;
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.inviteLoading = false;
        state.inviteError = action.payload.message;
      });
  },
});
export default spaceSlice.reducer;
export const { clearInviteStatus } = spaceSlice.actions;
