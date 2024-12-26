import { AiFillDashboard } from "react-icons/ai";
import { FaShoppingCart, FaUsers, FaUserCog, FaUserPlus } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdPayments } from "react-icons/md";
import { IoLogoWechat } from "react-icons/io5";

export const allNav = [
    {
        id: 1,
        title: 'Dashboard',
        icon: <AiFillDashboard />,
        role: 'admin',
        path: '/admin/dashboard'
    },
    {
        id: 2,
        title: 'Order',
        icon: <FaShoppingCart />,
        role: 'admin',
        path: '/admin/order'
    },
    {
        id: 3,
        title: 'Category',
        icon: <BiSolidCategoryAlt />,
        role: 'admin',
        path: '/admin/category'
    },
    {
        id: 4,
        title: 'Sellers',
        icon: <FaUsers />,
        role: 'admin',
        path: '/admin/seller'
    },
    {
        id: 5,
        title: 'Payment Request',
        icon: <MdPayments />,
        role: 'admin',
        path: '/admin/payment-request'
    },
    {
        id: 6,
            title: 'Deactivate Sellers',
        icon: <FaUserCog />,
        role: 'admin',
        path: '/admin/deactivate-seller'
    },
    {
        id: 7,
        title: 'Sellers Request',
        icon: <FaUserPlus />,
        role: 'admin',
        path: '/admin/seller-request'
    },
    {
        id: 8,
        title: 'Live Chat',
        icon: <IoLogoWechat />,
        role: 'admin',
        path: '/admin/live-chat'
    },
]