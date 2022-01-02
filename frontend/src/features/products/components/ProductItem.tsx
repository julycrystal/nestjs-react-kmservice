import { faCartPlus, faEye, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router"
import { GetProducts_getProducts_data_products } from "../../../__generated__/GetProducts"

interface IProductItem {
    product: GetProducts_getProducts_data_products,
}
const ProductItem = ({ product }: IProductItem) => {
    const navigate = useNavigate();
    const detailClickHandler = (id: number) => {
        navigate(`${id}`);
    }
    return (
        <div className="lg:w-1/4 md:w-1/2 w-full px-2 mb-6">
            <div className="bg-white shadow-xl pb-5">
                <div>
                    {product.coverImage ?
                        <img src={product.coverImage} alt={product.title} className="h-60 w-full" /> :
                        <img src="place-holder.png" alt={product.title} className="h-60 w-full" />
                    }
                </div>
                <div className="px-4">
                    <div className="flex my-2 space-x-3">
                        <div className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faStar} className="text-xs" />
                            <p className="text-xs">5.6</p>
                        </div>
                        <p className="text-gray-400 text-sm font-bold">
                            {product.category.name}
                        </p>
                    </div>
                    <p className="">
                        {product.title}
                    </p>
                    <p className="font-bold text-lg">
                        $ {product.price}
                    </p>
                    {/* <hr className="border-black my-3" /> */}
                    <div className="flex space-x-2 mt-3">
                        <button className="w-full bg-black text-white py-1">
                            <FontAwesomeIcon icon={faCartPlus} />
                        </button>
                        <button onClick={() => detailClickHandler(product.id)} className="w-full border-black border-2">
                            <FontAwesomeIcon icon={faEye} className="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductItem
