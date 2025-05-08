import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

/**
 * Lấy danh sách đơn hàng cho admin
 * @param {Object} params - Các tham số phân trang và tìm kiếm
 * @param {number} params.parPage - Số lượng đơn hàng mỗi trang
 * @param {number} params.page - Trang hiện tại
 * @param {string} params.searchValue - Từ khóa tìm kiếm
 */
export const get_admin_orders = createAsyncThunk(
    'orders/get_admin_orders',
    async({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/admin/orders?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Lấy chi tiết một đơn hàng cho admin
 * @param {string} orderId - ID của đơn hàng cần lấy
 */
export const get_admin_order = createAsyncThunk(
    'orders/get_admin_order',
    async(orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/admin/order/${orderId}`,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Cập nhật trạng thái đơn hàng (admin)
 * @param {Object} params
 * @param {string} params.orderId - ID đơn hàng cần cập nhật
 * @param {Object} params.info - Thông tin cập nhật (trạng thái mới)
 */
export const admin_order_status_update = createAsyncThunk(
    'orders/admin_order_status_update',
    async({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/admin/order-status/update/${orderId}`,
                info,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Lấy danh sách đơn hàng cho seller
 * @param {Object} params - Các tham số phân trang và tìm kiếm
 * @param {number} params.parPage - Số lượng đơn hàng mỗi trang
 * @param {number} params.page - Trang hiện tại
 * @param {string} params.searchValue - Từ khóa tìm kiếm
 * @param {string} params.sellerId - ID của seller
 */
export const get_seller_orders = createAsyncThunk(
    'orders/get_seller_orders',
    async({ parPage, page, searchValue, sellerId }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Lấy chi tiết một đơn hàng cho seller
 * @param {string} orderId - ID của đơn hàng cần lấy
 */
export const get_seller_order = createAsyncThunk(
    'orders/get_seller_order',
    async(orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/seller/order/${orderId}`,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Cập nhật trạng thái đơn hàng (seller)
 * @param {Object} params
 * @param {string} params.orderId - ID đơn hàng cần cập nhật
 * @param {Object} params.info - Thông tin cập nhật (trạng thái mới)
 */
export const seller_order_status_update = createAsyncThunk(
    'orders/seller_order_status_update',
    async({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(
                `/seller/order-status/update/${orderId}`,
                info,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Redux slice quản lý state liên quan đến đơn hàng
 */
export const OrderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',    // Thông báo thành công
        errorMessage: '',      // Thông báo lỗi
        totalOrder: 0,         // Tổng số đơn hàng
        order: {},             // Chi tiết một đơn hàng
        myOrders: [],          // Danh sách đơn hàng
        loader: false          // Trạng thái loading (mới thêm)
    },
    reducers: {
        /**
         * Xóa các thông báo trong state
         */
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý khi lấy danh sách đơn hàng admin thành công
            .addCase(get_admin_orders.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.myOrders = payload.orders;
                state.totalOrder = payload.totalOrder;
            })
            .addCase(get_admin_orders.rejected, (state) => {
                state.loader = false;
            })

            // Xử lý khi lấy chi tiết đơn hàng admin thành công
            .addCase(get_admin_order.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_admin_order.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.order = payload.order;
            })
            .addCase(get_admin_order.rejected, (state) => {
                state.loader = false;
            })

            // Xử lý khi cập nhật trạng thái đơn hàng admin
            .addCase(admin_order_status_update.pending, (state) => {
                state.loader = true;
            })
            .addCase(admin_order_status_update.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(admin_order_status_update.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })

            // Xử lý khi lấy danh sách đơn hàng seller thành công
            .addCase(get_seller_orders.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.myOrders = payload.orders;
                state.totalOrder = payload.totalOrder;
            })
            .addCase(get_seller_orders.rejected, (state) => {
                state.loader = false;
            })

            // Xử lý khi lấy chi tiết đơn hàng seller thành công
            .addCase(get_seller_order.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_seller_order.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.order = payload.order;
            })
            .addCase(get_seller_order.rejected, (state) => {
                state.loader = false;
            })

            // Xử lý khi cập nhật trạng thái đơn hàng seller
            .addCase(seller_order_status_update.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_order_status_update.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            });
    }
});

export const { messageClear } = OrderReducer.actions;
export default OrderReducer.reducer;