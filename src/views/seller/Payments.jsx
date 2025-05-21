import React, { useEffect, useState, useCallback } from 'react';
import { MdCurrencyExchange } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { get_seller_payment_details, messageClear, send_withdrowal_request } from '../../store/Reducers/PaymentReducer';
import toast from 'react-hot-toast';
import moment from 'moment';

/**
 * Component quản lý thanh toán và rút tiền cho seller
 */
const Payments = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const {
        successMessage,
        errorMessage,
        loader,
        pendingWithdrows,
        successWithdrows,
        withdrowAmount,
        pendingAmount,
        availableAmount
    } = useSelector(state => state.payment);

    // Add dashboard state to get recent orders
    const { recentOrder } = useSelector(state => state.dashboard);

    const [amount, setAmount] = useState(0);

    // Calculate total revenue using the same method as dashboard
    const calculateTotalRevenue = useCallback(() => {
        if (!recentOrder) return 0;
        
        return recentOrder
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
    }, [recentOrder]);

    // Calculate available balance
    const calculateAvailableBalance = useCallback(() => {
        const totalRevenue = calculateTotalRevenue();
        const totalWithdrawn = withdrowAmount || 0;
        const totalPending = pendingAmount || 0;
        return totalRevenue - totalWithdrawn - totalPending;
    }, [calculateTotalRevenue, withdrowAmount, pendingAmount]);

    // Xử lý scroll wheel (nếu cần sử dụng sau này)
    // const handleOnWheel = useCallback(({ deltaY }) => {
    //     console.log('handleOnWheel', deltaY);
    // }, []);

    // Component hiển thị hàng trong danh sách chờ duyệt
    const PendingRow = useCallback(({ index, style }) => {
        return (
            <div style={style} className='flex text-sm text-gray-800 font-medium hover:bg-indigo-50 transition-colors'>
                <div className='w-[25%] p-3 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[25%] p-3 whitespace-nowrap'>{pendingWithdrows[index]?.amount.toLocaleString('vi-VN')} ₫</div>
                <div className='w-[25%] p-3 whitespace-nowrap'>
                    <span className='py-1 px-3 bg-yellow-100 text-yellow-800 rounded-full text-xs'>
                        {pendingWithdrows[index]?.status}
                    </span>
                </div>
                <div className='w-[25%] p-3 whitespace-nowrap'>
                    {moment(pendingWithdrows[index]?.createdAt).format('DD/MM/YYYY')}
                </div>
            </div>
        );
    }, [pendingWithdrows]);

    // Component hiển thị hàng trong danh sách đã thành công
    const SuccessRow = useCallback(({ index, style }) => {
        return (
            <div style={style} className='flex text-sm text-gray-800 font-medium hover:bg-indigo-50 transition-colors'>
                <div className='w-[25%] p-3 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[25%] p-3 whitespace-nowrap'>{successWithdrows[index]?.amount.toLocaleString('vi-VN')} ₫</div>
                <div className='w-[25%] p-3 whitespace-nowrap'>
                    <span className='py-1 px-3 bg-green-100 text-green-800 rounded-full text-xs'>
                        {successWithdrows[index]?.status}
                    </span>
                </div>
                <div className='w-[25%] p-3 whitespace-nowrap'>
                    {moment(successWithdrows[index]?.createdAt).format('DD/MM/YYYY')}
                </div>
            </div>
        );
    }, [successWithdrows]);

    // Gửi yêu cầu rút tiền
    const sendRequest = useCallback((e) => {
        e.preventDefault();
        if (amount <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ');
            return;
        }
        if (availableAmount - amount >= 10) {
            dispatch(send_withdrowal_request({ amount, sellerId: userInfo._id }));
            setAmount(0);
        } else {
            toast.error('Số dư không đủ để rút');
        }
    }, [amount, availableAmount, dispatch, userInfo._id]);

    // Lấy thông tin thanh toán khi component mount hoặc userInfo._id thay đổi
    useEffect(() => {
        if (userInfo?._id) {
            dispatch(get_seller_payment_details(userInfo._id));
        }
    }, [dispatch, userInfo._id]);

    // Hiển thị thông báo khi có successMessage hoặc errorMessage
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

    return (
        <div className='px-4 md:px-8 py-6'>
            {/* Thống kê tổng quan */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
                {renderStatCard('Tổng doanh thu', calculateTotalRevenue(), 'blue')}
                {renderStatCard('Số dư khả dụng', calculateAvailableBalance(), 'green')}
                {renderStatCard('Đã rút', withdrowAmount, 'purple')}
                {renderStatCard('Chờ xử lý', pendingAmount, 'yellow')}
            </div>

            {/* Nội dung chính */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Form yêu cầu rút tiền */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>Yêu cầu rút tiền</h2>
                    {renderWithdrawalForm()}
                    {renderPendingWithdrawals()}
                </div>

                {/* Danh sách đã thành công */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>Lịch sử rút tiền</h2>
                    {renderWithdrawalHistory()}
                </div>
            </div>
        </div>
    );

    // Helper function để render thẻ thống kê
    function renderStatCard(title, value, color) {
        const colorClasses = {
            blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
            green: { bg: 'bg-green-100', text: 'text-green-600' },
            purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
            yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' }
        };

        return (
            <div className='flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-gray-100'>
                <div className='flex flex-col'>
                    <span className='text-sm text-gray-600 font-medium'>{title}</span>
                    <span className='text-2xl font-bold text-gray-800'>{value.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className={`w-12 h-12 rounded-full ${colorClasses[color].bg} flex justify-center items-center`}>
                    <MdCurrencyExchange className={`${colorClasses[color].text} text-xl`} />
                </div>
            </div>
        );
    }

    // Helper function để render form rút tiền
    function renderWithdrawalForm() {
        return (
            <form onSubmit={sendRequest} className='mb-8'>
                <div className='flex flex-col space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Số tiền (VND)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            placeholder='Nhập số tiền muốn rút'
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loader}
                        className={`px-6 py-2 rounded-md text-white font-medium ${loader ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                    >
                        {loader ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                    </button>
                </div>
            </form>
        );
    }

    // Helper function để render danh sách chờ duyệt
    function renderPendingWithdrawals() {
        return (
            <div>
                <h3 className='text-lg font-medium text-gray-800 mb-4'>Yêu cầu đang chờ</h3>
                <div className='border border-gray-200 rounded-lg overflow-hidden'>
                    {renderTableHeader()}
                    <div className='divide-y divide-gray-200'>
                        <List
                            height={300}
                            itemCount={pendingWithdrows.length}
                            itemSize={50}
                            width="100%"
                        >
                            {PendingRow}
                        </List>
                    </div>
                </div>
            </div>
        );
    }

    // Helper function để render lịch sử rút tiền
    function renderWithdrawalHistory() {
        return (
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
                {renderTableHeader()}
                <div className='divide-y divide-gray-200'>
                    <List
                        height={400}
                        itemCount={successWithdrows.length}
                        itemSize={50}
                        width="100%"
                    >
                        {SuccessRow}
                    </List>
                </div>
            </div>
        );
    }

    // Helper function để render header của bảng
    function renderTableHeader() {
        return (
            <div className='grid grid-cols-4 bg-gray-50 text-gray-600 font-medium text-sm uppercase'>
                <div className='p-3'>STT</div>
                <div className='p-3'>Số tiền</div>
                <div className='p-3'>Trạng thái</div>
                <div className='p-3'>Ngày tạo</div>
            </div>
        );
    }
};

export default Payments;