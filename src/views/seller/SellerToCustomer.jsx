import React, { useEffect, useRef, useState } from 'react';
import { FaList, FaPaperclip } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { BsCheck2All, BsEmojiSmile } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { get_customer_message, get_customers, messageClear, send_message, updateMessage } from '../../store/Reducers/chatReducer';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { socket } from '../../utils/utils';
import {FiSend} from "react-icons/fi";

/**
 * Component Chat giữa Seller và Customer
 * Thiết kế hiện đại với giao diện thân thiện người dùng
 */
const SellerToCustomer = () => {
    const scrollRef = useRef();
    const [showSidebar, setShowSidebar] = useState(false);
    const { userInfo } = useSelector(state => state.auth);
    const { customers, messages, currentCustomer, successMessage } = useSelector(state => state.chat);
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const { customerId } = useParams();
    const dispatch = useDispatch();

    // Lấy danh sách khách hàng
    useEffect(() => {
        dispatch(get_customers(userInfo._id));
    }, [dispatch, userInfo._id]);

    // Lấy tin nhắn khi customerId thay đổi
    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId));
        }
    }, [customerId, dispatch]);

    // Gửi tin nhắn
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            dispatch(send_message({
                senderId: userInfo._id,
                receverId: customerId,
                text: message,
                name: userInfo?.shopInfo?.shopName
            }));
            setMessage('');
        }
    };

    // Xử lý tin nhắn thành công
    useEffect(() => {
        if (successMessage) {
            socket.emit('send_seller_message', messages[messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, messages, dispatch]);

    // Lắng nghe tin nhắn từ khách hàng
    useEffect(() => {
        socket.on('customer_message', (msg) => {
            setReceivedMessage(msg);
        });

        return () => {
            socket.off('customer_message');
        };
    }, []);

    // Cập nhật tin nhắn nhận được
    useEffect(() => {
        if (receivedMessage) {
            if (customerId === receivedMessage.senderId && userInfo._id === receivedMessage.receverId) {
                dispatch(updateMessage(receivedMessage));
            } else {
                toast.success(`${receivedMessage.senderName} gửi một tin nhắn`);
            }
        }
    }, [receivedMessage, customerId, userInfo._id, dispatch]);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar danh sách khách hàng */}
            <div className={`fixed md:relative z-20 w-64 h-full bg-white shadow-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Khách hàng</h2>
                    <button
                        onClick={() => setShowSidebar(false)}
                        className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-120px)]">
                    {customers.map((customer) => (
                        <Link
                            key={customer.fdId}
                            to={`/seller/dashboard/chat-customer/${customer.fdId}`}
                            className={`flex items-center p-3 hover:bg-blue-50 ${customerId === customer.fdId ? 'bg-blue-100' : ''}`}
                        >
                            <div className="relative mr-3">
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                    src={customer.avatar || "http://localhost:3001/images/default-avatar.jpg"}
                                    alt={customer.name}
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
                                <p className="text-xs text-gray-500 truncate">...</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Phần chat chính */}
            <div className="flex-1 flex flex-col">
                {/* Header chat */}
                <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="mr-4 md:hidden text-gray-500 hover:text-gray-700"
                        >
                            <FaList size={18} />
                        </button>
                        {currentCustomer && (
                            <div className="flex items-center">
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-green-400 object-cover mr-3"
                                    src={currentCustomer.avatar || "http://localhost:3001/images/default-avatar.jpg"}
                                    alt={currentCustomer.name}
                                />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{currentCustomer.name}</h2>
                                    <p className="text-xs text-gray-500">Đang trực tuyến</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Khung chat */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    {customerId ? (
                        messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    ref={scrollRef}
                                    className={`flex mb-4 ${msg.senderId === userInfo._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.senderId === userInfo._id
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 shadow rounded-bl-none border border-gray-200'}`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                                            {msg.senderId === userInfo._id && (
                                                <BsCheck2All className="text-xs" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Bắt đầu cuộc trò chuyện với khách hàng
                            </div>
                        )
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <img
                                src="http://localhost:3001/images/select-customer.svg"
                                alt="Select customer"
                                className="w-32 h-32 mb-4"
                            />
                            <p>Vui lòng chọn khách hàng để bắt đầu trò chuyện</p>
                        </div>
                    )}
                </div>

                {/* Form gửi tin nhắn */}
                {customerId && (
                    <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                                <FaPaperclip />
                            </button>
                            <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                                <BsEmojiSmile />
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 mx-2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tin nhắn..."
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SellerToCustomer;