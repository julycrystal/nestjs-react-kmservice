import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetProduct_getProduct_product } from "../../__generated__/GetProduct";
import { GetProducts_getProducts_data_products } from "../../__generated__/GetProducts";

type ProductType = GetProduct_getProduct_product | GetProducts_getProducts_data_products;

export interface ICartItemState {
    product: ProductType;
    quantity: number;
}

export interface ICartState {
    items: ICartItemState[];
    totalPrice: number;
}


const calculateTotalPrice = (cartItems: ICartItemState[]) => {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.quantity * item.product.price;
    })
    return totalPrice;
}

const items = JSON.parse(localStorage.getItem("cartItems") || "[]");

const initialState: ICartState = {
    items,
    totalPrice: calculateTotalPrice(items),
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ICartItemState>) => {
            const item = action.payload;
            const existItem = state.items.find(
                (x) => x.product.id === item.product.id
            );
            if (existItem) {
                state.items = state.items.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                state.items = [...state.items, item];
            }
            state.totalPrice = calculateTotalPrice(state.items);
            localStorage.setItem("cartItems", JSON.stringify(state.items))
        },
        removeCartItem: (state, action: PayloadAction<ProductType>) => {
            state.items = state.items.filter(
                (x) => x.product.id !== action.payload.id
            );
            state.totalPrice = calculateTotalPrice(state.items);
            localStorage.setItem("cartItems", JSON.stringify(state.items))
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            localStorage.setItem("cartItems", JSON.stringify(state.items))
        },
    },
});

export const {
    addToCart,
    clearCart,
    removeCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;

// TODO: refactor