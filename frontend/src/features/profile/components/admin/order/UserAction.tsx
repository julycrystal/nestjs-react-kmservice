import { useMutation } from "@apollo/client";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CANCEL_ORDER_MUTATION } from "../../../../../graphql/order.graphql";
import { CancelOrderMutation, CancelOrderMutationVariables } from "../../../../../__generated__/CancelOrderMutation";
import { OrderStatus } from "../../../../../__generated__/globalTypes"

interface IUserActionProps {
    status: OrderStatus;
    orderId: number;
    refetch: () => void;
}

const UserAction = ({ orderId, refetch, status }: IUserActionProps) => {
    const [updatePaymentStatus] = useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CANCEL_ORDER_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: ({ cancelOrder }) => {
            const { ok, } = cancelOrder;
            if (ok) {
                refetch();
            }
        },
        onError: (error) => {
            console.log(error)
        },
    });

    const orderCancelHandler = () => {
        updatePaymentStatus({ variables: { cancelOrderInput: { orderId } } })
    }

    const isValid = () => {
        return (status !== OrderStatus.DELIVERED) && (status !== OrderStatus.CANCELLED);
    }

    return (
        <div className="lg:ml-4">
            <h1 className="font-bold text-xl">Actions</h1>
            <div className="text-sm mt-3 ml-3 space-x-6 flex">
                <button onClick={orderCancelHandler} disabled={!isValid()} className={`${isValid() ? "bg-black" : "bg-gray-500"} text-white font-bold px-3 py-1`}>Cancel Order</button>
                <button className="bg-black text-white font-bold px-3 py-2 space-x-2 flex items-center"> <FontAwesomeIcon icon={faFileDownload} /> <p>Download Invoice</p></button>
            </div>
        </div>
    )
}

export default UserAction
