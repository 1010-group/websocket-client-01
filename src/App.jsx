// Full audio-only WebRTC call logic
// This includes caller and callee sides with working audio, signaling, and timer.

// ========== App.jsx ==========
import React, { useEffect, useRef, useState } from 'react';
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
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);

  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    socket.on("incoming_call", ({ offer, caller, from }) => {
      dispatch(setIncomingCall({ offer, caller, from }));
    });

    socket.on("call_ended", () => {
      peerRef.current?.close();
      peerRef.current = null;

      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;

      const audio = document.getElementById("remote_audio");
      if (audio) audio.srcObject = null;

      clearInterval(timerRef.current);
      setCallDuration(0);

      dispatch(clearIncomingCall());
      document.getElementById("incoming_call_modal")?.close();
    });

    socket.on("ice_candidate", ({ candidate }) => {
      if (peerRef.current) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
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

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

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
      const audio = document.getElementById("remote_audio");
      if (audio) {
        audio.srcObject = event.streams[0];
        audio.play().catch(console.error);
      }
    };

    await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer_call", {
      targetId: incomingCall.from,
      answer,
    });

    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleReject = () => {
    if (!incomingCall) return;

    socket.emit("end_call", { targetId: incomingCall.from });

    peerRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    clearInterval(timerRef.current);
    setCallDuration(0);

    dispatch(clearIncomingCall());
    document.getElementById("incoming_call_modal")?.close();
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

      <audio id="remote_audio" autoPlay className="hidden" playsInline />

      {incomingCall && (
        <IncomingCallModal
          caller={incomingCall.caller}
          onAccept={handleAccept}
          onReject={handleReject}
          callDuration={callDuration}
        />
      )}
    </div>
  );
};

export default App;