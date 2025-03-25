import React, { useState } from 'react';
import { FaAnglesDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";

const Orders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [parPage, setParPage] = useState(5);
    const [expandAll, setExpandAll] = useState(false); // Trạng thái mở rộng tất cả đơn hàng con
    const [expandedOrder, setExpandedOrder] = useState(null); // Trạng thái mở rộng đơn hàng tổng cụ thể

    // Dữ liệu mẫu: 6 đơn hàng tổng để kiểm tra phân trang
    const orders = [
        {
            id: '#1212',
            price: '1,368,000đ',
            paymentStatus: 'Đang chờ',
            orderStatus: 'Đang chờ',
            subOrders: [
                { id: '#1212-1', price: '456,000đ', paymentStatus: 'Đang chờ', orderStatus: 'Đang chờ' },
                { id: '#1212-2', price: '456,000đ', paymentStatus: 'Đang chờ', orderStatus: 'Đang chờ' },
                { id: '#1212-3', price: '456,000đ', paymentStatus: 'Đang chờ', orderStatus: 'Đang chờ' },
            ],
        },
        {
            id: '#1213',
            price: '912,000đ',
            paymentStatus: 'Đã thanh toán',
            orderStatus: 'Đã giao',
            subOrders: [
                { id: '#1213-1', price: '456,000đ', paymentStatus: 'Đã thanh toán', orderStatus: 'Đã giao' },
                { id: '#1213-2', price: '456,000đ', paymentStatus: 'Đã thanh toán', orderStatus: 'Đã giao' },
            ],
        },
        {
            id: '#1214',
            price: '500,000đ',
            paymentStatus: 'Đã thanh toán',
            orderStatus: 'Đã giao',
            subOrders: [],
        },
        {
            id: '#1215',
            price: '700,000đ',
            paymentStatus: 'Đang chờ',
            orderStatus: 'Đang xử lý',
            subOrders: [
                { id: '#1215-1', price: '700,000đ', paymentStatus: 'Đang chờ', orderStatus: 'Đang xử lý' },
            ],
        },
        {
            id: '#1216',
            price: '1,000,000đ',
            paymentStatus: 'Đã thanh toán',
            orderStatus: 'Đã giao',
            subOrders: [],
        },
        {
            id: '#1217',
            price: '2,000,000đ',
            paymentStatus: 'Đang chờ',
            orderStatus: 'Đang chờ',
            subOrders: [
                { id: '#1217-1', price: '1,000,000đ', paymentStatus: 'Đang chờ', orderStatus: 'Đang chờ' },
                { id: '#1217-2', price: '1,000,000đ', paymentStatus: 'Đang chờ', orderStatus: 'Đang chờ' },
            ],
        },
    ];

    // Hàm toggle mở rộng tất cả đơn hàng con
    const toggleExpandAll = () => {
        setExpandAll(!expandAll);
        if (!expandAll) setExpandedOrder(null); // Khi mở tất cả, reset trạng thái đơn lẻ
    };

    // Hàm toggle mở rộng đơn hàng tổng cụ thể
    const toggleExpandOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
        if (expandAll) setExpandAll(false); // Khi mở đơn lẻ, tắt trạng thái mở tất cả
    };

    // Logic phân trang
    const totalOrders = orders.length; // Tổng số đơn hàng tổng
    const startIndex = (currentPage - 1) * parPage;
    const endIndex = startIndex + parPage;
    const paginatedOrders = orders.slice(startIndex, endIndex); // Lấy đơn hàng cho trang hiện tại

    return (
        <div className='px-2 lg:px-7 max-w-full'>
            <div className='w-full p-4 bg-[#dfac3f] rounded-md'>
                {/* Bộ lọc và tìm kiếm */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <select
                        onChange={(e) => setParPage(parseInt(e.target.value))}
                        className='px-4 py-2 w-full sm:w-auto hover:border-white outline-none bg-[#dfac3f] border border-slate-700 rounded-md text-[#3c2c0a]'
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <input
                        className='px-4 py-2 w-full sm:w-auto focus:border-indigo-400 outline-none bg-[#fff] border border-slate-700 rounded-md'
                        type="text"
                        placeholder='Tìm kiếm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Bảng đơn hàng */}
                <div className='relative mt-5 overflow-x-auto max-w-full'>
                    <table className='w-full text-sm text-left text-[#0a333c]'>
                        <thead className='text-sm uppercase border-b border-slate-700 bg-[#f5d08e]'>
                        <tr>
                            <th className='py-3 px-4 w-[20%] font-bold'>ID đơn hàng</th>
                            <th className='py-3 px-4 w-[15%] font-bold'>Giá</th>
                            <th className='py-3 px-4 w-[15%] font-bold'>Trạng thái thanh toán</th>
                            <th className='py-3 px-4 w-[15%] font-bold'>Trạng thái đơn hàng</th>
                            <th className='py-3 px-4 w-[20%] font-bold'>Hành động</th>
                            <th className='py-3 px-4 w-[5%] font-bold'>
                                <button onClick={toggleExpandAll}>
                                    <FaAnglesDown className={`transition-transform ${expandAll ? 'rotate-180' : ''}`} />
                                </button>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedOrders.map((order) => (
                            <React.Fragment key={order.id}>
                                {/* Đơn hàng tổng */}
                                <tr className='border-b border-slate-700 hover:bg-[#f5d08e]'>
                                    <td className='py-3 px-4 w-[20%] font-medium whitespace-nowrap'>{order.id}</td>
                                    <td className='py-3 px-4 w-[15%] font-medium whitespace-nowrap'>{order.price}</td>
                                    <td className='py-3 px-4 w-[15%] font-medium whitespace-nowrap'>{order.paymentStatus}</td>
                                    <td className='py-3 px-4 w-[15%] font-medium whitespace-nowrap'>{order.orderStatus}</td>
                                    <td className='py-3 px-4 w-[20%] font-medium whitespace-nowrap'>
                                        <Link to='#' className='text-blue-600 hover:underline'>Xem</Link>
                                    </td>
                                    <td className='py-3 px-4 w-[5%] font-bold'>
                                        {order.subOrders && order.subOrders.length > 0 ? (
                                            <button onClick={() => toggleExpandOrder(order.id)}>
                                                <FaAnglesDown className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                            </button>
                                        ) : (
                                            <span className='text-gray-400'>—</span>
                                        )}
                                    </td>
                                </tr>

                                {/* Đơn hàng con */}
                                {(expandAll || expandedOrder === order.id) && order.subOrders && order.subOrders.length > 0 && order.subOrders.map((subOrder, index) => (
                                    <tr key={index} className='bg-[#d6f2f8] border-b border-slate-700'>
                                        <td className='py-3 px-4 pl-8 w-[20%] font-medium whitespace-nowrap'>{subOrder.id}</td>
                                        <td className='py-3 px-4 w-[15%] font-medium whitespace-nowrap'>{subOrder.price}</td>
                                        <td className='py-3 px-4 w-[15%] font-medium whitespace-nowrap'>{subOrder.paymentStatus}</td>
                                        <td className='py-3 px-4 w-[15%] font-medium whitespace-nowrap'>{subOrder.orderStatus}</td>
                                        <td className='py-3 px-4 w-[20%] font-medium whitespace-nowrap'>
                                            <Link to='#' className='text-blue-600 hover:underline'>Xem</Link>
                                        </td>
                                        <td className='py-3 px-4 w-[5%] font-bold'></td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className='mt-5'>
                    <Pagination
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={totalOrders} // Tổng số đơn hàng tổng
                        parPage={parPage}
                        showItem={Math.min(parPage, totalOrders)} // Số mục hiển thị trên trang hiện tại
                    />
                </div>
            </div>
        </div>
    );
};

export default Orders;