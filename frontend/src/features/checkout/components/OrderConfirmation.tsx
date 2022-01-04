import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { GetAddresses_getAddresses_addresses } from "../../../__generated__/GetAddresses";

interface IOrderConfirmationProps {
    addresses: GetAddresses_getAddresses_addresses[];
    billingAddressId: number;
    deliveryAddressId: number;
    createOrder: () => void;
    loading: boolean;
}

const OrderConfirmation = ({
    addresses,
    billingAddressId,
    deliveryAddressId,
    createOrder,
    loading = false,
}: IOrderConfirmationProps) => {
    const cart = useSelector((state: RootState) => state.cart);
    const user = useSelector((state: RootState) => state.auth.user);
    const [billingAddress, setBillingAddress] =
        useState<GetAddresses_getAddresses_addresses | null>(null);
    const [deliveryAddress, setDeliveryAddress] =
        useState<GetAddresses_getAddresses_addresses | null>(null);

    useEffect(() => {
        const setAddress = () => {
            const billingAddress = addresses.find(
                (item) => item.id === +billingAddressId
            );

            if (billingAddress) {
                setBillingAddress(billingAddress);
            }
            const deliveryAddress = addresses.find(
                (item) => item.id === +deliveryAddressId
            );
            if (deliveryAddress) {
                setDeliveryAddress(deliveryAddress);
            }
        };
        setAddress();
    }, [billingAddressId, deliveryAddressId, addresses]);

    const PlaceOrderButton = () => (
        <button
            disabled={loading}
            onClick={createOrder}
            className={`${loading ? "bg-gray-500" : "bg-black"} text-sm text-white px-8 py-2`}
        >
            Place Order
        </button>
    );

    const ConfirmationHeader = () => {
        return (
            <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between items-start">
                <p className="lg:text-xl font-bold">Order Confirmation</p>
                <div className="flex flex-row items-center space-x-8">
                    <div className="flex items-center space-x-4">
                        <p className="text-sm">Order Total:</p>
                        <p className="lg:text-2xl">$ {cart.totalPrice}</p>
                    </div>
                    <PlaceOrderButton />
                </div>
            </div>
        );
    };

    const OrderItemsSection = () => {
        return (
            <div className="flex flex-col space-y-8 my-4 px-8 py-8">
                <div className="flex justify-between">
                    <p>#</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Sub Total</p>
                </div>
                <hr />
                {cart.items.map((item, index) => {
                    const { product, quantity } = item;
                    return (
                        <>
                            <div
                                key={index}
                                className="flex justify-between text-gray-500 font-bold"
                            >
                                <p>{index + 1}</p>
                                <p>{product.title}</p>
                                <p>{product.price}</p>
                                <p>{quantity}</p>
                                <p>$ {product.price * quantity}</p>
                            </div>
                            <hr />
                        </>
                    );
                })}
                <div className="flex justify-end text-gray-500 font-bold">
                    <p className="text-sm mr-8">Total Price</p>
                    <p>$ {cart.totalPrice}</p>
                </div>
                <div className="flex justify-end">
                    <PlaceOrderButton />
                </div>
            </div>
        );
    };

    const InfoConfirmation = () => {
        return (
            <div className="flex flex-col space-y-8 shadow-xl bg-white my-4 px-8 py-8">
                <div className="flex lg:flex-row flex-col w-full lg:space-x-8 space-y-8">
                    <div className="lg:w-1/2 flex flex-col items-start">
                        <h1 className="text-lg">Your Information</h1>
                        <hr className="border-black border-dotted w-full my-3" />
                        <div className="text-left space-y-4 flex flex-col w-full text-sm">
                            <div className="flex justify-between">
                                <p>Name</p>
                                <p>{user?.name}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Email</p>
                                <p>{user?.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Username </p>
                                <p>{user?.username}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 flex flex-col items-start">
                        <h1 className="text-lg">Delivery Address</h1>
                        <hr className="border-black border-dotted w-full my-3" />
                        <div className="text-left space-y-2">
                            <h1 className="font-bold text-lg">{deliveryAddress?.name}</h1>
                            <p className="text-sm">{deliveryAddress?.country}</p>
                            <p className="text-sm">{deliveryAddress?.city}</p>
                            <p className="text-sm">{deliveryAddress?.apartment}</p>
                            <p className="text-sm">{deliveryAddress?.address}</p>
                        </div>
                    </div>
                </div>
                <div className="flex lg:flex-row flex-col w-full lg:space-x-8 space-y-8">
                    <div className="lg:w-1/2 flex flex-col items-start">
                        <h1 className="text-lg">Payment</h1>
                        <hr className="border-black border-dotted w-full mt-3" />
                        <div className="h-full w-full flex items-center justify-center">
                            <p className="font-bold text-gray-500 text-lg">
                                Cash on delivery
                            </p>
                        </div>
                    </div>
                    <div className="lg:w-1/2 flex flex-col items-start">
                        <h1 className="text-lg">Billing Address</h1>
                        <hr className="border-black border-dotted w-full my-3" />
                        <div className="text-left space-y-2">
                            <h1 className="font-bold text-lg">{billingAddress?.name}</h1>
                            <p className="text-sm">{billingAddress?.country}</p>
                            <p className="text-sm">{billingAddress?.city}</p>
                            <p className="text-sm">{billingAddress?.apartment}</p>
                            <p className="text-sm">{billingAddress?.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="my-16 w-5/6 mx-auto flex flex-col">
            <ConfirmationHeader />
            <InfoConfirmation />
            <OrderItemsSection />
        </div>
    );
};

export default OrderConfirmation;
