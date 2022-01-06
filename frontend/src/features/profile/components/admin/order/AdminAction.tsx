import { useMutation } from '@apollo/client';
import { useState } from 'react'
import { OrderStatus } from '../../../../../__generated__/globalTypes'
import { UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables } from '../../../../../__generated__/UpdatePaymentStatusMutation';
import { UPDATE_ORDER_STATUS_MUTATION, UPDATE_PAYMENT_STATUS_MUTATION } from "../../../../../graphql/order.graphql";
import { UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables } from '../../../../../__generated__/UpdateOrderStatusMutation';

interface IAdminActionProps {
    paid: boolean;
    status: OrderStatus;
    orderId: number;
    refetch: () => void;
}

const AdminAction = ({ paid, status, orderId, refetch }: IAdminActionProps) => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<number>(() => paid ? 1 : 0);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(status)
    const [updatePaymentStatus] = useMutation<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>(UPDATE_PAYMENT_STATUS_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: ({ updatePaymentStatus }) => {
            const { ok, } = updatePaymentStatus;
            if (ok) {
                refetch();
            }
            setLoading(false);
        },
        onError: (error) => {
            setLoading(false);
        },
    });

    const [updateOrderStatus] = useMutation<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>(UPDATE_ORDER_STATUS_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: ({ updateOrderStatus }) => {
            const { ok, } = updateOrderStatus;
            if (ok) {
                refetch();
            }
            setLoading(false);
        },
        onError: (error) => {
            setLoading(false);
        },
    });

    const updatePaymentHandler = () => {
        updatePaymentStatus({ variables: { updatePaymentStatusInput: { orderId, paid: +paymentStatus === 1 } } });
    }

    const updateOrderStatusHandler = () => {
        updateOrderStatus({ variables: { updateOrderStatusInput: { orderId, status: orderStatus } } });
    }

    const orderStatusValid = () => {
        return status !== orderStatus;
    }

    const paymentStatusValid = () => {
        const currentStatus = (paid ? 1 : 0);
        return currentStatus !== +paymentStatus
    };

    return (
        <div className="ml-4">
            <h1 className="font-bold text-xl">Admin Actions</h1>
            <div className="flex lg:flex-row flex-col lg:space-x-6 space-x-0 lg:space-y-0 space-y-6">
                <div className="text-sm mt-3 lg:ml-3 flex flex-col lg:w-1/2">
                    <div>
                        <h1>Payment Status</h1>
                        <hr />
                    </div>
                    <div className="flex space-x-6 mt-4">
                        <select value={paymentStatus} onChange={(event: any) => setPaymentStatus(event.target.value)}>
                            <option value={1}>PAID</option>
                            <option value={0}>UNPAID</option>
                        </select>
                        <button onClick={updatePaymentHandler} disabled={!paymentStatusValid()} className={`${paymentStatusValid() ? "bg-black" : "bg-gray-500"} text-white font-bold px-3 py-1 uppercase w-fit`}>update</button>
                    </div>
                </div>
                <div className="text-sm mt-3 ml-3 flex flex-col lg:w-1/2">
                    <div>
                        <h1>
                            Update Status</h1>
                        <hr />
                    </div>
                    <div className="flex space-x-6 mt-4">
                        <select
                            disabled={status === OrderStatus.CANCELLED}
                            value={orderStatus} onChange={(event: any) => {
                                setOrderStatus(event.target.value)
                            }}>
                            <option value={OrderStatus.PENDING}>Pending</option>
                            <option value={OrderStatus.ORDER_CONFIRMED}>Order Confirmed</option>
                            <option value={OrderStatus.PICKED_BY_COURIER}>Picked By Courier</option>
                            <option value={OrderStatus.ON_THE_WAY}>On The Way</option>
                            <option value={OrderStatus.DELIVERED}>Delivered</option>
                        </select>
                        <button onClick={updateOrderStatusHandler} disabled={!orderStatusValid()} className={`${orderStatusValid() ? "bg-black" : "bg-gray-500"} text-white font-bold px-3 py-1 uppercase w-fit`}>update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAction;