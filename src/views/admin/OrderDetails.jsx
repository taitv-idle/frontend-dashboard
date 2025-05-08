import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    // Fetch order details when component mounts or orderId changes
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                await dispatch(get_admin_order(orderId));
            } catch (error) {
                toast.error('Lỗi khi tải chi tiết đơn hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, dispatch]);

    // Update local status when order data changes
    useEffect(() => {
        if (order?.delivery_status) {
            setStatus(order.delivery_status);
        }
    }, [order]);

    // Handle status update
    const status_update = (e) => {
        const newStatus = e.target.value;
        dispatch(admin_order_status_update({
            orderId,
            info: { status: newStatus }
        }));
        setStatus(newStatus);
    };

    // Show toast messages
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

    /**
     * Render status badge with appropriate color
     * @param {string} status - Order status
     * @returns {JSX.Element} - Styled status badge
     */
    const renderStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-500 text-yellow-100', label: 'Chờ xử lý' },
            processing: { color: 'bg-blue-500 text-blue-100', label: 'Đang xử lý' },
            warehouse: { color: 'bg-purple-500 text-purple-100', label: 'Trong kho' },
            placed: { color: 'bg-green-500 text-green-100', label: 'Đã đặt' },
            cancelled: { color: 'bg-red-500 text-red-100', label: 'Đã hủy' },
            delivered: { color: 'bg-green-600 text-green-100', label: 'Đã giao' }
        };

        const config = statusConfig[status] || { color: 'bg-gray-500 text-gray-100', label: status };

        return (
            <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
                {config.label}
            </span>
        );
    };

    /**
     * Safely format price with fallback for undefined/null values
     * @param {number} price - Price value
     * @returns {string} - Formatted price string
     */
    const formatPrice = (price) => {
        if (!price && price !== 0) return '$0';
        return `$${price.toLocaleString()}`;
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Error state - order not found
    if (!order || !order._id) {
        return (
            <div className="text-center py-10">
                <h3 className="text-xl text-indigo-200">Không tìm thấy đơn hàng</h3>
            </div>
        );
    }

    return (
        <div className='px-4 lg:px-8 pt-6'>
            <div className='w-full p-6 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl shadow-lg'>
                {/* Header with status selector */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-indigo-800 rounded-lg mb-6'>
                    <h2 className='text-xl font-semibold text-white'>Chi tiết đơn hàng</h2>
                    <select
                        onChange={status_update}
                        value={status}
                        className='px-4 py-2 focus:ring-2 focus:ring-white outline-none bg-indigo-600 border border-indigo-400 rounded-lg text-white hover:bg-indigo-700 transition-colors'
                    >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="warehouse">Trong kho</option>
                        <option value="placed">Đã đặt</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>

                {/* Order summary */}
                <div className='p-4 bg-indigo-800/50 rounded-lg mb-6'>
                    <div className='flex flex-wrap justify-between items-center gap-2 mb-4'>
                        <div className='flex items-center gap-2 text-lg text-white'>
                            <span className='font-medium'>Mã đơn hàng:</span>
                            <span>#{order._id}</span>
                        </div>
                        <div className='text-indigo-200'>
                            {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Shipping info */}
                        <div className='bg-indigo-900/50 p-4 rounded-lg'>
                            <h3 className='text-lg font-semibold text-white mb-3'>Thông tin giao hàng</h3>
                            <div className='space-y-2 text-indigo-100'>
                                <p className='font-medium'>{order.shippingInfo?.name || 'N/A'}</p>
                                <p className='text-sm'>
                                    {[
                                        order.shippingInfo?.address,
                                        order.shippingInfo?.area,
                                        order.shippingInfo?.city,
                                        order.shippingInfo?.province
                                    ].filter(Boolean).join(', ')}
                                </p>
                                <div className='flex items-center gap-2 mt-3'>
                                    <span className='font-medium'>Thanh toán:</span>
                                    {renderStatusBadge(order.payment_status || 'pending')}
                                </div>
                                <div className='mt-2'>
                                    <span className='font-medium'>Tổng giá trị:</span>
                                    <span className='ml-2 text-white font-bold'>
                                        {formatPrice(order.price)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main products */}
                        <div className='lg:col-span-2'>
                            <h3 className='text-lg font-semibold text-white mb-3'>Sản phẩm</h3>
                            <div className='space-y-4'>
                                {order.products?.length > 0 ? (
                                    order.products.map((p, i) => (
                                        <div key={i} className='flex gap-4 p-3 bg-indigo-900/30 rounded-lg hover:bg-indigo-900/50 transition-colors'>
                                            <img
                                                className='w-16 h-16 object-cover rounded-lg border border-indigo-400'
                                                src={p.images?.[0] || '/placeholder-product.png'}
                                                alt={p.name}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-product.png';
                                                }}
                                            />
                                            <div className='flex-1'>
                                                <h4 className='text-white font-medium'>{p.name || 'Sản phẩm không tên'}</h4>
                                                <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-indigo-200 mt-1'>
                                                    <span>Thương hiệu: {p.brand || 'N/A'}</span>
                                                    <span>Số lượng: {p.quantity || 0}</span>
                                                    <span>Giá: {formatPrice(p.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-indigo-200'>Không có sản phẩm nào</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-orders */}
                {order?.suborder?.length > 0 && (
                    <div className='p-4 bg-indigo-800/50 rounded-lg'>
                        <h3 className='text-lg font-semibold text-white mb-4'>Đơn hàng từ người bán</h3>
                        <div className='space-y-6'>
                            {order.suborder.map((o, i) => (
                                <div key={i} className='p-4 bg-indigo-900/30 rounded-lg'>
                                    <div className='flex justify-between items-center mb-3'>
                                        <h4 className='text-white font-medium'>Người bán {i + 1}</h4>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-indigo-200'>Trạng thái:</span>
                                            {renderStatusBadge(o.delivery_status || 'pending')}
                                        </div>
                                    </div>

                                    <div className='space-y-3'>
                                        {o.products?.length > 0 ? (
                                            o.products.map((p, j) => (
                                                <div key={j} className='flex gap-4 p-3 bg-indigo-900/10 rounded-lg'>
                                                    <img
                                                        className='w-14 h-14 object-cover rounded border border-indigo-400'
                                                        src={p.images?.[0] || '/placeholder-product.png'}
                                                        alt={p.name}
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-product.png';
                                                        }}
                                                    />
                                                    <div className='flex-1'>
                                                        <h5 className='text-white text-sm font-medium'>{p.name || 'Sản phẩm không tên'}</h5>
                                                        <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-indigo-200 mt-1'>
                                                            <span>Thương hiệu: {p.brand || 'N/A'}</span>
                                                            <span>Số lượng: {p.quantity || 0}</span>
                                                            <span>Giá: {formatPrice(p.price)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className='text-indigo-200 text-sm'>Không có sản phẩm nào</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;