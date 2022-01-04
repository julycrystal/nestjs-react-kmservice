import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../../../app/store";
import Header from "../../../shared/Header";
import {
    CreateOrder,
    CreateOrderVariables,
} from "../../../__generated__/CreateOrder";
import {
    GetAddresses_getAddresses_addresses,
    GetAddresses,
} from "../../../__generated__/GetAddresses";
import { CreateOrderInput } from "../../../__generated__/globalTypes";
import { clearCart } from "../../products/cart.slice";
import CheckOutTopSection from "../components/CheckOutTopSection";
import OrderConfirmation from "../components/OrderConfirmation";
import { CREATE_ORDER } from "../../../graphql/order.graphql";
import Address from "./Address";
import { GET_ADDRESSES } from "../../../graphql/profile.graphql";

const CASH_ON_DELIVERY = 1;
const CARD_PAYMENT = 2;

const Checkout = () => {

    const [step, setStep] = useState(1);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { register, watch } = useForm({ mode: "onChange" });
    const cart = useSelector((state: RootState) => state.cart)

    const [addresses, setAddresses] = useState<
        GetAddresses_getAddresses_addresses[]
    >([]);
    const [fetchAddresses] = useLazyQuery<GetAddresses, null>(GET_ADDRESSES, {
        fetchPolicy: "no-cache",
        onCompleted: ({ getAddresses }) => {
            const { ok, addresses } = getAddresses;
            if (ok && addresses) {
                setAddresses(addresses);
            }
        },
        onError: (error) => {
            // setErrorMessage(getErrorMessage(error));
        },
    });

    const { billingAddress, deliveryAddress, paymentMethod } = watch();

    const [createOrder, { loading }] = useMutation<CreateOrder, CreateOrderVariables>(
        CREATE_ORDER,
        {
            onCompleted: ({ createOrder }) => {
                const { ok } = createOrder;
                if (ok) {
                    dispatch(clearCart());
                    navigate('success')
                }
            },
            onError: (error) => {

            }
        }
    );

    const createOrderHandler = () => {
        const orderItems = cart.items.map(item => ({ productId: item.product.id, quantity: item.quantity, discount: 0, }))
        let createOrderInput: CreateOrderInput = {
            billingAddressId: +billingAddress,
            deliveryAddressId: +deliveryAddress,
            orderItems: orderItems,
        }
        createOrder({ variables: { createOrderInput } })
    }

    const AddressComponent = () => (
        <div>
            <form className="mt-8 lg:w-4/6 lg:mx-auto mx-2 flex justify-between space-x-4">
                <Address
                    title="Billing Address"
                    name="billingAddress"
                    register={register}
                    addresses={addresses}
                    callback={fetchAddresses}
                />
                <Address
                    title="Delivery Address"
                    name="deliveryAddress"
                    register={register}
                    addresses={addresses}
                    callback={fetchAddresses}
                />
            </form>
        </div>
    );

    const PaymentMethod = () => (
        <div className="my-16 w-4/6 mx-auto flex flex-col items-center">
            <div className="space-y-4">
                <div className="space-x-3 flex flex-start items-center">
                    <input
                        value={CASH_ON_DELIVERY}
                        {...register("paymentMethod")}
                        type="radio"
                        id={"cash-on-deli"}
                    />
                    <label htmlFor={`cash-on-deli`}>Cash On Delivery</label>
                </div>
                <div className="space-x-3 flex flex-start">
                    <input
                        value={CARD_PAYMENT}
                        {...register("paymentMethod")}
                        type="radio"
                        id={"cash-on-deli"}
                    />
                    <label htmlFor={`cash-on-deli`}>Credit Card</label>
                </div>
            </div>
        </div>
    );

    const RenderComponent = () => {
        if (step === 1) {
            return <AddressComponent />;
        } else if (step === 2) {
            return <PaymentMethod />;
        }
        return (
            <OrderConfirmation
                billingAddressId={billingAddress}
                deliveryAddressId={deliveryAddress}
                addresses={addresses}
                loading={loading}
                createOrder={createOrderHandler}
            />
        );
    };

    const isValid = () => {
        if (step === 1) {
            console.log(deliveryAddress, billingAddress);
            const addresses = [deliveryAddress, billingAddress];
            return addresses.every((address) => address && address !== null);
        } else if (step === 2) {
            return paymentMethod && paymentMethod !== null;
        }
        return false;
    };

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const nextStep = () => {
        if (step === 1) {
            // checkout.setAddress(deliveryAddress, billingAddress);
        } else if (step === 2) {
            // checkout.setPaymentMethod(paymentMethod)
        }
        if (step < 3) {
            setStep((step) => step + 1);
        }
    };
    const prevStep = () => {
        if (step > 0) {
            setStep((step) => step - 1);
        }
    };

    return (
        <div className="lg:w-4/6 w-full my-12 mx-auto text-center">
            <Header title="Checkout" description="" />
            <CheckOutTopSection step={step} />
            <div className="flex-grow">
                <RenderComponent />
            </div>
            <div
                className={`flex ${step > 1 ? "justify-between" : "justify-end"
                    } mt-8 lg:w-4/6 lg:mx-auto mx-2`}
            >
                {step > 1 && (
                    <button className="bg-black text-white px-4 py-2" onClick={prevStep}>
                        Prev
                    </button>
                )}
                {step < 3 && (
                    <button
                        className={`${isValid() ? "bg-black text-white" : "bg-gray-500 text-white"
                            } px-4 py-2`}
                        disabled={!isValid()}
                        onClick={nextStep}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Checkout;
