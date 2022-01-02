import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { faCheckCircle, faTimesCircle, faPencilAlt, faTrashAlt, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ErrorMessage } from "../../../../../shared/error/FormError";
import Header from "../../../../../shared/Header"
import LoadingCmp from "../../../../../shared/loader/LoadingCmp";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import { GetProducts, GetProductsVariables, GetProducts_getProducts_data_products } from "../../../../../__generated__/GetProducts";
import { ADMIN_DELETE_PRODUCT } from "../../../graphql/admin.graphql";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import Modal from "../../../../../shared/Modal";
import { ProductDelete, ProductDeleteVariables } from "../../../../../__generated__/ProductDelete";
import { PRODUCT_LIST_QUERY } from "../../../../products/product.graphql";

const ProductList = () => {
    const [products, setProducts] = useState<GetProducts_getProducts_data_products[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalItems, setTotalItems] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const userPerPage = 10;
    const [productId2Delete, setProductId2Delete] = useState<null | number>(null);

    const [fetchProducts, { loading }] = useLazyQuery<GetProducts, GetProductsVariables>(PRODUCT_LIST_QUERY, {
        variables: { getProductsInput: { pageNumber } },
        fetchPolicy: "no-cache",
        onCompleted: ({ getProducts }) => {
            const { ok, data } = getProducts;
            if (ok && data && data.products) {
                setTotalItems(data.totalItems)
                setProducts(data.products);
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const [deleteProductMutation] = useMutation<ProductDelete, ProductDeleteVariables>(ADMIN_DELETE_PRODUCT, {
        fetchPolicy: "no-cache",
        onCompleted: ({ deleteProduct }) => {
            const { ok } = deleteProduct;
            if (ok) {
                fetchProducts();
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleChange = (data: any) => {
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

    const onDeleteClick = (id: number) => {
        setProductId2Delete(id);
        setShowModal(true);
    }

    const deleteProduct = () => {
        if (productId2Delete) {
            // delete product
            deleteProductMutation({ variables: { productDeleteInput: { id: productId2Delete } } })
        }
        setProductId2Delete(null);
        setShowModal(false);
    }

    return (
        <div id="accountPanel" className="px-10 py-5 text-gray-900">
            <Header title="Products" description="Your Products." />
            <div className="flex justify-between items-center">
                <h3 className="text-2xl mb-4 font-bold">Product List</h3>
                <Link className="bg-black text-white font-bold px-4 py-2" to="create">Create</Link>
            </div>
            <hr className="border-black" />
            <table className="w-full mt-4">
                <thead>
                    <tr className="text-center bg-black text-white font-bold text-sm uppercase">
                        <td className="pl-2 py-3">#</td>
                        <td className="">Title</td>
                        <td className="">Price</td>
                        <td className="">Qty</td>
                        <td className="">Show Remaining</td>
                        <td className="hidden lg:inline-flex lg:py-3 pr-2">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        return (<tr key={product.id} className="w-full cursor-pointer text-center border-b-2 text-sm">
                            <td className=" py-4">{product.id}</td>
                            <td className="">{product.title}</td>
                            <td className="">{product.price}</td>
                            <td className="">{product.quantity}</td>
                            <td className="">
                                {
                                    product.showRemaining ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> :
                                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                                }
                            </td>
                            <td className="hidden lg:inline-flex lg:py-4 pr-2 space-x-2">
                                <FontAwesomeIcon icon={faPencilAlt} title="View Details" onClick={() => detailPage(product.id)} className="cursor-pointer" />
                                <FontAwesomeIcon icon={faTrashAlt} title="Delete" className="cursor-pointer" onClick={() => onDeleteClick(product.id)} />
                            </td>
                        </tr>);
                    })}
                </tbody>
            </table>
            {products && <div className="lg:my-24 my-12">
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
            <Modal
                onCancel={() => setShowModal(false)}
                show={showModal}
                onClick={deleteProduct}
                icon={faExclamationTriangle}
                title={"Delete Product"}
                description={"Are you sure you want to delete Product?"} />
        </div>
    )
}

export default ProductList
