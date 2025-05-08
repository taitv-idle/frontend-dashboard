import React from 'react';
import { FaList, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <div className='fixed top-0 left-0 w-full py-4 px-2 lg:px-7 z-40'>
            <div className='ml-0 lg:ml-[260px] rounded-lg h-[70px] flex justify-between items-center bg-gradient-to-r from-[#6a64f1] to-[#8b85f5] px-5 transition-all shadow-md'>

                {/* Nút menu cho mobile */}
                <div
                    onClick={() => setShowSidebar(!showSidebar)}
                    className='w-[40px] flex lg:hidden h-[40px] rounded-md bg-white bg-opacity-20 shadow-lg hover:shadow-indigo-500/50 justify-center items-center cursor-pointer transition-all hover:bg-opacity-30'
                >
                    <span className='text-white'><FaList /></span>
                </div>

                {/* Ô tìm kiếm */}
                <div className='hidden md:flex items-center relative w-[300px]'>
                    <input
                        className='w-full px-4 py-2 pl-10 outline-none border-0 bg-white bg-opacity-20 rounded-md text-white placeholder-white placeholder-opacity-70 focus:bg-opacity-30 transition-all'
                        type="text"
                        name='search'
                        placeholder='Tìm kiếm...'
                    />
                    <FaSearch className='absolute left-3 text-white text-opacity-80' />
                </div>

                {/* Thông tin người dùng */}
                <div className='flex justify-center items-center gap-6 relative'>
                    <div className='flex justify-center items-center'>
                        <div className='flex justify-center items-center gap-3'>
                            <div className='flex justify-center items-center flex-col text-end'>
                                <h2 className='text-md font-bold text-white'>{userInfo.name}</h2>
                                <span className='text-sm font-medium text-white text-opacity-80'>
                  {userInfo.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
                            </div>

                            <div className='relative'>
                                {userInfo.role === 'admin' ? (
                                    <img
                                        className='w-[45px] h-[45px] rounded-full border-2 border-white border-opacity-30 object-cover'
                                        src="/images/admin.png"
                                        alt="Admin"
                                    />
                                ) : (
                                    <img
                                        className='w-[45px] h-[45px] rounded-full border-2 border-white border-opacity-30 object-cover'
                                        src={userInfo.image}
                                        alt="User"
                                    />
                                )}
                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;