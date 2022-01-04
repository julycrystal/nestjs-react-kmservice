import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { GetNewestProducts } from '../../../__generated__/GetNewestProducts';
import { GetProducts_getProducts_data_products } from '../../../__generated__/GetProducts';
import { GET_NEWEST_PRODUCT_QUERY } from '../../../graphql/product.graphql';
import ProductSlideSection from './ProductsSlideSection';

const NewestProductSection = () => {

    const [newestProducts, setNewestProducts] = useState<GetProducts_getProducts_data_products[]>([]);

    const [fetchNewestProducts] = useLazyQuery<GetNewestProducts, null>(
        GET_NEWEST_PRODUCT_QUERY,
        {
            fetchPolicy: "no-cache",
            onCompleted: ({ getNewestProducts }) => {
                const { ok, products } = getNewestProducts;
                if (ok && products) {
                    setNewestProducts(products);
                }
            },
            onError: () => {
            }
        }
    );

    useEffect(() => {
        fetchNewestProducts();
    }, [fetchNewestProducts,])

    return (
        <ProductSlideSection products={newestProducts} title="Newest Proudcts" />
    )
}

export default NewestProductSection
