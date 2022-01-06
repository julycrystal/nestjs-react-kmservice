import { GetOrder_getOrder_order_orderItems } from "../../../../../__generated__/GetOrder"

interface IOrderItemInfoProps {
    orderItems: GetOrder_getOrder_order_orderItems[];
}

const OrderItemInfo = ({ orderItems }: IOrderItemInfoProps) => {
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-center font-bold text-sm uppercase border-b-2">
                    <td className="pl-2 py-3">#</td>
                    <td className="">Title</td>
                    <td className="">Price</td>
                    <td className="">Qty</td>
                    <td className="">Sub Total</td>
                </tr>
            </thead>
            <tbody>
                {orderItems.map((item) => {
                    return (<tr key={item.id} className="w-full cursor-pointer text-center border-b-2 text-sm">
                        <td className=" py-4">{item.id}</td>
                        <td className="">{item.productName}</td>
                        <td className="">{item.productPrice}</td>
                        <td className="">{item.quantity}</td>
                        <td className="">{item.quantity * item.productPrice}</td>
                        {/*  */}
                    </tr>);
                })}
                <tr className="text-right border-b-2">
                    <td colSpan={4} className="py-4">
                        Total Amount
                    </td>
                    <td className="text-center py-4">$ {33}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default OrderItemInfo
