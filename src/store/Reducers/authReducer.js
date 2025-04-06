import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

/**
 * Thực hiện đăng nhập admin
 * @param {Object} info - Thông tin đăng nhập (email, password)
 * @returns {Promise} - Promise chứa kết quả đăng nhập
 */
export const admin_login = createAsyncThunk(
    "auth/admin_login",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/admin-login", info, {
                withCredentials: true,
            });
            localStorage.setItem("accessToken", data.token); // Lưu token vào localStorage
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Thực hiện đăng nhập seller
 * @param {Object} info - Thông tin đăng nhập (email, password)
 * @returns {Promise} - Promise chứa kết quả đăng nhập
 */
export const seller_login = createAsyncThunk(
    "auth/seller_login",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/seller-login", info, {
                withCredentials: true,
            });
            localStorage.setItem("accessToken", data.token); // Lưu token vào localStorage
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Lấy thông tin người dùng hiện tại
 * @returns {Promise} - Promise chứa thông tin người dùng
 */
export const get_user_info = createAsyncThunk(
    "auth/get_user_info",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get("/get-user", { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Upload ảnh đại diện
 * @param {File} image - File ảnh cần upload
 * @returns {Promise} - Promise chứa kết quả upload
 */
export const profile_image_upload = createAsyncThunk(
    "auth/profile_image_upload",
    async (image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/profile-image-upload", image, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Đăng ký tài khoản seller
 * @param {Object} info - Thông tin đăng ký
 * @returns {Promise} - Promise chứa kết quả đăng ký
 */
export const seller_register = createAsyncThunk(
    "auth/seller_register",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/seller-register", info, {
                withCredentials: true,
            });
            localStorage.setItem("accessToken", data.token); // Lưu token vào localStorage
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Thêm thông tin cá nhân
 * @param {Object} info - Thông tin cá nhân cần thêm
 * @returns {Promise} - Promise chứa kết quả
 */
export const profile_info_add = createAsyncThunk(
    "auth/profile_info_add",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/profile-info-add", info, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Kiểm tra và trả về role từ token
 * @param {String} token - JWT token
 * @returns {String} - Role của người dùng hoặc chuỗi rỗng nếu không hợp lệ
 */
const returnRole = (token) => {
    if (token) {
        const decodeToken = jwtDecode(token);
        const expireTime = new Date(decodeToken.exp * 1000); // Chuyển đổi thời gian hết hạn
        if (new Date() > expireTime) {
            localStorage.removeItem("accessToken"); // Xóa token nếu hết hạn
            return "";
        } else {
            return decodeToken.role; // Trả về role nếu token còn hạn
        }
    } else {
        return "";
    }
};

/**
 * Thực hiện đăng xuất
 * @param {Object} param0 - Chứa navigate và role
 * @returns {Promise} - Promise chứa kết quả đăng xuất
 */
export const logout = createAsyncThunk(
    "auth/logout",
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get("/logout", { withCredentials: true });
            localStorage.removeItem("accessToken"); // Xóa token khi đăng xuất
            // Chuyển hướng tùy theo role
            if (role === "admin") {
                navigate("/admin/login");
            } else {
                navigate("/login");
            }
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Thay đổi mật khẩu
 * @param {Object} info - Thông tin mật khẩu (mật khẩu cũ, mật khẩu mới)
 * @returns {Promise} - Promise chứa kết quả thay đổi mật khẩu
 */
export const change_password = createAsyncThunk(
    "auth/change_password",
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/change-password", info, {
                withCredentials: true,
            });
            return fulfillWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Tạo auth reducer
export const authReducer = createSlice({
    name: "auth",
    initialState: {
        successMessage: "", // Thông báo thành công
        errorMessage: "", // Thông báo lỗi
        loader: false, // Trạng thái loading
        userInfo: "", // Thông tin người dùng
        role: returnRole(localStorage.getItem("accessToken")), // Role từ token
        token: localStorage.getItem("accessToken"), // Token từ localStorage
    },
    reducers: {
        // Xóa thông báo
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái đăng nhập admin
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            // Xử lý trạng thái đăng nhập seller
            .addCase(seller_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            // Xử lý trạng thái đăng ký seller
            .addCase(seller_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            // Xử lý lấy thông tin người dùng
            .addCase(get_user_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
            })

            // Xử lý upload ảnh đại diện
            .addCase(profile_image_upload.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message;
            })

            // Xử lý thêm thông tin cá nhân
            .addCase(profile_info_add.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_info_add.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message;
            })

            // Xử lý thay đổi mật khẩu
            .addCase(change_password.pending, (state) => {
                state.loader = true;
                state.errorMessage = null;
            })
            .addCase(change_password.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload;
            })
            .addCase(change_password.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload;
            });
    },
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;