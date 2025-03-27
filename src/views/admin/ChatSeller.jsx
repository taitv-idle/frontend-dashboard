import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaList, FaPaperPlane } from "react-icons/fa";

const ChatSeller = () => {
    const [show, setShow] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(1); // Người bán đang được chọn (mặc định là ID 1)
    const [messages, setMessages] = useState([
        { id: 1, sender: 'seller', text: 'Tin nhắn 1', time: '10:30 AM' },
        { id: 2, sender: 'admin', text: 'Chào bạn, tôi có thể giúp gì?', time: '10:32 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Danh sách người bán mẫu
    const sellers = [
        { id: 1, name: 'Bùi Thị C', lastMessage: 'Tin nhắn 1', time: '10:30 AM' },
        { id: 2, name: 'Bùi Thị A', lastMessage: 'Hỏi về thanh toán', time: '9:15 AM' },
        { id: 3, name: 'Bùi Thị H', lastMessage: 'Cảm ơn hỗ trợ', time: 'Yesterday' },
    ];

    // Xử lý gửi tin nhắn
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, {
                id: messages.length + 1,
                sender: 'admin',
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setNewMessage('');
        }
    };

    // Lấy thông tin người bán đang chat
    const currentSeller = sellers.find(seller => seller.id === selectedSeller);

    return (
        <div className='px-2 lg:px-7 py-5 min-h-screen bg-[#f1f5f9]'>
            <div className='w-full bg-white rounded-md shadow-sm h-[calc(100vh-140px)] flex flex-col lg:flex-row'>
                {/* Danh sách người bán */}
                <div
                    className={`w-72 h-full bg-white border-r border-gray-200 transition-all duration-300 
                        ${show ? 'absolute z-10 left-0' : 'absolute -left-72 lg:static lg:left-0'} 
                        lg:w-1/3`}
                >
                    <div className='h-[calc(100vh-177px)] overflow-y-auto'>
                        <div className='flex justify-between items-center p-4 text-[#1e293b]'>
                            <h2 className='text-lg font-semibold'>Người bán</h2>
                            <button
                                onClick={() => setShow(false)}
                                className='text-gray-600 hover:text-gray-800 lg:hidden'
                            >
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <div className='space-y-2 px-3'>
                            {sellers.map((seller) => (
                                <div
                                    key={seller.id}
                                    onClick={() => {
                                        setSelectedSeller(seller.id);
                                        setShow(false); // Ẩn danh sách trên mobile khi chọn
                                    }}
                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                                        selectedSeller === seller.id ? 'bg-indigo-100 border-l-4 border-indigo-500' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div className='relative'>
                                        <img
                                            className='w-10 h-10 rounded-full object-cover border-2 border-gray-300'
                                            src="/images/seller.png"
                                            alt={seller.name}
                                        />
                                        <div className='w-3 h-3 bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-800'>{seller.name}</p>
                                        <p className='text-xs text-gray-500 truncate'>{seller.lastMessage}</p>
                                    </div>
                                    <span className='text-xs text-gray-400'>{seller.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Khu vực chat */}
                <div className='flex-1 flex flex-col relative'>
                    {/* Toggle trên mobile */}
                    <div className='p-3 border-b border-gray-200 flex justify-between items-center lg:hidden'>
                        <button
                            onClick={() => setShow(true)}
                            className='text-indigo-600'
                        >
                            <FaList size={20} />
                        </button>
                        {currentSeller && (
                            <div className='flex items-center gap-2'>
                                <div className='relative'>
                                    <img
                                        className='w-10 h-10 rounded-full object-cover border-2 border-gray-300'
                                        src="/images/seller.png"
                                        alt={currentSeller.name}
                                    />
                                    <div className='w-3 h-3 bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                                </div>
                                <h2 className='text-sm font-semibold text-gray-800'>{currentSeller.name}</h2>
                            </div>
                        )}
                    </div>

                    {/* Header trên desktop */}
                    <div className='hidden lg:flex justify-between items-center p-4 border-b border-gray-200'>
                        {currentSeller && (
                            <div className='flex items-center gap-3'>
                                <div className='relative'>
                                    <img
                                        className='w-12 h-12 rounded-full object-cover border-2 border-gray-300'
                                        src="/images/seller.png"
                                        alt={currentSeller.name}
                                    />
                                    <div className='w-3 h-3 bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                                </div>
                                <h2 className='text-lg font-semibold text-gray-800'>{currentSeller.name}</h2>
                            </div>
                        )}
                    </div>

                    {/* Tin nhắn */}
                    <div className='flex-1 p-4 overflow-y-auto max-h-[calc(100vh-240px)] bg-gray-50'>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                {msg.sender === 'seller' && (
                                    <img
                                        className='w-8 h-8 rounded-full object-cover mr-2 mt-1'
                                        src="/images/seller.png"
                                        alt="Seller"
                                    />
                                )}
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg text-sm ${
                                        msg.sender === 'admin' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <p>{msg.text}</p>
                                    <span className='text-xs opacity-75 block mt-1'>{msg.time}</span>
                                </div>
                                {msg.sender === 'admin' && (
                                    <img
                                        className='w-8 h-8 rounded-full object-cover ml-2 mt-1'
                                        src="/images/admin.png"
                                        alt="Admin"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Ô nhập tin nhắn */}
                    <form onSubmit={handleSendMessage} className='p-4 border-t border-gray-200 bg-white'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='text'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder='Nhập tin nhắn...'
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none'
                            />
                            <button
                                type='submit'
                                className='p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
                            >
                                <FaPaperPlane size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatSeller;