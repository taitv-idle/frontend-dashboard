import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {

    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className='bg-[#f5ccc3] w-full min-h-screen'>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
            <div className='ml-0 lg:ml-[260px] pt-[120px] transition-all'>
                <Outlet/>
            </div>
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
        </div>
    );
};

export default MainLayout;