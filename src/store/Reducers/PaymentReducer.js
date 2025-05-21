import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 
 
export const get_seller_payment_details = createAsyncThunk(
    'payment/get_seller_payment_details',
    async( sellerId,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/payment/seller-payment-details/${sellerId} `,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 
  


export const send_withdrowal_request = createAsyncThunk(
    'payment/send_withdrowal_request',
    async( info,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.post(`/payment/withdrowal-request`,info,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 
  

  export const get_payment_request = createAsyncThunk(
    'payment/get_payment_request',
    async(_,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/payment/request`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 
  

  export const confirm_payment_request = createAsyncThunk(
    'payment/confirm_payment_request',
    async(info ,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.post(`/payment/request-confirm`, info, {withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 
  

  export const get_withdrawal_history = createAsyncThunk(
    'payment/get_withdrawal_history',
    async(_,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/payment/withdrawal-history`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
) 

export const get_admin_payment_history = createAsyncThunk(
  'payment/get_admin_payment_history',
  async(params, {rejectWithValue, fulfillWithValue}) => { 
    try { 
      const {page = 1, limit = 10, search = '', status = ''} = params || {};
      const {data} = await api.get(
        `/admin/payment/history?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        {withCredentials: true}
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_payment_overview = createAsyncThunk(
  'payment/get_payment_overview',
  async(_, {rejectWithValue, fulfillWithValue}) => { 
    try { 
      const {data} = await api.get('/admin/payment/overview', {withCredentials: true});
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const PaymentReducer = createSlice({
    name: 'payment',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        pendingWithdrows : [], 
        successWithdrows: [], 
        withdrawalHistory: [],
        paymentHistory: {
          withdrawals: [],
          totalWithdrawals: 0,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            perPage: 10
          },
          stats: {
            totalWithdrawnAmount: 0,
            totalPendingAmount: 0,
            monthlyStats: []
          }
        },
        overview: {
          totalRevenue: 0,
          currentMonthRevenue: 0,
          lastMonthRevenue: 0,
          growthRate: 0,
          shopMonthlyRevenue: [],
          topSellers: [],
          yearlyData: {
            year: new Date().getFullYear(),
            months: []
          }
        },
        totalAmount: 0,
        withdrowAmount: 0,
        pendingAmount: 0,
        availableAmount: 0,
    },
    reducers : {

        messageClear : (state,_) => {
            state.successMessage = ""
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
          
        .addCase(get_seller_payment_details.fulfilled, (state, { payload }) => {
            state.pendingWithdrows = payload.pendingWithdrows;
            state.successWithdrows = payload.successWithdrows;
            state.totalAmount = payload.totalAmount;
            state.availableAmount = payload.availableAmount;
            state.withdrowAmount = payload.withdrowAmount;
            state.pendingAmount = payload.pendingAmount; 
        })

        .addCase(send_withdrowal_request.pending, (state, { payload }) => {
            state.loader = true  
        })
        .addCase(send_withdrowal_request.rejected, (state, { payload }) => {
            state.loader = false  
            state.errorMessage = payload.message; 
        })
        .addCase(send_withdrowal_request.fulfilled, (state, { payload }) => {
            state.loader = false  
            state.successMessage = payload.message; 
            state.pendingWithdrows = [...state.pendingWithdrows,payload.withdrowal]; 
            state.availableAmount = state.availableAmount - payload.withdrowal.amount; 
            state.pendingAmount = payload.withdrowal.amount; 
        })

        .addCase(get_payment_request.fulfilled, (state, { payload }) => {
            state.pendingWithdrows = payload.withdrowalRequest  
        })

        .addCase(confirm_payment_request.pending, (state, { payload }) => {
            state.loader = true  
        })
        .addCase(confirm_payment_request.rejected, (state, { payload }) => {
            state.loader = false  
            state.errorMessage = payload.message; 
        })
        .addCase(confirm_payment_request.fulfilled, (state, { payload }) => {
            state.loader = false  
            state.successMessage = payload.message;
            
            if (payload.payment) {
                const temp = state.pendingWithdrows.filter(r => r._id !== payload.payment._id)
                state.pendingWithdrows = temp
            }
        })

        .addCase(get_withdrawal_history.pending, (state) => {
            state.loader = true  
        })
        .addCase(get_withdrawal_history.rejected, (state, { payload }) => {
            state.loader = false  
            state.errorMessage = payload.message; 
        })
        .addCase(get_withdrawal_history.fulfilled, (state, { payload }) => {
            state.loader = false  
            state.withdrawalHistory = payload.withdrawalHistory
        })

        .addCase(get_admin_payment_history.pending, (state) => {
            state.loader = true;
        })
        .addCase(get_admin_payment_history.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.message;
        })
        .addCase(get_admin_payment_history.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.paymentHistory = {
              withdrawals: payload.withdrawals || [],
              totalWithdrawals: payload.totalWithdrawals || 0,
              pagination: payload.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                perPage: 10
              },
              stats: payload.stats || {
                totalWithdrawnAmount: 0,
                totalPendingAmount: 0,
                monthlyStats: []
              }
            };
        })

        .addCase(get_payment_overview.pending, (state) => {
            state.loader = true;
        })
        .addCase(get_payment_overview.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.message;
        })
        .addCase(get_payment_overview.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.overview = {
              totalRevenue: payload.totalRevenue || 0,
              currentMonthRevenue: payload.currentMonthRevenue || 0,
              lastMonthRevenue: payload.lastMonthRevenue || 0,
              growthRate: payload.growthRate || 0,
              shopMonthlyRevenue: payload.shopMonthlyRevenue || [],
              topSellers: payload.topSellers || [],
              yearlyData: payload.yearlyData || {
                year: new Date().getFullYear(),
                months: []
              }
            };
        })
       

    }

})
export const {messageClear} = PaymentReducer.actions
export default PaymentReducer.reducer