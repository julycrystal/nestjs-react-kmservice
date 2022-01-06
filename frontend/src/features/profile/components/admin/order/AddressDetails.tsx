import { AddressParts } from "../../../../../__generated__/AddressParts";

interface IAddressDetailsProps {
    deliveryAddress: AddressParts;
    billingAddress: AddressParts;
}

const AddressDetails = ({
    billingAddress,
    deliveryAddress,
}: IAddressDetailsProps) => {

    const AddressInfo = ({ address }: { address: any }) => {
        return (<div className="text-sm  space-y-3">
            <div className="flex justify-between">
                <p>Name</p>
                <p>{address.name}</p>
            </div>
            <div className="flex justify-between">
                <p>Country</p>
                <p>{address.country}</p>
            </div>
            <div className="flex justify-between">
                <p>City</p>
                <p>{address.city}</p>
            </div>
            <div className="flex justify-between">
                <p>Address</p>
                <p>{address.address}</p>
            </div>
            <div className="flex justify-between">
                <p>Apartment</p>
                <p>{address.apartment}</p>
            </div>
            <div className="flex justify-between">
                <p>Note</p>
                <p>{address.note}</p>
            </div>
        </div>);
    }

    return (
        <div className="lg:ml-8">
            <h1 className="mb-3 text-lg text-gray-700 font-bold">Address Details</h1>
            <hr className="border-gray-500" />
            <div className="space-y-4 text-sm mt-4">
                <div className="ml-3 space-y-3">
                    <div>
                        <h1 className="font-bold">Billing Address</h1>
                        <hr className="my-2" />
                        <AddressInfo address={billingAddress} />
                    </div>
                    <div>
                        <h1 className="font-bold">Shipping Address</h1>
                        <hr className="my-2" />
                        <AddressInfo address={deliveryAddress} />
                    </div>
                </div>
            </div>
        </div>);
};

export default AddressDetails;
