import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import IncomingCallModal from './Components/IncomingCallModal';
import socket from './socket';

import { useDispatch, useSelector } from 'react-redux';
import { setIncomingCall, clearIncomingCall } from './redux/slices/callSlice';

const App = () => {
  const dispatch = useDispatch();
  const incomingCall = useSelector((state) => state.call.incomingCall);
  const peerRef = useRef(null); // ✅ Peer saqlash uchun

  useEffect(() => {
    socket.on("incoming_call", ({ offer, caller, from }) => {
      dispatch(setIncomingCall({ offer, caller, from }));
      document.getElementById("incoming_call_modal")?.showModal();
    });

    socket.on("call_ended", () => {
      peerRef.current?.close(); // 💥 connectionni toza yop
      dispatch(clearIncomingCall());
      document.getElementById("incoming_call_modal")?.close();
    });

    socket.on("ice_candidate", ({ candidate }) => {
      if (peerRef.current) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_ended");
      socket.off("ice_candidate");
    };
  }, [dispatch]);

  const handleAccept = async () => {
    if (!incomingCall) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    peerRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          targetId: incomingCall.from,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      const videoElement = document.getElementById("remote_video");
      if (videoElement) videoElement.srcObject = remoteStream;
    };

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
    peerRef.current?.close(); // 🧼
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
