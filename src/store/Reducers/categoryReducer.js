import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (image) {
                formData.append('image', image);
            }
            const { data } = await api.post('/category-add', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Something went wrong' });
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (image && image instanceof File) { // Chỉ thêm ảnh nếu là file mới
                formData.append('image', image);
            }
            const { data } = await api.put(`/category-update/${id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Something went wrong' });
        }
    }
);
 
export const get_category = createAsyncThunk(
    'category/get_category',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)


export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async(id,{rejectWithValue }) => {
        
        try { 
             
            const response = await api.delete(`/category/${id}`);  
            return response.data;
        } catch (error) {  
            return rejectWithValue(error.response.data.message)
        }
    }
)



export const categoryReducer = createSlice({
    name: 'category',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        categorys : [],
        totalCategory: 0
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(categoryAdd.pending, (state, { payload }) => {
            state.loader = true;
        })
        .addCase(categoryAdd.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error
        })
        .addCase(categoryAdd.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message
            state.categorys = [...state.categorys, payload.category]

        })

        .addCase(get_category.fulfilled, (state, { payload }) => {
            state.totalCategory = payload.totalCategory;
            state.categorys = payload.categorys;

        })

        .addCase(updateCategory.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message
            const index = state.categorys.findIndex((cat) => cat._id === payload.category._id);
            if (index !== -1) {
                state.categorys[index] = payload.category;
            }

        })

        .addCase(updateCategory.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })

        .addCase(deleteCategory.fulfilled, (state, action) => {
            state.categorys = state.categorys.filter(cat => cat._id !== action.meta.arg);
            state.successMessage = action.payload.message;
        })
        .addCase(deleteCategory.rejected, (state,action) => {
            state.errorMessage = action.payload;
        })


    }

})
export const {messageClear} = categoryReducer.actions
export default categoryReducer.reducer