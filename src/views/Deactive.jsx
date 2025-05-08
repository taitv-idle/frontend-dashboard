import React from 'react';
import { FaLock, FaEnvelope, FaHeadset } from 'react-icons/fa';

const Deactive = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <FaLock className="text-red-500 text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">Tài khoản của bạn đã bị vô hiệu hóa</h1>

                <p className="text-gray-600 mb-6">
                    Rất tiếc, tài khoản của bạn hiện không thể truy cập. Điều này có thể do vi phạm điều khoản dịch vụ.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                    <p className="text-yellow-700">
                        Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.
                    </p>
                </div>

                <div className="space-y-4">
                    <a
                        href="mailto:support@example.com"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        <FaEnvelope />
                        Liên hệ qua Email: truongvantai@example.com
                    </a>

                    <a
                        href="tel:+1234567890"
                        className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg transition-colors"
                    >
                        <FaHeadset />
                        Gọi hỗ trợ: 123 456-7890
                    </a>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    Mã lỗi: DEACTIVATED_ACCOUNT_001
                </p>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} TruongVanTai. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
    );
};

export default Deactive;