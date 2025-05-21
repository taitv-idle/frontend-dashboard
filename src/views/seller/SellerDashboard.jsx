import React, { useEffect, useState, useCallback } from 'react';
import {
    MdCurrencyExchange,
    MdProductionQuantityLimits,
    MdOutlineRefresh,
    MdOutlinePayment,
    MdOutlineLocalShipping
} from "react-icons/md";
import { FaCartShopping, FaBoxOpen } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';
import 'moment/locale/vi';
import { toast } from 'react-hot-toast';
// import customer from '../../assets/demo.jpg';

moment.locale('vi');

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalPendingOrder,
        recentOrder,
        monthlyData,
        loading,
        errorMessage,
        availableAmount,
        pendingWithdrows
    } = useSelector(state => state.dashboard);

    // Add payment state
    const { totalAmount } = useSelector(state => state.payment);

    // const { userInfo } = useSelector(state => state.auth);
    const [timeRange, setTimeRange] = useState('yearly');
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            await dispatch(get_seller_dashboard_data());
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu dashboard');
        }
    }, [dispatch]);

    const prepareChartData = useCallback(() => {
        if (!monthlyData) return;

        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        let displayData = monthlyData;

        if (timeRange === 'monthly') {
            const currentMonth = new Date().getMonth();
            displayData = monthlyData.slice(Math.max(currentMonth - 5, 0), currentMonth + 1);
        }

        const categories = displayData.map(data => months[data.month - 1]);
        const ordersData = displayData.map(data => data.totalOrders);
        const salesData = displayData.map(data => {
            // Calculate monthly revenue from paid/completed orders
            const monthlyOrders = recentOrder?.filter(order => {
                const orderDate = new Date(order.date);
                const orderMonth = orderDate.getMonth() + 1;
                const orderYear = orderDate.getFullYear();
                const currentYear = new Date().getFullYear();
                
                return orderMonth === data.month && 
                       orderYear === currentYear &&
                       (order.payment_status === 'paid' || order.payment_status === 'completed');
            }) || [];
            
            return monthlyOrders.reduce((total, order) => {
                // Calculate order total with products
                const orderTotal = order.products?.reduce((productTotal, product) => {
                    const price = product.price || 0;
                    const quantity = product.quantity || 0;
                    const discount = product.discount || 0;
                    return productTotal + (price * quantity * (1 - discount/100));
                }, 0) || 0;

                // Add shipping fee if order total is less than 500,000
                const shippingFee = orderTotal < 500000 ? 40000 : 0;
                
                return total + orderTotal + shippingFee;
            }, 0);
        });

        const newSeries = [
            {
                name: "Đơn hàng",
                data: ordersData
            },
            {
                name: "Doanh thu",
                data: salesData
            }
        ];

        const newOptions = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: true
                },
                foreColor: '#374151'
            },
            colors: ['#4FD1C5', '#F6AD55'],
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: '55%',
                },
            },
            xaxis: {
                categories: categories,
            },
            yaxis: [
                {
                    title: {
                        text: 'Số lượng đơn hàng'
                    },
                    seriesName: 'Đơn hàng'
                },
                {
                    title: {
                        text: 'Doanh thu (VND)'
                    },
                    seriesName: 'Doanh thu',
                    opposite: true,
                    labels: {
                        formatter: function(value) {
                            return value.toLocaleString('vi-VN') + ' ₫';
                        }
                    }
                }
            ],
            tooltip: {
                y: {
                    formatter: function (val, { seriesIndex }) {
                        if (seriesIndex === 1) {
                            return val.toLocaleString('vi-VN') + ' ₫';
                        }
                        return val;
                    }
                }
            }
        };

        setChartData({
            series: newSeries,
            options: newOptions
        });
    }, [monthlyData, timeRange, recentOrder]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        prepareChartData();
    }, [prepareChartData]);

    // Auto refresh dashboard data every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    // Show error message if any
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    const calculateOrderTotal = (order) => {
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
        
        return productTotal + shippingFee - orderDiscount;
    };

    const StatCard = ({ title, value, icon: Icon, color, bgColor, suffix = '', isCurrency = false }) => {
        // Get the correct value based on the title
        const getDisplayValue = () => {
            switch (title) {
                case 'Tổng doanh thu':
                    return recentOrder
                        ?.filter(order => order.payment_status === 'paid' || order.payment_status === 'completed')
                        .reduce((total, order) => total + calculateOrderTotal(order), 0) || 0;
                case 'Số dư khả dụng':
                    return availableAmount || 0;
                case 'Đã rút':
                    return totalAmount - availableAmount;
                case 'Chờ xử lý':
                    return pendingWithdrows?.reduce((total, withdrawal) => total + (withdrawal.amount || 0), 0) || 0;
                default:
                    return value || 0;
            }
        };

        return (
            <div className={`p-5 rounded-lg shadow-sm flex justify-between items-center ${bgColor}`}>
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {isCurrency 
                            ? `${Number(getDisplayValue()).toLocaleString('vi-VN')}${suffix}`
                            : typeof value === 'number' 
                                ? `${value.toLocaleString('vi-VN')}${suffix}`
                                : value}
                    </h3>
                </div>
                <div className={`p-3 rounded-full ${color} text-white`}>
                    <Icon size={24} />
                </div>
            </div>
        );
    };

    // const MessageItem = ({ message }) => (
    //     <li className="mb-4 ml-6">
    //         <div className="absolute -left-5 flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full shadow-lg">
    //             <img
    //                 className="w-full h-full rounded-full object-cover"
    //                 src={message.senderId === userInfo._id ? userInfo.image : customer}
    //                 alt={message.senderName}
    //             />
    //         </div>
    //         <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
    //             <div className="flex justify-between items-center mb-2">
    //                 <Link className="font-medium text-gray-800">{message.senderName}</Link>
    //                 <time className="text-xs text-gray-500">
    //                     {moment(message.createdAt).startOf('hour').fromNow()}
    //                 </time>
    //             </div>
    //             <div className="p-2 text-sm text-gray-700 bg-gray-50 rounded-lg">
    //                 {message.message}
    //             </div>
    //         </div>
    //     </li>
    // );
    //
    // const OrderRow = ({ order }) => (
    //     <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    //         <td className="py-3 px-4 font-medium text-blue-600">#{order._id?.slice(0, 8) || ''}...</td>
    //         <td className="py-3 px-4">${order.price?.toFixed(2) || '0.00'}</td>
    //         <td className="py-3 px-4">
    //             <span className={`px-2 py-1 rounded-full text-xs ${
    //                 order.payment_status === 'completed'
    //                     ? 'bg-green-100 text-green-800'
    //                     : 'bg-yellow-100 text-yellow-800'
    //             }`}>
    //                 {order.payment_status}
    //             </span>
    //         </td>
    //         <td className="py-3 px-4">
    //             <span className={`px-2 py-1 rounded-full text-xs ${
    //                 order.delivery_status === 'delivered'
    //                     ? 'bg-green-100 text-green-800'
    //                     : 'bg-blue-100 text-blue-800'
    //             }`}>
    //                 {order.delivery_status}
    //             </span>
    //         </td>
    //         <td className="py-3 px-4">
    //             <Link
    //                 to={`/seller/order/details/${order._id}`}
    //                 className="text-blue-600 hover:text-blue-800 font-medium"
    //             >
    //                 View
    //             </Link>
    //         </td>
    //     </tr>
    // );

    const getStatusBadge = (status, type) => {
        const statusConfig = {
            payment: {
                pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ thanh toán' },
                paid: { color: 'bg-green-100 text-green-800', text: 'Đã thanh toán' },
                unpaid: { color: 'bg-red-100 text-red-800', text: 'Chưa thanh toán' },
                completed: { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' }
            },
            delivery: {
                pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
                processing: { color: 'bg-blue-100 text-blue-800', text: 'Đang xử lý' },
                warehouse: { color: 'bg-purple-100 text-purple-800', text: 'Trong kho' },
                placed: { color: 'bg-indigo-100 text-indigo-800', text: 'Đã đặt' },
                delivered: { color: 'bg-green-100 text-green-800', text: 'Đã giao' },
                cancelled: { color: 'bg-red-100 text-red-800', text: 'Đã hủy' }
            }
        };

        const config = statusConfig[type][status] || { color: 'bg-gray-100 text-gray-800', text: status };
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="px-4 md:px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển người bán</h1>
                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <MdOutlineRefresh className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <StatCard
                    title="Tổng doanh thu"
                    value={totalSale}
                    icon={MdCurrencyExchange}
                    color="bg-indigo-600"
                    bgColor="bg-indigo-50"
                    suffix=" ₫"
                    isCurrency={true}
                />
                <StatCard
                    title="Số dư khả dụng"
                    value={availableAmount}
                    icon={MdCurrencyExchange}
                    color="bg-green-600"
                    bgColor="bg-green-50"
                    suffix=" ₫"
                    isCurrency={true}
                />
                <StatCard
                    title="Đã rút"
                    value={totalAmount - availableAmount}
                    icon={MdCurrencyExchange}
                    color="bg-purple-600"
                    bgColor="bg-purple-50"
                    suffix=" ₫"
                    isCurrency={true}
                />
                <StatCard
                    title="Chờ xử lý"
                    value={pendingWithdrows?.reduce((total, withdrawal) => total + (withdrawal.amount || 0), 0) || 0}
                    icon={MdCurrencyExchange}
                    color="bg-yellow-600"
                    bgColor="bg-yellow-50"
                    suffix=" ₫"
                    isCurrency={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Tổng quan bán hàng</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setTimeRange('yearly')}
                                className={`px-3 py-1 text-xs rounded-md ${
                                    timeRange === 'yearly'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                Theo năm
                            </button>
                            <button
                                onClick={() => setTimeRange('monthly')}
                                className={`px-3 py-1 text-xs rounded-md ${
                                    timeRange === 'monthly'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                6 tháng gần nhất
                            </button>
                        </div>
                    </div>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={350}
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Thống kê nhanh</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlinePayment className="text-indigo-600 mr-3" size={20} />
                                <span className="text-gray-600">Đơn hàng đã thanh toán</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder?.filter(order => 
                                    order.payment_status === 'paid' || order.payment_status === 'completed'
                                ).length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlineLocalShipping className="text-green-600 mr-3" size={20} />
                                <span className="text-gray-600">Đơn hàng đã giao</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder?.filter(order => order.delivery_status === 'delivered').length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <FaBoxOpen className="text-yellow-600 mr-3" size={20} />
                                <span className="text-gray-600">Đơn hàng đang xử lý</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder?.filter(order => 
                                    order.delivery_status === 'processing' || order.delivery_status === 'pending'
                                ).length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu theo trạng thái</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlinePayment className="text-green-600 mr-3" size={20} />
                                <span className="text-gray-600">Doanh thu đã thanh toán</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder
                                    ?.filter(order => order.payment_status === 'paid' || order.payment_status === 'completed')
                                    .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                    .toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlinePayment className="text-yellow-600 mr-3" size={20} />
                                <span className="text-gray-600">Doanh thu chờ thanh toán</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder
                                    ?.filter(order => order.payment_status === 'pending')
                                    .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                    .toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlinePayment className="text-red-600 mr-3" size={20} />
                                <span className="text-gray-600">Doanh thu chưa thanh toán</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder
                                    ?.filter(order => order.payment_status === 'unpaid')
                                    .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                    .toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng theo trạng thái giao hàng</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlineLocalShipping className="text-green-600 mr-3" size={20} />
                                <span className="text-gray-600">Đã giao hàng</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder?.filter(order => order.delivery_status === 'delivered').length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlineLocalShipping className="text-blue-600 mr-3" size={20} />
                                <span className="text-gray-600">Đang xử lý</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder?.filter(order => order.delivery_status === 'processing').length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <MdOutlineLocalShipping className="text-yellow-600 mr-3" size={20} />
                                <span className="text-gray-600">Chờ xử lý</span>
                            </div>
                            <span className="font-medium text-gray-800">
                                {recentOrder?.filter(order => order.delivery_status === 'pending').length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê theo thời gian</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Hôm nay</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Đơn hàng:</span>
                                <span className="font-medium">
                                    {recentOrder?.filter(order => 
                                        moment(order.date).isSame(moment(), 'day')
                                    ).length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Doanh thu:</span>
                                <span className="font-medium">
                                    {recentOrder
                                        ?.filter(order => 
                                            moment(order.date).isSame(moment(), 'day') &&
                                            (order.payment_status === 'paid' || order.payment_status === 'completed')
                                        )
                                        .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                        .toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Chưa thanh toán:</span>
                                <span className="font-medium">
                                    {recentOrder
                                        ?.filter(order => 
                                            moment(order.date).isSame(moment(), 'day') &&
                                            (order.payment_status === 'pending' || order.payment_status === 'unpaid')
                                        )
                                        .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                        .toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Tuần này</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Đơn hàng:</span>
                                <span className="font-medium">
                                    {recentOrder?.filter(order => 
                                        moment(order.date).isSame(moment(), 'week')
                                    ).length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Doanh thu:</span>
                                <span className="font-medium">
                                    {recentOrder
                                        ?.filter(order => 
                                            moment(order.date).isSame(moment(), 'week') &&
                                            (order.payment_status === 'paid' || order.payment_status === 'completed')
                                        )
                                        .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                        .toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Chưa thanh toán:</span>
                                <span className="font-medium">
                                    {recentOrder
                                        ?.filter(order => 
                                            moment(order.date).isSame(moment(), 'week') &&
                                            (order.payment_status === 'pending' || order.payment_status === 'unpaid')
                                        )
                                        .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                        .toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Tháng này</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Đơn hàng:</span>
                                <span className="font-medium">
                                    {recentOrder?.filter(order => 
                                        moment(order.date).isSame(moment(), 'month')
                                    ).length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Doanh thu:</span>
                                <span className="font-medium">
                                    {recentOrder
                                        ?.filter(order => 
                                            moment(order.date).isSame(moment(), 'month') &&
                                            (order.payment_status === 'paid' || order.payment_status === 'completed')
                                        )
                                        .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                        .toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Chưa thanh toán:</span>
                                <span className="font-medium">
                                    {recentOrder
                                        ?.filter(order => 
                                            moment(order.date).isSame(moment(), 'month') &&
                                            (order.payment_status === 'pending' || order.payment_status === 'unpaid')
                                        )
                                        .reduce((total, order) => total + calculateOrderTotal(order), 0)
                                        .toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
                    <Link to="/seller/orders" className="text-sm text-indigo-600 hover:text-indigo-800">
                        Xem tất cả
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã đơn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thanh toán
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày đặt
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrder?.slice(0, 5).map((order, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-medium text-blue-600">#{order._id?.slice(0, 8) || ''}...</td>
                                <td className="py-3 px-4">{calculateOrderTotal(order).toLocaleString('vi-VN')} ₫</td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(order.payment_status, 'payment')}
                                </td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(order.delivery_status, 'delivery')}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {moment(order.date).format('DD/MM/YYYY HH:mm')}
                                </td>
                                <td className="py-3 px-4">
                                    <Link
                                        to={`/seller/order/details/${order._id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Xem
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;