import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders',
    async (user_id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Async thunk to fetch order details by ID
export const fetchOrderDetails = createAsyncThunk('orders/fetchOrderDetails',
    async (order_id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        totalOrders : 0,
        orderDetails: null,
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            StyleSheet.loading = false;
        })
        .addCase(fetchUserOrders.rejected, (state, action) => {
            state.error = action.payload?.message;
            state.loading = false;
        })
        //fetch order details
        .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.orderDetails = action.payload;
            StyleSheet.loading = false;
        })
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.error = action.payload?.message;
            state.loading = false;
        });
    }
});

export default orderSlice.reducer;