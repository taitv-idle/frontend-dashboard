import {
    RiStore3Line,
    RiMoneyDollarCircleLine,
    RiUserForbidLine,
    RiUserAddLine,
    RiChat3Line,
    RiAddBoxLine,
    RiProductHuntLine,
    RiCouponLine,
    RiShoppingBag3Line,
    RiBankLine,
    RiChatSmile2Line,
    RiCustomerService2Line,
    RiUserSettingsLine,
} from 'react-icons/ri';
import { FiPackage } from 'react-icons/fi';
import {AiOutlineDashboard} from "react-icons/ai";
import {BiCategoryAlt} from "react-icons/bi";
export const allNav = [
    {
        id: 1,
        title: 'Bảng điều khiển',
        icon: <AiOutlineDashboard />, // Giữ nguyên - phù hợp
        role: 'admin',
        path: '/admin/dashboard'
    },
    {
        id: 2,
        title: 'Đơn hàng',
        icon: <FiPackage />, // Đổi từ shopping cart sang package (phù hợp với đơn hàng admin)
        role: 'admin',
        path: '/admin/orders'
    },
    {
        id: 3,
        title: 'Danh mục',
        icon: <BiCategoryAlt />, // Đổi sang phiên bản category có thiết kế đẹp hơn
        role: 'admin',
        path: '/admin/category'
    },
    {
        id: 4,
        title: 'Người bán',
        icon: <RiStore3Line />, // Đổi từ users sang store (phù hợp với người bán)
        role: 'admin',
        path: '/admin/sellers'
    },
    {
        id: 5,
        title: 'Yêu cầu thanh toán',
        icon: <RiMoneyDollarCircleLine />, // Đổi sang icon tiền rõ ràng hơn
        role: 'admin',
        path: '/admin/payment-request'
    },
    {
        id: 6,
        title: 'Người bán bị vô hiệu hóa',
        icon: <RiUserForbidLine />, // Icon thể hiện "cấm" rõ ràng hơn
        role: 'admin',
        path: '/admin/deactive-sellers'
    },
    {
        id: 7,
        title: 'Yêu cầu đăng ký người bán',
        icon: <RiUserAddLine />, // Icon thêm người dùng phù hợp hơn
        role: 'admin',
        path: '/admin/sellers-request'
    },
    {
        id: 8,
        title: 'Trò chuyện trực tiếp',
        icon: <RiChat3Line />, // Icon chat đơn giản, hiện đại
        role: 'admin',
        path: '/admin/chat-sellers'
    },
    {
        id: 9,
        title: 'Bảng điều khiển',
        icon: <AiOutlineDashboard />, // Giữ nguyên
        role: 'seller',
        path: '/seller/dashboard'
    },
    {
        id: 10,
        title: 'Thêm sản phẩm',
        icon: <RiAddBoxLine />, // Đổi sang icon thêm có hộp (phù hợp thêm sản phẩm)
        role: 'seller',
        path: '/seller/add-product'
    },
    {
        id: 11,
        title: 'Tất cả sản phẩm',
        icon: <RiProductHuntLine />, // Icon sản phẩm chuyên nghiệp
        role: 'seller',
        path: '/seller/products'
    },
    {
        id: 12,
        title: 'Sản phẩm giảm giá',
        icon: <RiCouponLine />, // Icon coupon thể hiện giảm giá
        role: 'seller',
        path: '/seller/discount-product'
    },
    {
        id: 13,
        title: 'Đơn hàng',
        icon: <RiShoppingBag3Line />, // Icon túi mua hàng phù hợp với seller
        role: 'seller',
        path: '/seller/orders'
    },
    {
        id: 14,
        title: 'Thanh toán',
        icon: <RiBankLine />, // Icon ngân hàng/thẻ phù hợp thanh toán
        role: 'seller',
        path: '/seller/payments'
    },
    {
        id: 15,
        title: 'Trò chuyện với khách hàng',
        icon: <RiChatSmile2Line />, // Icon chat có smile (phù hợp khách hàng)
        role: 'seller',
        path: '/seller/chat-customer'
    },
    {
        id: 16,
        title: 'Trò chuyện với hỗ trợ',
        icon: <RiCustomerService2Line />, // Icon hỗ trợ khách hàng
        role: 'seller',
        path: '/seller/chat-support'
    },
    {
        id: 17,
        title: 'Hồ sơ cá nhân',
        icon: <RiUserSettingsLine />, // Icon profile có setting (thể hiện cá nhân)
        role: 'seller',
        path: '/seller/profile'
    }
];