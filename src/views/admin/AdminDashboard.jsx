import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers, FaChartPie, FaMoneyBillWave, FaShoppingBag, FaStore } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';

const AdminDashboard = () => {
    const dispatch = useDispatch()
    // Lấy dữ liệu từ Redux store
    const dashboard = useSelector(state => state.dashboard) || {}
    const {
        totalSale = 0,
        totalOrder = 0,
        totalProduct = 0,
        totalSeller = 0,
        recentOrder = [],
        monthlyData = [],
        orderStatusStats = [],
        paymentMethodStats = [],
        topProducts = [],
        newSellers = [],
    } = dashboard

    useEffect(() => {
        dispatch(get_admin_dashboard_data())
    }, [dispatch])

    // Kiểm tra dữ liệu từ server
    useEffect(() => {
        console.log('=== Dashboard Data ===')
        console.log('Monthly Data:', monthlyData)
        console.log('Order Status Stats:', orderStatusStats)
        console.log('Payment Method Stats:', paymentMethodStats)
        console.log('Top Products:', topProducts)
        console.log('New Sellers:', newSellers)
        console.log('Recent Orders:', recentOrder)
        console.log('====================')
    }, [monthlyData, orderStatusStats, paymentMethodStats, topProducts, newSellers, recentOrder])

    // Sắp xếp đơn hàng gần đây theo thời gian mới nhất
    const sortedRecentOrders = recentOrder ? [...recentOrder]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5) : []

    // Cấu hình biểu đồ
    const cauHinhBieuDo = {
        series: [
            {
                name: "Đơn hàng",
                data: monthlyData ? monthlyData.map(item => item.totalOrders) : Array(12).fill(0)
            },
            {
                name: "Doanh thu",
                data: monthlyData ? monthlyData.map(item => item.totalSales) : Array(12).fill(0)
            },
            {
                name: "Người bán",
                data: monthlyData ? monthlyData.map(item => item.newSellers) : Array(12).fill(0)
            },
        ],
        options: {
            color: ['#4f46e5', '#10b981', '#f59e0b'],
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                colors: ['#4f46e5', '#10b981', '#f59e0b']
            },
            xaxis: {
                categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
                    'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: '#d0d2d6'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#d0d2d6'
                    },
                    formatter: function (value) {
                        if (value === undefined || value === null) return '0';
                        return value.toLocaleString();
                    }
                }
            },
            grid: {
                borderColor: '#4b5563',
                strokeDashArray: 4
            },
            legend: {
                position: 'top',
                labels: {
                    colors: '#d0d2d6'
                }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (value, {seriesIndex}) {
                        if (value === undefined || value === null) return '0';
                        if (seriesIndex === 1) { // Doanh thu
                            return value.toLocaleString() + ' VND';
                        } else { // Đơn hàng và người bán
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    }

    // Cấu hình biểu đồ tròn cho trạng thái đơn hàng
    const orderStatusChart = {
        options: {
            chart: {
                type: 'donut',
                background: 'transparent',
                foreColor: '#d0d2d6',
            },
            labels: ['Đã giao', 'Đang xử lý', 'Hoàn thành', 'Đã đặt', 'Đã hủy', 'Chờ xử lý'],
            colors: ['#10b981', '#3b82f6', '#8b5cf6', '#6366f1', '#ef4444', '#f59e0b'],
            legend: {
                position: 'bottom',
                labels: {
                    colors: '#d0d2d6'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(1) + "%"
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '50%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Tổng đơn',
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                }
                            }
                        }
                    }
                }
            }
        },
        series: orderStatusStats || [0, 0, 0, 0, 0, 0]
    }

    // Cấu hình biểu đồ tròn cho phương thức thanh toán
    const paymentMethodChart = {
        options: {
            chart: {
                type: 'donut',
                background: 'transparent',
                foreColor: '#d0d2d6',
            },
            labels: ['Đã thanh toán', 'Chưa thanh toán', 'Chờ thanh toán'],
            colors: ['#10b981', '#ef4444', '#f59e0b'],
            legend: {
                position: 'bottom',
                labels: {
                    colors: '#d0d2d6'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(1) + "%"
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '50%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Tổng đơn',
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                }
                            }
                        }
                    }
                }
            }
        },
        series: paymentMethodStats || [0, 0, 0]
    }

    // Tính toán tỷ lệ trạng thái đơn hàng từ recentOrder
    const calculateOrderStatusStats = () => {
        if (!recentOrder || recentOrder.length === 0) return [0, 0, 0, 0, 0, 0]
        
        const total = recentOrder.length
        const stats = {
            delivered: 0,
            processing: 0,
            completed: 0,
            ordered: 0,
            cancelled: 0,
            pending: 0
        }

        recentOrder.forEach(order => {
            switch(order.delivery_status) {
                case 'delivered':
                    stats.delivered++
                    break
                case 'processing':
                    stats.processing++
                    break
                case 'completed':
                    stats.completed++
                    break
                case 'ordered':
                    stats.ordered++
                    break
                case 'cancelled':
                    stats.cancelled++
                    break
                default:
                    stats.pending++
            }
        })

        return [
            (stats.delivered / total) * 100,
            (stats.processing / total) * 100,
            (stats.completed / total) * 100,
            (stats.ordered / total) * 100,
            (stats.cancelled / total) * 100,
            (stats.pending / total) * 100
        ]
    }

    // Tính toán tỷ lệ phương thức thanh toán từ recentOrder
    const calculatePaymentMethodStats = () => {
        if (!recentOrder || recentOrder.length === 0) return [0, 0, 0]
        
        const total = recentOrder.length
        const stats = {
            paid: 0,
            unpaid: 0,
            pending: 0
        }

        recentOrder.forEach(order => {
            switch(order.payment_status) {
                case 'paid':
                    stats.paid++
                    break
                case 'unpaid':
                    stats.unpaid++
                    break
                default:
                    stats.pending++
            }
        })

        return [
            (stats.paid / total) * 100,
            (stats.unpaid / total) * 100,
            (stats.pending / total) * 100
        ]
    }

    return (
        <div className='px-4 md:px-6 py-5 bg-gray-900 min-h-screen'>
            {/* Tiêu đề trang */}
            <h1 className='text-2xl font-bold text-white mb-6'>Bảng điều khiển quản trị</h1>

            {/* Thống kê tổng quan */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6'>
                {/* Thẻ tổng doanh thu */}
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-white'>
                        <h2 className='text-3xl font-bold'>{totalSale?.toLocaleString()} VND</h2>
                        <span className='text-sm font-medium'>Tổng doanh thu</span>
                    </div>
                    <div className='w-12 h-12 rounded-full bg-white bg-opacity-20 flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-white' />
                    </div>
                </div>

                {/* Thẻ tổng sản phẩm */}
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-white'>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <span className='text-sm font-medium'>Sản phẩm</span>
                    </div>
                    <div className='w-12 h-12 rounded-full bg-white bg-opacity-20 flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-white' />
                    </div>
                </div>

                {/* Thẻ tổng người bán */}
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-white'>
                        <h2 className='text-3xl font-bold'>{totalSeller}</h2>
                        <span className='text-sm font-medium'>Người bán</span>
                    </div>
                    <div className='w-12 h-12 rounded-full bg-white bg-opacity-20 flex justify-center items-center text-xl'>
                        <FaUsers className='text-white' />
                    </div>
                </div>

                {/* Thẻ tổng đơn hàng */}
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-white'>
                        <h2 className='text-3xl font-bold'>{totalOrder}</h2>
                        <span className='text-sm font-medium'>Đơn hàng</span>
                    </div>
                    <div className='w-12 h-12 rounded-full bg-white bg-opacity-20 flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-white' />
                    </div>
                </div>
            </div>

            {/* Biểu đồ và đơn hàng gần đây */}
            <div className='w-full flex flex-col lg:flex-row gap-6 mb-6'>
                {/* Biểu đồ thống kê */}
                <div className='w-full lg:w-7/12'>
                    <div className='w-full bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h2 className='text-lg font-semibold text-white mb-4'>Thống kê hoạt động</h2>
                        <Chart
                            options={cauHinhBieuDo.options}
                            series={cauHinhBieuDo.series}
                            type='area'
                            height={350}
                        />
                    </div>
                </div>

                {/* Đơn hàng gần đây */}
                <div className='w-full lg:w-5/12'>
                    <div className='w-full bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-semibold text-white'>Đơn hàng gần đây</h2>
                            <Link to="/admin/orders" className='text-sm font-medium text-blue-400 hover:text-blue-300'>
                                Xem tất cả
                            </Link>
                        </div>
                        <div className='space-y-4'>
                            {sortedRecentOrders?.map((order, index) => (
                                <div key={index} className='flex items-center gap-4 p-3 bg-gray-700 rounded-lg'>
                                    <div className='flex-1'>
                                        <div className='flex justify-between items-center'>
                                            <h3 className='text-white font-medium'>#{order._id.slice(-8).toUpperCase()}</h3>
                                        </div>
                                        <div className='flex justify-between items-center mt-1'>
                                            <span className='text-gray-400 text-sm'>
                                                {order.price.toLocaleString()} VND
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                order.payment_status === 'paid'
                                                    ? 'bg-green-900 text-green-300'
                                                    : order.payment_status === 'pending'
                                                        ? 'bg-yellow-900 text-yellow-300'
                                                        : 'bg-red-900 text-red-300'
                                            }`}>
                                                {order.payment_status === 'paid' ? 'Đã thanh toán' :
                                                    order.payment_status === 'pending' ? 'Chờ thanh toán' : 'Chưa thanh toán'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thống kê chi tiết */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                {/* Thống kê trạng thái đơn hàng */}
                <div className='bg-gray-800 p-4 rounded-lg shadow-lg'>
                    <div className='flex items-center gap-2 mb-4'>
                        <FaChartPie className='text-indigo-500 text-xl' />
                        <h2 className='text-lg font-semibold text-white'>Thống kê trạng thái đơn hàng</h2>
                    </div>
                    <Chart
                        options={orderStatusChart.options}
                        series={orderStatusStats || calculateOrderStatusStats()}
                        type='donut'
                        height={300}
                    />
                </div>

                {/* Thống kê phương thức thanh toán */}
                <div className='bg-gray-800 p-4 rounded-lg shadow-lg'>
                    <div className='flex items-center gap-2 mb-4'>
                        <FaMoneyBillWave className='text-green-500 text-xl' />
                        <h2 className='text-lg font-semibold text-white'>Thống kê trạng thái thanh toán</h2>
                    </div>
                    <Chart
                        options={paymentMethodChart.options}
                        series={paymentMethodStats || calculatePaymentMethodStats()}
                        type='donut'
                        height={300}
                    />
                </div>
            </div>

            {/* Sản phẩm bán chạy và người bán mới */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Sản phẩm bán chạy */}
                <div className='bg-gray-800 p-4 rounded-lg shadow-lg'>
                    <div className='flex items-center gap-2 mb-4'>
                        <FaShoppingBag className='text-purple-500 text-xl' />
                        <h2 className='text-lg font-semibold text-white'>Sản phẩm bán chạy</h2>
                    </div>
                    <div className='space-y-4'>
                        {topProducts?.map((product, index) => (
                            <div key={index} className='flex items-center gap-4 p-3 bg-gray-700 rounded-lg'>
                                <img 
                                    src={product.images?.[0] || '/placeholder-product.png'} 
                                    alt={product.name} 
                                    className='w-16 h-16 object-cover rounded-lg' 
                                />
                                <div className='flex-1'>
                                    <h3 className='text-white font-medium'>{product.name}</h3>
                                    <div className='flex justify-between items-center mt-1'>
                                        <span className='text-gray-400 text-sm'>Đã bán: {product.totalSold}</span>
                                        <span className='text-green-500 font-medium'>{product.totalRevenue?.toLocaleString()} VND</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Người bán mới */}
                <div className='bg-gray-800 p-4 rounded-lg shadow-lg'>
                    <div className='flex items-center gap-2 mb-4'>
                        <FaStore className='text-blue-500 text-xl' />
                        <h2 className='text-lg font-semibold text-white'>Người bán mới</h2>
                    </div>
                    <div className='space-y-4'>
                        {newSellers?.map((seller, index) => (
                            <div key={index} className='flex items-center gap-4 p-3 bg-gray-700 rounded-lg'>
                                <img 
                                    src={seller.image || '/placeholder-avatar.png'} 
                                    alt={seller.name} 
                                    className='w-12 h-12 rounded-full object-cover' 
                                />
                                <div className='flex-1'>
                                    <h3 className='text-white font-medium'>{seller.name}</h3>
                                    <div className='flex justify-between items-center mt-1'>
                                        <span className='text-gray-400 text-sm'>Ngày tham gia: {moment(seller.createdAt).format('DD/MM/YYYY')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;