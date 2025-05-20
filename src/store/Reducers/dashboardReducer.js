import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

// Get admin dashboard data
export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/get-dashboard-data', {
                withCredentials: true
            })
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// Get seller dashboard data
export const get_seller_dashboard_data = createAsyncThunk(
    'dashboard/get_seller_dashboard_data',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/seller/get-dashboard-data', {
                withCredentials: true
            })
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    totalSale: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalSeller: 0,
    monthlyData: [],
    orderStatusStats: [],
    paymentMethodStats: [],
    topProducts: [],
    newSellers: [],
    recentOrder: [],
    errorMessage: '',
    successMessage: '',
    loading: false
}

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            // Get admin dashboard data
            .addCase(get_admin_dashboard_data.pending, (state) => {
                state.loading = true
            })
            .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
                state.loading = false
                state.totalSale = payload.totalSale
                state.totalOrder = payload.totalOrder
                state.totalProduct = payload.totalProduct
                state.totalSeller = payload.totalSeller
                state.monthlyData = payload.monthlyData
                state.orderStatusStats = payload.orderStatusStats
                state.paymentMethodStats = payload.paymentMethodStats
                state.topProducts = payload.topProducts
                state.newSellers = payload.newSellers
                state.recentOrder = payload.recentOrders
                state.successMessage = 'Dashboard data loaded successfully'
            })
            .addCase(get_admin_dashboard_data.rejected, (state, { payload }) => {
                state.loading = false
                state.errorMessage = payload?.error || 'Failed to load dashboard data'
            })
            // Get seller dashboard data
            .addCase(get_seller_dashboard_data.pending, (state) => {
                state.loading = true
            })
            .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
                state.loading = false
                state.totalSale = payload.totalSale
                state.totalOrder = payload.totalOrder
                state.totalProduct = payload.totalProduct
                state.monthlyData = payload.monthlyData
                state.recentOrder = payload.recentOrders
                state.successMessage = 'Dashboard data loaded successfully'
            })
            .addCase(get_seller_dashboard_data.rejected, (state, { payload }) => {
                state.loading = false
                state.errorMessage = payload?.error || 'Failed to load dashboard data'
            })
    }
})

export const { messageClear } = dashboardReducer.actions
export default dashboardReducer.reducer