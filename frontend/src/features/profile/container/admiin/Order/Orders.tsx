import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import Header from "../../../../../shared/Header";
import { ADMIN_ORDER_LIST_QUERY } from "../../../../../graphql/order.graphql";
import { AdminOrderListQuery, AdminOrderListQueryVariables, AdminOrderListQuery_orders_data_orders } from "../../../../../__generated__/AdminOrderListQuery";
import { useLazyQuery } from "@apollo/client";
import { Spinner } from "../../../../../shared/loader";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import OrderList from "../../../components/OrderList";

const Orders = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalItems, setTotalItems] = useState(10);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<AdminOrderListQuery_orders_data_orders[]>([]);
    const orderPerPage = 10;

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

    if (loading || orders.length < 1) {
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
            <OrderList orders={orders} />
            {orders && <div className="lg:my-24 my-12">
                <Pagination
                    innerClass="flex pl-0 rounded list-none flex-wrap justify-center"
                    itemClass="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-gray-500 bg-white text-gray-500"
                    activePage={pageNumber}
                    activeLinkClass="bg-black text-white w-full rounded-full h-full pt-2 pl-3"
                    itemsCountPerPage={orderPerPage}
                    totalItemsCount={totalItems}
                    onChange={handleChange}
                    disabledClass="bg-gray-400 text-gray-100"
                />
            </div>}
        </div>
    );
}

export default Orders
