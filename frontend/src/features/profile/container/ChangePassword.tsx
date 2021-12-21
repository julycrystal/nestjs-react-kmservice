import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { SubmitButton } from "../../../shared/button";
import FormError, { ErrorMessage } from "../../../shared/error/FormError";
import Header from "../../../shared/Header";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { ChangePasswordMutation, ChangePasswordMutationVariables } from "../../../__generated__/ChangePasswordMutation";
import { logout } from "../../auth/authSlice";
import { removeToken } from "../../auth/services/localstorage.service";
import { CHANGE_PASSWORD_MUTATION } from "../graphql/profile.graphql";

export default function ChangePassword () {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange",

    });

    const [mutate, { loading: isLoading }] = useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(CHANGE_PASSWORD_MUTATION, {
        onCompleted: ({ changePassword }) => {
            if (changePassword.ok) {
                removeToken();
                dispatch(logout());
                navigate('/login')
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error))
        }
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const { password, newPassword, confirmNewPassword } = watch();

    const isValid = () => {
        const passwordList: string[] = [password, newPassword, confirmNewPassword];
        const isNotEmpty = passwordList.every(pword => pword && pword.trim().length >= 6)
        return isNotEmpty && confirmNewPassword === newPassword;
    }

    const onSubmit = () => {
        mutate({ variables: { changePasswordInput: { newPassword: newPassword, oldPassword: password } } })
    }

    return (
        <div id="accountPanel" className="px-10 pt-5 text-gray-900">
            <Header title="Change Password" description="Change your password." />
            <h3 className="text-2xl mb-4 font-bold">Change Password</h3>
            <hr className="border-black" />
            <p className="mb-3 mt-6 text-gray-500">
                Choose a strong password.<br />
                Changing your password will log you out.<br />
                You will need to login in again.
            </p>
            <div className="lg:w-1/3">
                <div className={`mb-2 ${errorMessage ? 'block' : 'hidden'} duration-300 transition-all`}>
                    {(errorMessage) && <FormError onClick={() => setErrorMessage(null)} message={errorMessage} />}
                </div>
                <form action="" className="flex flex-col pb-8" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("password", {
                            minLength: {
                                value: 6,
                                message: "The password must be at least 6 characters long."
                            }, required: "This field is required."
                        })}
                        type="password"
                        placeholder="Current Password"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.password && <ErrorMessage message={errors.password.message} />}
                    <input
                        {...register("newPassword", {
                            minLength: {
                                value: 6,
                                message: "The password must be at least 6 characters long."
                            }, required: "This field is required."
                        })}
                        type="password"
                        placeholder="New Password"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.newPassword && <ErrorMessage message={errors.newPassword.message} />}
                    {newPassword !== confirmNewPassword && <ErrorMessage message="New Password and Confirm Password must be equal." />}
                    <input
                        {...register("confirmNewPassword", {
                            minLength: {
                                value: 6,
                                message: "The password must be at least 6 characters long."
                            }, required: "This field is required."
                        })}
                        type="password"
                        placeholder="Confirm New Password"
                        className="border-2 border-black p-2 md:mb-4 mb-2"
                    />
                    {errors.confirmNewPassword && <ErrorMessage message={errors.confirmNewPassword.message} />}
                    {newPassword !== confirmNewPassword && <ErrorMessage message="New Password and Confirm Password must be equal." />}
                    <SubmitButton loading={isLoading} buttonText="Change Password" isValid={isValid()} />
                </form>
            </div>
        </div>

    );
}
