import { useMutation } from "@apollo/client";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../../../../shared/button";
import FormError, { ErrorMessage } from "../../../../shared/error/FormError";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { AddressParts } from "../../../../__generated__/AddressParts";
import {
    CreateAddressMutation,
    CreateAddressMutationVariables,
} from "../../../../__generated__/CreateAddressMutation";
import { UpdateAddressMutation, UpdateAddressMutationVariables } from "../../../../__generated__/UpdateAddressMutation";
import { CREATE_ADDRESS_MUTATION, UPDATE_ADDRESS_MUTATION } from "../../graphql/profile.graphql";

interface IAddressFormProps {
    callback: () => void;
    addressObj?: AddressParts | null;
    isEditing?: boolean,
    endEditing?: () => void,
}

export default function AddressForm ({ callback, addressObj, isEditing = false, endEditing }: IAddressFormProps) {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            name: addressObj ? addressObj.name : "",
            city: addressObj ? addressObj.city : "",
            country: addressObj ? addressObj.country : "",
            address: addressObj ? addressObj.address : "",
            apartment: addressObj ? addressObj.apartment : "",
            note: addressObj ? addressObj.note : "",
        },
    });
    const { name, city, address, country, apartment, note } = watch();

    useEffect(() => {
        if (isEditing && !showModal) {
            setShowModal(true);
        }
        if (addressObj) {
            setValue("name", addressObj ? addressObj.name : "");
            setValue("city", addressObj ? addressObj.city : "");
            setValue("country", addressObj ? addressObj.country : "");
            setValue("address", addressObj ? addressObj.address : "");
            setValue("apartment", addressObj ? addressObj.apartment : "");
            setValue("note", addressObj ? addressObj.note : "");
        }

    }, [isEditing, addressObj])

    const [createAddress] = useMutation<
        CreateAddressMutation,
        CreateAddressMutationVariables
    >(CREATE_ADDRESS_MUTATION, {
        onCompleted: ({ createAddress }) => {
            if (createAddress.ok) {
                setLoading(false);
                reset();
                setShowModal(false);
                if (callback) {
                    callback();
                }
            }
        },
        onError: (err) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(err));
        },
    });

    const [updateAddress] = useMutation<
        UpdateAddressMutation,
        UpdateAddressMutationVariables
    >(UPDATE_ADDRESS_MUTATION, {
        onCompleted: ({ updateAddress }) => {
            if (updateAddress.ok) {
                setLoading(false);
                reset();
                setShowModal(false);
                if (callback) {
                    callback();
                    if (endEditing) {
                        endEditing()
                    }
                }
            }
        },
        onError: (err) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(err));
        },
    });

    const isUpdateValueValid = () => {
        const { name, city, address, country, apartment, note } = getValues();
        const requiredFields: string[] = [name, city, address, country];
        const result = requiredFields.every(field => field && field.length > 0);
        const sameWithPrevValue = addressObj && Boolean(
            (name === addressObj.name) &&
            (city === addressObj.city) &&
            (address === addressObj.address) &&
            (country === addressObj.country) &&
            (apartment ? apartment === addressObj?.apartment : true) &&
            (note ? note === addressObj?.note : true)
        )
        return Boolean(
            result &&
            !sameWithPrevValue &&
            Object.entries(errors).length === 0
        );
    }

    const isValid = useCallback(() => {
        if (isEditing) {
            return isUpdateValueValid();
        }
        const { name, city, address, country } = getValues();
        const requiredFields: string[] = [name, city, address, country];
        const result = requiredFields.every(field => field && field.length > 0);
        return Boolean(
            result &&
            Object.entries(errors).length === 0
        );
    }, [name, address, city, country, errors]);

    const onSubmit = () => {
        setLoading(true);
        if (isEditing && addressObj) {
            const updateObj = {
                ...((note && addressObj) && (note !== addressObj?.note) && { note }),
                ...((name && addressObj) && (name !== addressObj?.name) && { name }),
                ...((apartment && addressObj) && (apartment !== addressObj?.apartment) && { apartment }),
                ...((country && addressObj) && (country !== addressObj?.country) && { country }),
                ...((city && addressObj) && (city !== addressObj?.city) && { city }),
                ...((address && addressObj) && (address !== addressObj?.address) && { address }),
            }
            updateAddress({ variables: { updateAddressInput: { ...updateObj, id: addressObj.id } } })
        } else {
            createAddress({ variables: { createAddressInput: { ...getValues() } } });
        }
    };

    const closeModal = () => {
        reset();
        setShowModal(false);
        if (isEditing && endEditing) {
            endEditing()
        }
    };

    return (
        <>
            <div className="flex mb-3 items-stretch">
                <button
                    className="font-bold uppercase outline-none mr-1 text-xl"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlusSquare} />
                </button>
            </div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-xl">
                            {/*content*/}
                            <form onSubmit={handleSubmit(onSubmit)} method="post">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            {addressObj ? "Edit" : "Create New"}  Address
                                        </h3>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        {errorMessage && (
                                            <div className="mb-2">
                                                <FormError
                                                    message={errorMessage}
                                                    onClick={() => setErrorMessage(null)}
                                                />
                                            </div>
                                        )}
                                        <input
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: "This field is required.",
                                                },
                                            })}
                                            placeholder="Address Name *"
                                            className="border-2 border-black p-2 md:mb-2 w-full"
                                        />
                                        {errors.name && (
                                            <ErrorMessage message={errors.name.message} />
                                        )}
                                        <input
                                            {...register("city", {
                                                required: {
                                                    value: true,
                                                    message: "This field is required.",
                                                },
                                            })}
                                            placeholder="City *"
                                            className="border-2 border-black p-2 md:mb-2 w-full"
                                        />
                                        {errors.city && (
                                            <ErrorMessage message={errors.city.message} />
                                        )}

                                        <input
                                            {...register("address", {
                                                required: {
                                                    value: true,
                                                    message: "This field is required.",
                                                },
                                            })}
                                            placeholder="Address *"
                                            className="border-2 border-black p-2 md:mb-2 w-full"
                                        />
                                        {errors.address && (
                                            <ErrorMessage message={errors.address.message} />
                                        )}

                                        <input
                                            {...register("apartment", { require: false })}
                                            placeholder="Apartment"
                                            className="border-2 border-black p-2 md:mb-2 w-full"
                                        />
                                        {errors.apartment && (
                                            <ErrorMessage message={errors.apartment.message} />
                                        )}

                                        <input
                                            {...register("country", {
                                                required: {
                                                    value: true,
                                                    message: "This field is required.",
                                                },
                                            })}
                                            placeholder="Country *"
                                            className="border-2 border-black p-2 md:mb-2 w-full"
                                        />
                                        {errors.country && (
                                            <ErrorMessage message={errors.country.message} />
                                        )}

                                        <textarea
                                            {...register("note", {
                                                required: {
                                                    value: false,
                                                },
                                            })}
                                            placeholder="Note"
                                            className="border-2 border-black p-2 md:mb-2 w-full"
                                        />
                                        {errors.note && (
                                            <ErrorMessage message={errors.note.message} />
                                        )}
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="border-2 border-black text-black-500 font-bold uppercase px-3 py-1 text-sm outline-none mr-1"
                                            type="button"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                        <SubmitButton
                                            loading={loading}
                                            buttonText="Save"
                                            classes="px-3 py-1 uppercase mb-0"
                                            isValid={isValid()}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
