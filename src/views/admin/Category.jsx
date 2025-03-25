import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {FaEdit} from "react-icons/fa";
import {MdDeleteForever} from "react-icons/md";
import Pagination from "../Pagination";

const Category = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false)
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex flex-wrap w-full '>
                <div className='w-full bg-[#dfac3f] lg:w-7/12 rounded-md'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                        <select
                            onChange={(e) => setParPage(parseInt(e.target.value))}
                            className='px-4 py-2 w-full sm:w-auto hover:border-white outline-none bg-[#dfac3f] border border-slate-700 rounded-md text-[#3c2c0a]'
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                        <input
                            className='px-4 py-2 w-full sm:w-auto focus:border-indigo-400 outline-none bg-[#fff] border border-slate-700 rounded-md'
                            type="text"
                            placeholder='Tìm kiếm'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative overflow-x-auto">
                        <table className='w-full text-sm text-left text-[#d0d2d6] uppercase border-b border-slate-600'>
                            <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>TT</th>
                                <th scope='col' className='py-3 px-4'>Hình ảnh</th>
                                <th scope='col' className='py-3 px-4'>Tên</th>
                                <th scope='col' className='py-3 px-4'>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [1,2,3,4,5].map((item, i) => (
                                    <tr key={i}>
                                        <td className='py-3 px-6 font-medium whitespace-nowrap'>{item}</td>
                                        <td className='py-3 px-6 font-medium whitespace-nowrap'>
                                            <img className='w-[45px] h-[45px]' src={`/images/category/${item}.jpg`} alt="" />

                                        </td>
                                        <td className='py-3 px-6 font-medium whitespace-nowrap'>San pham 1</td>
                                        <td className='py-3 px-6 font-medium whitespace-nowrap'>
                                           <div className='flex justify-start items-center gap-4'>
                                               <Link className='p-[6px] bg-amber-700 rounded hover:shadow-lg hover:shadow-amber-700' to='#'><FaEdit /></Link>
                                               <Link className='p-[6px] bg-amber-700 rounded hover:shadow-lg hover:shadow-amber-700' to='#'><MdDeleteForever /></Link>

                                           </div>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                    {/* Phân trang */}
                    <div className='mt-5'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={50}
                            parPage={parPage}
                            showItem={Math.min(parPage, 50)}
                        />
                    </div>
                </div>

                <div className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 ${show ? 'right-0' : '-right-[340px]'} z-20 top-0 transition-all duration-500`}>
                    <div className='w-full pl-5'>
                        <div className='bg-amber-100 h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#ddd]'>
                            <h2 className='text-blue-600 font-semibold text-xl mb-4 w-full text-center'>Thêm danh mục</h2>
                            <form action="">
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor="name">Tên danh mục</label>
                                    <input className='px-4 py-2 w-full sm:w-auto focus:border-indigo-400 outline-none bg-[#fff] border border-slate-700 rounded-md' type="text" id='name' name='danh_muc'placeholder='Tên danh mục'/>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;