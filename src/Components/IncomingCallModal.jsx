import React from 'react';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";

const IncomingCallModal = ({ caller, onAccept, onReject }) => {
  return (
    <dialog id="incoming_call_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-neutral text-neutral-content">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">📞 Kiruvchi qo‘ng‘iroq</h3>
          <img
            src={caller?.image || 'https://placehold.co/100x100'}
            alt="caller"
            className="mx-auto size-28 rounded-full border-4 border-primary shadow-md"
          />
          <h4 className="text-lg mt-4">{caller?.username}</h4>
          <p className="opacity-70 text-sm">{caller?.phone || 'Unknown number'}</p>
        </div>

        <div className="modal-action justify-center mt-6 gap-5">
          <button onClick={onAccept} className="btn btn-success btn-circle btn-lg text-white text-2xl">
            <IoIosCall />
          </button>
          <button onClick={onReject} className="btn btn-error btn-circle btn-lg text-white text-2xl">
            <MdCallEnd />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default IncomingCallModal;
