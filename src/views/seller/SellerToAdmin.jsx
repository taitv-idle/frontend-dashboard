import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    get_seller_message,
    send_message_seller_admin,
    updateAdminMessage,
    messageClear
} from '../../store/Reducers/chatReducer';
import { socket } from '../../utils/utils';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import { BsCheck2All } from 'react-icons/bs';
import moment from 'moment';
import 'moment/locale/vi';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

moment.locale('vi');

/**
 * Component Chat giữa Seller và Admin
 * Giao diện được thiết kế lại với màu sắc chuyên nghiệp và trải nghiệm người dùng tốt hơn
 */
const SellerToAdmin = () => {
    const scrollRef = useRef();
    const emojiPickerRef = useRef(null);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { seller_admin_message, successMessage } = useSelector(state => state.chat);
    const { userInfo } = useSelector(state => state.auth);

    // Đóng emoji picker khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Thêm emoji vào tin nhắn
    const addEmoji = (emoji) => {
        setMessage(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

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
            socket.off('receved_admin_message');
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

    // Nhóm tin nhắn theo ngày
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(msg => {
            const date = moment(msg.createdAt).format('YYYY-MM-DD');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return groups;
    };

    const messageGroups = groupMessagesByDate(seller_admin_message);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            dispatch(send_message_seller_admin({
                senderId: userInfo._id,
                receverId: '',
                message: message,
                text: message,
                senderName: userInfo.name
            }));
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header chat */}
            <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-center">
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
            </div>

            {/* Khung hiển thị tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {seller_admin_message.length > 0 ? (
                    Object.entries(messageGroups).map(([date, msgs]) => (
                        <div key={date} className="mb-6">
                            <div className="flex justify-center mb-4">
                                <span className="px-4 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                                    {moment(date).format('DD/MM/YYYY')}
                                </span>
                            </div>
                            {msgs.map((msg, index) => (
                                <div
                                    key={index}
                                    ref={index === msgs.length - 1 ? scrollRef : null}
                                    className={`flex mb-4 ${msg.senderId === userInfo._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                            msg.senderId === userInfo._id
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 shadow rounded-bl-none border border-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            {msg.message || msg.text}
                                        </p>
                                        <div className="flex items-center justify-end mt-1 space-x-1">
                                            <span className="text-xs opacity-70">
                                                {moment(msg.createdAt).format('HH:mm')}
                                            </span>
                                            {msg.senderId === userInfo._id && (
                                                <BsCheck2All className="text-xs" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <img
                            src="http://localhost:3001/images/chat-empty.svg"
                            alt="Empty chat"
                            className="w-32 h-32 mb-4"
                        />
                        <p>Bắt đầu trò chuyện với Admin</p>
                    </div>
                )}
            </div>

            {/* Form gửi tin nhắn */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
                <div className="flex items-center">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                        <FiPaperclip size={20} />
                    </button>
                    <div className="relative" ref={emojiPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <FiSmile size={20} />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 z-50">
                                <Picker
                                    data={data}
                                    onEmojiSelect={addEmoji}
                                    theme="light"
                                    set="native"
                                    previewPosition="none"
                                    skinTonePosition="none"
                                />
                            </div>
                        )}
                    </div>
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
                        <FiSend size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerToAdmin;