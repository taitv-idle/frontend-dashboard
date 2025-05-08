import React, { useEffect, useRef, useState } from 'react';
import { FaUsers, FaPaperPlane } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_message, get_sellers, send_message_seller_admin, messageClear, updateSellerMessage } from '../../store/Reducers/chatReducer';
import { Link, useParams } from 'react-router-dom';
import { socket } from '../../utils/utils';
import toast from 'react-hot-toast';

const ChatSeller = () => {
    const scrollRef = useRef();
    const [showSidebar, setShowSidebar] = useState(false);
    const { sellerId } = useParams();
    const [message, setMessage] = useState('');
    const [receverMessage, setReceverMessage] = useState('');

    const { sellers, activeSeller, seller_admin_message, currentSeller, successMessage } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    // Lấy danh sách người bán
    useEffect(() => {
        dispatch(get_sellers());
    }, [dispatch]);

    // Gửi tin nhắn
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        dispatch(send_message_seller_admin({
            senderId: '',
            receverId: sellerId,
            message: message,
            senderName: 'Admin Support'
        }));
        setMessage('');
    };

    // Lấy tin nhắn khi có sellerId
    useEffect(() => {
        if (sellerId) {
            dispatch(get_admin_message(sellerId));
        }
    }, [sellerId, dispatch]);

    // Xử lý tin nhắn thành công
    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_admin_to_seller', seller_admin_message[seller_admin_message.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, seller_admin_message, dispatch]);

    // Nhận tin nhắn từ socket
    useEffect(() => {
        const handleReceivedMessage = (msg) => {
            setReceverMessage(msg);
        };

        socket.on('receved_seller_message', handleReceivedMessage);

        return () => {
            socket.off('receved_seller_message', handleReceivedMessage);
        };
    }, []);

    // Cập nhật tin nhắn nhận được
    useEffect(() => {
        if (receverMessage) {
            if (receverMessage.senderId === sellerId && receverMessage.receverId === '') {
                dispatch(updateSellerMessage(receverMessage));
            } else {
                toast.success(`${receverMessage.senderName} đã gửi tin nhắn`);
                dispatch(messageClear());
            }
        }
    }, [receverMessage, sellerId, dispatch]);

    // Tự động cuộn xuống tin nhắn mới
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [seller_admin_message]);

    return (
        <div className="px-4 lg:px-8 py-6 h-[calc(100vh-80px)]">
            <div className="w-full bg-white rounded-xl shadow-lg h-full flex overflow-hidden">
                {/* Sidebar danh sách người bán */}
                <div className={`w-full md:w-64 bg-indigo-700 h-full absolute md:relative z-20 transition-all duration-300 ${showSidebar ? 'left-0' : '-left-full'} md:left-0`}>
                    <div className="p-4 border-b border-indigo-600 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">Người bán</h2>
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="md:hidden text-white hover:text-indigo-200"
                        >
                            <IoMdClose size={24} />
                        </button>
                    </div>

                    <div className="h-[calc(100%-60px)] overflow-y-auto">
                        {sellers.map((seller) => (
                            <Link
                                key={seller._id}
                                to={`/admin/chat-sellers/${seller._id}`}
                                className={`flex items-center gap-3 p-3 hover:bg-indigo-600 transition-colors ${sellerId === seller._id ? 'bg-indigo-600' : ''}`}
                            >
                                <div className="relative">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                        src={seller.image}
                                        alt={seller.name}
                                    />
                                    {activeSeller.some(a => a.sellerId === seller._id) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{seller.name}</p>
                                    <p className="text-indigo-200 text-xs truncate">
                                        {activeSeller.some(a => a.sellerId === seller._id) ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Phần chat chính */}
                <div className="flex-1 flex flex-col h-full bg-gray-50">
                    {sellerId ? (
                        <>
                            {/* Header chat */}
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowSidebar(true)}
                                        className="md:hidden text-gray-600 hover:text-indigo-600"
                                    >
                                        <FaUsers size={20} />
                                    </button>
                                    {currentSeller && (
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                                                    src={currentSeller.image}
                                                    alt={currentSeller.name}
                                                />
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{currentSeller.name}</h3>
                                                <p className="text-xs text-gray-500">Người bán</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nội dung chat */}
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                                {seller_admin_message.map((msg, i) => (
                                    <div
                                        key={i}
                                        ref={i === seller_admin_message.length - 1 ? scrollRef : null}
                                        className={`flex mb-4 ${msg.senderId === sellerId ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`flex max-w-[80%] ${msg.senderId === sellerId ? 'flex-row' : 'flex-row-reverse'}`}>
                                            <img
                                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                                src={msg.senderId === sellerId ? currentSeller.image : '/images/admin.png'}
                                                alt={msg.senderName}
                                            />
                                            <div className={`mx-2 p-3 rounded-lg ${msg.senderId === sellerId ? 'bg-white text-gray-800' : 'bg-indigo-600 text-white'}`}>
                                                <p>{msg.message}</p>
                                                <p className="text-xs mt-1 opacity-70 text-right">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Form gửi tin nhắn */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        type="text"
                                        placeholder="Nhập tin nhắn..."
                                    />
                                    <button
                                        type="submit"
                                        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <FaUsers className="text-4xl mb-2" />
                            <p className="text-lg">Vui lòng chọn người bán để bắt đầu trò chuyện</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatSeller;