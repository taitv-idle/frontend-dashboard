import React from 'react';
import { ImCoinDollar } from "react-icons/im";
import { MdProductionQuantityLimits } from "react-icons/md";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { BiCartAdd } from "react-icons/bi";
import Chart from 'react-apexcharts'


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
                    yaxis: {
                        categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            }
                        },
                        chart: {
                            height: "550px",
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
                        <h2 className='text-3xl font-bold'>$2025</h2>
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
                        <h2 className='text-3xl font-bold'>$2025</h2>
                        <span className='text-md font-medium'>Orders</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#43dc27] flex justify-center items-center text-xl'>
                        <BiCartAdd className='text-[#fae8e8] shadow-lg'/>
                    </div>
                </div>

            </div>

            <div className='w-full flex flex-wrap mt-7'>
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-[#e095ee] p-4 rounded-md '>
                        <Chart options={state.options} series={state.series} type='bar' height='350px'/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;