import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; 

//Retreive user info and token from localStorage if available
const userFromStorage = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem("userInfo")) : null;

//Check for an existing guestID in the localStorge or genearate a new one
const initialGuestID = localStorage.getItem('guestID') || `guest_${new Date().getTime()}`;
localStorage.setItem("guestID", initialGuestID);

//Initial State
const initialState = {
    user: userFromStorage || null,
    guestID: initialGuestID,
    loading: false,
    error: null,
};

//Async thunk to login user
export const loginUser = createAsyncThunk("auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);
            
            return response.data.user; //returning the user object from the response
        } catch (error){
            return rejectWithValue(error.response.data);
        }
    }
)

//Async thunk to register user
export const registerUser = createAsyncThunk("auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user; //returning the user object from the response
        } catch (error){
            return rejectWithValue(error.response.data);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout:(state) => {
            state.user = null;
            state.guestID = `guest_${new Date().getTime()}`;// Reset guestId on logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestID);
        },
        generateNewGuestId : (state) => {
            state.guestID = `guest_${new Date().getTime()}`;//generate a new guestId
            localStorage.setItem("guestId", state.guestID);   
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    }
});

export const {logout, generateNewGuestId} = authSlice.actions;
export default authSlice.reducer;