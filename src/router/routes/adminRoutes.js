import {lazy} from "react";
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Orders = lazy(() => import("../../views/admin/Orders"));
const Category = lazy(() => import("../../views/admin/Category"));
const Sellers = lazy(() => import("../../views/admin/Sellers"));
const PaymentRequest = lazy(() => import("../../views/admin/PaymentRequest"));
const DeactiveSellers = lazy(() => import("../../views/admin/DeactiveSellers"));
const SellerRequest = lazy(() => import("../../views/admin/SellerRequest"));
const SellerDetails = lazy(() => import("../../views/admin/SellerDetails"));
const ChatSeller = lazy(() => import("../../views/admin/ChatSeller"));

export const adminRoutes = [
    {path: 'admin/dashboard', element: <AdminDashboard />, role: 'admin'},
    {path: 'admin/don-hang', element: <Orders />, role: 'admin'},
    {path: 'admin/danh-muc', element: <Category />, role: 'admin'},
    {path: 'admin/nguoi-ban', element: <Sellers />, role: 'admin'},
    {path: 'admin/yeu-cau-thanh-toan', element: <PaymentRequest />, role: 'admin'},
    {path: 'admin/huy-nguoi-ban', element: <DeactiveSellers />, role: 'admin'},
    {path: 'admin/yeu-cau-nguoi-ban', element: <SellerRequest />, role: 'admin'},
    {path: 'admin/nguoi-ban/thong-tin/:sellerId', element: <SellerDetails />, role: 'admin'},
    {path: 'admin/tin-nhan', element: <ChatSeller />, role: 'admin'},

]