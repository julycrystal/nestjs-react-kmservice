import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GetPopularProducts } from "../../../__generated__/GetPopularProducts";
import { GetProducts_getProducts_data_products } from "../../../__generated__/GetProducts";
import { GET_PUPULAR_PRODUCT_QUERY } from "../../../graphql/product.graphql";
import ProductSlideSection from "./ProductsSlideSection";

const PopularProductSection = () => {
    const [popularProducts, setPopularProducts] = useState<GetProducts_getProducts_data_products[]>([]);

    const [fetchPopularProducts] = useLazyQuery<GetPopularProducts, null>(
        GET_PUPULAR_PRODUCT_QUERY,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ getPopularProducts }) => {
                const { ok, products } = getPopularProducts;
                if (ok && products) {
                    setPopularProducts(products);
                }
            },
            onError: () => {
            }
        }
    );

    useEffect(() => {
        fetchPopularProducts();
    }, [fetchPopularProducts,])

    return (
        <ProductSlideSection products={popularProducts} title="Popular Proudcts" />
    )
}

export default PopularProductSection
