import gql from "graphql-tag";

export const PRODUCT_LIST_QUERY = gql`
  query GetProducts($getProductsInput: PaginationInput!) {
    getProducts(getProductsInput: $getProductsInput) {
      error
      ok
      data {
        currentPage
        currentPageItems
        limit
        totalItems
        totalPages
        products {
          id
          coverImage
          discount
          price
          quantity
          showRemaining
          title
          category {
            name
          }
        }
      }
    }
  }
`;
