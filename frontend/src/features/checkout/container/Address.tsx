import {
    GetAddresses_getAddresses_addresses,
} from "../../../__generated__/GetAddresses";
import AddressForm from "../../profile/components/admin/AddressForm";

interface IAddressProps {
    title: string;
    name: string;
    addresses: GetAddresses_getAddresses_addresses[],
    callback: () => void;
    register: any,
}

const Address = ({ title, name, addresses, callback, register }: IAddressProps) => {
    return (
        <div>
            <h1 className="font-bold text-lg text-left">{title}</h1>
            <AddressForm callback={callback} />
            <div className="space-y-3">
                {addresses.map((address) => {
                    return (
                        <div className="space-x-3 flex flex-start items-center" key={`${address.id}-${name}`}>
                            <input {...register(name)} value={address.id} type="radio" id={`address-${address.id}-${name}`} />
                            <label htmlFor={`address-${address.id}-${name}`}>{address.name}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Address;
