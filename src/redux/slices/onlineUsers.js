// redux/slices/onlineUsers.js
import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: {
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions; // 👈 BU HAM MUHIM!
export default onlineUsersSlice.reducer;
