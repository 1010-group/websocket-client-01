import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "./socket";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import IncomingCallModal from "./Components/SidebarComponents/IncomingCallModal";
import { setIncomingCall, clearIncomingCall } from "./redux/slices/callSlice";
import { MdCallEnd } from "react-icons/md";
import BottomNavbar from "./Components/NavbarComponents/BottomNavbar";

const App = () => {
  const dispatch = useDispatch();
  const incomingCall = useSelector((state) => state.call.incomingCall);
  const [callDuration, setCallDuration] = useState(0);
  const callIntervalRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // 🧽 Qo‘ng‘iroqni tugatish funksiyasi
  const cleanupCall = () => {
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
    }

    clearInterval(callIntervalRef.current);
    setCallDuration(0);

    dispatch(clearIncomingCall());
    document.getElementById("incoming_call_modal")?.close();
  };

  // ✅ Socket hodisalar
  useEffect(() => {
    const handleIncomingCall = ({ offer, caller, from }) => {
      dispatch(setIncomingCall({ offer, caller, from }));
      document.getElementById("incoming_call_modal")?.showModal();
    };

    const handleCallAnswered = async ({ answer }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleICE = ({ candidate }) => {
      if (peerRef.current && candidate) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_answered", handleCallAnswered);
    socket.on("ice_candidate", handleICE);
    socket.on("call_ended", cleanupCall);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_answered", handleCallAnswered);
      socket.off("ice_candidate", handleICE);
      socket.off("call_ended", cleanupCall);
    };
  }, [dispatch]);

  // ✅ Qo‘ng‘iroqni qabul qilish
  const handleAccept = async () => {
    if (!incomingCall) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
        {
          urls: "turn:turn.xirsys.com:3478?transport=udp",
          username: "bekzodmirzaaliyev27Gmail.com",
          credential: "6862442",
        },
        {
          urls: "turn:turn.xirsys.com:3478?transport=tcp",
          username: "bekzodmirzaaliyev27Gmail.com",
          credential: "6862442",
        },
      ],
    });

    peerRef.current = peer;
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice_candidate", {
          targetId: incomingCall.from,
          candidate: e.candidate,
        });
      }
    };

    peer.ontrack = (e) => {
      if (remoteAudioRef.current && e.streams[0]) {
        remoteAudioRef.current.srcObject = e.streams[0];
        remoteAudioRef.current.play().catch((err) => console.error("play err:", err));
      }
    };

    await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer_call", {
      targetId: incomingCall.from,
      answer,
    });

    dispatch(clearIncomingCall());
    document.getElementById("incoming_call_modal")?.close();

    callIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // ❌ Qo‘ng‘iroqni rad qilish
  const handleReject = () => {
    if (incomingCall?.from) {
      socket.emit("end_call", { targetId: incomingCall.from });
    }
    cleanupCall();
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-3/12 border-r border-base-300">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="w-full lg:w-9/12 flex flex-col">
        {/* Navbar */}
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <div className="w-full lg:hidden">
          <BottomNavbar />
        </div>

        {/* Router content */}
        <div className="flex-1 bg-base-100 flex justify-center items-center relative">
          <Outlet />
          <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />

          {callDuration > 0 && (
            <div className="absolute bottom-20 right-5 text-white bg-success font-bold bg-opacity-90 px-4 py-2 rounded flex items-center gap-3 shadow-lg">
              ⏱ {formatTime(callDuration)}
              <button
                className="ml-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                onClick={() => {
                  socket.emit("end_call", { targetId: incomingCall?.from });
                  cleanupCall();
                }}
              >
                <MdCallEnd />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Incoming Call Modal */}
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
