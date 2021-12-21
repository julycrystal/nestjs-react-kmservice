import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { SubmitButton } from "../../../shared/button";
import FormError, { ErrorMessage } from "../../../shared/error/FormError";
import Header from "../../../shared/Header";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { UpdateProfileMutation, UpdateProfileMutationVariables } from "../../../__generated__/UpdateProfileMutation";
import { login } from "../../auth/authSlice";
import { UPDATE_PROFILE_MUTATION } from "../graphql/profile.graphql";

export default function EditProfile () {

    const dispatch = useDispatch();

    const [enabled, setEnabled] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            name: user ? user.name : "",
            email: user ? user.email : "",
            bio: user ? user.bio : "",
        }
    });

    const [mutate] = useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UPDATE_PROFILE_MUTATION, {
        onCompleted: ({ updateProfile }) => {
            const { ok, user } = updateProfile;
            if (ok && user) {
                dispatch(login({ user: user }))
                setLoading(false);
            }
        },
        onError: (error: any) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error))
        }
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const { name, email, bio } = watch();

    const isSameWithPrevValue = () => {
        return Boolean((bio ? bio === user?.bio : true) &&
            email === user?.email &&
            name === user?.name)
    }

    const isValid = () => {
        const dataList: string[] = [name, email];
        const isNotEmpty = dataList.every(item => item && item.trim().length > 0)
        console.log(`isNotEmpty && isChanged && !isSameWithPrevValue() ${isNotEmpty} && ${isChanged} && ${!isSameWithPrevValue()}`);
        return isNotEmpty && isChanged && !isSameWithPrevValue();
    }
    console.log(isSameWithPrevValue());
    const onSubmit = () => {
        setLoading(true);
        const updateObj = {
            ...((bio && user) && (bio !== user?.bio) && { bio }),
            ...((name && user) && (name !== user?.name) && { name }),
            ...((email && user) && (email !== user?.email) && { email })
        }
        mutate({ variables: { updateUserInput: updateObj } });
    }

    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <Header title="Edit Profile" description="Edit your profile." />
            <h3 className="text-2xl mb-4 font-bold">Edit Profile</h3>
            <hr className="border-black" />
            <p className="mb-3 mt-6 text-gray-500">
                Edit your profile details.
            </p>
            <div className="lg:w-1/3">
                <div className={`mb-2 ${errorMessage ? 'block' : 'hidden'} duration-300 transition-all`}>
                    {(errorMessage) && <FormError onClick={() => setErrorMessage(null)} message={errorMessage} />}
                </div>
                <form action="" className="flex flex-col pb-8" onSubmit={handleSubmit(onSubmit)} onChange={() => setIsChanged(true)}>
                    <input
                        {...register("name", {
                            minLength: {
                                value: 6,
                                message: "The name must be at least 6 characters long."
                            }, required: "This field is required."
                        })}
                        type="text"
                        placeholder="Your Name"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.name && errors.name.message && <ErrorMessage message={errors.name.message} />}
                    <input
                        {...register("email", {
                            required: "This field is required.",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        placeholder="Your Email"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.email && errors.email.message && <ErrorMessage message={errors.email.message} />}
                    <textarea
                        {...register("bio")}
                        placeholder="Your Bio"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.bio && errors.bio.message && <ErrorMessage message={errors.bio.message} />}
                    <SubmitButton loading={loading} buttonText="Edit Profile" isValid={isValid()} />
                </form>
            </div>
        </div>

    );
}
