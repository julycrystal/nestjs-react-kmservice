import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SolidButton, SubmitButton } from "../../../../../shared/button";
import FormError, { ErrorMessage } from "../../../../../shared/error/FormError";
import Header from "../../../../../shared/Header";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { stateToHTML } from "draft-js-export-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    ADMIN_CREATE_PRODUCT,
    ADMIN_DELETE_PRODUCT_ENTRY,
    ADMIN_PRODUCT_ENTRY_LIST_QUERY,
    ADMIN_UPDATE_PRODUCT,
} from "../../../../../graphql/admin.graphql";
import {
    GetProductEntriesByProduct,
    GetProductEntriesByProductVariables,
    GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries,
} from "../../../../../__generated__/GetProductEntriesByProduct";
import { useLazyQuery, useMutation } from "@apollo/client";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import {
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import ProductEntryForm from "../../../components/admin/product/ProductEntryForm";
import {
    CreateProduct,
    CreateProductVariables,
} from "../../../../../__generated__/CreateProduct";
import { Link, useParams, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";

import {
    GetProduct,
    GetProductVariables,
    GetProduct_getProduct_product,
} from "../../../../../__generated__/GetProduct";
import CustomModal from "../../../../../shared/CustomModal";
import {
    DeleteProductEntry,
    DeleteProductEntryVariables,
} from "../../../../../__generated__/DeleteProductEntry";
import {
    ProductUpdate,
    ProductUpdateVariables,
} from "../../../../../__generated__/ProductUpdate";
import ProductEntryList from "../../../components/admin/product/ProductEntryList";
import ProductImageComponent from "../../../components/admin/product/ProductImageComponent";
import { GET_PRODUCT_QUERY } from "../../../../../graphql/product.graphql";

interface IProductForm {
    title: string;
    categoryName: string;
    price: Number;
    discount: Number;
}

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [content, setContent] = useState<any>();
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );
    const [showModal, setShowModal] = useState(false);
    const [entry2Delete, setEntry2Delete] = useState<number | null>(null);
    const [totalEntries, setTotalEntries] = useState<number>(10);
    const [entryPageNumber, setEntryPageNumber] = useState(1);
    const [productEntries, setProductEntries] = useState<
        GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries[]
    >([]);
    const [entry, setEntry] =
        useState<GetProductEntriesByProduct_getProductEntriesByProduct_data_productEntries | null>(
            null
        );

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<GetProduct_getProduct_product | null>(
        null
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors },
        // } = useForm<IProductForm>({
    } = useForm({
        mode: "onChange",
        defaultValue: {},
    });

    // entry query
    const [fetchProductEntries] = useLazyQuery<
        GetProductEntriesByProduct,
        GetProductEntriesByProductVariables
    >(ADMIN_PRODUCT_ENTRY_LIST_QUERY, {
        fetchPolicy: "no-cache",
        onCompleted: ({ getProductEntriesByProduct }) => {
            const { ok, data } = getProductEntriesByProduct;
            if (ok && data && data.productEntries) {
                setTotalEntries(data.totalItems);
                setProductEntries(data.productEntries);
            }
        },
        onError: (error) => {
            setErrorMessage(getErrorMessage(error));
        },
    });

    const [fetchProductById] = useLazyQuery<GetProduct, GetProductVariables>(
        GET_PRODUCT_QUERY,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ getProduct }) => {
                const { ok, product } = getProduct;
                if (ok && product) {
                    setProduct(product);
                    setLoading(false);
                }
            },
            onError: (error) => {
                setErrorMessage(getErrorMessage(error));
            },
        }
    );

    const [createProduct] = useMutation<CreateProduct, CreateProductVariables>(
        ADMIN_CREATE_PRODUCT,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ createProduct }) => {
                const { ok, productId } = createProduct;
                if (ok) {
                    reset();
                    setLoading(false);
                    navigate(`/profile/admin/products/${productId}`);
                }
            },
            onError: (error) => {
                setLoading(false);
                setErrorMessage(getErrorMessage(error));
            },
        }
    );

    const [updateProduct] = useMutation<ProductUpdate, ProductUpdateVariables>(
        ADMIN_UPDATE_PRODUCT,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ updateProduct }) => {
                const { ok } = updateProduct;
                if (ok) {
                    if (id) {
                        fetchProductById({ variables: { getProductInput: { id: +id } } });
                    }
                    setLoading(false);
                }
            },
            onError: (error) => {
                setLoading(false);
                setErrorMessage(getErrorMessage(error));
            },
        }
    );

    // entry query
    const [deleteEntry] = useMutation<
        DeleteProductEntry,
        DeleteProductEntryVariables
    >(ADMIN_DELETE_PRODUCT_ENTRY, {
        fetchPolicy: "no-cache",
        onCompleted: ({ deleteProductEntry }) => {
            const { ok } = deleteProductEntry;
            console.log(deleteProductEntry);
            if (ok && product) {
                fetchProductEntries({
                    variables: {
                        getProductEntriesByProductInput: {
                            productId: product.id,
                        },
                    },
                });
                setShowModal(false);
            }
        },
        onError: (error) => {
            setLoading(false);
            setErrorMessage(getErrorMessage(error));
        },
    });

    useEffect(() => {
        if (product) {
            setValue("title", product.title);
            setValue("price", product.price);
            setValue("discount", product.discount);
            setValue("categoryName", product.category.name);
            setValue("showRemaining", product.showRemaining);
            const blocksFromHtml = htmlToDraft(product.description);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
                entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [product, setValue,]);

    useEffect(() => {
        if (id) {
            fetchProductById({ variables: { getProductInput: { id: +id } } });
            fetchProductEntries({
                variables: {
                    getProductEntriesByProductInput: {
                        productId: +id,
                        pageNumber: entryPageNumber,
                    },
                },
            });
        }
    }, [id, entryPageNumber, fetchProductById, fetchProductEntries])

    const { title, price, discount, categoryName, showRemaining } = watch();

    const sameWithPrevState = () => {
        return (
            product &&
            title === product?.title &&
            parseFloat(price) === product.price &&
            categoryName === product.category.name &&
            showRemaining === product.showRemaining &&
            parseFloat(discount) === product.discount &&
            product.description === stateToHTML(editorState.getCurrentContent())
        );
    };

    const isProductInfoValid = () => {
        const editorContent = stateToHTML(editorState.getCurrentContent());

        const requiredValue = [title, categoryName];
        const validationResult =
            Object.entries(errors).length === 0 &&
            price &&
            price > 0 &&
            discount &&
            discount > 0 &&
            requiredValue.every((element) => element && element.length > 0);

        if (product) {
            return !sameWithPrevState() && validationResult;
        } else {
            const isValidEditorContent = editorContent.length > 7;
            return Boolean(isValidEditorContent && validationResult);
        }
    };

    const handleEntryChange = (data: number) => {
        setEntryPageNumber(data);
    };

    const editHandler = (data: number) => {
        const entry2Edit = productEntries.find(
            (entryData) => entryData.id === data
        );
        if (entry2Edit) {
            setEntry(entry2Edit);
        }
    };

    const onSubmit = () => {
        setLoading(true);
        const { title, price, discount, showRemaining, categoryName } = getValues();
        if (product) {
            const editorContent = stateToHTML(editorState.getCurrentContent());
            const updateObj = {
                id: product.id,
                ...(title !== product.title && { title }),
                ...(price !== product.price && { price: parseFloat(price) }),
                ...(categoryName !== product.category.name && { categoryName }),
                ...(discount !== product.discount && {
                    discount: parseFloat(discount),
                }),
                ...(product.description !== editorContent && {
                    description: editorContent,
                }),
            };
            updateProduct({
                variables: {
                    updateProductInput: updateObj,
                },
            });
        } else {
            createProduct({
                variables: {
                    createProductInput: {
                        title,
                        price: parseFloat(price),
                        discount: parseFloat(discount),
                        showRemaining,
                        description: stateToHTML(editorState.getCurrentContent()),
                        categoryName,
                    },
                },
            });
        }
    };

    const deleteHandler = (reduceAmount = false) => {
        if (entry2Delete) {
            deleteEntry({
                variables: {
                    productEntryDeleteInput: { id: entry2Delete, reduceAmount },
                },
            });
        }
    };

    return (
        <div id="accountPanel" className="lg:px-10 px-2 pt-8 pb-16 text-gray-900">
            <Header title="Products" description="Your Products." />
            <div className="flex justify-between items-center">
                <h3 className="text-2xl mb-4 font-bold">Product Form</h3>
                <Link
                    className="bg-black text-white font-bold px-4 py-2"
                    to="/profile/admin/products"
                >
                    List
                </Link>
            </div>
            <hr className="border-black" />
            <div>
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div className="border-0 rounded-lg relative flex flex-col outline-none focus:outline-none">
                        <h3 className="mt-4 font-bold">Product Information</h3>
                        {/*body*/}
                        <div className="relative mt-3 px-2 flex-auto space-y-3">
                            {errorMessage && (
                                <div className="mb-2">
                                    <FormError
                                        message={errorMessage}
                                        onClick={() => setErrorMessage(null)}
                                    />
                                </div>
                            )}
                            <div className="flex lg:flex-row flex-col w-full lg:space-x-2 lg:space-y-0 space-y-2">
                                <div className="w-full">
                                    <input
                                        {...register("title", {
                                            required: {
                                                value: true,
                                                message: "This field is required.",
                                            },
                                        })}
                                        placeholder="Product Title *"
                                        className="border-2 border-black p-2 md:mb-2 w-full"
                                    />
                                    {errors.title && (
                                        <ErrorMessage message={errors.title.message} />
                                    )}
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("price", {
                                            required: {
                                                value: true,
                                                message: "This field is required.",
                                            },
                                        })}
                                        type="number"
                                        placeholder="Price *"
                                        className="border-2 border-black p-2 md:mb-2 w-full"
                                    />
                                    {errors.price && (
                                        <ErrorMessage message={errors.price.message} />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row w-full lg:space-x-2 lg:space-y-0 space-y-2">
                                <div className="w-full">
                                    <input
                                        type="number"
                                        max={99}
                                        {...register("discount", {
                                            required: {
                                                value: true,
                                                message: "This field is required.",
                                            },
                                        })}
                                        placeholder="1,2,40 etc"
                                        className="border-2 border-black p-2 md:mb-2 w-full"
                                    />
                                    {errors.discount && (
                                        <ErrorMessage message={errors.discount.message} />
                                    )}
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("categoryName", {
                                            required: {
                                                value: true,
                                                message: "This field is required.",
                                            },
                                        })}
                                        placeholder="Category Name"
                                        className="border-2 border-black p-2 md:mb-2 w-full"
                                    />
                                    {errors.categoryName && (
                                        <ErrorMessage message={errors.categoryName.message} />
                                    )}
                                </div>
                            </div>

                            <div className="w-full flex items-center">
                                <input
                                    type="checkbox"
                                    name="showRemaining"
                                    {...register("showRemaining")}
                                    id="showRemaining"
                                    className={`form-check-input ${errors.showRemaining ? "is-invalid" : ""
                                        }`}
                                />

                                <label
                                    htmlFor="showRemaining"
                                    className="form-check-label ml-2"
                                >
                                    Show Remaining
                                </label>
                            </div>

                            <div
                                className="border-2 border-black overflow-y-scroll"
                                style={{ height: 300 }}
                            >
                                <Editor
                                    toolbar={{
                                        options: [
                                            "inline",
                                            "blockType",
                                            "fontSize",
                                            "fontFamily",
                                            "list",
                                            "textAlign",
                                            "colorPicker",
                                            "link",
                                            "emoji",
                                            "history",
                                        ],
                                    }}
                                    onEditorStateChange={(data) => {
                                        setEditorState(data);
                                    }}
                                    editorState={editorState}
                                    editorClassName="h-64"
                                    onChange={(data: any) => setContent(data)}
                                />
                            </div>
                            <SubmitButton
                                loading={loading}
                                buttonText={product ? "EDIT PRODUCT" : "CREATE PRODUCT"}
                                classes="px-3 py-4 uppercase mb-0 w-full"
                                isValid={isProductInfoValid()}
                            />
                        </div>
                    </div>
                </form>
                {product && (
                    <>
                        <hr className="border-black mt-8" />
                        <ProductImageComponent product={product} coverImage={product.coverImage} />
                    </>
                )}
            </div>
            {product && (
                <>
                    <hr className="border-black" />
                    <div className="my-4 px-2">
                        <h3 className="font-bold">Product Entries</h3>
                        <div className="mt-4">
                            <ProductEntryForm
                                callback={() => {
                                    setEntry(null);
                                    fetchProductEntries({
                                        variables: {
                                            getProductEntriesByProductInput: {
                                                productId: product.id,
                                            },
                                        },
                                    });
                                }}
                                entry={entry}
                                productId={product.id}
                            />
                        </div>
                        <ProductEntryList
                            productEntries={productEntries}
                            editHandler={editHandler}
                            setShowModal={setShowModal}
                            setEntry2Delete={setEntry2Delete}
                        />
                    </div>
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
            <CustomModal
                show={showModal}
                icon={faExclamationTriangle}
                actions={
                    <div className="flex space-x-3 bg-gray-50 flex-row-reverse px-4 py-3">
                        <SolidButton
                            text="Delete & Reduce"
                            onClick={() => {
                                deleteHandler(true);
                            }}
                            classes=" px-2 py-1 ml-4 text-sm"
                        />
                        <SolidButton
                            text="Delete"
                            onClick={() => {
                                deleteHandler();
                            }}
                            classes=" px-2 py-1 ml-4 text-sm"
                        />
                        <SolidButton
                            text="Cancel"
                            onClick={() => {
                                setEntry2Delete(null);
                                setShowModal(false);
                            }}
                            classes={
                                "text-sm bg-white border-2 border-black text-gray-900 px-2 py-1"
                            }
                        />
                    </div>
                }
                title={"Delete Entry"}
                description={
                    "Are you sure you want to delete your account entry? Also reduce amount ?"
                }
            />
        </div>
    );
};

export default ProductForm;
