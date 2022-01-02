import { useLazyQuery } from "@apollo/client";
import {
    faCheckCircle,
    faMinus,
    faMinusSquare,
    faPlus,
    faPlusSquare,
    faStar,
    faTimes,
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

const ProductDetails = () => {
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


    const handleAddToCart = () => { }

    return (
        <div className="w-4/5 mx-auto my-6">
            <div className="flex space-x-2">
                <div className="w-full">
                    <div className="bg-white shadow-lg">
                        <div className="flex h-96">
                            <div className=" w-4/5 h-96 flex justify-center">
                                <img
                                    alt={product?.title}
                                    src={product?.coverImage || "place-holder.png"}
                                    className="h-full"
                                />
                            </div>
                            <div className="w-2/5 px-4 py-4 space-y-4 bg-white flex flex-col justify-between h-full">
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
                                <div className="flex justify-between">
                                    <p>Quantity</p>
                                    <div className="text-xs flex items-center">
                                        {productCount > 0 && <FontAwesomeIcon onClick={decreaseAmount} className="cursor-pointer" icon={faMinus} />}
                                        <p className="mx-2 text-sm mt-auto">{productCount}</p>
                                        {productCount < product.quantity && <FontAwesomeIcon onClick={increateAmount} className="cursor-pointer" icon={faPlus} />}
                                    </div>
                                </div>
                                {product?.quantity! > 0 &&
                                    <div className="flex justify-between">
                                        <button onClick={handleAddToCart} className="text-white bg-black w-full py-2">
                                            Add to Cart
                                        </button>
                                    </div>}
                            </div>
                        </div>
                        <div className="bg-white p-8 flex flex-col space-y-3">

                            <div className="flex flex-col space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <p>Description</p>
                                </div>
                                {/* {showDetails && <p className="text-justify"> {renderHTML(product?.description)} */}
                                <p className="text-justify ml-2">
                                    <Interweave content={product?.description} />
                                </p>
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
