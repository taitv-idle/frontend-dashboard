import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/admin/get-dashboard-data', { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_seller_dashboard_data = createAsyncThunk(
    'dashboard/get_seller_dashboard_data',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/seller/get-dashboard-data', { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState: {
        totalSale: 0,
        totalOrder: 0,
        totalProduct: 0,
        totalPendingOrder: 0,
        totalSeller: 0,
        recentOrder: [],
        recentMessage: [],
        monthlyData: [], // Thêm trường mới cho dữ liệu theo tháng
        loading: false,
        errorMessage: ""
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái pending
            .addCase(get_admin_dashboard_data.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_seller_dashboard_data.pending, (state) => {
                state.loading = true;
            })

            // Xử lý khi thành công
            .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.totalSale = payload.totalSale || 0;
                state.totalOrder = payload.totalOrder || 0;
                state.totalProduct = payload.totalProduct || 0;
                state.totalSeller = payload.totalSeller || 0;
                state.recentOrder = payload.recentOrders || [];
                state.recentMessage = payload.messages || [];
                state.monthlyData = payload.monthlyData || []; // Thêm dữ liệu theo tháng
            })
            .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
                state.loading = false;
                // Tính tổng doanh thu từ các đơn hàng đã thanh toán
                const totalSale = payload.recentOrders?.reduce((total, order) => {
                    if (order.payment_status === 'paid' || order.payment_status === 'completed') {
                        return total + (order.price || 0);
                    }
                    return total;
                }, 0) || 0;
                
                state.totalSale = totalSale;
                state.totalOrder = payload.totalOrder || 0;
                state.totalProduct = payload.totalProduct || 0;
                state.totalPendingOrder = payload.totalPendingOrder || 0;
                state.recentOrder = payload.recentOrders || [];
                state.recentMessage = payload.messages || [];
                state.monthlyData = payload.monthlyData || []; // Thêm dữ liệu theo tháng
            })

            // Xử lý khi có lỗi
            .addCase(get_admin_dashboard_data.rejected, (state, { payload }) => {
                state.loading = false;
                state.errorMessage = payload?.message || "Lỗi khi tải dữ liệu dashboard";
            })
            .addCase(get_seller_dashboard_data.rejected, (state, { payload }) => {
                state.loading = false;
                state.errorMessage = payload?.message || "Lỗi khi tải dữ liệu dashboard";
            });
    }
});

export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;