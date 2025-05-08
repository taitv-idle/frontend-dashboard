import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    get_seller_message,
    send_message_seller_admin,
    updateAdminMessage,
    messageClear
} from '../../store/Reducers/chatReducer';
import { socket } from '../../utils/utils';
import { FiSend } from 'react-icons/fi';
import { BsCheck2All } from 'react-icons/bs';

/**
 * Component Chat giữa Seller và Admin
 * Giao diện được thiết kế lại với màu sắc chuyên nghiệp và trải nghiệm người dùng tốt hơn
 */
const SellerToAdmin = () => {
    const scrollRef = useRef(); // Ref để tự động cuộn xuống tin nhắn mới
    const dispatch = useDispatch();
    const [message, setMessage] = useState(''); // State lưu nội dung tin nhắn
    const { seller_admin_message, successMessage } = useSelector(state => state.chat);
    const { userInfo } = useSelector(state => state.auth);

    // Lấy danh sách tin nhắn khi component mount
    useEffect(() => {
        dispatch(get_seller_message());
    }, [dispatch]);

    // Lắng nghe tin nhắn mới từ socket
    useEffect(() => {
        socket.on('receved_admin_message', msg => {
            dispatch(updateAdminMessage(msg));
        });

        return () => {
            socket.off('receved_admin_message'); // Clean up khi component unmount
        };
    }, [dispatch]);

    // Gửi tin nhắn mới qua socket khi có tin nhắn mới
    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_seller_to_admin', seller_admin_message[seller_admin_message.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, seller_admin_message, dispatch]);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [seller_admin_message]);

    /**
     * Hàm gửi tin nhắn
     * @param {Event} e - Event form submit
     */
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            dispatch(send_message_seller_admin({
                senderId: userInfo._id,
                receverId: '',
                message: message,
                senderName: userInfo.name
            }));
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full p-4 bg-gray-50 rounded-lg shadow-sm">
            {/* Header chat */}
            <div className="flex items-center p-4 bg-white rounded-t-lg border-b">
                <div className="relative mr-3">
                    <img
                        className="w-12 h-12 border-2 border-green-400 rounded-full object-cover"
                        src="http://localhost:3001/images/admin.png"
                        alt="Admin Avatar"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Hỗ trợ Admin</h2>
                    <p className="text-xs text-gray-500">Trực tuyến</p>
                </div>
            </div>

            {/* Khung hiển thị tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
                <div className="space-y-3">
                    {seller_admin_message.map((msg, index) => (
                        <div
                            key={index}
                            ref={scrollRef}
                            className={`flex ${msg.senderId === userInfo._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.senderId === userInfo._id
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                            >
                                <p className="text-sm">{msg.message}</p>
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
                    ))}
                </div>
            </div>

            {/* Form gửi tin nhắn */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white rounded-b-lg border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tin nhắn..."
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSend className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerToAdmin;