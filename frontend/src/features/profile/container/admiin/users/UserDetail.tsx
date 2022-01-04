import { useLazyQuery, useMutation } from "@apollo/client";
import Pagination from "react-js-pagination";
import {
    faArrowAltCircleLeft,
    faCheckCircle,
    faMinusSquare,
    faPlusSquare,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ErrorMessage } from "../../../../../shared/error/FormError";
import Header from "../../../../../shared/Header";
import LoadingCmp from "../../../../../shared/loader/LoadingCmp";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import {
    GetUser,
    GetUserVariables,
    GetUser_getUser_user,
} from "../../../../../__generated__/GetUser";
import { UserRole } from "../../../../../__generated__/globalTypes";
import {
    DISABLE_ACCOUNT,
    ENABLE_ACCOUNT,
    GET_ENTRIES_BY_USER,
    GET_USER,
    UPDATE_USER_ROLE,
} from "../../../../../graphql/admin.graphql";
import {
    GetProductEntriesByUser,
    GetProductEntriesByUserVariables,
    GetProductEntriesByUser_getProductEntriesByUser_data_productEntries,
} from "../../../../../__generated__/GetProductEntriesByUser";
import {
    DisableAccount,
    DisableAccountVariables,
} from "../../../../../__generated__/DisableAccount";
import {
    EnableAccount,
    EnableAccountVariables,
} from "../../../../../__generated__/EnableAccount";
import { UpdateUserRole, UpdateUserRoleVariables } from "../../../../../__generated__/UpdateUserRole";
import AddressList from "../../../components/AddressList";

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState<GetUser_getUser_user>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [entryPageNumber, setEntryPageNumber] = useState(1);
    const [entries, setEntries] = useState<
        GetProductEntriesByUser_getProductEntriesByUser_data_productEntries[]
    >([]);
    const [totalEntries, setTotalEntries] = useState<number>(10);
    const [showAddresses, setShowAddresses] = useState(false);
    const [showProductEntries, setShowProductEntries] = useState(false);
    const navigate = useNavigate();

    const [getUser, { loading }] = useLazyQuery<GetUser, GetUserVariables>(
        GET_USER,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ getUser }) => {
                const { ok, user } = getUser;
                if (ok && user) {
                    setUser(user);
                }
            },
            onError: (error) => {
                setErrorMessage(getErrorMessage(error));
            },
        }
    );

    const [fetchEntries] = useLazyQuery<
        GetProductEntriesByUser,
        GetProductEntriesByUserVariables
    >(GET_ENTRIES_BY_USER, {
        fetchPolicy: "no-cache",
        onCompleted: ({ getProductEntriesByUser }) => {
            const { ok, data } = getProductEntriesByUser;
            if (ok && data && data.productEntries) {
                setEntries(data.productEntries);
                setTotalEntries(data.totalItems);
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const [disableAccount, { loading: disableLoading }] = useMutation<
        DisableAccount,
        DisableAccountVariables
    >(DISABLE_ACCOUNT, {
        fetchPolicy: "no-cache",
        onCompleted: ({ disableAccount }) => {
            const { ok } = disableAccount;
            if (ok && id) {
                getUser({ variables: { getUserInput: { id: +id } } });
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const [enableAccount, { loading: enableLoading }] = useMutation<
        EnableAccount,
        EnableAccountVariables
    >(ENABLE_ACCOUNT, {
        fetchPolicy: "no-cache",
        onCompleted: ({ enableAccount }) => {
            const { ok } = enableAccount;
            if (ok && id) {
                getUser({ variables: { getUserInput: { id: +id } } });
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });
    const [changeRole, { loading: changeRoleLoading }] = useMutation<
        UpdateUserRole,
        UpdateUserRoleVariables
    >(UPDATE_USER_ROLE, {
        fetchPolicy: "no-cache",
        onCompleted: ({ updateUserRole }) => {
            const { ok } = updateUserRole;
            if (ok && id) {
                getUser({ variables: { getUserInput: { id: +id } } });
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    useEffect(() => {
        if (id) {
            if (!user || (user && user.id !== +id)) {
                getUser({ variables: { getUserInput: { id: +id } } });
            }
            fetchEntries({
                variables: {
                    getProductEntriesInput: { userId: +id, pageNumber: entryPageNumber },
                },
            });
        }
    }, [id, entryPageNumber, fetchEntries, getUser, user]);

    const handleEntryChange = (data: number) => {
        setEntryPageNumber(data);
    };
    if (loading || !user) {
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
        <div className="lg:px-10 px-4 py-5 text-gray-900 bg-gray-100 min-h-full">
            <Header title="User Details" description="Get user Details" />
            <div className="flex items-center justify-between">
                <h3 className="text-2xl mb-2 font-bold">User Details for #{user.id}</h3>
                <button className="px-2 py-1 space-x-3 flex text-white bg-black" onClick={() => navigate('/profile/admin/users/')}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    <p>User List</p>
                </button>
            </div>
            <hr className="border-black" />
            <div className="mt-4">
                <div className="flex lg:flex-row flex-col lg:space-x-2 space-y-2 ">
                    <div className="lg:w-2/3 w-full p-5 bg-white shadow-lg">
                        <div className="text-lg text-black font-bold mb-2">
                            Personal Information
                            <hr className="border-black mb-2 w-1/3" />
                        </div>
                        <table className="w-full" style={{ rowGap: 55 }}>
                            <tbody>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>ID</td>
                                    <td># {user.id}</td>
                                </tr>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>Name</td>
                                    <td>{user.name}</td>
                                </tr>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>User Name</td>
                                    <td>{user.username}</td>
                                </tr>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>Email</td>
                                    <td>{user.email}</td>
                                </tr>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>Role</td>
                                    <td>{user.role}</td>
                                </tr>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>Verified</td>
                                    <td>
                                        {user.verified ? (
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                className="text-red-500"
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr style={{ lineHeight: 3 }}>
                                    <td>Enabled</td>
                                    <td>
                                        {user.disabled ? (
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                className="text-red-500"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                className="text-green-500"
                                            />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={`py-3 px-5 bg-white shadow-lg mt-3`}>
                    <div
                        className={`text-black font-bold ${showAddresses ? "mb-2" : "mb-0"
                            }`}
                    >
                        <div className="flex justify-between">
                            <p className="text-lg">Actions</p>
                        </div>
                        <hr className="border-black mb-2" />
                    </div>
                    <div className="space-x-3">
                        {user.role === UserRole.User ? (
                            <button
                                onClick={() => changeRole({ variables: { updateUserRoleInput: { role: UserRole.Admin, userId: user.id } } })}
                                disabled={changeRoleLoading}
                                className="bg-cyan-500 text-white font-bold text-sm py-1 px-2">
                                Make Admin
                            </button>
                        ) : (
                            <button
                                disabled={changeRoleLoading}
                                onClick={() => changeRole({ variables: { updateUserRoleInput: { role: UserRole.User, userId: user.id } } })}
                                className="bg-cyan-500 text-white font-bold text-sm py-1 px-2"
                            >
                                Make User
                            </button>
                        )}
                        {user.disabled ? (
                            <button
                                onClick={() =>
                                    enableAccount({
                                        variables: { toggleDisableInput: { userId: user.id } },
                                    })
                                }
                                disabled={enableLoading}
                                className="bg-green-500 text-white font-bold text-sm py-1 px-2"
                            >
                                Enable Account
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    disableAccount({
                                        variables: { toggleDisableInput: { userId: user.id } },
                                    })
                                }
                                disabled={disableLoading}
                                className="bg-red-500 text-white font-bold text-sm py-1 px-2"
                            >
                                Disable Account
                            </button>
                        )}
                    </div>
                </div>
                {user.addresses && (
                    <div className={`py-3 px-5 bg-white shadow-lg mt-3`}>
                        <div
                            className={`text-black font-bold ${showAddresses ? "mb-2" : "mb-0"
                                }`}
                        >
                            <div className="flex justify-between">
                                <p className="text-lg">Addresses</p>
                                <button onClick={() => setShowAddresses(!showAddresses)}>
                                    {!showAddresses ? (
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    ) : (
                                        <FontAwesomeIcon icon={faMinusSquare} />
                                    )}
                                </button>
                            </div>
                            {showAddresses && <hr className="border-black mb-2" />}
                        </div>
                        {showAddresses && <AddressList addresses={user.addresses} />}
                    </div>
                )}
                {user.role === UserRole.Admin && entries && (
                    <div className={`py-3 px-5 bg-white shadow-lg mt-3`}>
                        <div
                            className={`text-black font-bold ${showAddresses ? "mb-2" : "mb-0"
                                }`}
                        >
                            <div className="flex justify-between">
                                <p className="text-lg">Product Entries</p>
                                <button
                                    onClick={() => setShowProductEntries(!showProductEntries)}
                                >
                                    {!showProductEntries ? (
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    ) : (
                                        <FontAwesomeIcon icon={faMinusSquare} />
                                    )}
                                </button>
                            </div>
                            {showProductEntries && <hr className="border-black mb-2" />}
                        </div>
                        {showProductEntries && (
                            <div className="flex flex-wrap">
                                {entries.length === 0 && (
                                    <div className="my-4 text-center font-bold w-full">
                                        Empty Entries
                                    </div>
                                )}
                                {entries.length > 0 && (
                                    <>
                                        {" "}
                                        <table className="w-full mt-4">
                                            <thead>
                                                <tr className="text-center bg-black text-white font-bold text-sm uppercase">
                                                    <td className="pl-2 py-3">#</td>
                                                    <td className="">Title</td>
                                                    <td className="">Amount</td>
                                                    <td className="">Entry Date</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entries.map((entry) => {
                                                    return (
                                                        <tr
                                                            key={entry.id}
                                                            className="w-full text-center border-b-2 text-sm"
                                                        >
                                                            <td className=" py-4">{entry.id}</td>
                                                            <td className="">{entry.product.title}</td>
                                                            <td className="">{entry.amount}</td>
                                                            <td className="">{entry.entryDate}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="lg:my-12 my-12 mx-auto">
                                            <Pagination
                                                innerClass="flex pl-0 rounded list-none flex-wrap justify-center"
                                                itemClass="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-gray-500 bg-white text-gray-500"
                                                activePage={entryPageNumber}
                                                activeLinkClass="bg-black text-white w-full rounded-full h-full pt-2 pl-3"
                                                itemsCountPerPage={10}
                                                totalItemsCount={totalEntries}
                                                onChange={handleEntryChange}
                                                disabledClass="bg-gray-400 text-gray-100"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {/* TODO: implement order list features */}
                {/* <div>orders</div> */}
            </div>
        </div>
    );
};

export default UserDetail;
