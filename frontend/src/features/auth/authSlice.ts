import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./types/user.type";

export interface IAuthState {
    user?: IUser;
}

const initialState: IAuthState = {
    user: undefined,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IAuthState>) => {
            state.user = action.payload.user;
        },
        register: (state,) => { },
        logout: (state,) => {
            state.user = undefined;
        },
        myProfile: (state) => { },
        deleteAccount: (state) => { },
    }
})

export const {
    login,
    register,
    logout,
    myProfile,
    deleteAccount,
} = authSlice.actions;

export default authSlice.reducer;