import { __DO_NOT_USE__ActionTypes, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`;

//Fetch all orders(admin only)
export const fetchAllOrders = createAsyncThunk(
    'adminOrders/fetchAllOrders',
    async(_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/orders`,
                {
                    headers: {
                        'Authorization': USER_TOKEN
                    }
                }
            );
            return response.data;
        } catch (error) {
            rejectWithValue(error.response.data);
        }
    }
);

//update delivery status
export const updateOrderStatus = createAsyncThunk(
    'adminOrders/updateOrderStatus',
    async({id, status}, {rejectWithValue}) => {
        try {
            const response = await axios.put(`${API_URL}/api/admin/orders/${id}`,
                {status},
                {
                    headers: {
                        'Authorization': USER_TOKEN
                    }
                }
            );
            return response.data;
        } catch (error) {
            rejectWithValue(error.response.data);
        }
    }
);

//Delete an order
export const deleteOrder = createAsyncThunk(
    'adminOrders/deleteOrder',
    async(id, {rejectWithValue}) => {
        try {
            await axios.delete(`${API_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        'Authorization': USER_TOKEN
                    }
                }
            );
            return id
        } catch (error) {
            rejectWithValue(error.response.data);
        }
    }
);

const adminOrderSlice = createSlice({
    name: 'adminOrders',
    initialState: {
        orders: [],
        totalOrders : 0,
        loading: false,
        error: null,
        totalSales : 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.loading = false;
            state.totalOrders = action.payload.length;
            state.totalSales = action.payload.reduce((acc, order) =>{return acc + order.totalPrice;}, 0);
        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.error = action.payload.message;
            state.loading = false;
        })
        .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            const updatedOrder = action.payload;
            const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
            if (orderIndex !== -1) {
                state.orders[orderIndex] = updatedOrder;
            }
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.error = action.payload.message;
            state.loading = false;
        })
        .addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(order => order._id !== action.payload);
        })
        .addCase(deleteOrder.rejected, (state, action) => {
            state.error = action.payload.message;
            state.loading = false;
        })


    }
})


export default adminOrderSlice.reducer;