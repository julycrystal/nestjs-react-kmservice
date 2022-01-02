import { useLazyQuery } from "@apollo/client";
import {
    faCheckCircle,
    faMinus,
    faPlus,
    faStar,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Spinner } from "../../../shared/loader";
import {
    GetProduct,
    GetProductVariables,
    GetProduct_getProduct_product,
} from "../../../__generated__/GetProduct";
import { GET_PRODUCT_QUERY } from "../product.graphql";
import Interweave from "interweave";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeCartItem } from "../cart.slice";
import { RootState } from "../../../app/store";

const ProductDetails = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items)

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [productCount, setProductCount] = useState(1);
    const [product, setProduct] = useState<GetProduct_getProduct_product | null>(
        null
    );

    const [fetchProduct] = useLazyQuery<GetProduct, GetProductVariables>(
        GET_PRODUCT_QUERY,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ getProduct }) => {
                const { ok, product } = getProduct;
                if (ok && product) {
                    setProduct(product);
                }
                setLoading(false);
            },
            onError: (err: any) => {
                if (err.graphQLErrors) {
                    if (err.graphQLErrors[0].extensions.exception.status) {
                        navigate("/404", { replace: true, });
                        return;
                    };
                }
                setLoading(false);
            },
        }
    );

    useEffect(() => {
        if (id) {
            fetchProduct({ variables: { getProductInput: { id: +id } } });
        }
    }, [id, fetchProduct]);


    if (loading || !product) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner height={40} color={"#000"} />
            </div>
        );
    }

    const increateAmount = (num: number) => {
        if (product.quantity > productCount) {
            setProductCount(prevValue => prevValue + 1)
        }
    }

    const decreaseAmount = (num: number) => {
        if (productCount > 0) {
            setProductCount(prevValue => prevValue - 1)
        }
    }

    const isInCart = () => {
        return cartItems.some(y => y.product.id === product.id)
    }

    const handleRemoveCart = () => {
        dispatch(removeCartItem(product))
    }

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity: productCount }))
    }

    return (
        <div className="lg:w-4/5 lg:mx-auto mx-4 my-6">
            <div className="flex space-x-2">
                <div className="w-full">
                    <div className="bg-white shadow-lg">
                        <div className="flex lg:flex-row md:flex-row flex-col lg:h-96 h-auto">
                            <div className="lg:w-4/5 md:w-1/2 lg:h-full flex justify-center" >
                                <img
                                    alt={product?.title}
                                    src={product?.coverImage || "/place-holder.png"}
                                    className="lg:h-full"
                                />
                            </div>
                            <div className="lg:w-2/5 md:w-1/2 w-full px-4 py-4 space-y-4 flex flex-col justify-between min-h-full">
                                <p className="font-bold text-lg">{product?.title}</p>
                                <p className="font-bold text-sm text-gray-500">{product?.category.name}</p>
                                <div className="flex space-x-2">
                                    <div className="flex space-x-2 text-yellow-500">
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">12 reviews</p>
                                </div>
                                <div className="flex justify-between border-black">
                                    <p>Price</p>
                                    <p>${product?.price}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>In Stock</p>
                                    <p>
                                        {product?.quantity! > 0 ? (
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                className="text-red-500"
                                            />
                                        )}
                                    </p>
                                </div>
                                {product.quantity > 0 && <div className="flex justify-between">
                                    <p>Quantity</p>
                                    <div className="text-xs flex items-center">
                                        {productCount > 1 && <FontAwesomeIcon onClick={decreaseAmount} className="cursor-pointer" icon={faMinus} />}
                                        <p className="mx-2 text-sm mt-auto">{productCount}</p>
                                        {productCount < product.quantity && <FontAwesomeIcon onClick={increateAmount} className="cursor-pointer" icon={faPlus} />}
                                    </div>
                                </div>}
                                <div className="flex justify-between">
                                    {(product?.quantity! > 0 && !isInCart()) &&
                                        <button onClick={handleAddToCart} className="text-white bg-black w-full py-2">
                                            Add to Cart
                                        </button>
                                    }
                                    {isInCart() && <button onClick={handleRemoveCart} className="text-white bg-black w-full py-2">
                                        Remove From Cart
                                    </button>}

                                </div>
                            </div>
                        </div>
                        <div className="bg-white lg:p-8 px-2 py-4 flex flex-col space-y-3">
                            <div className="flex flex-col space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <p>Description</p>
                                </div>
                                {/* {showDetails && <p className="text-justify"> {renderHTML(product?.description)} */}
                                <div className="text-justify ml-2">
                                    <Interweave content={product?.description} />
                                </div>
                            </div>
                            {/* <div className="flex flex-col space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <p>Reviews</p>
                                </div>
                                {showReviews && <Review productId={product?.id!} />}
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
