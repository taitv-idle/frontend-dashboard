import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import {getNav} from "../navigation/index";
import { RiLogoutCircleRFill } from "react-icons/ri";

const Sidebar = () => {

    const {pathname} = useLocation();
    const [allNav, setAllNav] = useState([]);
    useEffect(() => {
        const navs = getNav('admin');
        setAllNav(navs);
    }, []);
    console.log(allNav);

    return (
        <div>
            <div></div>
            <div
                className='w-[260px] fixed bg-[#ea9481] z-50 top-0 h-screen shadow-[0_0-15px_15px_o_rgb(34_41_47_/_5%)] transition-all'>
                <div className='flex justify-center items-center'>
                    <Link to='/' className='w-[180px] h-[50px]'>
                        <img className='w-full h-full' src={`${window.location.origin}/images/logo.png`} alt="Logo"/>
                    </Link>
                </div>
                <div className='px-[16px]'>
                    <ul>
                        {allNav.map((nav, index) => (
                            <li key={index}>
                                <Link
                                    to={nav.path}
                                    className={`w-full mb-1 mt-3 px-[12px] py-[9px] flex justify-start items-center gap-[12px] rounded-sm transition-all duration-200 
                                    ${pathname === nav.path
                                        ? 'bg-red-700 shadow-amber-500/50 text-white duration-500'
                                        : 'text-[#030811] font-bold hover:pl-4'}`}
                                >
                                    <span>{nav.icon}</span>
                                    <span>{nav.title}</span>
                                </Link>

                            </li>
                        ))}
                        <li>
                            <button
                                className='text-[#030811] font-bold hover:pl-4 w-full mb-1 mt-3 px-[12px] py-[9px] flex justify-start items-center gap-[12px] rounded-sm transition-all duration-200'>
                                <span>{<RiLogoutCircleRFill/>}</span>
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