import { GetOrder_getOrder_order_customer } from "../../../../../__generated__/GetOrder";

interface IUserDetailsProps {
    user: GetOrder_getOrder_order_customer;
}
const UserDetails = ({ user }: IUserDetailsProps) => {
    return (
        <div className="lg:ml-8 ml-3">
            <h1 className="mb-3 text-lg text-gray-700 font-bold">User Details</h1>
            <hr className="border-gray-500" />
            <div className="space-y-4 text-sm mt-8">
                <div className="flex justify-between">
                    <p>Name</p>
                    <p>{user.name}</p>
                </div>
                <div className="flex justify-between">
                    <p>Email</p>
                    <p>{user.email}</p>
                </div>
                <div className="flex justify-between">
                    <p>Username</p>
                    <p>{user.username}</p>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
