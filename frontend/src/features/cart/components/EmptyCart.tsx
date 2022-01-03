import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

const EmptyCart = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl w-1/5 mx-auto px-2 py-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-gray-300 rounded-full w-fit px-4 py-4">
                        <FontAwesomeIcon icon={faShoppingBasket} className="text-6xl" />
                    </div>
                    <p className="text-center font-bold text-gray-500">Your cart is empty :(</p>
                </div>
                <div className="w-full text-center  bg-black text-white py-2 mt-4">
                    <Link replace to="/products">Browse Products</Link>
                </div>
            </div>
        </div>
    )
}

export default EmptyCart
