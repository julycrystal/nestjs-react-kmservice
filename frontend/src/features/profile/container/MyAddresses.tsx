import { useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import { ErrorMessage } from "../../../shared/error/FormError";
import Header from "../../../shared/Header";
import LoadingCmp from "../../../shared/loader/LoadingCmp";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { AddressParts } from "../../../__generated__/AddressParts";
import { GetAddresses } from "../../../__generated__/GetAddresses";
import AddressForm from "../components/admin/AddressForm";
import AddressList from "../components/AddressList";
import { GET_ADDRESSES } from "../graphql/profile.graphql";

const MyAddresses = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<AddressParts[]>([]);
    const [editAddress, setEditAddress] = useState<AddressParts | null>();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const { loading, refetch } = useQuery<GetAddresses, null>(GET_ADDRESSES, {
        fetchPolicy: "no-cache",
        onCompleted: ({ getAddresses }) => {
            const { ok, addresses } = getAddresses;
            console.log(getAddresses)
            if (ok && addresses) {
                setAddresses(addresses);
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const editHandler = (address: AddressParts) => {
        setEditAddress(address);
        setIsEditing(true);
    }

    const endEditing = () => {
        setIsEditing(false);
        setEditAddress(null);
    }

    if (loading) {
        return <LoadingCmp />;
    }

    if (errorMessage) {
        return (
            <div className="h-full flex justify-center items-center">
                <ErrorMessage message={errorMessage} classes="text-3xl font-bold" />
            </div>
        );
    }

    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <Header title="My Addresses" description="Update your addresses." />
            <div className="flex items-center justify-between">
                <h3 className="text-2xl mb-4 font-bold">My Addresses</h3>
                <AddressForm
                    endEditing={endEditing}
                    isEditing={isEditing}
                    addressObj={editAddress}
                    callback={refetch}
                />
            </div>
            <hr className="border-black" />
            {addresses && <AddressList
                editHandler={editHandler}
                callback={refetch}
                addresses={addresses}
                showActions={true}
            />}
        </div>
    );
};

export default MyAddresses;
