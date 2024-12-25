import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async(info) =>{
        try {
            console.log(info);
            // const {data} = await axios.post('/admin-login', info, {withCredentials: true});
            // console.log(data);

        }catch (e) {
            console.log(e);
        }
    }

);

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: ''
    },
    reducers: {

    },
    extraReducers: () => {

    }
});

export default authReducer.reducer;