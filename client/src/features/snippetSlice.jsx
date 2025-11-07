import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../api/Api";

const initialState = {
  snippets: [],
  isLoading: false,
  error: null,
  currentSnippet: null,
};
// for fetching the sinippet inside space  we are using createAsyncThunk
export const fetchSnippetsBySpace = createAsyncThunk(
  "snippets/fetchSnippets",
  async (spaceId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token)
      return rejectWithValue({ message: "Authentication token missing" });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // If a spaceId is provided, call the snippets-by-space endpoint; otherwise call a generic snippets endpoint
    const endpoint = spaceId
      ? `${API_BASE_URL}/snippets/space/${spaceId}`
      : `${API_BASE_URL}/snippets`;

    try {
      const response = await axios.get(endpoint, config);
      return response.data; // becomes action.payload
    } catch (err) {
      // Pass server response body to rejected action so reducers can read message
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// fetch the snippet by id
export const fetchSnippetById = createAsyncThunk(
  "snippets/fetchSnippetById",
  async (snippetId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token)
      return rejectWithValue({ message: "Authentication token missing" });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const endpoint = `${API_BASE_URL}/snippets/${snippetId}`;
    try {
      const response = await axios.get(endpoint, config);
      return response.data; // becomes action.payload
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateSnippet = createAsyncThunk(
  "snippets/updateSnippet",
  async (
    { snippetId, content, name, language },
    { getState, rejectWithValue }
  ) => {
    const token = getState().auth.token;
    if (!token)
      return rejectWithValue({ message: "Authentication token missing" });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `${API_BASE_URL}/snippets/${snippetId}`,
        { name, content, language },
        config
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createSnippet = createAsyncThunk(
  "snippets/createSnippet",
  async (snippetData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token)
      return rejectWithValue({ message: "Authentication token missing" });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/snippets/createSnippet`,
        snippetData,
        config
      );
      return response.data; // becomes action.payload
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const snippetSlice = createSlice({
  name: "snippets",
  initialState,
  reducers: {
    setSnippetSuccess: (state, action) => {
      // store a selected snippet in state.currentSnippet
      state.currentSnippet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSnippetsBySpace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSnippetsBySpace.fulfilled, (state, action) => {
        state.isLoading = false;
        // payload may be an object or an array depending on API; handle both
        state.snippets = action.payload?.snippets;
      })
      .addCase(fetchSnippetsBySpace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSnippetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSnippetById.fulfilled, (state, action) => {
        state.isLoading = false;
        // payload may be an object or an array depending on API; handle both
        state.currentSnippet = action.payload?.snippet;
      })
      .addCase(fetchSnippetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSnippet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.snippets.push(action.payload.snippet);
      })
      .addCase(createSnippet.rejected, (state, action) => {
        state.isLoading = false;
        // action.payload may be undefined unless rejectWithValue was used; fall back to action.error
        state.error =
          action.payload?.message || action.error?.message || "Create failed";
      })
      .addCase(updateSnippet.pending, (state) => {
        state.isLoading = true;
        // Clear any previous error when starting an update
        state.error = null;
      })
      .addCase(updateSnippet.fulfilled, (state, action) => {
        // API might return { snippet } or the snippet object directly; handle both
        state.currentSnippet = action.payload?.snippet || action.payload;
        state.isLoading = false;
      })
      .addCase(updateSnippet.rejected, (state, action) => {
        // Use payload message if provided by rejectWithValue, otherwise use action.error
        state.error =
          action.payload?.message || action.error?.message || "Update failed";
        state.isLoading = false;
      });
  },
});

export const { setSnippetSuccess } = snippetSlice.actions;
export default snippetSlice.reducer;
