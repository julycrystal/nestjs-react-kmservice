import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Spinner } from "../../../shared/loader";
import { GetProducts, GetProductsVariables, GetProducts_getProducts_data_products } from "../../../__generated__/GetProducts";
import { PRODUCT_LIST_QUERY } from "../product.graphql";
import Pagination from "react-js-pagination";
import ProductItem from "../components/ProductItem";
import LeftSide from "../components/LeftSide";

const ProductList = () => {

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<GetProducts_getProducts_data_products[] | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const productPerPage = 10;

    const [fetchProducts] = useLazyQuery<GetProducts, GetProductsVariables>(
        PRODUCT_LIST_QUERY,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ getProducts }) => {
                const { ok, data } = getProducts;
                if (ok && data?.products) {
                    setProducts(data.products);
                    setTotalItems(data.totalItems)
                }
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        }
    );

    useEffect(() => {
        fetchProducts({
            variables: {
                getProductsInput: { pageNumber }
            }
        })
    }, [pageNumber, fetchProducts])

    const handleChange = (data: number) => {
        setPageNumber(data);
    }

    if (loading || !products) {
        return (<div className="h-screen flex items-center justify-center">
            <Spinner height={40} color={"#000"} />
        </div>);
    }

    return (
        <div className="py-12">
            <div className="flex pl-2">
                <div className="w-1/5">
                    <LeftSide />
                </div>
                <div className="flex flex-wrap w-4/5">
                    {products.map((product => <ProductItem product={product} />))}
                </div>
            </div>
            <Pagination
                innerClass="flex pl-0 rounded list-none flex-wrap justify-center"
                itemClass="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-gray-500 bg-white text-gray-500"
                activePage={pageNumber}
                activeLinkClass="bg-black text-white w-full rounded-full h-full pt-2 pl-3"
                itemsCountPerPage={productPerPage}
                totalItemsCount={totalItems}
                onChange={handleChange}
                disabledClass="bg-gray-400 text-gray-100"
            />
        </div>
    )
}

export default ProductList
