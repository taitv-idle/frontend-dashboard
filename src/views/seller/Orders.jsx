import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';
import Pagination from '../Pagination';
import { PropagateLoader } from 'react-spinners'; // Thay thế Loader bằng spinner

const Orders = () => {
    const dispatch = useDispatch();
    const { myOrders, totalOrder, loading } = useSelector(state => state.order);
    const { userInfo } = useSelector(state => state.auth);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            status: statusFilter !== 'all' ? statusFilter : '',
            sellerId: userInfo._id
        };
        dispatch(get_seller_orders(obj));
    }, [searchValue, currentPage, parPage, statusFilter, dispatch, userInfo._id]);

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Component hiển thị trạng thái
    const StatusBadge = ({ status }) => {
        let bgColor = 'bg-gray-200';
        let textColor = 'text-gray-800';

        if (status === 'completed' || status === 'hoàn thành') {
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
        } else if (status === 'processing' || status === 'đang xử lý') {
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
        } else if (status === 'cancelled' || status === 'đã hủy') {
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
        } else if (status === 'pending' || status === 'chờ xử lý') {
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
        }

        // Chuyển đổi từ tiếng Anh sang tiếng Việt nếu cần
        const statusText = {
            'completed': 'hoàn thành',
            'processing': 'đang xử lý',
            'cancelled': 'đã hủy',
            'pending': 'chờ xử lý'
        }[status] || status;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {statusText}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tìm kiếm đơn hàng..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center">
                        <FaFilter className="text-gray-500 mr-2" />
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <PropagateLoader color="#4f46e5" size={15} />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đơn hàng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thanh toán
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {myOrders.length > 0 ? (
                                    myOrders
                                        .filter(order =>
                                            statusFilter === 'all' ||
                                            order.delivery_status === statusFilter
                                        )
                                        .map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.price.toLocaleString('vi-VN')}₫
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <StatusBadge status={order.payment_status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <StatusBadge status={order.delivery_status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    to={`/seller/order/details/${order._id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                                                >
                                                    <FaEye className="mr-1" /> Xem
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không tìm thấy đơn hàng nào
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {totalOrder > parPage && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <Pagination
                                    pageNumber={currentPage}
                                    setPageNumber={setCurrentPage}
                                    totalItem={totalOrder}
                                    parPage={parPage}
                                    showItem={5}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;