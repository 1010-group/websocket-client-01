import { useEffect, useState } from 'react';
import socket from './socket';

function App() {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    // Отправляем событие с правильным именем 'send_message'
    socket.emit("send_message", { message });
    console.log("отправлено:", message);
    setMessage("");  // Очищаем поле ввода
  };

  useEffect(() => {
    socket.on("message", (data) => {
      console.log("Получено сообщение:", data);
    });
  }, []);

  return (
    <>
      <form>
        <input 
          className='input input-primary' 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          type="text" 
        />
        <button className='btn btn-primary' onClick={sendMessage}>Submit</button>
      </form>
    </>
  );
}

export default App;
