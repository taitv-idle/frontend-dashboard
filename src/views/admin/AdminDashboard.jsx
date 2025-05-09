import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import seller from '../../assets/seller.png'
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';

const AdminDashboard = () => {
    const dispatch = useDispatch()
    // Lấy dữ liệu từ Redux store
    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalSeller,
        recentOrder,
        recentMessage,
        monthlyData, // Lấy dữ liệu theo tháng từ store
        loading,
    } = useSelector(state => state.dashboard)

    const { userInfo } = useSelector(state => state.auth) // Thông tin người dùng

    // Gọi API lấy dữ liệu dashboard khi component mount
    useEffect(() => {
        dispatch(get_admin_dashboard_data())
    }, [dispatch])

    // Cấu hình biểu đồ
    // Tạo dữ liệu động cho biểu đồ
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
                    },
                    export: {
                        csv: {
                            filename: 'thong-ke-dashboard',
                            columnDelimiter: ',',
                            headerCategory: 'Tháng',
                            headerValue: 'Giá trị',
                        },
                        svg: {
                            filename: 'thong-ke-dashboard',
                        },
                        png: {
                            filename: 'thong-ke-dashboard',
                        }
                    }
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
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
                    formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
                        // Kiểm tra giá trị hợp lệ
                        if (value === undefined || value === null) return '0';

                        // Thêm đơn vị cho từng loại dữ liệu
                        if (seriesIndex === 1) { // Doanh thu
                            return value.toLocaleString() + ' VND';
                        } else { // Đơn hàng và người bán
                            return value.toLocaleString();
                        }
                    }
                }
            },
            noData: {
                text: loading ? "Đang tải dữ liệu..." : "Không có dữ liệu",
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    color: "#d0d2d6",
                    fontSize: '16px',
                    fontFamily: undefined
                }
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            height: "350px"
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
        }
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

            {/* Biểu đồ và tin nhắn gần đây */}
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

                {/* Tin nhắn gần đây */}
                <div className='w-full lg:w-5/12'>
                    <div className='w-full bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-semibold text-white'>Tin nhắn gần đây</h2>
                            <Link to="/admin/chat-sellers" className='text-sm font-medium text-blue-400 hover:text-blue-300'>
                                Xem tất cả
                            </Link>
                        </div>

                        <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2'>
                            {recentMessage.map((message, index) => (
                                <div key={index} className='flex items-start gap-3 p-3 bg-gray-700 rounded-lg'>
                                    <div className='flex-shrink-0'>
                                        {message.senderId === userInfo._id ? (
                                            <img
                                                className='w-10 h-10 rounded-full object-cover'
                                                src={userInfo.image}
                                                alt="Avatar người dùng"
                                            />
                                        ) : (
                                            <img
                                                className='w-10 h-10 rounded-full object-cover'
                                                src={seller}
                                                alt="Avatar người bán"
                                            />
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className='font-medium text-white'>{message.senderName}</span>
                                            <span className='text-xs text-gray-400'>
                                                {moment(message.createdAt).startOf('hour').fromNow()}
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-300 bg-gray-800 p-2 rounded'>
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Đơn hàng gần đây */}
            <div className='w-full bg-gray-800 p-4 rounded-lg shadow-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold text-white'>Đơn hàng gần đây</h2>
                    <Link to="/admin/orders" className='text-sm font-medium text-blue-400 hover:text-blue-300'>
                        Xem tất cả
                    </Link>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left text-gray-400'>
                        <thead className='text-xs uppercase bg-gray-700 text-gray-300'>
                        <tr>
                            <th scope='col' className='px-4 py-3'>Mã đơn hàng</th>
                            <th scope='col' className='px-4 py-3'>Giá trị</th>
                            <th scope='col' className='px-4 py-3'>Thanh toán</th>
                            <th scope='col' className='px-4 py-3'>Trạng thái</th>
                            <th scope='col' className='px-4 py-3'>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrder.map((order, index) => (
                            <tr key={index} className='border-b border-gray-700 hover:bg-gray-700'>
                                <td className='px-4 py-3 font-medium text-white'>#{order._id}</td>
                                <td className='px-4 py-3'>{order.price?.toLocaleString()} VND</td>
                                <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            order.payment_status === 'completed'
                                                ? 'bg-green-900 text-green-300'
                                                : 'bg-yellow-900 text-yellow-300'
                                        }`}>
                                            {order.payment_status}
                                        </span>
                                </td>
                                <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            order.delivery_status === 'delivered'
                                                ? 'bg-green-900 text-green-300'
                                                : 'bg-blue-900 text-blue-300'
                                        }`}>
                                            {order.delivery_status}
                                        </span>
                                </td>
                                <td className='px-4 py-3'>
                                    <Link
                                        to={`/admin/order/details/${order._id}`}
                                        className='text-blue-400 hover:text-blue-300 font-medium'
                                    >
                                        Chi tiết
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

export default AdminDashboard;