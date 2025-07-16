import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import moment from 'moment';
import { IoSendSharp } from 'react-icons/io5';
import { FaChevronLeft } from 'react-icons/fa';
import { setSelectedUser } from '../redux/slices/selectedUser';
import { toast } from 'react-toastify';

const Chat = () => {
    const currentUser = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.selectChat.selectedUser);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { chatId } = useParams();

    useEffect(() => {
        if (!chatId) {
            navigate('/');
            return;
        }

        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (chatId) {
            setIsLoading(true);
            socket.emit('get_user', { userId: chatId });
            socket.once('user_data', (userData) => {
                setIsLoading(false);
                if (userData) {
                    dispatch(setSelectedUser(userData));
                } else {
                    toast.error('Пользователь не найден');
                    navigate('/');
                }
            });

            return () => {
                socket.off('user_data');
            };
        }
    }, [chatId, selectedUser, currentUser, dispatch, navigate]);

    useEffect(() => {
        if (!selectedUser || !currentUser) return;
        setIsLoading(true);
        socket.emit('get_history', {
            from: currentUser._id,
            to: selectedUser._id,
        });

        socket.once('chat_history', (messages) => {
            setChatMessages(messages);
            setIsLoading(false);
        });

        return () => {
            socket.off('chat_history');
        };
    }, [selectedUser, currentUser]);

    useEffect(() => {
        if (currentUser) {
            socket.emit('user_joined', currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        socket.on('mute_oluvchi_result', (data) => {
            console.log('mute_oluvchi_result:', data);
        });

        return () => {
            socket.off('mute_oluvchi_result');
        };
    }, []);

    useEffect(() => {
        const receiveMessage = (data) => {
            if (
                (data.from === currentUser._id && data.to === selectedUser?._id) ||
                (data.from === selectedUser?._id && data.to === currentUser._id)
            ) {
                setChatMessages((prev) => [...prev, data]);
            }
        };

        const receiveTyping = (data) => {
            if (data.from === selectedUser?._id) {
                setTypingUser(true);
                setTimeout(() => setTypingUser(null), 1500);
            }
        };

        socket.on('receive_message', receiveMessage);
        socket.on('typed', receiveTyping);

        return () => {
            socket.off('receive_message', receiveMessage);
            socket.off('typed', receiveTyping);
        };
    }, [selectedUser, currentUser]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (!message.trim() || !selectedUser) return;

        const msgData = {
            from: currentUser._id,
            to: selectedUser._id,
            text: message,
            timestamp: new Date(),
        };

        socket.emit('send_message', msgData);
        setChatMessages((prev) => [...prev, msgData]);
        setMessage('');
    };

    const handleTyping = () => {
        if (!selectedUser) return;

        socket.emit('typing', {
            from: currentUser._id,
            to: selectedUser._id,
        });
    };

    const handleFileSelect = (file) => {
        if (file) {
            const fileData = {
                from: currentUser._id,
                to: selectedUser._id,
                file: file.name,
                timestamp: new Date(),
            };
            socket.emit('send_file', fileData);
            setChatMessages((prev) => [...prev, { ...fileData, text: `File: ${file.name}` }]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-base-100 flex-1">
            <div className="container bg-base-200 h-[10%] p-4 mb:p-2 shadow mb-2 flex items-center gap-4">
                <button onClick={() => navigate('/')} className="md:hidden p-2 m-2">
                    <FaChevronLeft />
                </button>
                <div>
                    <h2 className="text-lg font-bold">{selectedUser?.username || 'Пользователь не выбран'}</h2>
                    <p className={selectedUser?.status ? 'text-success' : 'text-error'}>
                        {typingUser ? (
                            <span className="flex items-center gap-1">
                                Печатает
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce delay-150">.</span>
                                <span className="animate-bounce delay-300">.</span>
                            </span>
                        ) : selectedUser?.status ? (
                            'Online'
                        ) : (
                            'Offline'
                        )}
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-base-100 rounded-md shadow p-4 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${msg.from === currentUser._id
                            ? 'flex items-center gap-4 justify-start flex-row-reverse'
                            : 'flex items-center gap-4 justify-start'
                            }`}
                    >
                        <figure>
                            <img
                                className="size-14 rounded-full"
                                src={
                                    msg.from === currentUser._id
                                        ? currentUser.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdIYuCdg369Zi9PDQqmDljt26Co3bVUf4wA&s'
                                        : selectedUser?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdIYuCdg369Zi9PDQqmDljt26Co3bVUf4wA&s'
                                }
                                alt=""
                            />
                        </figure>
                        <div>
                            {msg.from === currentUser._id ? (
                                <p className="text-end px-1 text-primary font-bold">Me</p>
                            ) : (
                                <p className="font-bold">{selectedUser?.username}</p>
                            )}
                            <span
                                className={`inline-block px-3 py-1 rounded-2xl break-words min-w-[200px] max-w-md md:max-w-xl lg:max-w-2xl ${msg.from === currentUser._id
                                    ? 'bg-[#833AB4] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white'
                                    : 'bg-[#020024] bg-gradient-to-r from-[rgba(2,0,36,1)] via-[rgba(9,9,121,1)] to-[rgba(0,212,255,1)] text-white'
                                    }`}
                            >
                                {msg.text}
                            </span>
                            <div
                                className={`text-xs ${msg.from === currentUser._id
                                    ? 'flex items-center gap-4 justify-end'
                                    : 'flex items-center gap-4 justify-start'
                                    }`}
                            >
                                <span className="text-balance text-base-content/35">
                                    {moment(msg.timestamp).calendar()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="mt-2 flex gap-2 bg-base-300 p-3 rounded-md items-center">
                <input
                    type="text"
                    placeholder="Xabar yozing..."
                    className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-primary transition"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    className="btn btn-primary min-w-[40px] flex items-center justify-center"
                >
                    <IoSendSharp size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
