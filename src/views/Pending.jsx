import React from 'react';
import { FaClock, FaEnvelope, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Pending = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <FaClock className="text-yellow-500 text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">Tài khoản đang chờ phê duyệt</h1>

                <p className="text-gray-600 mb-6">
                    Tài khoản của bạn đang trong quá trình xét duyệt. Chúng tôi sẽ thông báo cho bạn qua email khi tài khoản được kích hoạt.
                </p>

                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                    <div className="flex items-start mb-3">
                        <FaEnvelope className="text-blue-500 mt-1 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-800">Kiểm tra email</h3>
                            <p className="text-sm text-gray-600">
                                Vui lòng kiểm tra hộp thư email bạn đã đăng ký để nhận thông báo.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <FaHeadset className="text-blue-500 mt-1 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-800">Hỗ trợ</h3>
                            <p className="text-sm text-gray-600">
                                Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    to="/contact"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Liên hệ hỗ trợ
                </Link>

                <p className="text-sm text-gray-500 mt-6">
                    Thời gian xét duyệt thường từ 1-3 ngày làm việc.
                </p>
            </div>
        </div>
    );
};

export default Pending;