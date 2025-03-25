import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import Pagination from "../Pagination";

const Category = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false); // Hiển thị/ẩn form trên mobile

    return (
        <div className='px-2 sm:px-4 lg:px-7 pt-5'>
            <div className='flex flex-col lg:flex-row w-full gap-4'>
                {/* Bảng danh mục */}
                <div className='w-full bg-white rounded-lg shadow-md p-4'>
                    {/* Bộ lọc và tìm kiếm */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4'>
                        <select
                            onChange={(e) => setParPage(parseInt(e.target.value))}
                            className='px-3 py-1.5 w-full sm:w-24 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none text-sm'
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                        <input
                            className='px-3 py-1.5 w-full sm:w-64 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400 text-sm'
                            type="text"
                            placeholder='Tìm kiếm danh mục...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Bảng */}
                    <div className="relative overflow-x-auto">
                        <table className='w-full text-sm text-left text-gray-800'>
                            <thead className='text-xs uppercase bg-gray-100 text-gray-600 border-b border-gray-200'>
                            <tr>
                                <th scope='col' className='py-2 px-2 sm:px-4'>TT</th>
                                <th scope='col' className='py-2 px-2 sm:px-4'>Hình ảnh</th>
                                <th scope='col' className='py-2 px-2 sm:px-4'>Tên</th>
                                <th scope='col' className='py-2 px-2 sm:px-4 sm:table-cell'>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[1, 2, 3, 4, 5].map((item, i) => (
                                <tr key={i} className='hover:bg-gray-50 border-b border-gray-200'>
                                    <td className='py-2 px-2 sm:px-4 font-medium'>{item}</td>
                                    <td className='py-2 px-2 sm:px-4'>
                                        <img
                                            className='w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover'
                                            src={`/images/category/${item}.jpg`}
                                            alt={`Danh mục ${item}`}
                                        />
                                    </td>
                                    <td className='py-2 px-2 sm:px-4 font-medium'>Sản phẩm {item}</td>
                                    <td className='py-2 px-2 sm:px-4 hidden sm:table-cell'>
                                        <div className='flex items-center gap-2'>
                                            <Link
                                                to='#'
                                                className='p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Link
                                                to='#'
                                                className='p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                                                title="Xóa"
                                            >
                                                <MdDeleteForever />
                                            </Link>
                                        </div>
                                    </td>
                                    {/* Hành động trên mobile */}
                                    <td className='py-2 px-2 sm:hidden'>
                                        <div className='flex items-center gap-1'>
                                            <Link to='#' className='p-1 bg-blue-500 text-white rounded hover:bg-blue-600'>
                                                <FaEdit size={14} />
                                            </Link>
                                            <Link to='#' className='p-1 bg-red-500 text-white rounded hover:bg-red-600'>
                                                <MdDeleteForever size={14} />
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

                {/* Form thêm danh mục */}
                <div
                    className={`w-full lg:w-5/12 bg-gray-100 p-4 rounded-lg shadow-md ${show ? 'block' : 'hidden lg:block'}`}
                >
                    <div className='w-full'>
                        <h2 className='text-lg font-semibold text-gray-800 mb-4 text-center'>Thêm danh mục</h2>
                        <form>
                            <div className='mb-4'>
                                <label htmlFor="name" className='block text-gray-700 font-medium text-sm mb-1'>Tên danh mục</label>
                                <input
                                    className='w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400 text-sm'
                                    type="text"
                                    id='name'
                                    name='danh_muc'
                                    placeholder='Nhập tên danh mục'
                                />
                            </div>

                            <div className='mb-4'>
                                <label
                                    className='flex justify-center items-center flex-col h-40 w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors'
                                    htmlFor='image'
                                >
                                    <FaImage className='text-2xl text-gray-500 mb-2' />
                                    <span className='text-gray-600 text-sm'>Chọn hình ảnh</span>
                                    <input className='hidden' type="file" name='image' id='image' />
                                </label>
                            </div>

                            <button
                                type='submit'
                                className='w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm'
                            >
                                Thêm danh mục
                            </button>
                        </form>
                    </div>
                </div>

                {/* Nút toggle form trên mobile */}
                <button
                    onClick={() => setShow(!show)}
                    className='lg:hidden fixed bottom-4 right-4 p-2 bg-red-300 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors text-sm'
                >
                    {show ? 'Ẩn' : 'Thêm Danh Mục'}
                </button>
            </div>
        </div>
    );
};

export default Category;