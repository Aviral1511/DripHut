import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Async thunk to fetch products by collection and optional filters
export const fetchProductsByFilters = createAsyncThunk(
    "products/fetchByFilters",
    async({
        collections,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit
    }) => {
        const query = new URLSearchParams();
        if (size) query.append('size', size);
        if(collections) query.append('collections', collections);
        if(color) query.append('color', color);
        if(gender) query.append('gender', gender);
        if(minPrice) query.append('minPrice', minPrice);
        if(material) query.append('material', material);
        if(maxPrice) query.append('maxPrice', maxPrice);
        if(sortBy) query.append('sortBy', sortBy);
        if(search) query.append('search', search);
        if(category) query.append('category', category);
        if(brand) query.append('brand', brand);
        if(limit) query.append('limit', limit);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        );
        return response.data.products;
    }
);

//Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails',
    async(id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }   
    }
);

//Async thunk to update products
export const updateProduct = createAsyncThunk('products/updateProduct',
    async({id, productData}) => {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, productData, 
            {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('userToken')}`
                },
            }
        );
        return response.data;
    }
);

//Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk('products/fetchSimilarProducts',
    async({id}) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`);
        return response.data;
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        selectedProduct : null, //store detail of single product
        loading: false,
        error: null,
        similarProducts: [],
        filters : {
            brand: '',
            category: '',
            size: '',
            color: '',
            minPrice: '',
            maxPrice: '',
            sortBy: '',
            search: '',
            material: '',
            collection: '',
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = {...state.filters, ...action.payload};
        },
        clearFilters: (state) => {
            state.filters = {
                brand: '',
                category: '',
                size: '',
                color: '',
                minPrice: '',
                maxPrice: '',
                sortBy: '',
                search: '',
                material: '',
                collection: '',
            };
        },
    },
    extraReducers: (builder) => {
        builder
        //handle fetching products with filters
        .addCase(fetchProductsByFilters.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
            state.loading = false;
            state.products = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(fetchProductsByFilters.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        //Handle fetching single product
        .addCase(fetchProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        })
        .addCase(fetchProductDetails.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        //handle updating products
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload;
            const index = state.products.findIndex((product) => product.id === updatedProduct.id);
            if(index !== -1) {
                state.products[index] = updatedProduct;
            }
        })
        .addCase(updateProduct.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchSimilarProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.similarProducts = action.payload; 
        })
        .addCase(fetchSimilarProducts.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export const {setFilters, clearFilters} = productsSlice.actions;
export default productsSlice.reducer;