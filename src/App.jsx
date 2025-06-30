import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import IncomingCallModal from './Components/IncomingCallModal';
import socket from './socket';

import { useDispatch, useSelector } from 'react-redux';
import { setIncomingCall, clearIncomingCall } from './redux/slices/callSlice';

const App = () => {
  const dispatch = useDispatch();
  const incomingCall = useSelector((state) => state);
  console.log("incomeCall: ", incomingCall);

  
  useEffect(() => {
    socket.on("incoming_call", ({ offer, caller, from }) => {
      dispatch(setIncomingCall({ offer, caller, from }));
      document.getElementById("incoming_call_modal")?.showModal();
    });

    socket.on("call_ended", () => {
      dispatch(clearIncomingCall());
      document.getElementById("incoming_call_modal")?.close();
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_ended");
    };
  }, [dispatch]);

  const handleAccept = async () => {
    if (!incomingCall) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const peer = new RTCPeerConnection();

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer_call", {
      targetId: incomingCall.from,
      answer,
    });

    document.getElementById("incoming_call_modal")?.close();
    dispatch(clearIncomingCall());
  };

  const handleReject = () => {
    if (!incomingCall) return;
    socket.emit("end_call", { targetId: incomingCall.from });
    document.getElementById("incoming_call_modal")?.close();
    dispatch(clearIncomingCall());
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-9/12">
        <Navbar />
        <div className="flex-1 bg-base-100 flex justify-center items-center">
          <Outlet />
        </div>
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          caller={incomingCall.caller}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default App;
