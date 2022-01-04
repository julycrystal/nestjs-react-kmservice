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

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($getProductInput: GetProductInput!) {
    getProduct(getProductInput: $getProductInput) {
      ok
      product {
        id
        title
        description
        coverImage
        discount
        showRemaining
        price
        quantity
        category {
          name
        }
      }
    }
  }
`;

export const GET_PUPULAR_PRODUCT_QUERY = gql`
  query GetPopularProducts {
    getPopularProducts {
      ok
      products {
        id
        title
        description
        coverImage
        discount
        showRemaining
        price
        quantity
        category {
          name
        }
      }
    }
  }
`;

export const GET_NEWEST_PRODUCT_QUERY = gql`
  query GetNewestProducts {
    getNewestProducts {
      ok
      products {
        id
        title
        description
        coverImage
        discount
        showRemaining
        price
        quantity
        category {
          name
        }
      }
    }
  }
`;
