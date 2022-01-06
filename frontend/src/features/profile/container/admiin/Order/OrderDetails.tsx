import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GET_ORDER } from "../../../../../graphql/order.graphql";
import Header from "../../../../../shared/Header";
import { Spinner } from "../../../../../shared/loader";
import {
    GetOrder,
    GetOrderVariables,
    GetOrder_getOrder_order,
} from "../../../../../__generated__/GetOrder";
import AddressDetails from "../../../components/admin/order/AddressDetails";
import AdminAction from "../../../components/admin/order/AdminAction";
import OrderTracking from "../../../components/admin/order/OrderTracking";
import UserAction from "../../../components/admin/order/UserAction";
import UserDetails from "../../../components/admin/order/UserDetails";
import OrderItemInfo from "./OrderItemInfo";
// import jsPDF from 'jspdf';
// import pdfMake from 'pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// import htmlToPdfmake from 'html-to-pdfmake';

interface IOrderDetailsProps {
    isAdmin: boolean;
}

const OrderDetails = ({ isAdmin }: IOrderDetailsProps) => {
    const { id } = useParams();
    const [order, setOrder] = useState<GetOrder_getOrder_order | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const [fetchOrder, { refetch }] = useLazyQuery<GetOrder, GetOrderVariables>(GET_ORDER, {
        fetchPolicy: "no-cache",
        onCompleted: ({ getOrder }) => {
            const { ok, order } = getOrder;
            if (ok && order) {
                setOrder(order);
            }
            setLoading(false);
        },
        onError: (error) => {
            setLoading(false);
        },
    });

    const refetchQuery = () => {
        if (id) {
            refetch();
        }
    }

    const printDocument = () => {
        //const input = document.getElementById('divToPrint');

        // const doc = new jsPDF();

        // //get table html
        // const pdfTable = document.getElementById('divToPrint');
        // //html to pdf format
        // var html = htmlToPdfmake(pdfTable.innerHTML);

        // const documentDefinition = { content: html };
        // pdfMake.vfs = pdfFonts.pdfMake.vfs;
        // pdfMake.createPdf(documentDefinition).open();

    }

    useEffect(() => {
        if (id) {
            fetchOrder({
                variables: { getOrderInput: { orderId: +id } },
            });
        }
    }, [id, fetchOrder]);

    if (loading || !order) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner height={40} color={"#000"} />
            </div>
        );
    }

    return (
        <div id="accountPanel" className="lg:px-10 px-4 py-5 text-gray-900">
            <Header title="Orders" description="Orders." />
            <div className="flex items-center mb-4 space-x-4">
                <h3 className="text-2xl font-bold">Order Details </h3>
                <p>#{order.id}</p>
            </div>
            <hr className="border-black" />
            <div className="lg:space-x-6 space-x-0 space-y-6 lg:space-y-0 mt-6 flex lg:flex-row flex-col">
                <div className="lg:w-1/2 w-full">
                    <UserDetails user={order.customer} />
                </div>
                <div className="lg:w-1/2 w-full">
                    <AddressDetails
                        deliveryAddress={order.deliveryAddress}
                        billingAddress={order.billingAddress}
                    />
                </div>
            </div>
            <hr className="border-gray-500 my-6" />
            {isAdmin ?
                <>
                    <AdminAction paid={order.paid} status={order.status} orderId={order.id} refetch={refetchQuery} />
                    <hr className="border-gray-500 my-6" />
                </> :
                <>
                    <UserAction status={order.status} orderId={order.id} refetch={refetchQuery} />
                    <hr className="border-gray-500 my-6" />
                </>
            }
            <div className="lg:ml-4 space-y-8">
                <h1 className="font-bold text-xl">Order Info</h1>
                <div className="w-full space-y-20">
                    <div className="lg:w-1/3 ml-3 space-y-6">
                        <div className="flex justify-between items-center">
                            <p>Status</p>
                            <p className="bg-gray-800 text-white font-bold px-3 py-2">{order.status}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Paid</p>
                            <p className={`bg-${order.paid ? "green" : "red"}-500 text-white font-bold px-3 py-2`}>{order.paid ? "PAID" : "UNPAID"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Order At</p>
                            <p className={`font-bold px-3 py-2`}>{moment(order.createdAt).format("MMM Do YYYY")}</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <OrderTracking status={order.status} />
                    </div>
                </div>
                <div className="px-4">
                    <h1 className="text-lg">Order Items</h1>
                    <hr />
                    <OrderItemInfo orderItems={order.orderItems} />
                </div>
            </div>
            <button className="bg-black text-white px-4 py-2 mt-4" onClick={() => isAdmin ? navigate("/profile/admin/orders") : navigate("/profile/orders")}>
                Back to Orders
            </button>
        </div>
    );
};

export default OrderDetails;
