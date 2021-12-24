import { useMutation } from "@apollo/client";
import { faExclamationTriangle, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Modal from "../../../shared/Modal";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { AddressParts } from "../../../__generated__/AddressParts";
import { DeleteAddressMutation, DeleteAddressMutationVariables } from "../../../__generated__/DeleteAddressMutation";
import { DELETE_ADDRESS_MUTATION } from "../graphql/profile.graphql";

interface IAddressListProps {
    addresses: AddressParts[],
    showActions?: boolean,
    callback?: () => void,
    editHandler?: (address: AddressParts) => void,
}

const AddressList = ({ addresses, showActions = false, callback, editHandler }: IAddressListProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [id2Delete, setId2Delete] = useState<number | null>();
    const [showModal, setShowModal] = useState(false);
    const [deleteAddress, { loading: disableLoading }] = useMutation<
        DeleteAddressMutation,
        DeleteAddressMutationVariables
    >(DELETE_ADDRESS_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: ({ deleteAddress }) => {
            const { ok } = deleteAddress;
            if (ok) {
                if (callback) {
                    callback();
                }
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const deleteHandler = () => {
        if (id2Delete) {
            deleteAddress({
                variables: {
                    deleteAddressInput: {
                        id: id2Delete,
                    }
                }
            })
            setShowModal(false);
        }
    }

    const deleteClickHanler = (id: number) => {
        setId2Delete(id);
        setShowModal(true);
    }

    return (<div className={`py-3 px-5 mt-3`}>
        <div className="flex flex-wrap">
            {addresses.length === 0 && (
                <div className="my-4 text-center font-bold w-full">
                    Empty Address
                </div>
            )}
            {addresses.length > 0 &&
                addresses.map((address) => {
                    return (
                        <>
                            <div key={address.id} className="my-1 mx-1 shadow-lg px-4 border-2 border-gray-300 py-2 lg:w-48 w-full">
                                {showActions && editHandler && <div className="text-sm flex justify-end space-x-2">
                                    <FontAwesomeIcon icon={faPencilAlt} className="cursor-pointer" onClick={() => editHandler(address)} />
                                    <FontAwesomeIcon icon={faTrashAlt} className="cursor-pointer" onClick={() => deleteClickHanler(address.id)} />
                                </div>}
                                <p className="font-bold text-black">{address.name}</p>
                                <p>{address.country}</p>
                                <p>{address.city}</p>
                                <p>{address.address}</p>
                                <p>{address.apartment}</p>
                            </div>
                            <Modal
                                onCancel={() => setShowModal(false)}
                                show={showModal}
                                onClick={deleteHandler}
                                icon={faExclamationTriangle}
                                title={"Delete Address"}
                                description={"Are you sure you want to delete your Address?"} />
                        </>
                    );
                })}
        </div>
    </div>);
}

export default AddressList
