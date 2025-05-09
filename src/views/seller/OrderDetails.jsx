import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');

    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        setStatus(order?.delivery_status);
    }, [order]);

    useEffect(() => {
        dispatch(get_seller_order(orderId));
    }, [orderId, dispatch]);

    const status_update = (e) => {
        dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }));
        setStatus(e.target.value);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock className="mr-2" />;
            case 'processing': return <FiPackage className="mr-2" />;
            case 'warehouse': return <FiPackage className="mr-2" />;
            case 'placed': return <FiTruck className="mr-2" />;
            case 'cancelled': return <FiXCircle className="mr-2" />;
            case 'delivered': return <FiCheckCircle className="mr-2" />;
            default: return <FiClock className="mr-2" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'warehouse': return 'bg-purple-100 text-purple-800';
            case 'placed': return 'bg-indigo-100 text-indigo-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="px-4 lg:px-8 py-6">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                        <div className="flex items-center mt-2 text-gray-600">
                            <span className="mr-4">Mã đơn: #{order?._id || 'N/A'}</span>
                            <span>Ngày: {order?.date || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <select
                            onChange={status_update}
                            value={status}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="warehouse">Tại kho</option>
                            <option value="placed">Đang giao</option>
                            <option value="cancelled">Đã hủy</option>
                            <option value="delivered">Đã giao</option>
                        </select>
                    </div>
                </div>

                {/* Thông tin chính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Thông tin giao hàng */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <FiTruck className="mr-2 text-indigo-600" />
                                Thông tin giao hàng
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p><span className="font-medium">Người nhận:</span> {order?.shippingInfo?.name || 'N/A'}</p>
                                <p><span className="font-medium">Địa chỉ:</span> {order?.shippingInfo?.address || 'N/A'}</p>
                                <p><span className="font-medium">SĐT:</span> {order?.shippingInfo?.phone || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Sản phẩm */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sản phẩm đã đặt</h3>
                            <div className="space-y-4">
                                {order?.products?.map((p, i) => (
                                    <div key={i} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <img
                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                            src={p?.images?.[0] || '/placeholder-image.png'}
                                            alt={p?.name || 'Product image'}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{p?.name || 'Unnamed Product'}</h4>
                                            <p className="text-sm text-gray-600">Thương hiệu: {p?.brand || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Số lượng: {p?.quantity || 0}</p>
                                            <p className="text-sm font-medium text-indigo-600 mt-1">
                                                ${((p?.price || 0) * (p?.quantity || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-4 rounded-lg sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span>${order.price?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between font-medium text-gray-800 border-t pt-3">
                                    <span>Tổng cộng:</span>
                                    <span>${order.price?.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Trạng thái thanh toán</h4>
                                <span className={`px-3 py-1 rounded-full text-sm ${order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {order.payment_status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Trạng thái đơn hàng</h4>
                                <div className="flex items-center">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                                        {getStatusIcon(status)}
                                        {status === 'pending' && 'Chờ xử lý'}
                                        {status === 'processing' && 'Đang xử lý'}
                                        {status === 'warehouse' && 'Tại kho'}
                                        {status === 'placed' && 'Đang giao'}
                                        {status === 'cancelled' && 'Đã hủy'}
                                        {status === 'delivered' && 'Đã giao'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;