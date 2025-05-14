import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import socket from './socket'

function App() {
  const [message, setMessage] = useState("")

  const sendMessage = (e) => {
    e.preventDefault()

    socket.emit("send_message", {message})
    console.log("ОТПРАВЛЕНО: ", message)
    setMessage("")
  }

  useEffect(() => {
    socket.on("message", (data) => {
      console.log("KELGAN HABAR: ", data)
    })
  },[])

  return (
    <>
      <form action="">
        <input className='input input-primary' value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
        <button className='btn btn-primary' onClick={(e) => sendMessage(e)}>submit</button>
      </form>
    </>
  )
}

export default App
