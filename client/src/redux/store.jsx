import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import spaceReducer from "../features/spaceSlice";
import snippetReducer from "../features/snippetSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    spaces: spaceReducer,
    snippets: snippetReducer,
  },
});
export default store;
