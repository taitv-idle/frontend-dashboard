import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import logo from '../assets/logo.png';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const dispatch = useDispatch();
    const { role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [allNav, setAllNav] = useState([]);

    useEffect(() => {
        const navs = getNav(role);
        setAllNav(navs);
    }, [role]);

    const handleLogout = () => {
        dispatch(logout({ navigate, role }));
    };

    return (
        <>
            {/* Overlay khi sidebar mở trên mobile */}
            <div
                onClick={() => setShowSidebar(false)}
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                    showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'
                } lg:hidden`}
            />

            {/* Sidebar chính */}
            <div
                className={`w-64 fixed bg-gradient-to-b from-[#4f46e5] to-[#6d67f0] z-50 top-0 h-screen shadow-xl transition-all duration-300 ${
                    showSidebar ? 'left-0' : '-left-64 lg:left-0'
                }`}
            >
                {/* Header sidebar */}
                <div className='h-20 flex items-center justify-between px-6 border-b border-white border-opacity-10'>
                    <Link to='/' className='flex items-center'>
                        <img
                            className='h-10 object-contain'
                            src={logo}
                            alt="Logo"
                        />
                        <span className='ml-3 text-white font-bold text-xl'>Admin Panel</span>
                    </Link>

                    {/* Nút đóng sidebar trên mobile */}
                    <button
                        onClick={() => setShowSidebar(false)}
                        className='lg:hidden text-white text-2xl'
                    >
                        <FiMenu />
                    </button>
                </div>

                {/* Nội dung sidebar */}
                <div className='p-4 overflow-y-auto h-[calc(100vh-5rem)]'>
                    <ul className='space-y-2'>
                        {allNav.map((navItem, index) => (
                            <li key={index}>
                                <Link
                                    to={navItem.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                                        pathname === navItem.path
                                            ? 'bg-white text-indigo-600 shadow-md'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                                >
                                    <span className='text-xl mr-3'>{navItem.icon}</span>
                                    <span className='font-medium'>{navItem.title}</span>
                                </Link>
                            </li>
                        ))}

                        {/* Nút logout */}
                        <li className='mt-6 pt-4 border-t border-white border-opacity-10'>
                            <button
                                onClick={handleLogout}
                                className='flex items-center w-full px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all'
                            >
                                <span className='text-xl mr-3'><BiLogOutCircle /></span>
                                <span className='font-medium'>Đăng xuất</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;