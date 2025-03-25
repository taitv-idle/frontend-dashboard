import {lazy} from "react";
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Orders = lazy(() => import("../../views/admin/Orders"));
const Category = lazy(() => import("../../views/admin/Category"));
const Sellers = lazy(() => import("../../views/admin/Sellers"));
const PaymentRequest = lazy(() => import("../../views/admin/PaymentRequest"));

export const adminRoutes = [
    {path: 'admin/dashboard', element: <AdminDashboard />, role: 'admin'},
    {path: 'admin/don-hang', element: <Orders />, role: 'admin'},
    {path: 'admin/danh-muc', element: <Category />, role: 'admin'},
    {path: 'admin/nguoi-ban', element: <Sellers />, role: 'admin'},
    {path: 'admin/yeu-cau-thanh-toan', element: <PaymentRequest />, role: 'admin'},
]