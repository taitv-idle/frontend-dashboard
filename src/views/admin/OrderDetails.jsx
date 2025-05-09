import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    // Hàm xử lý URL hình ảnh
    const getImageUrl = (image) => {
        if (!image) return '/placeholder-product.png';
        
        // Nếu là URL đầy đủ
        if (typeof image === 'string' && image.startsWith('http')) {
            return image;
        }
        
        // Nếu là object từ Cloudinary
        if (typeof image === 'object' && image.url) {
            return image.url;
        }
        
        // Nếu là object từ Cloudinary với secure_url
        if (typeof image === 'object' && image.secure_url) {
            return image.secure_url;
        }
        
        // Nếu là object từ Cloudinary với public_id
        if (typeof image === 'object' && image.public_id) {
            return `https://res.cloudinary.com/your-cloud-name/image/upload/${image.public_id}`;
        }
        
        return '/placeholder-product.png';
    };

    // Fetch order details when component mounts or orderId changes
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const result = await dispatch(get_admin_order(orderId));
                console.log('Order data:', result.payload.order);
                console.log('Product details:', result.payload.order.products[0].productId);
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
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'warehouse':
                return 'bg-purple-100 text-purple-800';
            case 'placed':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'processing':
                return 'Đang xử lý';
            case 'warehouse':
                return 'Trong kho';
            case 'placed':
                return 'Đã đặt';
            case 'delivered':
                return 'Đã giao';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    /**
     * Safely format price with fallback for undefined/null values
     * @param {number} price - Price value
     * @returns {string} - Formatted price string
     */
    const formatPrice = (price) => {
        if (!price && price !== 0) return '0 ₫';
        return `${price.toLocaleString('vi-VN')} ₫`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'cod':
                return 'Thanh toán khi nhận hàng (COD)';
            case 'stripe':
                return 'Thanh toán online (Stripe)';
            default:
                return method;
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ thanh toán';
            case 'paid':
                return 'Đã thanh toán';
            case 'unpaid':
                return 'Chưa thanh toán';
            default:
                return status;
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
        <div className="px-4 lg:px-8 py-6">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                        <div className="flex items-center mt-2 text-gray-600">
                            <span className="mr-4">Mã đơn: #{order._id}</span>
                            <span>Ngày: {formatDate(order.date)}</span>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <select
                            value={order.delivery_status}
                            onChange={(e) => status_update(e)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="warehouse">Trong kho</option>
                            <option value="placed">Đã đặt</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                {/* Thông tin chính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Thông tin giao hàng và sản phẩm */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <FiTruck className="mr-2 text-indigo-600" />
                                Thông tin giao hàng
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p><span className="font-medium">Người nhận:</span> {order.shippingAddress?.name || 'N/A'}</p>
                                <p><span className="font-medium">SĐT:</span> {order.shippingAddress?.phone || 'N/A'}</p>
                                <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress?.address || 'N/A'}</p>
                                <p><span className="font-medium">Tỉnh/Thành:</span> {order.shippingAddress?.province || 'N/A'}</p>
                                <p><span className="font-medium">Quận/Huyện:</span> {order.shippingAddress?.city || 'N/A'}</p>
                                <p><span className="font-medium">Phường/Xã:</span> {order.shippingAddress?.area || 'N/A'}</p>
                                {order.shippingAddress?.post && (
                                    <p><span className="font-medium">Mã bưu điện:</span> {order.shippingAddress.post}</p>
                                )}
                            </div>
                        </div>

                        {/* Sản phẩm đã đặt */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sản phẩm đã đặt</h3>
                            <div className="space-y-4">
                                {order.products?.map((product, index) => (
                                    <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex-shrink-0 w-20 h-20">
                                            <img
                                                src={getImageUrl(product.productId?.images?.[0])}
                                                alt={product.productId?.name}
                                                className="w-full h-full object-cover rounded-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 ml-4">
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.productId?.name || 'Sản phẩm không tên'}</p>
                                            <p className="text-sm text-gray-500">Thương hiệu: {product.productId?.brand || 'N/A'}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <p className="text-sm text-gray-500">Số lượng: {product.productId?.quantity || 0}</p>
                                                    <div className="flex items-center space-x-2">
                                                        {product.productId?.discount > 0 && (
                                                            <p className="text-sm text-gray-500 line-through">
                                                                {formatPrice(product.productId?.price || 0)}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            Đơn giá: {formatPrice(product.productId?.discount ? (product.productId?.price * (1 - product.productId?.discount/100)) : product.productId?.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-indigo-600">
                                                    Thành tiền: {formatPrice((product.productId?.discount ? (product.productId?.price * (1 - product.productId?.discount/100)) : product.productId?.price) * (product.productId?.quantity || 0))}
                                                </p>
                                            </div>
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

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="font-medium">{formatPrice(order.price - (order.shipping_fee || 0))}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-medium">{formatPrice(order.shipping_fee || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                    <span className="text-lg font-semibold text-indigo-600">{formatPrice(order.price)}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Trạng thái thanh toán</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                                        <p className="font-medium">{getPaymentMethodText(order.payment_method)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(order.payment_status)}`}>
                                            {getPaymentStatusText(order.payment_status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Trạng thái đơn hàng</h4>
                                <div className="flex items-center">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                                        {getStatusIcon(status)}
                                        {getStatusText(status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Đơn hàng từ người bán */}
                {order.suborder && order.suborder.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng từ người bán</h3>
                        <div className="space-y-6">
                            {order.suborder.map((sellerOrder, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Người bán {index + 1}</h4>
                                            <p className="text-sm text-gray-500">Mã đơn: #{sellerOrder._id}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(sellerOrder.payment_status)}`}>
                                                    {getPaymentStatusText(sellerOrder.payment_status)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Trạng thái giao hàng</p>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(sellerOrder.delivery_status)}`}>
                                                    {getStatusIcon(sellerOrder.delivery_status)}
                                                    {getStatusText(sellerOrder.delivery_status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {sellerOrder.products?.map((product, pIndex) => (
                                            <div key={pIndex} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0 w-16 h-16">
                                                    <img
                                                        src={getImageUrl(product.productId?.images?.[0])}
                                                        alt={product.productId?.name}
                                                        className="w-full h-full object-cover rounded-md"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/placeholder-product.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 ml-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{product.productId?.name || 'Sản phẩm không tên'}</p>
                                                    <p className="text-sm text-gray-500">Thương hiệu: {product.productId?.brand || 'N/A'}</p>
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <p className="text-sm text-gray-500">Số lượng: {product.productId?.quantity || 0}</p>
                                                            <div className="flex items-center space-x-2">
                                                                {product.productId?.discount > 0 && (
                                                                    <p className="text-sm text-gray-500 line-through">
                                                                        {formatPrice(product.productId?.price || 0)}
                                                                    </p>
                                                                )}
                                                                <p className="text-sm text-gray-500">
                                                                    Đơn giá: {formatPrice(product.productId?.discount ? (product.productId?.price * (1 - product.productId?.discount/100)) : product.productId?.price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-medium text-indigo-600">
                                                            Thành tiền: {formatPrice((product.productId?.discount ? (product.productId?.price * (1 - product.productId?.discount/100)) : product.productId?.price) * (product.productId?.quantity || 0))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500">Tổng tiền đơn hàng:</p>
                                            <p className="text-lg font-medium text-gray-900">{formatPrice(sellerOrder.price)}</p>
                                        </div>
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