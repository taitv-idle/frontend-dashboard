import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { getNav } from "../navigation/index";
import { RiLogoutCircleRFill } from "react-icons/ri";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const { pathname } = useLocation();
    const [allNav, setAllNav] = useState([]);

    useEffect(() => {
        const navs = getNav('admin');
        setAllNav(navs);
    }, []);

    // Hàm ẩn sidebar khi nhấp vào menu hoặc logout trên mobile
    const handleMenuClick = () => {
        if (window.innerWidth < 1024) { // Chỉ ẩn trên mobile (dưới 1024px)
            setShowSidebar(false);
        }
    };

    return (
        <div>
            {/* Overlay để ẩn sidebar khi nhấp ra ngoài */}
            <div
                onClick={() => setShowSidebar(false)}
                className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-200 ${
                    showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'
                } lg:hidden`}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 h-screen w-60 lg:w-[260px] bg-[#ea9481] z-50 shadow-[0_0_15px_rgba(34,41,47,0.05)] transition-transform duration-300 ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Logo */}
                <div className='flex justify-center items-center py-3'>
                    <Link to='/' className='w-32 lg:w-[180px] h-10 lg:h-[50px]' onClick={handleMenuClick}>
                        <img
                            className='w-full h-full object-contain'
                            src={`${window.location.origin}/images/logo.png`}
                            alt="Logo"
                        />
                    </Link>
                </div>

                {/* Menu */}
                <div className='px-3 lg:px-[16px]'>
                    <ul>
                        {allNav.map((nav, index) => (
                            <li key={index}>
                                <Link
                                    to={nav.path}
                                    onClick={handleMenuClick}
                                    className={`flex items-center gap-2 lg:gap-[12px] px-2 lg:px-[12px] py-1.5 lg:py-[9px] mb-1 mt-2 lg:mt-3 rounded-sm text-sm lg:text-base font-bold transition-all duration-200 ${
                                        pathname === nav.path
                                            ? 'bg-red-700 text-white shadow-md'
                                            : 'text-[#030811] hover:bg-red-600 hover:text-white hover:pl-3 lg:hover:pl-4'
                                    }`}
                                >
                                    <span className='text-base lg:text-lg'>{nav.icon}</span>
                                    <span>{nav.title}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleMenuClick}
                                className='flex items-center gap-2 lg:gap-[12px] px-2 lg:px-[12px] py-1.5 lg:py-[9px] mb-1 mt-2 lg:mt-3 w-full text-sm lg:text-base font-bold text-[#030811] hover:bg-red-600 hover:text-white hover:pl-3 lg:hover:pl-4 rounded-sm transition-all duration-200'
                            >
                                <span className='text-base lg:text-lg'><RiLogoutCircleRFill /></span>
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;