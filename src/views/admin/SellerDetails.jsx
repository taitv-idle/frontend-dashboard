import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller, seller_status_update, messageClear } from '../../store/Reducers/sellerReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';

const SellerDetails = () => {
    const dispatch = useDispatch();
    const { seller, successMessage, loading } = useSelector(state => state.seller);
    const { sellerId } = useParams();

    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(get_seller(sellerId));
    }, [sellerId, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (seller) {
            setStatus(seller.status);
        }
    }, [seller]);

    const handleStatusSubmit = async (e) => {
        e.preventDefault();
        if (!status) {
            toast.error('Vui lòng chọn trạng thái');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(seller_status_update({
                sellerId,
                status
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm hiển thị trạng thái với màu sắc
    const renderStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', label: 'Hoạt động' },
            deactive: { color: 'bg-red-100 text-red-800', label: 'Ngừng hoạt động' },
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Chờ duyệt' }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

        return (
            <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // Hàm hiển thị trạng thái thanh toán
    const renderPaymentStatus = (payment) => {
        return payment === 'paid' ? (
            <span className="text-green-600 font-medium">Đã thanh toán</span>
        ) : (
            <span className="text-yellow-600 font-medium">Chưa thanh toán</span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <PropagateLoader color="#6a5fdf" cssOverride={overrideStyle} />
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="px-4 lg:px-8 py-6">
                <div className="text-center py-10">
                    <p className="text-lg text-gray-600">Không tìm thấy thông tin người bán</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chi tiết Người bán</h1>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Ảnh đại diện */}
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-[250px] h-[250px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {seller.image ? (
                                <img
                                    src={seller.image}
                                    alt={seller.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-400 text-center p-4">
                                    <p>Không có ảnh</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-3 text-gray-800">Thông tin cơ bản</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Họ tên:</span>
                                    <span className="font-medium">{seller.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{seller.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vai trò:</span>
                                    <span className="font-medium capitalize">{seller.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    {renderStatusBadge(seller.status)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thanh toán:</span>
                                    {renderPaymentStatus(seller.payment)}
                                </div>
                            </div>
                        </div>

                        {/* Thông tin cửa hàng */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-3 text-gray-800">Thông tin cửa hàng</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tên cửa hàng:</span>
                                    <span className="font-medium">{seller.shopInfo?.shopName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tỉnh/Thành phố:</span>
                                    <span className="font-medium">{seller.shopInfo?.division || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quận/Huyện:</span>
                                    <span className="font-medium">{seller.shopInfo?.district || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phường/Xã:</span>
                                    <span className="font-medium">{seller.shopInfo?.sub_district || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form cập nhật trạng thái */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <form onSubmit={handleStatusSubmit}>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="flex-1">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Cập nhật trạng thái
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">-- Chọn trạng thái --</option>
                                    <option value="active">Hoạt động</option>
                                    <option value="deactive">Ngừng hoạt động</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`mt-2 sm:mt-6 px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                            >
                                {isSubmitting ? (
                                    <PropagateLoader color="#ffffff" cssOverride={overrideStyle} size={10} />
                                ) : (
                                    'Cập nhật'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;