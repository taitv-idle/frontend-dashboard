import React from 'react';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UnAuthorized = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
        >
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <FaLock className="text-red-500 text-4xl" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Truy cập bị từ chối</h1>
                <p className="text-gray-600 mb-6">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
                </p>
                <div className="flex flex-col space-y-3">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        to="/contact"
                        className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                    >
                        Liên hệ hỗ trợ
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default UnAuthorized;