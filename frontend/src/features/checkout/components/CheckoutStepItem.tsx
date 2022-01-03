
interface ICheckoutStepItemProps {
    text: string;
    isActive?: boolean
}

const CheckoutStepItem = ({ text, isActive = false }: ICheckoutStepItemProps) => {
    return (
        <div className={`${isActive ? "bg-black" : "bg-gray-500"} cursor-pointer text-white rounded-full px-3 py-1 w-fit`}>
            {text}
        </div>
    )
}

export default CheckoutStepItem
