import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { socket } from '../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';

const MainLayout = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (userInfo && userInfo.role === 'seller') {
            socket.emit('add_seller', userInfo._id, userInfo);
        } else {
            socket.emit('add_admin', userInfo);
        }
    }, [userInfo]);

    useEffect(() => {
        socket.on('activeCustomer', (customers) => {
            dispatch(updateCustomer(customers));
        });
        socket.on('activeSeller', (sellers) => {
            dispatch(updateSellers(sellers));
        });

        return () => {
            socket.off('activeCustomer');
            socket.off('activeSeller');
        };
    }, [dispatch]);

    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-screen'>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

            <div className={`ml-0 lg:ml-[260px] pt-[85px] transition-all duration-300 px-4 lg:px-8 pb-8`}>
                <div className='bg-white rounded-xl shadow-sm p-4 lg:p-6 min-h-[calc(100vh-120px)]'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;