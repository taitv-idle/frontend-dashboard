import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

export const add_product = createAsyncThunk(
    'product/add_product',
    async(product,{rejectWithValue, fulfillWithValue}) => {
        
        try { 
            const {data} = await api.post('/product-add',product,{withCredentials: true}) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)



export const get_products = createAsyncThunk(
    'product/get_products',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  


  
export const get_product = createAsyncThunk(
    'product/get_product',
    async(productId, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get(`/product-details/${productId}`, {withCredentials: true})
            console.log('API Response:', data);
            if (data.product && typeof data.product.description === 'string') {
                // Ensure description is properly formatted HTML if needed
                data.product.description = data.product.description.trim();
            }
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const delete_product = createAsyncThunk(
    'product/delete_product',
    async (productId, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Thêm log để xem URL đầy đủ
            const fullUrl = `${api.defaults.baseURL}/product-delete/${productId}`;
            console.log('Making DELETE request to:', fullUrl);

            const { data } = await api.delete(`/product-delete/${productId}`, { withCredentials: true });
            console.log('API response:', data);
            return fulfillWithValue(data);
        } catch (error) {
            console.error('API error details:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            }
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);


  
export const update_product = createAsyncThunk(
    'product/update_product',
    async( product ,{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.post('/product-update', product,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  


  export const product_image_update = createAsyncThunk(
    'product/product_image_update',
    async( {oldImage,newImage,productId} ,{rejectWithValue, fulfillWithValue}) => {
        
        try {

            const formData = new FormData()
            formData.append('oldImage', oldImage)
            formData.append('newImage', newImage)
            formData.append('productId', productId)             
            const {data} = await api.post('/product-image-update', formData,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  

export const get_discount_products = createAsyncThunk(
    'product/get_discount_products',
    async({ parPage, page, searchValue, minDiscount }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/discount-products-get?page=${page}&searchValue=${searchValue}&parPage=${parPage}&minDiscount=${minDiscount}`,
                { withCredentials: true }
            );
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const productReducer = createSlice({
    name: 'product',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        products: [],
        product: '',
        totalProduct: 0,
        discountProducts: [],
        totalDiscountProduct: 0,
        loading: false
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Add Product
            .addCase(add_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(add_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Thêm sản phẩm thất bại';
            })
            .addCase(add_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.products = [...state.products, payload.product]; // Cập nhật danh sách nếu backend trả product
            })

            // Get Products
            .addCase(get_products.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_products.rejected, (state, { payload }) => {
                state.loading = false;
                state.errorMessage = payload?.error || 'Lỗi khi tải danh sách sản phẩm';
            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.products = payload.products || [];
                state.totalProduct = payload.totalProduct || 0;
            })

            // Update Product
            .addCase(update_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(update_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Cập nhật sản phẩm thất bại';
            })
            .addCase(update_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.product = payload.product;
                const index = state.products.findIndex(p => p._id === payload.product._id);
                if (index !== -1) {
                    state.products[index] = payload.product; // Cập nhật danh sách sản phẩm
                }
            })

            // Delete Product
            .addCase(delete_product.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(delete_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Xóa sản phẩm thất bại. Vui lòng thử lại!';
            })
            .addCase(delete_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload?.message || 'Xóa sản phẩm thành công';
                if (payload?.productId) {
                    state.products = state.products.filter(product => product._id !== payload.productId);
                    state.totalProduct -= 1; // Cập nhật tổng số sản phẩm
                } else {
                    console.error('Payload missing productId:', payload);
                }
            })

            // Product Image Update
            .addCase(product_image_update.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.product = payload.product;
                const index = state.products.findIndex(p => p._id === payload.product._id);
                if (index !== -1) {
                    state.products[index] = payload.product;
                }
            })

            // Get Product
            .addCase(get_product.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_product.rejected, (state, { payload }) => {
                state.loading = false;
                state.errorMessage = payload?.error || 'Lỗi khi tải chi tiết sản phẩm';
            })
            .addCase(get_product.fulfilled, (state, { payload }) => {
                state.loading = false;
                console.log('Product description from API:', payload.product?.description);
                state.product = payload.product;
            })

            // Get Discount Products
            .addCase(get_discount_products.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_discount_products.rejected, (state, { payload }) => {
                state.loading = false;
                state.errorMessage = payload?.error || 'Lỗi khi tải sản phẩm giảm giá';
            })
            .addCase(get_discount_products.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.discountProducts = payload.products;
                state.totalDiscountProduct = payload.totalProducts;
            });
    }
});

export const {messageClear} = productReducer.actions
export default productReducer.reducer