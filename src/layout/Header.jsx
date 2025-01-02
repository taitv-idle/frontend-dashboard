import React from 'react';
import {FaList} from "react-icons/fa";

const Header = ({showSidebar, setShowSidebar}) => {
    return (
        <div className='fixed top-0 left-0 w-full py-5 px-2 lg:px-7 z-40'>
            <div
                className='ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-amber-700 px-5 transition-all'>
                <div onClick={() => setShowSidebar(!showSidebar)}
                     className='w-[35px] flex lg:hidden h-[35px] rounded-sm bg-[#d7ea81] shadow-lg hover:shadow-amber-400/50 justify-center items-center cursor-pointer'>
                    <span><FaList/></span>
                </div>
                <div className='hidden md:block'>
                    <input className='px-3 py-1 outline-none border bg-transparent border-slate-700 rounded-md text-[#81d7ea] focus:border-amber-500 overflow-hidden' type="text" name="search" placeholder="Search"/>
                </div>
                <div className='flex justify-center items-center gap-8 relative'>
                    <div className='flex justify-center items-center'>
                        <div className='flex justify-center items-center gap-3'>
                            <div className='flex justify-center items-center flex-col text-end'>
                                <h2 className='text-md font-bold text-[#e6eefb]'>Truong Van Tai</h2>
                                <span className='text-[#e6f9fb] w-full font-normal'>admin</span>
                            </div>
                            <img className='w-[46px] h-[46px] rounded-full overflow-hidden' src="http://localhost:3000/images/admin.png" alt="admin-im"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;