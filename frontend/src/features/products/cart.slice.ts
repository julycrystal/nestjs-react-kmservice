import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetProduct_getProduct_product } from "../../__generated__/GetProduct";

export interface ICartItemState {
    product: GetProduct_getProduct_product;
    quantity: number;
}

export interface ICartState {
    items?: ICartItemState[];
}

const initialState: ICartState = {
    items: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ICartState>) => {
            // state.user = action.payload.user;
        },
        updateCart: (state,) => { },
        deleteCartItem: (state,) => { },
        getCartItems: (state,) => { },
        clearCart: (state,) => {
            state.items = [];
        },
    }
})

export const {
    addToCart,
    updateCart,
    clearCart,
    getCartItems,
    deleteCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;