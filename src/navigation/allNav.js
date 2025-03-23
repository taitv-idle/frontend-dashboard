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
        title: 'Đơn hàng',
        icon: <FaShoppingCart />,
        role: 'admin',
        path: '/admin/don-hang'
    },
    {
        id: 3,
        title: 'Danh mục',
        icon: <BiSolidCategoryAlt />,
        role: 'admin',
        path: '/admin/danh-muc'
    },
    {
        id: 4,
        title: 'Người bán',
        icon: <FaUsers />,
        role: 'admin',
        path: '/admin/nguoi-ban'
    },
    {
        id: 5,
        title: 'Yêu cầu thanh toán',
        icon: <MdPayments />,
        role: 'admin',
        path: '/admin/yeu-cau-thanh-toan'
    },
    {
        id: 6,
            title: 'Hủy người bán',
        icon: <FaUserCog />,
        role: 'admin',
        path: '/admin/huy-nguoi-ban'
    },
    {
        id: 7,
        title: 'Yêu cầu người bán',
        icon: <FaUserPlus />,
        role: 'admin',
        path: '/admin/yeu-cau-nguoi-ban'
    },
    {
        id: 8,
        title: 'Tin nhắn',
        icon: <IoLogoWechat />,
        role: 'admin',
        path: '/admin/tin-nhan'
    },
]