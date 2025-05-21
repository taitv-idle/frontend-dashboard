import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  confirm_payment_request, 
  get_payment_request, 
  get_admin_payment_history,
  get_payment_overview,
  messageClear 
} from '../../store/Reducers/PaymentReducer';
import moment from 'moment';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';

// Tỷ giá USD/VND
const USD_TO_VND_RATE = 22000;

const PaymentRequest = () => {
    const dispatch = useDispatch();
    const { 
      successMessage, 
      errorMessage, 
      pendingWithdrows, 
      paymentHistory,
      loader 
    } = useSelector(state => state.payment);
    
    const [paymentId, setPaymentId] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'history'
    
    // Pagination and filter states
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        if (activeTab === 'pending') {
            dispatch(get_payment_request());
        } else if (activeTab === 'history') {
            dispatch(get_admin_payment_history({
                page: currentPage,
                search: searchTerm,
                status: statusFilter
            }));
        }
    }, [dispatch, activeTab, currentPage, searchTerm, statusFilter]);

    // Calculate total revenue for a seller
    const calculateSellerRevenue = useCallback((orders) => {
        if (!orders) return 0;
        
        return orders
            .filter(order => order.payment_status === 'paid' || order.payment_status === 'completed')
            .reduce((total, order) => {
                // Calculate product total with discounts
                const productTotal = order.products?.reduce((total, product) => {
                    const price = product.price || 0;
                    const quantity = product.quantity || 0;
                    const discount = product.discount || 0;
                    return total + (price * quantity * (1 - discount/100));
                }, 0) || 0;

                // Add shipping fee if total is less than 500,000
                const shippingFee = productTotal < 500000 ? 40000 : 0;
                
                // Add order discount if exists
                const orderDiscount = order.discount || 0;
                
                return total + productTotal + shippingFee - orderDiscount;
            }, 0);
    }, []);

    // Calculate monthly revenue
    const calculateMonthlyRevenue = useCallback((orders, month, year) => {
        if (!orders) return 0;
        
        return orders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return (orderDate.getMonth() + 1 === month && 
                        orderDate.getFullYear() === year &&
                        (order.payment_status === 'paid' || order.payment_status === 'completed'));
            })
            .reduce((total, order) => {
                const productTotal = order.products?.reduce((total, product) => {
                    const price = product.price || 0;
                    const quantity = product.quantity || 0;
                    const discount = product.discount || 0;
                    return total + (price * quantity * (1 - discount/100));
                }, 0) || 0;

                const shippingFee = productTotal < 500000 ? 40000 : 0;
                const orderDiscount = order.discount || 0;
                
                return total + productTotal + shippingFee - orderDiscount;
            }, 0);
    }, []);

    // Calculate growth rate
    const calculateGrowthRate = useCallback((currentMonth, lastMonth) => {
        if (lastMonth === 0) return 100;
        return ((currentMonth - lastMonth) / lastMonth) * 100;
    }, []);

    // Calculate available balance for a seller
    const calculateSellerAvailableBalance = useCallback((seller) => {
        const totalRevenue = calculateSellerRevenue(seller.orders);
        const totalWithdrawn = seller.withdrawnAmount || 0;
        const totalPending = seller.pendingAmount || 0;
        return totalRevenue - totalWithdrawn - totalPending;
    }, [calculateSellerRevenue]);

    // Handle search input with debounce
    const handleSearch = (e) => {
        const value = e.target.value;
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        setSearchTimeout(setTimeout(() => {
            setSearchTerm(value);
            setCurrentPage(1); // Reset to first page on new search
        }, 500));
    };

    const confirmRequest = (id, amountInVND) => {
        setPaymentId(id);
        // Chuyển đổi số tiền VND sang USD cho Stripe
        const amount = amountInVND || 0;
        const amountInUSD = (amount / USD_TO_VND_RATE).toFixed(2);
        dispatch(confirm_payment_request({ 
            paymentId: id, 
            amountInVND: amount,
            amountInUSD: parseFloat(amountInUSD)
        }));
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

    // Hàm hiển thị trạng thái với màu sắc
    const renderStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Chờ xử lý' },
            success: { color: 'bg-green-100 text-green-800', label: 'Đã xác nhận' },
            confirmed: { color: 'bg-green-100 text-green-800', label: 'Đã xác nhận' },
            failed: { color: 'bg-red-100 text-red-800', label: 'Đã từ chối' },
            rejected: { color: 'bg-red-100 text-red-800', label: 'Đã từ chối' }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // Hàm hiển thị số tiền
    const renderAmount = (request) => {
        const amountInVND = request.amount || 0;
        const amountInUSD = (amountInVND / USD_TO_VND_RATE).toFixed(2);
        
        return (
            <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                    {amountInVND.toLocaleString('vi-VN')} ₫
                </span>
                <span className="text-sm text-gray-500">
                    ≈ {amountInUSD} USD
                </span>
            </div>
        );
    };
    
    // Render pagination controls
    const renderPagination = () => {
        const { pagination } = paymentHistory;
        const totalPages = pagination?.totalPages || 1;
        
        return (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div>
                    <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{paymentHistory.withdrawals?.length || 0}</span> trong tổng số{' '}
                        <span className="font-medium">{pagination?.totalItems || 0}</span> giao dịch
                    </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                            currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Trước
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                            currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        );
    };
    
    // Render growth indicator with arrow
    const renderGrowthIndicator = (rate) => {
        if (rate > 0) {
            return (
                <span className="inline-flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {rate.toFixed(2)}%
                </span>
            );
        } else if (rate < 0) {
            return (
                <span className="inline-flex items-center text-red-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {Math.abs(rate).toFixed(2)}%
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center text-gray-600">
                    0%
                </span>
            );
        }
    };

    // Hàm hiển thị thông tin người bán
    const renderSellerInfo = (request) => {
        if (!request) return (
            <div className="flex flex-col">
                <span className="font-medium text-gray-900">Không xác định</span>
                <span className="text-xs text-gray-500">N/A</span>
            </div>
        );

        // Kiểm tra và hiển thị thông tin người bán từ cả hai cấu trúc dữ liệu
        let shopName = 'Không xác định';
        let email = 'N/A';

        // Kiểm tra cấu trúc dữ liệu từ API payment/request
        if (request.seller) {
            shopName = request.seller.shopInfo?.shopName || request.seller.name || shopName;
            email = request.seller.email || email;
        } 
        // Kiểm tra cấu trúc dữ liệu từ API admin/payment/history
        else if (request.sellerName || request.shopName) {
            shopName = request.shopName || request.sellerName || shopName;
            email = request.sellerEmail || email;
        }

        return (
            <div className="flex flex-col">
                <span className="font-medium text-gray-900">{shopName}</span>
                <span className="text-xs text-gray-500">{email}</span>
            </div>
        );
    };

    // Cập nhật phần hiển thị trong bảng yêu cầu chờ xử lý
    const renderPendingTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày yêu cầu</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pendingWithdrows.map((request, index) => (
                        <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {renderAmount(request)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {renderStatusBadge(request.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(request.createdAt).format('LL')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {request.status === 'pending' && (
                                    <button
                                        onClick={() => confirmRequest(request._id, request.amount)}
                                        disabled={loader && paymentId === request._id}
                                        className={`px-3 py-1 rounded-md text-white ${loader && paymentId === request._id ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                                    >
                                        {loader && paymentId === request._id ? (
                                            <PropagateLoader color="#ffffff" cssOverride={overrideStyle} size={8} />
                                        ) : (
                                            'Xác nhận'
                                        )}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Cập nhật phần hiển thị trong bảng lịch sử thanh toán
    const renderHistoryTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người bán</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày yêu cầu</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày xác nhận</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {withdrawal._id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {renderSellerInfo(withdrawal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {renderAmount(withdrawal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {renderStatusBadge(withdrawal.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(withdrawal.createdAt).format('LL')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {withdrawal.processDate 
                                    ? moment(withdrawal.processDate).format('LL') 
                                    : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {withdrawal.transferId ? 'Stripe' : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="px-4 lg:px-8 py-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Quản lý thanh toán</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Tỷ giá: 1 USD = {USD_TO_VND_RATE.toLocaleString('vi-VN')} VND
                    </p>
                </div>

                {/* Tab navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                activeTab === 'pending'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Yêu cầu chờ xử lý
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                activeTab === 'history'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Lịch sử thanh toán
                        </button>
                    </nav>
                </div>

                {/* Pending withdrawals tab */}
                {activeTab === 'pending' && (
                    <>
                        {pendingWithdrows.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                Không có yêu cầu rút tiền nào đang chờ xử lý
                            </div>
                        ) : (
                            renderPendingTable()
                        )}
                    </>
                )}

                {/* Payment history tab */}
                {activeTab === 'history' && (
                    <>
                        <div className="p-4 bg-white border-b border-gray-200">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tìm kiếm
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder="Tìm theo tên shop hoặc ID..."
                                        onChange={handleSearch}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái
                                    </label>
                                    <select
                                        id="status"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="pending">Chờ xử lý</option>
                                        <option value="success">Đã xác nhận</option>
                                        <option value="failed">Đã từ chối</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {loader && !paymentHistory.withdrawals?.length ? (
                            <div className="p-6 text-center">
                                <PropagateLoader color="#6366f1" cssOverride={overrideStyle} size={15} />
                            </div>
                        ) : !paymentHistory.withdrawals?.length ? (
                            <div className="p-6 text-center text-gray-500">
                                Không tìm thấy dữ liệu thanh toán nào
                            </div>
                        ) : (
                            <>
                                {renderHistoryTable()}
                                {renderPagination()}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentRequest;