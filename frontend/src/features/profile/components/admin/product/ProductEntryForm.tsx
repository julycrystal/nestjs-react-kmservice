import { useForm } from "react-hook-form";
import { ErrorMessage } from "../../../../../shared/error/FormError";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from "@apollo/client";
import { CreateProductEntry, CreateProductEntryVariables } from "../../../../../__generated__/CreateProductEntry";
import { ADMIN_CREATE_PRODUCT_ENTRY, ADMIN_UPDATE_PRODUCT_ENTRY } from "../../../graphql/admin.graphql";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import { SubmitButton } from "../../../../../shared/button";
import { GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries } from "../../../../../__generated__/GetProductEntriesByProduct";
import { UpdateProductEntry, UpdateProductEntryVariables } from "../../../../../__generated__/UpdateProductEntry";

interface IProductEntryForm {
    productId: number;
    callback: () => void;
    entry: GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries | null;
}

const ProductEntryForm = ({ productId, callback, entry }: IProductEntryForm) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [value, onChange] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const { qty } = watch();
    const [createEntry] = useMutation<CreateProductEntry, CreateProductEntryVariables>(ADMIN_CREATE_PRODUCT_ENTRY, {
        onCompleted: ({ createProductEntry }) => {
            const { ok } = createProductEntry;
            if (ok) {
                setLoading(false);
                reset();
                callback()
            }
        },
        onError: (error) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error));
        },
    });

    const [editEntry] = useMutation<UpdateProductEntry, UpdateProductEntryVariables>(ADMIN_UPDATE_PRODUCT_ENTRY, {
        onCompleted: ({ updateProductEntry }) => {
            const { ok } = updateProductEntry;
            if (ok) {
                setLoading(false);
                reset();
                callback()
            }
        },
        onError: (error) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error));
        },
    });

    const onSubmit = () => {
        setLoading(true);
        if (entry) {
            editEntry({ variables: { updateProductEntryInput: { amount: +qty, id: entry.id, entryDate: value.toISOString(), } } })
        } else {
            createEntry({ variables: { createProductEntryInput: { amount: +qty, productId, entryDate: value.toISOString() } } })

        }
    };

    const isValid = () => {
        return qty > 0;
    }

    useEffect(() => {
        if (entry) {
            setValue('qty', entry.amount);
            onChange(new Date(entry.entryDate))
        }
    }, [entry, setValue])

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} onChange={isValid}>
                <div className="flex lg:space-x-4 space-x-2">
                    <div className="lg:w-1/3 w-1/2">
                        <input
                            {...register("qty", { require: false })}
                            placeholder="QTY"
                            type="number"
                            min={1}
                            className="border-2 border-black p-2 md:mb-2 w-full"
                        />
                        {errors.qty && (
                            <ErrorMessage message={errors.qty.message} />
                        )}
                    </div>
                    <div className="lg:w-1/4">
                        <DatePicker
                            className="border-2 text-center py-2 border-black"
                            selected={value}
                            onChange={onChange} />
                    </div>
                    <SubmitButton
                        isValid={isValid()}
                        buttonText={entry ? "EDIT" : "ADD"}
                        classes="px-4"
                        loading={loading}
                    />
                </div>
            </form>

        </div>
    )
}

export default ProductEntryForm
