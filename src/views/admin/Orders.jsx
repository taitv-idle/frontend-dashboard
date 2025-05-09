import React, { useEffect, useState, useCallback } from 'react';
import { LuArrowDownSquare, LuArrowUpSquare } from "react-icons/lu";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch();
    const { myOrders, totalOrder } = useSelector(state => state.order);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = useCallback(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_admin_orders(obj));
    }, [dispatch, parPage, currentPage, searchValue]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className='px-4 lg:px-8 pt-6'>
            <div className='w-full p-6 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl shadow-lg'>
                {/* Filters and Search */}
                <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
                    <div className='flex items-center gap-3'>
                        <label className='text-white font-medium'>Show:</label>
                        <select
                            onChange={(e) => setParPage(parseInt(e.target.value))}
                            className='px-4 py-2 focus:ring-2 focus:ring-white outline-none bg-indigo-600 border border-indigo-400 rounded-lg text-white hover:bg-indigo-700 transition-colors'
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <input
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                        className='px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-white outline-none bg-indigo-600 border border-indigo-400 rounded-lg text-white placeholder-indigo-200 hover:bg-indigo-700 transition-colors'
                        type="text"
                        placeholder='Search orders...'
                    />
                </div>

                {/* Orders Table */}
                <div className='relative overflow-x-auto rounded-lg border border-indigo-400'>
                    <table className='w-full text-left text-white'>
                        <thead className='bg-indigo-800'>
                        <tr>
                            <th className='px-6 py-4 font-bold'>Mã đơn hàng</th>
                            <th className='px-6 py-4 font-bold'>Giá trị</th>
                            <th className='px-6 py-4 font-bold'>Thanh toán</th>
                            <th className='px-6 py-4 font-bold'>Trạng thái</th>
                            <th className='px-6 py-4 font-bold'>Thao tác</th>
                            <th className='px-6 py-4 font-bold'></th>
                        </tr>
                        </thead>
                        <tbody>
                        {myOrders.length > 0 ? (
                            myOrders.map((order) => (
                                <React.Fragment key={order._id}>
                                    <tr className='border-b border-indigo-500 hover:bg-indigo-600/50 transition-colors'>
                                        <td className='px-6 py-4 font-medium'>#{order._id}</td>
                                        <td className='px-6 py-4'>{order.price?.toLocaleString()} VND</td>
                                        <td className='px-6 py-4'>
                                <span className={`px-3 py-1 rounded-full text-xs ${
                                    order.payment_status === 'completed'
                                        ? 'bg-green-600 text-green-100'
                                        : 'bg-yellow-600 text-yellow-100'
                                }`}>
                                    {order.payment_status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                <span className={`px-3 py-1 rounded-full text-xs ${
                                    order.delivery_status === 'delivered'
                                        ? 'bg-green-600 text-green-100'
                                        : order.delivery_status === 'processing'
                                            ? 'bg-blue-600 text-blue-100'
                                            : order.delivery_status === 'warehouse'
                                                ? 'bg-purple-600 text-purple-100'
                                                : order.delivery_status === 'placed'
                                                    ? 'bg-indigo-600 text-indigo-100'
                                                    : order.delivery_status === 'cancelled'
                                                        ? 'bg-red-600 text-red-100'
                                                        : 'bg-orange-600 text-orange-100'
                                }`}>
                                    {order.delivery_status === 'delivered' ? 'Đã giao' :
                                        order.delivery_status === 'processing' ? 'Đang xử lý' :
                                            order.delivery_status === 'warehouse' ? 'Trong kho' :
                                                order.delivery_status === 'placed' ? 'Đã đặt' :
                                                    order.delivery_status === 'cancelled' ? 'Đã hủy' :
                                                        'Chờ xử lý'}
                                </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <Link
                                                to={`/admin/order/details/${order._id}`}
                                                className='text-indigo-200 hover:text-white underline transition-colors'
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                        <td className='px-6 py-4 text-right'>
                                            <button
                                                onClick={() => toggleOrderDetails(order._id)}
                                                className='text-indigo-200 hover:text-white transition-colors'
                                            >
                                                {expandedOrder === order._id ? (
                                                    <LuArrowUpSquare size={20} />
                                                ) : (
                                                    <LuArrowDownSquare size={20} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrder === order._id && (
                                        <tr className='bg-indigo-700/50'>
                                            <td colSpan="6" className='px-6 py-4'>
                                                <div className='space-y-3'>
                                                    <h4 className='font-medium text-indigo-100'>Đơn hàng con:</h4>
                                                    {order.suborder.map((subOrder) => (
                                                        <div key={subOrder._id} className='flex items-center justify-between bg-indigo-800/50 p-3 rounded-lg'>
                                                            <span className='text-sm'>#{subOrder._id}</span>
                                                            <span className='text-sm'>{subOrder.price?.toLocaleString()} VND</span>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                subOrder.payment_status === 'completed'
                                                                    ? 'bg-green-600 text-green-100'
                                                                    : 'bg-yellow-600 text-yellow-100'
                                                            }`}>
                                                    {subOrder.payment_status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                subOrder.delivery_status === 'delivered'
                                                                    ? 'bg-green-600 text-green-100'
                                                                    : subOrder.delivery_status === 'processing'
                                                                        ? 'bg-blue-600 text-blue-100'
                                                                        : 'bg-orange-600 text-orange-100'
                                                            }`}>
                                                    {subOrder.delivery_status === 'delivered' ? 'Đã giao' :
                                                        subOrder.delivery_status === 'processing' ? 'Đang xử lý' :
                                                            'Đang vận chuyển'}
                                                </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className='px-6 py-4 text-center text-indigo-200'>
                                    Không tìm thấy đơn hàng
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalOrder > parPage && (
                    <div className='w-full flex justify-center mt-6'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalOrder}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;