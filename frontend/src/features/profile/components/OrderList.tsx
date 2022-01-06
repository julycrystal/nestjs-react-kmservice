import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { MyOrderQuery_myOrders_data_orders } from '../../../__generated__/MyOrderQuery';

interface IOrderListProps {
    orders: MyOrderQuery_myOrders_data_orders[];
}

const OrderList = ({ orders }: IOrderListProps) => {
    const navigate = useNavigate();
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-center bg-black text-white font-bold text-sm uppercase">
                    <td className="pl-2 py-3">#</td>
                    <td className="">Date</td>
                    <td className="">Total Price</td>
                    <td className="">Customer</td>
                    <td className="">Status</td>
                    <td className="">Paid</td>
                    <td className="hidden lg:inline-flex lg:py-3 pr-2">Actions</td>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 && orders.map((order) => {
                    return (<tr key={order.id} className="w-full text-center border-b-2 text-sm">
                        <td className=" py-4">{order.id}</td>
                        <td className="">{moment(order.createdAt).format("MMM Do YYYY")}</td>
                        <td className="">{order.totalAmount}</td>
                        <td className="">{order.customer.name}</td>
                        <td className="">{order.status}</td>
                        <td className="">
                            {
                                order.paid ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> :
                                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                            }
                        </td>
                        <td className="hidden lg:inline-flex lg:py-4 pr-2 space-x-2">
                            <button className="bg-black text-white px-3 py-1" onClick={() => navigate(`${order.id}`)}>
                                View Details
                            </button>
                        </td>
                    </tr>);
                })}
            </tbody>
        </table>
    )
}

export default OrderList
