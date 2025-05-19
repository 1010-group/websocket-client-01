import React, { useEffect, useState } from 'react'
import socket from './socket'
import { useSelector } from 'react-redux'


const App = () => {
  const user = useSelector(state => state.auth.user)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (user) {
      socket.emit("user_joined", user)
    }

    socket.on("user_joined", (data) => {
      console.log("asd: ", data);
    })

    socket.on("online_users", (data) => {
      setOnlineUsers(data)
      console.log("online_users: ", data);
    })
  })


  return (
    <div className="flex h-screen">
      <div className='w-3/12 h-full bg-base-300 overflow-y-auto'>
        {
          onlineUsers.map((item, id) => (
            <div key={id} className='flex gap-6 items-center p-2 bg-base-200'>
              <div>
                <img className='size-14 rounded-full' src={item.profilePic || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"} alt="" />
              </div>
              <div>
                <p>{item.username}</p>
                <p className='text-success'>Online</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className='w-9/12 h-full bg-base-100'></div>
    </div>
  )
}

export default App