import React from "react";
import { IoPeopleSharp } from "react-icons/io5";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-base-200 via-base-300 to-base-100 text-base-content">
      <IoPeopleSharp className="text-6xl text-base-content/50 mb-4" />
      <h2 className="text-2xl font-semibold text-base-content">Select a user to start chatting</h2>
      <p className="text-base text-base-content/50 mt-1">Choose someone from the sidebar to begin your conversation</p>
    </div>
  );
};

export default Welcome;
