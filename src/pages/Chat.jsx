import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoMdSend } from "react-icons/io";
import socket from '../socket';

const Chat = () => {
    const selectedChat = useSelector(state => state.selectChat.selectedUser)
    const [inputValue, setInputValue] = useState(null)


    useEffect(() => {
        console.log("CHAT: ", selectedChat)
    }, [selectedChat])

    const handleSendMessage = () => {
        console.log(inputValue)
        socket.emit("send_message", { message: inputValue, receiverId: selectedChat._id, from: selectedChat })
    }


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage()
        }
    }

    return (
        <div className='flex-1 h-screen flex flex-col'>
            <div className='h-[12%] bg-base-300 flex items-center p-2'>
                <div>
                    <p className='text-2xl font-semibold'>{selectedChat?.username}</p>
                    <p className={`text-sm ${selectedChat?.status ? "text-success" : "text-error"}`}>{selectedChat?.status ? "Online" : "Offline"}</p>
                </div>
                <div></div>
            </div>
            <div className='flex-1 bg-base-100 overflow-y-auto flex flex-col'>

            </div>
            <div className='h-1/12 bg-base-300 flex items-center'>
                <input type="text" placeholder='Type a message' value={inputValue} onChange={(e) => setInputValue(e.target.value)} className='input input-bordered w-full rounded-e-none' onKeyDown={handleKeyDown} />
                <button className='btn btn-primary rounded-l-none' onClick={() => handleSendMessage()}>
                    <IoMdSend />
                </button>
            </div>
        </div>
    )
}

export default Chat