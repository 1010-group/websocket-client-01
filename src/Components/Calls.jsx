import React, { useEffect, useRef, useState } from 'react';
import { IoIosCall } from 'react-icons/io';
import { MdCallEnd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';
import { setStatus } from '../redux/slices/callSlice';

// Ovoz fayllarini import qilish (fayllar assets/mp3/ da)
import manabuSound from '../assets/mp3/manabu.mp3'; // Qo‘ng‘iroq ovozi
import callsuserSound from '../assets/mp3/callsuser.mp3'; // Foydalanuvchi online bo‘lsa ovoz
import notAnsweredSound from '../assets/mp3/notanswered.mp3'; // Foydalanuvchi javob bermasa ovoz

const Calls = ({ selectedUser, currentUser }) => {
  const dispatch = useDispatch();
  const [status, setStatusText] = useState('Calling...');
  const [isCalling, setIsCalling] = useState(false);

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioRef = useRef(null); // Ovoz faylini ijro etish uchun ref
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);

  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.src = soundFile;
      audioRef.current.play().catch((e) => {
        console.error('Ovoz ijro etishda xato:', e);
      });
    }
  };

  const handleCall = async () => {
    const target = onlineUsers.find((u) => u._id === selectedUser._id);
    if (!target?.socketId) {
      alert('❌ Foydalanuvchi offline yoki socketId yo‘q.');
      playSound(notAnsweredSound); // Offline bo‘lsa bu ovoz ijro etiladi
      return;
    }

    setIsCalling(true);
    setStatusText('Calling...');
    document.getElementById('my_modal_call')?.showModal();

    playSound(manabuSound); // Qo‘ng‘iroq boshlanganda manabu ovoz
    playSound(callsuserSound); // Foydalanuvchi online bo‘lsa bu ovoz ijro etiladi

    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    localStreamRef.current = stream;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
        {
          urls: 'turn:turn.xirsys.com:3478?transport=udp',
          username: 'bekzodmirzaaliyev27Gmail.com',
          credential: '6862442'
        },
        {
          urls: 'turn:turn.xirsys.com:3478?transport=tcp',
          username: 'bekzodmirzaaliyev27Gmail.com',
          credential: '6862442'
        }
      ]
    });

    peerRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice_candidate', {
          targetId: target.socketId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const remoteAudio = document.getElementById('remote_audio');
      if (remoteAudio && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch((e) => console.log("play error:", e));
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit('call_user', {
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
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    const target = onlineUsers.find((u) => u._id === selectedUser._id);
    socket.emit('end_call', { targetId: target?.socketId });
    setIsCalling(false);
    setStatusText('Calling...');
    document.getElementById('my_modal_call')?.close();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    socket.on('call_answered', async ({ answer }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setStatusText('Connected');
      dispatch(setStatus('in-call'));
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });

    socket.on('ice_candidate', ({ candidate }) => {
      const peer = peerRef.current;
      if (peer && peer.signalingState !== 'closed') {
        peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      }
    });

    socket.on('call_ended', () => {
      endCall();
    });

    return () => {
      socket.off('call_answered');
      socket.off('ice_candidate');
      socket.off('call_ended');
    };
  }, []);

  return (
    <div>
      {selectedUser && (
        <button className="btn text-2xl btn-soft btn-success" onClick={handleCall}>
          <IoIosCall />
        </button>
      )}

      <dialog id="my_modal_call" className="modal">
        <div className="modal-box w-full max-w-md">
          <div className="flex flex-col items-center py-4">
            <audio id="remote_audio" autoPlay controls className="mb-4" />
            <audio ref={audioRef} />
            <figcaption className="text-center mt-2 text-accent animate-pulse">{status}</figcaption>
          </div>
          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn btn-error btn-soft text-2xl" onClick={endCall}>
                <MdCallEnd />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Calls;