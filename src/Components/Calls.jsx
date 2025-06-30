import React, { useEffect, useRef, useState } from 'react';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from 'react-icons/md';
import socket from '../socket';
import { useSelector } from 'react-redux';

const Calls = ({ selectedUser, currentUser }) => {
  const [status, setStatus] = useState("Calling...");
  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const onlineUsers = useSelector((state) => state?.onlineUsers?.onlineUsers); // ✅ correct slice

  const handleCall = async () => {
    console.log("online Users: ", onlineUsers)
    const target = onlineUsers.find(u => u._id === selectedUser._id);

    console.log("TARGET: ", target)
    if (!target || !target.socketId) {
      alert("❌ Foydalanuvchi offline yoki socketId yo‘q.");
      return;
    }

    setIsCalling(true);
    document.getElementById('my_modal_call')?.showModal();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;

    const peer = new RTCPeerConnection();
    peerRef.current = peer;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          targetId: target.socketId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log("OFFER: ", {
      targetId: target.socketId,
      offer,
      caller: {
        _id: currentUser._id,
        username: currentUser.username,
        image: currentUser.image,
        socketId: socket.id,
      },
    })
    socket.emit("call_user", {
      targetId: target.socketId,
      offer,
      caller: {
        _id: currentUser._id,
        username: currentUser.username,
        image: currentUser.image,
        socketId: socket.id,
      },
    });
  };

  const endCall = () => {
    peerRef.current?.close();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    socket.emit("end_call", { targetId: selectedUser?.socketId }); // may be undefined
    setIsCalling(false);
    setStatus("Calling...");
  };

  useEffect(() => {
    socket.on("call_answered", async ({ answer }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setStatus("Connected");
    });

    socket.on("ice_candidate", ({ candidate }) => {
      if (peerRef.current) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("call_ended", () => {
      endCall();
      setStatus("Call Ended");
    });

    return () => {
      socket.off("call_answered");
      socket.off("ice_candidate");
      socket.off("call_ended");
    };
  }, []);

  return (
    <div>
      <button className="btn text-2xl btn-soft btn-success" onClick={handleCall}><IoIosCall /></button>
      <dialog id="my_modal_call" className="modal">
        <div className="modal-box w-full max-w-xl">
          <div className='flex flex-col items-center py-4'>
            <video ref={localVideoRef} autoPlay muted className="rounded-lg w-40 h-40" />
            <video ref={remoteVideoRef} autoPlay className="rounded-lg w-40 h-40 mt-4" />
            <figcaption className='text-center mt-2 text-accent animate-pulse'>{status}</figcaption>
          </div>
          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn btn-error btn-soft text-2xl" onClick={endCall}><MdCallEnd /></button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Calls;
