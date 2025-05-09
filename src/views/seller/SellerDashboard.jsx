import React, { useEffect, useState, useCallback } from 'react';
import {
    MdCurrencyExchange,
    MdProductionQuantityLimits,
    MdOutlineRefresh
} from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
// import moment from 'moment';
// import customer from '../../assets/demo.jpg';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalPendingOrder,
        recentOrder,
        //recentMessage,
        monthlyData
    } = useSelector(state => state.dashboard);

    // const { userInfo } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('yearly');
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch(get_seller_dashboard_data());
        } finally {
            setLoading(false);
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
        const salesData = displayData.map(data => data.totalSales);

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
            yaxis: {
                title: {
                    text: 'Số lượng'
                }
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val.toLocaleString();
                    }
                }
            }
        };

        setChartData({
            series: newSeries,
            options: newOptions
        });
    }, [monthlyData, timeRange]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        prepareChartData();
    }, [prepareChartData]);

    const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
        <div className={`p-5 rounded-lg shadow-sm flex justify-between items-center ${bgColor}`}>
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                    {typeof value === 'number' && title.includes('Sale')
                        ? `$${value.toFixed(2)}`
                        : value}
                </h3>
            </div>
            <div className={`p-3 rounded-full ${color} text-white`}>
                <Icon size={24} />
            </div>
        </div>
    );

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
                    value={totalSale || 0}
                    icon={MdCurrencyExchange}
                    color="bg-indigo-600"
                    bgColor="bg-indigo-50"
                />
                <StatCard
                    title="Sản phẩm"
                    value={totalProduct || 0}
                    icon={MdProductionQuantityLimits}
                    color="bg-purple-600"
                    bgColor="bg-purple-50"
                />
                <StatCard
                    title="Tổng đơn hàng"
                    value={totalOrder || 0}
                    icon={FaCartShopping}
                    color="bg-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    title="Đơn hàng chờ"
                    value={totalPendingOrder || 0}
                    icon={FaCartShopping}
                    color="bg-yellow-600"
                    bgColor="bg-yellow-50"
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
                        <h2 className="text-lg font-semibold text-gray-800">Tin nhắn gần đây</h2>
                        <Link to="/seller/messages" className="text-sm text-indigo-600 hover:text-indigo-800">
                            Xem tất cả
                        </Link>
                    </div>
                    {/* ... (giữ nguyên phần tin nhắn) */}
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
                                Thao tác
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrder?.slice(0, 5).map((order, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-medium text-blue-600">#{order._id?.slice(0, 8) || ''}...</td>
                                <td className="py-3 px-4">${order.price?.toFixed(2) || '0.00'}</td>
                                <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    order.payment_status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.payment_status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                                </span>
                                </td>
                                <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    order.delivery_status === 'delivered'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.delivery_status === 'delivered' ? 'Đã giao' : 'Đang xử lý'}
                                </span>
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