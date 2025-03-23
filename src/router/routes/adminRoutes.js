import {lazy} from "react";
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("../../views/admin/AdminOrders"));

export const adminRoutes = [
    {path: 'admin/dashboard', element: <AdminDashboard />, role: 'admin'},
    {path: 'admin/don-hang', element: <AdminOrders />, role: 'admin'},
]