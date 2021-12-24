import { useQuery } from "@apollo/client";
import { faCheckCircle, faEye, faTimesCircle, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ErrorMessage } from "../../../../../shared/error/FormError";
import Header from "../../../../../shared/Header";
import LoadingCmp from "../../../../../shared/loader/LoadingCmp";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import { GET_USERS } from "../../../graphql/admin.graphql";
import Pagination from "react-js-pagination";
import { GetUsers, GetUsersVariables, GetUsers_getUsers_data_users } from "../../../../../__generated__/GetUsers";
import { useNavigate } from "react-router";

const UserList = () => {
    const [users, setUsers] = useState<GetUsers_getUsers_data_users[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalItems, setTotalItems] = useState(10);
    const navigate = useNavigate();
    const userPerPage = 10;

    const { loading } = useQuery<GetUsers, GetUsersVariables>(GET_USERS, {
        variables: { getUsersInput: { pageNumber } },
        fetchPolicy: "no-cache",
        onCompleted: ({ getUsers }) => {
            const { ok, data } = getUsers;
            if (ok && data && data.users) {
                setTotalItems(data.totalItems)
                setUsers(data.users);
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const handleChange = (data: any) => {
        setUsers([]);
        setPageNumber(data)
    }

    if (errorMessage) {
        return <div className="flex items-center justify-center h-full">
            <ErrorMessage message={errorMessage} classes="text-3xl font-bold" />
        </div>
    }

    if (loading) {
        return <LoadingCmp />;
    }

    const detailPage = (id: number) => {
        navigate(`${id}`)
    }
    return (
        <div className="lg:px-10 px-4 pt-5 text-gray-900 h-full">
            <Header title="Users" description="Get system users.." />
            <h3 className="text-2xl mb-4 font-bold">Users</h3>
            <hr className="border-black" />
            <table className="w-full mt-4">
                <thead>
                    <tr className="text-center bg-black text-white font-bold text-sm uppercase">
                        <td className="pl-2 py-3">#</td>
                        <td className="">Name</td>
                        <td className="hidden lg:inline-flex lg:py-3 pr-2">User Name</td>
                        <td className="hidden lg:inline-flex lg:py-3 pr-2">Email</td>
                        <td className="">Role</td>
                        <td className="hidden lg:inline-flex lg:py-3 pr-2">Verified</td>
                        <td className="">Enabled</td>
                        <td className="">Orders</td>
                        <td className="hidden lg:inline-flex lg:py-3 pr-2">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return (<tr key={user.id} className="w-full cursor-pointer text-center border-b-2 text-sm" onClick={() => detailPage(user.id)}>
                            <td className=" py-4">{user.id}</td>
                            <td className="">{user.name}</td>
                            <td className="hidden lg:inline-flex lg:py-3 pr-2">{user.username}</td>
                            <td className="hidden lg:inline-flex lg:py-3 pr-2">{user.email}</td>
                            <td className="">{user.role}</td>
                            <td className="hidden lg:inline-flex lg:py-3 pr-2">
                                {user.verified ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> :
                                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />}
                            </td>
                            <td className="">
                                {
                                    !user.disabled ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> :
                                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                                }
                            </td>
                            <td className="">{user.orders.length}</td>
                            <td className="hidden lg:inline-flex lg:py-4 pr-2" onClick={() => detailPage(user.id)}>
                                <FontAwesomeIcon icon={faEye} title="View Details" className="cursor-pointer" />
                            </td>
                        </tr>);
                    })}
                </tbody>
            </table>
            {users && <div className="lg:my-24 my-12">
                <Pagination
                    innerClass="flex pl-0 rounded list-none flex-wrap justify-center"
                    itemClass="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-gray-500 bg-white text-gray-500"
                    activePage={pageNumber}
                    activeLinkClass="bg-black text-white w-full rounded-full h-full pt-2 pl-3"
                    itemsCountPerPage={userPerPage}
                    totalItemsCount={totalItems}
                    onChange={handleChange}
                    disabledClass="bg-gray-400 text-gray-100"
                />
            </div>}
        </div>
    )
}

export default UserList
