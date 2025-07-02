import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "./socket";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import IncomingCallModal from "./Components/IncomingCallModal";
import { setIncomingCall, clearIncomingCall } from "./redux/slices/callSlice";
import { MdCallEnd } from "react-icons/md";

const App = () => {
  const dispatch = useDispatch();
  const incomingCall = useSelector((state) => state.call.incomingCall);

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [callDuration, setCallDuration] = useState(0);
  const callIntervalRef = useRef(null);

  // Timer format helper
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    socket.on("incoming_call", ({ offer, caller, from }) => {
      dispatch(setIncomingCall({ offer, caller, from }));
      document.getElementById("incoming_call_modal")?.showModal();
    });

    socket.on("call_ended", () => {
      cleanupCall();
    });

    socket.on("ice_candidate", ({ candidate }) => {
      if (peerRef.current) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("call_answered", async ({ answer }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_ended");
      socket.off("ice_candidate");
      socket.off("call_answered");
    };
  }, [dispatch]);

  const cleanupCall = () => {
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    remoteAudioRef.current.srcObject = null;
    clearInterval(callIntervalRef.current);
    setCallDuration(0);
    dispatch(clearIncomingCall());
    document.getElementById("incoming_call_modal")?.close();
  };

  const handleAccept = async () => {
    if (!incomingCall) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "openai",
          credential: "openai"
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "openai",
          credential: "openai"
        },
        {
          urls: "turn:global.relay.metered.ca:443?transport=tcp",
          username: "openai",
          credential: "openai"
        },
      ]
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
      remoteAudioRef.current.srcObject = event.streams[0];
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

    // Start timer
    callIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleReject = () => {
    if (incomingCall?.from) {
      socket.emit("end_call", { targetId: incomingCall.from });
    }
    cleanupCall();
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-9/12">
        <Navbar />
        <div className="flex-1 bg-base-100 flex justify-center items-center relative">
          <Outlet />

          {/* Hidden audio element */}
          <audio ref={remoteAudioRef} autoPlay playsInline hidden />

          {/* Call duration timer */}
          {callDuration > 0 && (
            <div
              className="absolute bottom-20 right-5 text-white bg-success font-bold bg-opacity-90 px-4 py-2 rounded cursor-pointer flex items-center gap-3 shadow-lg"
              title="Tugash uchun bosing"
            >
              ⏱ {formatTime(callDuration)}
              <button
                className="ml-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                onClick={() => {
                  socket.emit("end_call", {
                    targetId: peerRef.current?.remoteSocketId, // bu joyda remote socket id bo‘lishi kerak
                  });
                  cleanupCall();
                }}
              >
                <MdCallEnd />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Modal */}
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
