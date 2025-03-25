import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { FaCheck } from "react-icons/fa"; 
import Pagination from "../Pagination";

const SellerRequest = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [parPage, setParPage] = useState(5);

    return (
        <div className='px-2 sm:px-4 lg:px-7 pt-5 max-w-full'>
            <h1 className='text-xl font-bold text-gray-900 mb-4'>Yêu cầu thành người bán</h1>
            <div className='w-full bg-[#fef8e6] rounded-lg shadow-sm p-4 border border-gray-300'>
                {/* Bộ lọc và tìm kiếm */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4'>
                    <select
                        onChange={(e) => setParPage(parseInt(e.target.value))}
                        className='px-3 py-1.5 w-full sm:w-24 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-teal-400 outline-none text-sm'
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <input
                        className='px-3 py-1.5 w-full sm:w-64 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-teal-400 outline-none placeholder-gray-400 text-sm'
                        type="text"
                        placeholder='Tìm kiếm yêu cầu...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Bảng */}
                <div className="relative overflow-x-auto">
                    <table className='w-full text-sm text-left text-gray-800'>
                        <thead className='text-xs uppercase bg-[#ffe8a8] text-gray-700 border-b border-gray-300'>
                        <tr>
                            <th scope='col' className='py-2 px-2 sm:px-3'>TT</th>
                            <th scope='col' className='py-2 px-2 sm:px-3'>Hình ảnh</th>
                            <th scope='col' className='py-2 px-2 sm:px-3'>Tên</th>
                            <th scope='col' className='py-2 px-2 sm:px-3 hidden lg:table-cell'>Email</th>
                            <th scope='col' className='py-2 px-2 sm:px-3 hidden md:table-cell'>Trạng thái thanh toán</th>
                            <th scope='col' className='py-2 px-2 sm:px-3 hidden xl:table-cell'>Trạng thái</th>
                            <th scope='col' className='py-2 px-2 sm:px-3'>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[1, 2, 3, 4, 5].map((item, i) => (
                            <tr key={i} className='hover:bg-yellow-50 border-b border-gray-200'>
                                <td className='py-2 px-2 sm:px-3 font-medium'>{item}</td>
                                <td className='py-2 px-2 sm:px-3'>
                                    <img
                                        className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover'
                                        src={`/images/sellers/${item}.jpg`}
                                        alt={`Người bán ${item}`}
                                    />
                                </td>
                                <td className='py-2 px-2 sm:px-3 font-medium'>Người bán {item}</td>
                                <td className='py-2 px-2 sm:px-3 font-medium hidden lg:table-cell'>seller{item}@example.com</td>
                                <td className='py-2 px-2 sm:px-3 font-medium hidden md:table-cell'>
                                    Chưa kích hoạt
                                </td>
                                <td className='py-2 px-2 sm:px-3 font-medium hidden xl:table-cell'>
                                    <span className='py-1 px-2 bg-yellow-200 text-yellow-800 rounded-md text-xs'>Đang chờ</span>
                                </td>
                                <td className='py-2 px-2 sm:px-3'>
                                    <div className='flex items-center gap-2'>
                                        <Link
                                            to='#'
                                            className='p-1.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors'
                                            title="Xem chi tiết"
                                        >
                                            <GrView size={14} />
                                        </Link>
                                        <Link
                                            to='#'
                                            className='p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
                                            title="Duyệt yêu cầu"
                                        >
                                            <FaCheck size={14} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className='mt-4'>
                    <Pagination
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={50}
                        parPage={parPage}
                        showItem={Math.min(parPage, 50)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;