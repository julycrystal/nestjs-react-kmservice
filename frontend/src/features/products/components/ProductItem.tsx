import { faCartPlus, faEye, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../../../app/store";
import { GetProducts_getProducts_data_products } from "../../../__generated__/GetProducts";
import { removeCartItem, addToCart } from "../cart.slice";

interface IProductItem {
    product: GetProducts_getProducts_data_products;
}
const ProductItem = ({ product }: IProductItem) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const navigate = useNavigate();
    const detailClickHandler = (id: number) => {
        navigate(`${id}`);
    };

    const isInCart = () => {
        return cartItems.some((y) => y.product.id === product.id);
    };
    const handleRemoveCart = () => {
        dispatch(removeCartItem(product));
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity: 1 }));
    };

    const getActionButton = () => {
        if (product.quantity < 1) {
            return <button className="w-full bg-gray-500 text-white pt-2 pb-1">
                Out of Stock
            </button>
        }
        if (product.quantity > 0) {
            if (isInCart()) {
                return <button onClick={handleRemoveCart} className="w-full bg-black text-white pt-2 pb-1">
                    Remove from cart
                </button>;
            } else {
                return <button onClick={handleAddToCart} className="w-full bg-black text-white pt-2 pb-1">
                    Add to cart
                </button>;
            }
        }
    }

    return (
        <div className="lg:w-1/4 md:w-1/2 w-full px-2 mb-6">
            <div className="bg-white shadow-xl pb-5">
                <div className="cursor-pointer" onClick={() => detailClickHandler(product.id)}>
                    {product.coverImage ? (
                        <img
                            src={product.coverImage}
                            alt={product.title}
                            className="h-60 w-full"
                        />
                    ) : (
                        <img
                            src="place-holder.png"
                            alt={product.title}
                            className="h-60 w-full"
                        />
                    )}
                </div>
                <div className="px-4 cursor-pointer" onClick={() => detailClickHandler(product.id)}>
                    <div className="flex my-2 space-x-3">
                        <div className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faStar} className="text-xs" />
                            <p className="text-xs">5.6</p>
                        </div>
                        <p className="text-gray-400 text-sm font-bold">
                            {product.category.name}
                        </p>
                    </div>
                    <p className="">{product.title}</p>
                    <p className="font-bold text-lg">$ {product.price}</p>
                </div>
                <div className="flex space-x-2 mt-3 px-4">
                    {getActionButton()}
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
