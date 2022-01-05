import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import Header from "../../../../../shared/Header";
import { ADMIN_ORDER_LIST_QUERY } from "../../../../../graphql/order.graphql";
import { AdminOrderListQuery, AdminOrderListQueryVariables, AdminOrderListQuery_orders_data_orders } from "../../../../../__generated__/AdminOrderListQuery";
import { useLazyQuery } from "@apollo/client";
import { Spinner } from "../../../../../shared/loader";
import moment from 'moment';
import { getErrorMessage } from "../../../../../utils/getErrorMessage";

const Orders = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalItems, setTotalItems] = useState(10);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<AdminOrderListQuery_orders_data_orders[]>([]);
    const navigate = useNavigate();
    const userPerPage = 10;

    const [fetchOrders] = useLazyQuery<AdminOrderListQuery, AdminOrderListQueryVariables>(
        ADMIN_ORDER_LIST_QUERY,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ orders }) => {
                const { ok, data } = orders;
                if (ok && data?.orders) {
                    setOrders(data.orders);
                    setTotalItems(data.totalItems)
                }
                setLoading(false);
            },
            onError: (err) => {
                setLoading(false);
                setErrorMessage(getErrorMessage(err))
            }
        }
    );

    useEffect(() => {
        fetchOrders({
            variables: {
                ordersInput: { pageNumber }
            }
        })
    }, [pageNumber, fetchOrders])

    const handleChange = (data: number) => {
        setPageNumber(data);
    }

    if (loading || !orders) {
        return (<div className="h-screen flex items-center justify-center">
            <Spinner height={40} color={"#000"} />
        </div>);
    }

    if (errorMessage) {
        return <div className="h-screen flex items-center justify-center text-red-500 font-bold text-xl">
            {errorMessage}
        </div>
    }


    return (
        <div id="accountPanel" className="px-10 py-5 text-gray-900">
            <Header title="Orders" description="Orders." />
            <div className="flex justify-between items-center">
                <h3 className="text-2xl mb-4 font-bold">Order List</h3>
            </div>
            <hr className="border-black" />
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
            {orders && <div className="lg:my-24 my-12">
                <Pagination
                    innerClass="flex pl-0 rounded list-none flex-wrap justify-center"
                    itemClass="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-gray-500 bg-white text-gray-500"
                    activePage={pageNumber}
                    activeLinkClass="bg-black text-white w-full rounded-full h-full pt-2 pl-3"
                    itemsCountPerPage={userPerPage}
                    totalItemsCount={totalItems}
                    onChange={handleChange}
                    disabledClass="bg-gray-400 text-gray-100"
                />
            </div>}
        </div>
    );
}

export default Orders
