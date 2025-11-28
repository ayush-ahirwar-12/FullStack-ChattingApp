import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  isError: null,
  isUserLogging: false,
  SelectedUser: null,
  OnlineUsers: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;      // ✅ Proper assignment
      state.isLoggedIn = true;
      state.isError = null;
    },
    removeUser: (state) => {           // ✅ No action needed for logout
      state.user = null;
      state.isLoggedIn = false;
      state.isError = null;
    },
    setError: (state, action) => {
      state.isError = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.SelectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.OnlineUsers = action.payload;
    },
    clearAuth: (state) => initialState  // ✅ Fixed: proper function syntax
  },
});

export const { addUser, removeUser, setError, setSelectedUser, setOnlineUsers, clearAuth } = authSlice.actions;
export default authSlice.reducer;
