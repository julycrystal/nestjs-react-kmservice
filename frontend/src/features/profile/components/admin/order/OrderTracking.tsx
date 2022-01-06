import {
    faBox,
    faCheck,
    faSpinner,
    faTruck,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OrderStatus } from "../../../../../__generated__/globalTypes";
import "./OrderTracking.css";

interface IStepProps {
    icon: any;
    isActive?: boolean;
    label: string;
}

interface IOrderTrackingProps {
    status: OrderStatus;
}

const OrderTrackingStatus = [
    OrderStatus.PENDING,
    OrderStatus.ORDER_CONFIRMED,
    OrderStatus.PICKED_BY_COURIER,
    OrderStatus.ON_THE_WAY,
    OrderStatus.DELIVERED,
]

const Step = ({ icon, label, isActive = false }: IStepProps) => (
    <div className={`step ${isActive && "active"}`}>
        <span className="icon pt-1.5">
            <FontAwesomeIcon icon={icon} />
        </span>
        <span className="block text-xs mt-2 font-bold"> {label}</span>
    </div>
);

const OrderTracking = ({ status }: IOrderTrackingProps) => {
    const activeIndex = OrderTrackingStatus.findIndex(item => item === status);
    return (
        <div className="track w-full mx-auto">
            <Step icon={faSpinner} label="Pending" isActive={0 <= activeIndex} />
            <Step icon={faCheck} label="Order Confirmed" isActive={1 <= activeIndex} />
            <Step icon={faUser} label="Picked by courier" isActive={2 <= activeIndex} />
            <Step icon={faTruck} label="On the way" isActive={3 <= activeIndex} />
            <Step icon={faBox} label="Delivered" isActive={4 <= activeIndex} />
        </div>
    );
};

export default OrderTracking;
