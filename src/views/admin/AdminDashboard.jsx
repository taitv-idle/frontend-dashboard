import React from 'react';
import { ImCoinDollar } from "react-icons/im";
import { MdProductionQuantityLimits } from "react-icons/md";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { BiCartAdd } from "react-icons/bi";
import Chart from 'react-apexcharts'
import {Link} from "react-router-dom";


const AdminDashboard = () => {

    const state = {
        series: [
            {
                name: "Đơn hàng",
                data: [1,5,7,9,12,2,45,4,12,34,11,56]
            },
            {
                name: "Doanh thu",
                data: [11,52,72,9,2,22,45,4,45,23,34,12]
            },
            {
                name: "Người bán",
                data: [12,5,11,9,18,24,35,12,45,12,67,12]
            },
        ],
        options: {
            colors: ['#181ee8', '#b3e353', '#e3536b'],
            plotOptions: {
                radius: 30
            },
            chart: {
                background: 'transparent',
                foregroundColor: '#d0d2d6'
            },
            dataLabels: {
                enabled: false
            },
            strock: {
                show: true,
                curve: ['smooth', 'straight', 'stepline'],
                lineCap: 'butt',
                colors: '#f0f0f0',
                width: .5,
                dasharray: 0
            },
            xaxis: {
                categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            },
            legend: {
                position: 'top'
            },
            responsive: [
                {
                    breakpoint: 565,
                    options: {
                        yaxis: {
                            categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                                borderRadius: 5, // Bo góc cột
                            }
                        },
                        chart: {
                            height: "550px",
                        },
                        legend: {
                            position: 'bottom' // Chuyển chú thích xuống dưới cho mobile
                        }
                    }
                }
            ]
        }
    };


    return (
        <div className='px-2 md:px-7 py-5'>

            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>

                <div className='flex justify-between items-center p-5 bg-[#3de0c7] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>đ2025</h2>
                        <span className='text-md font-medium'>Doanh thu</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-red-400 flex justify-center items-center text-xl'>
                        <ImCoinDollar className='text-[#fae8e8] shadow-lg'/>
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-[#3dd0e0] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>50</h2>
                        <span className='text-md font-medium'>Sản phẩm</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#3de0c7] flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-[#fae8e8] shadow-lg'/>
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-[#43dc27] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>60</h2>
                        <span className='text-md font-medium'>Người bán</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#3dd0e0] flex justify-center items-center text-xl'>
                        <PiUsersThreeDuotone className='text-[#fae8e8] shadow-lg'/>
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-[#dcc029] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>đ2025</h2>
                        <span className='text-md font-medium'>Đơn hàng</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#43dc27] flex justify-center items-center text-xl'>
                        <BiCartAdd className='text-[#fae8e8] shadow-lg'/>
                    </div>
                </div>
            </div>

            <div className='w-full flex flex-wrap mt-7'>
                {/* Biểu đồ */}
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-[#e095ee] p-4 rounded-md'>
                        <Chart options={state.options} series={state.series} type='bar' height='350px' />
                    </div>
                </div>

                {/* Tin nhắn người bán gần đây */}
                <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
                    <div className='w-full bg-[#81a3ea] p-4 rounded-md text-[#d0d2d6]'>
                        {/* Tiêu đề và liên kết */}
                        <div className='flex justify-between items-center'>
                            <h2 className='font-semibold text-lg text-[#d0d2d6] pb-3'>Tin nhắn người bán gần đây</h2>
                            <Link className='font-semibold text-sm text-[#d0d2d6]' to="#">Xem tất cả</Link>
                        </div>

                        {/* Danh sách tin nhắn */}
                        <ol className='relative border-l border-slate-600 ml-4 mt-4'>
                            <li className='mb-3 ml-6'>
                                <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#eac881] rounded-full z-10'>
                                    <img className='w-full h-full rounded-full shadow-lg' src="/images/admin.png" alt="admin" />
                                </div>
                                <div className='p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <Link className='text-md font-normal'>Admin</Link>
                                        <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'>2 ngày trước</time>
                                    </div>
                                    <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
                                        Bạn khỏe không
                                    </div>
                                </div>
                            </li>
                            <li className='mb-3 ml-6'>
                                <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#eac881] rounded-full z-10'>
                                    <img className='w-full h-full rounded-full shadow-lg' src="/images/seller.png" alt="seller" />
                                </div>
                                <div className='p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <Link className='text-md font-normal'>Người bán</Link>
                                        <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'>1 giờ trước</time>
                                    </div>
                                    <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
                                        Cảm ơn bạn!
                                    </div>
                                </div>
                            </li>
                            <li className='mb-3 ml-6'>
                                <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#eac881] rounded-full z-10'>
                                    <img className='w-full h-full rounded-full shadow-lg' src="/images/admin.png" alt="admin" />
                                </div>
                                <div className='p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <Link className='text-md font-normal'>Admin</Link>
                                        <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'>1 giờ trước</time>
                                    </div>
                                    <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
                                        Cảm ơn bạn!
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>

            <div className='w-full p-4 bg-[#df5c3f] rounded-md mt-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg text-[#d0d2d6] pb-3'>Đơn hàng gần đây</h2>
                    <Link className='font-semibold text-sm text-[#d0d2d6]' to="#">Xem tất cả</Link>
                </div>

                <div className="relative overflow-x-auto">
                    <table className='w-full text-sm text-left text-[#d0d2d6] uppercase border-b border-slate-600'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                        <tr>
                            <th scope='col' className='py-3 px-4'>ID đơn hàng</th>
                            <th scope='col' className='py-3 px-4'>Giá</th>
                            <th scope='col' className='py-3 px-4'>Trạng thái thanh toán</th>
                            <th scope='col' className='py-3 px-4'>Trạng thái đặt hàng</th>
                            <th scope='col' className='py-3 px-4'>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            [1,2,3,4,5].map((item, i) => (
                                <tr key={i}>
                                    <td className='py-3 px-6 font-medium whitespace-nowrap'>#1212</td>
                                    <td className='py-3 px-6 font-medium whitespace-nowrap'>đ456000</td>
                                    <td className='py-3 px-6 font-medium whitespace-nowrap'>Đang chờ</td>
                                    <td className='py-3 px-6 font-medium whitespace-nowrap'>Đang chờ</td>
                                    <td className='py-3 px-6 font-medium whitespace-nowrap'><Link to='#'>Xem</Link></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;