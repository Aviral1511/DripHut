import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", 
    async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                {
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('userToken')}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

//Add the create user action
export const addUser = createAsyncThunk("admin/addUser",
    async(userData, {rejectWithValue}) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.message);
        }
    }
);

//Update user info
export const updateUser = createAsyncThunk("admin/updateUser",
    async({id, name, email, role}) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                {name, email, role},
                {
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data.user;
        } catch (error) {
            console.log(error);
        }
    }
);

//Delete an user
export const deleteUser = createAsyncThunk("admin/deleteUser",
    async(id) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                {
                    headers : {
                        'Authorization' : `Bearer ${localStorage.getItem('userToken')}`
                    },
                }
            );
            return id;
        } catch (error) {
            console.log(error);
        }
    }
);

const adminSlice = createSlice({
    name : 'admin',
    initialState : {
        users : [],
        loading : false,
        error : null,
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            // state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true;
            // state.error = null;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            const updatedUser = action.payload;
            const index = state.users.findIndex((user) => user.id === updatedUser.id);
            if(index !== -1){
                state.users[index] = updatedUser;
            }
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            // state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.users = state.users.filter((user) => user.id !== action.payload);
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload.user);
        })
        .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        
    }
});

export default adminSlice.reducer;