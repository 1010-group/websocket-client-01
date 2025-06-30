// redux/slices/callSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incomingCall: null,
  peer: null,       // RTCPeerConnection
  stream: null,     // Local MediaStream
  status: "idle",  // 'idle' | 'calling' | 'in-call'
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    setPeer: (state, action) => {
      state.peer = action.payload;
    },
    clearPeer: (state) => {
      state.peer?.close();
      state.peer = null;
    },
    setStream: (state, action) => {
      state.stream = action.payload;
    },
    clearStream: (state) => {
      state.stream?.getTracks().forEach((t) => t.stop());
      state.stream = null;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setIncomingCall,
  clearIncomingCall,
  setPeer,
  clearPeer,
  setStream,
  clearStream,
  setStatus,
} = callSlice.actions;

export default callSlice.reducer;
