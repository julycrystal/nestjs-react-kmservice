import { faMinus, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../app/store";
import Header from "../../../shared/Header";
import {
    addToCart,
    ICartItemState,
    removeCartItem,
} from "../../products/cart.slice";
import EmptyCart from "../components/EmptyCart";

const Cart = () => {
    const dispatch = useDispatch();

    const cartItems = useSelector((state: RootState) => state.cart.items);

    const decreaseAmount = (cartItem: ICartItemState) => {
        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    };

    const increateAmount = (cartItem: ICartItemState) => {
        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    };

    const removeItem = (cartItem: ICartItemState) => {
        dispatch(removeCartItem(cartItem.product));
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.quantity * item.product.price;
        })
        return totalPrice;
    }

    if (cartItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="lg:w-5/6 mx-auto">
            <Header title="Cart" description="Your cart." />
            <div className="flex justify-between items-center mt-8">
                <h3 className="text-2xl font-bold">Your Cart</h3>
                <hr className="border-black border-2" />
            </div>
            <table className="w-full my-4">
                <thead>
                    <tr className="text-center bg-black text-white font-bold text-sm uppercase">
                        <td className="pl-2 py-3">#</td>
                        <td className="">Actions</td>
                        <td className="">Name</td>
                        <td className="">Price</td>
                        <td className="">Qty</td>
                        <td className="">Sub Total</td>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((cartItem, index) => {
                        return (
                            <tr key={index} className="w-full text-center border-b-2 text-sm">
                                <td className=" py-4">{index + 1}</td>
                                <td className="">
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        title="Delete"
                                        className="cursor-pointer"
                                        onClick={() => removeItem(cartItem)}
                                    />
                                </td>
                                <td className="">{cartItem.product.title}</td>
                                <td className="">{cartItem.product.price}</td>
                                <td className="flex mt-3 justify-center items-center text-xs">
                                    {cartItem.quantity > 1 && (
                                        <FontAwesomeIcon
                                            onClick={() => decreaseAmount(cartItem)}
                                            className="cursor-pointer"
                                            icon={faMinus}
                                        />
                                    )}
                                    <p className="mx-2 text-sm mt-auto">{cartItem.quantity}</p>
                                    {cartItem.quantity < cartItem.product.quantity && (
                                        <FontAwesomeIcon
                                            onClick={() => increateAmount(cartItem)}
                                            className="cursor-pointer"
                                            icon={faPlus}
                                        />
                                    )}
                                </td>
                                <td className="">
                                    {cartItem.quantity * cartItem.product.price}
                                </td>
                            </tr>
                        );
                    })}
                    <tr className="text-right">
                        <td colSpan={5}>Total</td>
                        <td className="text-center">$ {calculateTotalPrice()}</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-end">
                <Link to="/checkout" className="bg-black text-white px-4 py-1">
                    Checkout
                </Link>
            </div>
        </div >
    );
};

export default Cart;
