import {lazy} from "react";
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Orders = lazy(() => import("../../views/admin/Orders"));
const Category = lazy(() => import("../../views/admin/Category"));

export const adminRoutes = [
    {path: 'admin/dashboard', element: <AdminDashboard />, role: 'admin'},
    {path: 'admin/don-hang', element: <Orders />, role: 'admin'},
    {path: 'admin/danh-muc', element: <Category />, role: 'admin'},
]