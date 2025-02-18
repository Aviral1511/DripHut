import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`;

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", 
    async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/products`, {
                headers: {
                    'Authorization' : USER_TOKEN,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);           
        }
    }
);

//async function to create a new product
export const createProduct = createAsyncThunk("adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/admin/products`, productData, 
                {
                    headers: {
                        'Authorization' : USER_TOKEN,
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.message);
        }
    }
);

//async thunk to update an existing product
export const updateProduct = createAsyncThunk("adminProducts/updateProduct",
    async ({id, productData}) => {
        try {
            const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData,
                {
                    headers: {
                        'Authorization' : USER_TOKEN,
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
);

//async thunk to delete a product
export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct",
    async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/products/${id}`,
                {
                    headers: {
                        'Authorization' : USER_TOKEN,
                    }
                }
            );
            return id;
        } catch (error) {
            console.log(error);
        }
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading : false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex((prduct) => prduct._id === action.payload._id);
            if(index !== -1){
                state.products[index] = action.payload;
            }
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter((product) => product._id !== action.payload);
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default adminProductSlice.reducer;