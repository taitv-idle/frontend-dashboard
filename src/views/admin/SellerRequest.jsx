import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_request } from '../../store/Reducers/sellerReducer';

const SellerRequest = () => {
    const dispatch = useDispatch();
    const { sellers, totalSeller } = useSelector(state => state.seller);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        dispatch(get_seller_request({
            parPage: parseInt(parPage),
            searchValue,
            page: parseInt(currentPage)
        }));
    }, [parPage, searchValue, currentPage, dispatch]);

    // Hàm hiển thị trạng thái với màu sắc
    const renderStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Chờ duyệt' },
            approved: { color: 'bg-green-100 text-green-800', label: 'Đã duyệt' },
            rejected: { color: 'bg-red-100 text-red-800', label: 'Từ chối' }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
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

    return (
        <div className="px-4 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Yêu cầu trở thành Người bán</h1>

                {/* Search và filter */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => setSearchValue(e.target.value)}
                            value={searchValue}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tìm kiếm người bán..."
                        />
                    </div>

                    <select
                        onChange={(e) => setParPage(parseInt(e.target.value))}
                        value={parPage}
                        className="block w-full md:w-24 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="5">5 dòng</option>
                        <option value="10">10 dòng</option>
                        <option value="20">20 dòng</option>
                    </select>
                </div>
            </div>

            {/* Bảng danh sách yêu cầu */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sellers.length > 0 ? (
                            sellers.map((seller, index) => (
                                <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(currentPage - 1) * parPage + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {seller.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {seller.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {renderPaymentStatus(seller.payment)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {renderStatusBadge(seller.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/admin/dashboard/seller/details/${seller._id}`}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors inline-block"
                                            title="Xem chi tiết"
                                        >
                                            <FaEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không có yêu cầu nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalSeller > parPage && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalSeller}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerRequest;