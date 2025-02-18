import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";


//Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
};

//Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

//Fetch cart for user or guest
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId, guestId }, { rejecteWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: { userId, guestId },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return rejecteWithValue(error.response.data);
        }
    }
);

//Add an item to the cart for a user or a guest
export const addToCart = createAsyncThunk("cart/addItemToCart",
    async ({ userId, guestId, productId, quantity, size, color }, { rejecteWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, 
                {
                    productId,
                    quantity,
                    size,
                    color,
                    userId,
                    guestId,
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return rejecteWithValue(error.response.data);
        }
    }
);

//Update the quantity of an item in cart
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", 
    async ({ userId, guestId, quantity, productId, size, color }, { rejecteWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    quantity,
                    productId,
                    size,
                    color,
                    userId,
                    guestId,
                }
            );
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            return rejecteWithValue(error.response.data);
        }
    }
);

//Remove an item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart",
    async ({ userId, guestId, productId, size, color }, { rejecteWithValue }) => {
        try {
            const response = await axios({
                method: "DELETE",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                data: {userId, productId, guestId, size, color}
            });
            return response.data;
        } catch (error) {
            console.error(error);
            return rejecteWithValue(error.response.data);
        }
    }
);

//Merge guest cart into user cart
export const mergeCart = createAsyncThunk("cart/mergeCart",
    async ({ user, guestId }, { rejecteWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                {guestId, user},
                {
                    headers : {
                        Authorization : `Bearer ${localStorage.getItem('userToken')}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return rejecteWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart : loadCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = {products : []};
            localStorage.removeItem("cart");
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Error fetching cart";
        })
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToStorage(action.payload);
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Error adding to cart";
        })
        .addCase(updateCartItemQuantity.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Error updating cart";
        })
        .addCase(removeFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Error removing item from cart";
        })
        .addCase(mergeCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(mergeCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToStorage(action.payload);
        })
        .addCase(mergeCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Error merging cart";
        });
    },
});

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;